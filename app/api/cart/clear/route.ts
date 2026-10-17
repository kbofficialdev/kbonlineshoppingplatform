import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateCart } from '@/lib/cart';

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') || 'default-guest';
  db.cartItems = db.cartItems.filter(i => i.sessionId !== sessionId);
  db.appliedPromos.delete(sessionId);
  return NextResponse.json(calculateCart(sessionId));
}
