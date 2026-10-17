import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const nonCancelledOrders = db.orders.filter(o => o.orderStatus !== 'CANCELLED');
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalPaid, 0);
    const totalOrders = db.orders.length;
    const totalCustomers = db.users.filter(u => u.role === 'CUSTOMER').length;
    const lowStockProducts = db.products.filter(p => p.stockQuantity <= 15);

    const ordersByStatus: Record<string, number> = {
      ORDER_PLACED: 0,
      CONFIRMED: 0,
      DISPATCHED: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    db.orders.forEach(o => {
      ordersByStatus[o.orderStatus] = (ordersByStatus[o.orderStatus] || 0) + 1;
    });

    const categoryRevenue: Record<string, number> = {};
    db.products.forEach(p => {
      categoryRevenue[p.category] = (categoryRevenue[p.category] || 0);
    });

    nonCancelledOrders.forEach(order => {
      order.items.forEach(item => {
        const prod = db.products.find(p => p.productId === item.productId || p.id === item.productId);
        const cat = prod?.category || 'General';
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.totalAmount;
      });
    });

    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.map(p => ({ id: p.productId, name: p.name, stock: p.stockQuantity })),
        ordersByStatus,
        categoryRevenue,
        recentOrders: db.orders.slice(0, 5),
        storeInfo: db.storeSettings,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

