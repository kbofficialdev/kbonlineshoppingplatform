import { NextRequest, NextResponse } from 'next/server';
import { db, ProductModel } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { productUpdateSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const product = db.products.find(p => p.id === id || p.productId === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    product,
    store: {
      officialName: db.storeSettings.officialName,
      address: db.storeSettings.address,
      contactPhone: db.storeSettings.contactPhone,
      contactEmail: db.storeSettings.contactEmail,
      gstExempt: db.storeSettings.gstExempt,
    }
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const productIndex = db.products.findIndex(p => p.id === id || p.productId === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const current = db.products[productIndex];
    const updated: ProductModel = {
      ...current,
      ...(parsed.data as any),
      updatedAt: new Date().toISOString(),
    };

    // If new image was provided (either uploaded Base64 or external URL)
    const rawImage = (parsed.data as any).imageUrl || parsed.data.imageData;
    if (rawImage) {
      const { validateImageDataPayload } = await import('@/lib/imageValidation');
      const valResult = validateImageDataPayload(rawImage);
      if (!valResult.valid) {
        return NextResponse.json({ error: valResult.error || 'Invalid product image' }, { status: 400 });
      }

      const imgId = `img-${Date.now()}`;
      const newImg = {
        id: imgId,
        productId: current.productId,
        name: `${updated.name} Updated Image`,
        mimeType: valResult.mimeType || 'image/jpeg',
        data: valResult.sanitizedUrl || rawImage,
        isPrimary: true,
        createdAt: new Date().toISOString(),
      };
      db.productImages.push(newImg);
      updated.images = [newImg];
    }

    db.products[productIndex] = updated;

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'PRODUCT_UPDATED',
      'PRODUCT',
      current.productId,
      parsed.data
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const product = db.products.find(p => p.id === id || p.productId === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    db.products = db.products.filter(p => p.id !== id && p.productId !== id);
    db.productImages = db.productImages.filter(img => img.productId !== product.productId);

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'PRODUCT_DELETED',
      'PRODUCT',
      product.productId,
      { name: product.name }
    );

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
