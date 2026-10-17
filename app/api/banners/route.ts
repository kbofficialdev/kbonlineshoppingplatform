import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const banners = db.getBanners();
  return NextResponse.json({
    banners,
    count: banners.length,
    timestamp: new Date().toISOString(),
  });
}

