import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = db.getTopNewProducts(5);
  return NextResponse.json({
    products,
    count: products.length,
    timestamp: new Date().toISOString(),
  });
}

