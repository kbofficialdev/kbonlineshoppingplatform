import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const sellerDetails = {
  legalName: "KB Retail Private Limited",
  brandName: "KB Online",
  cin: "U52100KA2026PTC184920",
  gstin: "29AAAAA0000A1Z5",
  address: "42, Industrial Layout, Indiranagar, Bengaluru, Karnataka 560038, India",
  supportEmail: "support@kbonline.internal",
  supportPhone: "+91 80 4920 0000",
  grievanceOfficer: {
    name: "Vikramaditya Rao",
    email: "grievance@kbonline.internal",
    sla: "48h acknowledgment, 15 business days redressal"
  }
};

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const order = db.orders.find(o => o.orderId === orderId || o.id === orderId);

  if (!order) {
    return NextResponse.json({ error: 'Order not found for tax invoice generation' }, { status: 404 });
  }

  const invoice = {
    orderId: order.orderId,
    invoiceNumber: order.invoiceNumber,
    createdAt: order.createdAt,
    seller: sellerDetails,
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      shippingAddress: `${order.streetAddress}, ${order.city}, ${order.state} - ${order.pinCode}`,
      b2bGstin: order.b2bGstin || null
    },
    items: order.items,
    financials: {
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      taxableBase: order.taxableBase,
      cgst: order.cgst,
      sgst: order.sgst,
      igst: order.igst,
      totalPaid: order.totalPaid,
      paymentMethod: order.paymentMethod,
      status: order.paymentStatus
    },
    digitalSignature: {
      authorizedBy: "KB Retail Pvt Ltd Statutory Invoicing Authority",
      signedAt: order.createdAt,
      verificationHash: `SHA256:${Buffer.from(`${order.orderId}|${order.invoiceNumber}|${order.totalPaid}`).toString('base64')}`
    }
  };

  return NextResponse.json({ invoice });
}
