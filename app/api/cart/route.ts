import { NextRequest, NextResponse } from 'next/server';
import { calculateCart } from '@/lib/cart';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth?.userId) {
    return NextResponse.json(
      { error: 'Authentication Required: Anonymous shopping sessions are not allowed.', requiresAuth: true },
      { status: 401 }
    );
  }
  return NextResponse.json(calculateCart(auth.userId));
}
