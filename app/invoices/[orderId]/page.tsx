import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PrintInvoiceButton from '@/components/PrintInvoiceButton';
import Link from 'next/link';

export default function InvoicePage({ params }: { params: { orderId: string } }) {
  const order = db.orders.find(o => o.orderId === params.orderId || o.id === params.orderId);

  if (!order) {
    notFound();
  }

  const store = db.storeSettings;
  const verificationHash = `SHA256:${Buffer.from(`${order.orderId}|${order.invoiceNumber}|${order.totalPaid}|${store.officialName}`).toString('base64')}`;

  return (
    <div className="bg-white min-h-screen text-black font-sans p-6 md:p-12 max-w-4xl mx-auto">
      {/* Navigation & Print Actions */}
      <div className="no-print flex justify-between items-center mb-6 border-b border-neutral-200 pb-4">
        <Link
          href={`/orders/${order.orderId}`}
          className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1.5"
        >
          ← Back to Live Order Timeline
        </Link>
        <PrintInvoiceButton />
      </div>

      {/* Bill Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{store.brandName}.</h1>
          <div className="text-sm font-bold text-neutral-800 mt-1">{store.officialName}</div>
          <div className="text-xs text-neutral-500 font-medium">RETAIL CASH MEMO / BILL OF SUPPLY</div>
          <div className="text-[10px] text-emerald-800 font-semibold mt-1">
            ✓ Small Village Enterprise • Traditional Occupation • GST Exempted (Sec 23 CGST Act)
          </div>
        </div>
        <div className="text-right">
          <span className="bg-neutral-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Original Customer Copy
          </span>
          <div className="text-sm font-bold mt-2">Bill #: {order.invoiceNumber}</div>
          <div className="text-xs text-neutral-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          <div className="text-xs text-neutral-500">Order ID: {order.orderId}</div>
        </div>
      </div>

      {/* Seller & Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <strong className="text-neutral-500 uppercase text-[10px] block mb-1">Sold By (Ancestral Shop):</strong>
          <div className="font-bold text-sm text-neutral-900">{store.officialName}</div>
          <div className="text-neutral-600 mt-1 leading-relaxed">{store.address}</div>
          <div className="mt-2 text-neutral-700"><strong>Contact:</strong> {store.contactPhone}</div>
          <div className="text-neutral-700"><strong>Email:</strong> {store.contactEmail}</div>
          <div className="text-[11px] text-neutral-500 mt-2 italic">
            "Serving Kalwaral village with honest textiles for over 20 years."
          </div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <strong className="text-neutral-500 uppercase text-[10px] block mb-1">Billed & Delivered To:</strong>
          <div className="font-bold text-sm text-neutral-900">{order.customerName}</div>
          <div className="text-neutral-600 mt-1 leading-relaxed">{order.streetAddress}</div>
          <div className="text-neutral-600">{order.villageOrCity}, {order.district}, {order.state} - {order.pinCode}</div>
          <div className="mt-2 text-neutral-700"><strong>Phone:</strong> {order.customerPhone}</div>
          <div className="text-neutral-700"><strong>Email:</strong> {order.customerEmail}</div>
        </div>
      </div>

      {/* Order Items Table */}
      <table className="w-full text-left text-xs my-6 border-collapse">
        <thead>
          <tr className="border-b border-black font-bold text-neutral-600 uppercase text-[10px]">
            <th className="py-2.5">#</th>
            <th className="py-2.5">Item Description</th>
            <th className="py-2.5 text-center">Size</th>
            <th className="py-2.5 text-center">Qty</th>
            <th className="py-2.5 text-right">Unit Price</th>
            <th className="py-2.5 text-right">Total Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {order.items.map((item, idx) => (
            <tr key={idx} className="py-2">
              <td className="py-3 font-mono text-neutral-400">{idx + 1}</td>
              <td className="py-3 font-semibold text-neutral-900">
                {item.title}
                <span className="block text-[10px] text-neutral-400 font-normal">Authentic handloom village textile</span>
              </td>
              <td className="py-3 text-center">{item.size}</td>
              <td className="py-3 text-center font-bold">{item.qty}</td>
              <td className="py-3 text-right">₹{item.unitPrice}</td>
              <td className="py-3 text-right font-bold">₹{item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Summary */}
      <div className="flex justify-end my-6 text-xs">
        <div className="w-full md:w-1/2 space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <div className="flex justify-between text-neutral-600">
            <span>Items Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Village Craft Discount:</span>
              <span>-₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-600">
            <span>Express Shipping & Packaging:</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="border-t border-neutral-300 pt-2 flex justify-between font-extrabold text-base text-neutral-900">
            <span>Net Payable / Total Paid:</span>
            <span>₹{order.totalPaid}</span>
          </div>
          <div className="text-[10px] text-neutral-500 pt-1">
            Payment Method: <span className="font-bold text-neutral-800">{order.paymentMethod}</span> ({order.paymentStatus})
          </div>
        </div>
      </div>

      {/* Statutory Exemption & Heritage Declaration */}
      <div className="border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 space-y-1">
        <p className="font-semibold text-neutral-700">Statutory Notice:</p>
        <p>{store.exemptionNotice}</p>
        <p>No tax is collected under Section 23 of CGST Act. The amount charged is the net retail purchase price for handcrafted/retail garments.</p>
      </div>

      {/* Digital Stamp & Verification Signature */}
      <div className="mt-8 pt-4 border-t-2 border-black flex flex-col md:flex-row justify-between items-center text-[10px] text-neutral-500 gap-4">
        <div>
          <div>Authorized Signatory: <strong>{store.officialName}</strong></div>
          <div>Location: Kalwaral(Vil), Kamareddy(D), Telangana - 503145</div>
        </div>
        <div className="text-right font-mono bg-neutral-100 px-3 py-1.5 rounded text-[9px] break-all max-w-md">
          Digital Hash: {verificationHash}
        </div>
      </div>
    </div>
  );
}
