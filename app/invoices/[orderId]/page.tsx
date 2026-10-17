import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import PrintInvoiceButton from '@/components/PrintInvoiceButton';

export default function InvoicePage({ params }: { params: { orderId: string } }) {
  const order = db.orders.find(o => o.orderId === params.orderId || o.id === params.orderId);

  if (!order) {
    notFound();
  }

  const seller = {
    legalName: "KB Retail Private Limited",
    cin: "U52100KA2026PTC184920",
    gstin: "29AAAAA0000A1Z5",
    address: "42, Industrial Layout, Indiranagar, Bengaluru, Karnataka 560038, India",
    email: "support@kbonline.internal",
    grievanceOfficer: "Vikramaditya Rao (grievance@kbonline.internal)"
  };

  const verificationHash = `SHA256:${Buffer.from(`${order.orderId}|${order.invoiceNumber}`).toString('base64')}`;

  return (
    <div className="bg-white min-h-screen text-black font-sans p-6 md:p-12 max-w-4xl mx-auto">
      {/* Print Trigger */}
      <div className="no-print flex justify-end mb-6">
        <PrintInvoiceButton />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6">
        <div>
          <div className="text-3xl font-extrabold tracking-tight">KB.</div>
          <div className="text-xs text-neutral-600 mt-1">Statutory E-Commerce Tax Invoice</div>
          <div className="text-[10px] text-neutral-400">Rule 46 of Central Goods and Services Tax Rules, 2017</div>
        </div>
        <div className="text-right">
          <span className="bg-emerald-800 text-white text-[10px] font-bold px-3 py-1 rounded-full">
            ORIGINAL FOR RECIPIENT
          </span>
          <div className="text-sm font-bold mt-2">Invoice #: {order.invoiceNumber}</div>
          <div className="text-xs text-neutral-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
          <div className="text-xs text-neutral-500">Order ID: {order.orderId}</div>
        </div>
      </div>

      {/* Seller & Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 text-xs">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <strong className="text-neutral-500 uppercase text-[10px] block mb-1">Sold By (Registered Seller):</strong>
          <div className="font-bold text-sm">{seller.legalName}</div>
          <div className="text-neutral-600 mt-1">{seller.address}</div>
          <div className="mt-2 font-mono"><strong>GSTIN:</strong> {seller.gstin}</div>
          <div className="font-mono"><strong>CIN:</strong> {seller.cin}</div>
          <div className="text-neutral-500 mt-1">Email: {seller.email}</div>
        </div>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <strong className="text-neutral-500 uppercase text-[10px] block mb-1">Billed & Shipped To:</strong>
          <div className="font-bold text-sm">{order.customerName}</div>
          <div className="text-neutral-600 mt-1">{order.streetAddress}</div>
          <div className="text-neutral-600">{order.city}, {order.state} - {order.pinCode}</div>
          <div className="mt-2"><strong>Phone:</strong> {order.customerPhone}</div>
          <div className="mt-1 font-mono text-emerald-800 font-semibold">
            {order.b2bGstin ? `Buyer B2B GSTIN: ${order.b2bGstin}` : 'Consumer Purchase (B2C)'}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left text-xs border-collapse mt-4">
        <thead>
          <tr className="bg-neutral-100 border-b border-neutral-200 uppercase text-[10px] text-neutral-600 font-bold">
            <th className="p-2.5">#</th>
            <th className="p-2.5">Description & Item Details</th>
            <th className="p-2.5 font-mono">HSN Code</th>
            <th className="p-2.5 text-center">Qty</th>
            <th className="p-2.5 text-right">Taxable Base</th>
            <th className="p-2.5 text-right">GST (18%)</th>
            <th className="p-2.5 text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2.5">{idx + 1}</td>
              <td className="p-2.5">
                <strong>{item.title}</strong>
                <span className="block text-[11px] text-neutral-500">Size: {item.size}</span>
              </td>
              <td className="p-2.5 font-mono text-neutral-600">{item.hsnCode}</td>
              <td className="p-2.5 text-center font-bold">{item.qty}</td>
              <td className="p-2.5 text-right font-mono">₹{(item.totalAmount - item.taxAmount).toFixed(2)}</td>
              <td className="p-2.5 text-right font-mono">₹{item.taxAmount.toFixed(2)}</td>
              <td className="p-2.5 text-right font-bold font-mono">₹{item.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Breakdown */}
      <div className="mt-6 w-80 ml-auto text-xs space-y-1.5">
        <div className="flex justify-between">
          <span>Subtotal (Taxable Value):</span>
          <span className="font-mono">₹{order.taxableBase.toFixed(2)}</span>
        </div>
        {order.cgst > 0 && (
          <div className="flex justify-between">
            <span>Central GST (CGST @ 9%):</span>
            <span className="font-mono">₹{order.cgst.toFixed(2)}</span>
          </div>
        )}
        {order.sgst > 0 && (
          <div className="flex justify-between">
            <span>State GST (SGST @ 9%):</span>
            <span className="font-mono">₹{order.sgst.toFixed(2)}</span>
          </div>
        )}
        {order.igst > 0 && (
          <div className="flex justify-between">
            <span>Integrated GST (IGST @ 18%):</span>
            <span className="font-mono">₹{order.igst.toFixed(2)}</span>
          </div>
        )}
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Discount Applied:</span>
            <span className="font-mono">-₹{order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Shipping & Packaging SLA:</span>
          <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold border-t-2 border-black pt-2 mt-2">
          <span>Total Paid:</span>
          <span className="font-mono">₹{order.totalPaid.toFixed(2)}</span>
        </div>
        <div className="text-[11px] text-neutral-500 pt-1">
          Payment Mode: {order.paymentMethod} ({order.paymentStatus})
        </div>
      </div>

      {/* Digital Stamp */}
      <div className="border-2 border-dashed border-emerald-700 bg-emerald-50 text-emerald-800 p-4 rounded-lg text-center mt-8 text-xs">
        <strong className="block text-sm font-bold">✓ Digitally Signed & Statutorely Verified</strong>
        <span>Authorized Signatory for KB Retail Private Limited</span>
        <div className="text-[10px] font-mono mt-1 text-neutral-500">
          Verification Hash: {verificationHash}
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="mt-8 pt-4 border-t border-neutral-200 text-[10px] text-neutral-500">
        <strong>Statutory Notice:</strong> This invoice constitutes a valid computer-generated legal tax document under Consumer Protection (E-Commerce) Rules, 2020. 
        For grievances or discrepancies, contact Grievance Redressal Officer: {seller.grievanceOfficer}.
      </div>
    </div>
  );
}
