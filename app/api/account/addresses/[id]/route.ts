import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = db.updateAddress(params.id, auth.userId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update address' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const deleted = db.deleteAddress(params.id, auth.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: 'Address deleted successfully',
  });
}
