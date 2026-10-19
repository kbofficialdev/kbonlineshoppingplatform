import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = db.updateCoupon(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'COUPON_UPDATED',
      'PROMOTION',
      id,
      body
    );

    return NextResponse.json({
      success: true,
      message: `Coupon "${updated.code}" updated successfully`,
      coupon: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const { id } = params;
    const deleted = db.deleteCoupon(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'COUPON_DELETED',
      'PROMOTION',
      id,
      {}
    );

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

