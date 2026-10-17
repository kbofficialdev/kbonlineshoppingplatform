import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth?.userId) {
    return NextResponse.json(
      { error: 'Authentication Required: Anonymous sessions are not permitted.', requiresAuth: true },
      { status: 401 }
    );
  }
  const userId = auth.userId;
  db.cartItems = db.cartItems.filter(i => i.sessionId !== userId && i.userId !== userId);
  db.appliedPromos.delete(userId);
  return NextResponse.json(calculateCart(userId));
}
