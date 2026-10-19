import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized: Valid customer session required' }, { status: 401 });
    }

    // Strictly isolated to authenticated user
    const userTransactions = db.getPaymentTransactions(auth.userId, auth.email);

    // Group transactions by orderId
    const orderMap = new Map<string, any>();
    for (const tx of userTransactions) {
      if (!orderMap.has(tx.orderId)) {
        const order = db.orders.find(o => o.orderId === tx.orderId);
        orderMap.set(tx.orderId, {
          orderId: tx.orderId,
          invoiceNumber: order?.invoiceNumber || 'N/A',
          totalAmount: order?.totalPaid || tx.amount,
          finalStatus: order?.paymentStatus || tx.status,
          orderStatus: order?.orderStatus || 'ORDER_PLACED',
          createdAt: tx.createdAt,
          attempts: [],
          successCount: 0,
          failedCount: 0,
        });
      }
      const entry = orderMap.get(tx.orderId);
      entry.attempts.push(tx);
      if (tx.status === 'SUCCESS') entry.successCount += 1;
      if (tx.status === 'FAILED') entry.failedCount += 1;
    }

    const orderSummaries = Array.from(orderMap.values());

    return NextResponse.json({
      success: true,
      count: userTransactions.length,
      transactions: userTransactions,
      orderSummaries,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

