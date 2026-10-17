import { NextRequest, NextResponse } from 'next/server';
import { calculateCart } from '@/lib/cart';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') || 'default-guest';
  return NextResponse.json(calculateCart(sessionId));
}
