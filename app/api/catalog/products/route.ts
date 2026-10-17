import { NextRequest, NextResponse } from 'next/server';
import { db, ProductModel, ProductImageModel } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { productCreateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured') === 'true';

    let result = [...db.products];

    // Filter by category or productType
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      result = result.filter(p => 
        p.category.toLowerCase() === catLower ||
        (p.productType && p.productType.toLowerCase() === catLower) ||
        (catLower.includes('saree') && p.productType === 'SAREE') ||
        ((catLower.includes('men') || catLower.includes('unstitched')) && p.productType === 'MEN_UNSTITCHED') ||
        (catLower.includes('women') && p.productType === 'WOMEN_WEAR') ||
        ((catLower.includes('blouse') || catLower.includes('matching')) && p.productType === 'BLOUSE_PIECE') ||
        ((catLower.includes('dhoti') || catLower.includes('towel')) && p.productType === 'DHOTI_TOWEL') ||
        ((catLower.includes('inner') || catLower.includes('banian')) && p.productType === 'INNER_ESSENTIAL')
      );
    }

    // Filter by search keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by price range
    if (minPrice !== undefined) {
      result = result.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      result = result.filter(p => p.price <= maxPrice);
    }

    // Filter by featured
    if (featured) {
      result = result.filter(p => p.isFeatured);
    }

    // Sort
    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: featured first, then newest
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return NextResponse.json({
      success: true,
      count: result.length,
      products: result,
      store: {
        officialName: db.storeSettings.officialName,
        village: db.storeSettings.village,
        district: db.storeSettings.district,
        state: db.storeSettings.state,
        gstExempt: db.storeSettings.gstExempt,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required to add products' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const now = new Date().toISOString();
    const productId = `prod-${Date.now()}`;
    const imageId = `img-${Date.now()}`;

    // Store image directly in database
    const imageModel: ProductImageModel = {
      id: imageId,
      productId,
      name: `${data.name} Image`,
      mimeType: data.imageData.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/jpeg',
      data: data.imageData,
      isPrimary: true,
      createdAt: now,
    };

    db.productImages.push(imageModel);

    const newProduct: ProductModel = {
      id: productId,
      productId,
      name: data.name,
      title: data.title || data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      category: data.category,
      productType: data.productType || 'GENERAL',
      brand: data.brand || 'KB FASHIONS',
      fabric: data.fabric || 'Pure Cotton',
      isUnstitched: data.isUnstitched ?? false,
      unitType: data.unitType || 'PIECE',
      pricePerMeter: data.pricePerMeter,
      availableMeters: data.availableMeters || [],
      tags: data.tags,
      sizes: data.sizes,
      colors: data.colors,
      stockQuantity: data.stockQuantity,
      rating: 5.0,
      reviews: 1,
      fabricCare: data.fabricCare || 'Pure Cotton. Gentle handwash or cold wash.',
      origin: data.origin,
      isFeatured: data.isFeatured,
      sareeDetails: data.sareeDetails ? (data.sareeDetails as any) : undefined,
      unstitchedDetails: data.unstitchedDetails ? (data.unstitchedDetails as any) : undefined,
      essentialDetails: data.essentialDetails ? (data.essentialDetails as any) : undefined,
      matchingDetails: data.matchingDetails ? (data.matchingDetails as any) : undefined,
      createdAt: now,
      updatedAt: now,
      images: [imageModel],
    };

    db.products.unshift(newProduct);

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'PRODUCT_CREATED',
      'PRODUCT',
      productId,
      { name: newProduct.name, price: newProduct.price, stock: newProduct.stockQuantity }
    );

    return NextResponse.json({
      success: true,
      message: 'Product and image successfully stored in database',
      product: newProduct,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
