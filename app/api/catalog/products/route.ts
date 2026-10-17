import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productFilterSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());

  const parsed = productFilterSchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid filter parameters', details: parsed.error.format() }, { status: 400 });
  }

  const { category, size, maxPrice, sort, search } = parsed.data;
  let products = [...db.products];

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category || p.tags.includes(category));
  }

  if (size && size !== 'All') {
    products = products.filter(p => p.sizes.includes(size));
  }

  if (maxPrice) {
    products = products.filter(p => p.price <= maxPrice);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.hsnCode.includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    total: db.products.length,
    visible: products.length,
    products,
  });
}
