import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { orderId } = params;
    const tracking = db.getOrderTracking(orderId);

    if (!tracking) {
      return NextResponse.json({ error: 'Tracking information not found for this Order ID' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tracking,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

