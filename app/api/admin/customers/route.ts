import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const customers = db.users
      .filter(u => u.role === 'CUSTOMER')
      .map(u => {
        const userOrders = db.orders.filter(o => o.userId === u.id || o.customerEmail === u.email);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.totalPaid, 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          isActive: u.isActive,
          createdAt: u.createdAt,
          ordersCount: userOrders.length,
          totalSpent,
        };
      });

    return NextResponse.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, isActive } = body;

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    user.isActive = Boolean(isActive);
    user.updatedAt = new Date().toISOString();

    db.addAuditLog(
      auth.email,
      'ADMIN',
      user.isActive ? 'CUSTOMER_ACTIVATED' : 'CUSTOMER_DEACTIVATED',
      'USER',
      user.id,
      { isActive: user.isActive }
    );

    return NextResponse.json({
      success: true,
      message: `Customer account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
