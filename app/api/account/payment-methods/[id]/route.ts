import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const deleted = db.deletePaymentMethod(params.id, auth.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Payment method not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Payment method removed successfully',
  });
}
