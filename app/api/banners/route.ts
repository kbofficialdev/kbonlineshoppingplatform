import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const banners = db.getBanners();
  return NextResponse.json({
    banners,
    count: banners.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
    }

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

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    const updated = db.updateBanner(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, banner: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    const deleted = db.deleteBanner(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete banner' }, { status: 500 });
  }
}
