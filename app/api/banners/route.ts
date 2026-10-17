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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBanner = db.createBanner({
      title: body.title,
      subtitle: body.subtitle,
      badge: body.badge,
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl,
      ctaText: body.ctaText,
      category: body.category || 'HERO',
      position: body.position,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });
    return NextResponse.json({ success: true, banner: newBanner }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create banner' }, { status: 500 });
  }
}


