import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const order = db.orders.find(o => o.orderId === orderId || o.id === orderId);

  if (!order) {
    return NextResponse.json({ error: 'Order not found for retail bill of supply generation' }, { status: 404 });
  }

  const settings = db.storeSettings;

  const invoice = {
    orderId: order.orderId,
    invoiceNumber: order.invoiceNumber,
    createdAt: order.createdAt,
    seller: {
      brandName: settings.brandName,
      officialName: settings.officialName,
      address: settings.address,
      village: settings.village,
      mandal: settings.mandal,
      district: settings.district,
      state: settings.state,
      pinCode: settings.pinCode,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      legalNote: `Ancestral rural enterprise operating continuously since ${settings.historySince}`,
      exemptNote: settings.exemptionNotice,
    },
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail,
      shippingAddress: `${order.streetAddress}, ${order.villageOrCity}${order.mandalOrArea ? ', ' + order.mandalOrArea : ''}, ${order.district}, ${order.state} - ${order.pinCode}`,
    },
    items: order.items,
    financials: {
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      totalPaid: order.totalPaid,
      paymentMethod: order.paymentMethod,
      status: order.paymentStatus
    },
    digitalSignature: {
      authorizedBy: `${settings.officialName} Village Retail Cash Memo / Bill of Supply`,
      signedAt: order.createdAt,
      verificationHash: `SHA256:${Buffer.from(`${order.orderId}|${order.invoiceNumber}|${order.totalPaid}`).toString('base64')}`
    }
  };

  return NextResponse.json({ invoice });
}
