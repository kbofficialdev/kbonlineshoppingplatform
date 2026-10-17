import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json({ error: 'Order ID or Tracking number is required' }, { status: 400 });
  }

  const trackingData = db.getOrderTracking(orderId);
  if (!trackingData) {
    return NextResponse.json(
      { error: `No tracking information found for parcel "${orderId}". Please verify your order number.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    tracking: trackingData,
  });
}
