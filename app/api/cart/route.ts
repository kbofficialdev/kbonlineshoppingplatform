import { NextRequest, NextResponse } from 'next/server';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  const sessionId = auth?.userId || req.nextUrl.searchParams.get('session_id') || 'default-guest';
  return NextResponse.json(calculateCart(sessionId));
}
