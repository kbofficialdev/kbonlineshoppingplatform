import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const order = db.orders.find(o => o.id === id || o.orderId === id || o.invoiceNumber === id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    order,
    store: db.storeSettings,
  });
}
