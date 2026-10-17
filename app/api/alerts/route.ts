import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const showAll = searchParams.get('all') === 'true';

  if (showAll) {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const allAlerts = db.getAllAlerts();
    return NextResponse.json({ alerts: allAlerts, count: allAlerts.length });
  }

  const activeAlerts = db.getActiveAlerts();
  return NextResponse.json({
    alerts: activeAlerts,
    count: activeAlerts.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth || auth.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required to push alerts' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const newAlert = db.createAlert({
      title: body.title.trim(),
      message: body.message.trim(),
      type: body.type || 'INFO',
      linkUrl: body.linkUrl || null,
      linkText: body.linkText || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      isPushed: body.isPushed !== undefined ? Boolean(body.isPushed) : false,
      displayLocation: body.displayLocation || 'TOP_BAR',
      badge: body.badge || null,
      textColor: body.textColor || null,
    });

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: 'Alert pushed successfully to customers'
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create alert' }, { status: 500 });
  }
}

