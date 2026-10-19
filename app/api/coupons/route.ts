import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    let coupons = db.getCoupons();
    if (activeOnly) {
      coupons = coupons.filter(c => c.isActive);
    }

    return NextResponse.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const code = body.code.toUpperCase().trim();
    const existing = db.findCouponByCode(code);
    if (existing) {
      return NextResponse.json({ error: `Coupon code "${code}" already exists` }, { status: 409 });
    }

    const newCoupon = db.createCoupon({
      code,
      discountType: body.discountType === 'FLAT' ? 'FLAT' : 'PERCENTAGE',
      discountValue: Number(body.discountValue) || 10,
      minOrderAmount: Number(body.minOrderAmount) || 0,
      maxDiscountAmount: body.maxDiscountAmount ? Number(body.maxDiscountAmount) : null,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      expiryDate: body.expiryDate || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    db.addAuditLog(
      auth.email,
      'ADMIN',
      'COUPON_CREATED',
      'PROMOTION',
      newCoupon.id,
      { code: newCoupon.code, discountValue: newCoupon.discountValue }
    );

    return NextResponse.json({
      success: true,
      message: `Coupon "${newCoupon.code}" created successfully`,
      coupon: newCoupon,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

