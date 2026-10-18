"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundSubmitted, setRefundSubmitted] = useState<boolean>(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data?.order) {
        setOrder(data.order);
        setTracking(data.tracking);
        setStore(data.store);
      }
    } catch (e) {
      console.error('Error fetching order details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundReason.trim() || refundReason.length < 10) {
      setRefundError("Please provide a reason of at least 10 characters");
      return;
    }
    setRefundError(null);
    setIsSubmittingRefund(true);
    try {
      const res = await authFetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          reason: refundReason.trim(),
          amount: order.totalPaid,
        })
      });
      const data = await res.json();
      if (data.success) {
        setRefundSubmitted(true);
        fetchOrder(); // refresh status
      } else {
        setRefundError(data.error || 'Failed to submit refund request');
      }
    } catch (e: any) {
      setRefundError(e.message || 'Error submitting refund request');
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-neutral-400">
        <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-neutral-600">Loading live consignment tracking & details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-2xl mx-auto mb-4">
          📦
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Consignment Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">Could not locate order ID #{id}. Please verify your bill or account order list.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/account?tab=orders" className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-all">
            My Orders
          </Link>
          <Link href="/" className="border border-neutral-200 text-neutral-700 text-xs font-semibold px-6 py-3 rounded-full hover:border-black transition-all">
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const STAGES = [
    { key: 'ORDER_PLACED', label: 'Order Placed', icon: '📝', desc: 'Received at Kalwaral Village Store' },
    { key: 'CONFIRMED', label: 'Confirmed & Packed', icon: '📦', desc: 'Handloom weave verified & packaged' },
    { key: 'DISPATCHED', label: 'Dispatched', icon: '🚚', desc: 'Handed to local village delivery runner' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🛵', desc: 'Runner en route within 10 km radius' },
    { key: 'DELIVERED', label: 'Delivered', icon: '✅', desc: 'Doorstep handed over with verification' },
  ];

  const isCancelled = order.orderStatus === 'CANCELLED';
  const currentStageIndex = STAGES.findIndex(s => s.key === order.orderStatus);
  const activeRefund = tracking?.refund || (order.refundStatus ? { status: order.refundStatus, amount: order.totalPaid } : null);

  const storeName = store?.storeName || 'KB FASHIONS (Kalwaral)';
  const storeAddress = store?.address || '3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145';
  const storePhone = store?.contactPhone || '+91 7989768200';
  const storeEmail = store?.contactEmail || 'kb.official.admin@gmail.com';
  const carrierName = tracking?.carrier || order.courierPartner || 'KB Local Village Runner (Kalwaral 10km)';
  const trackingNumber = tracking?.trackingCode || order.trackingNumber || `KB-RUN-${order.orderId.replace(/[^0-9]/g, '')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
      {/* Top Banner with Consignment Overview */}
      <div className={`text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 min-w-0 ${
        isCancelled ? 'bg-neutral-900 border border-neutral-700' : 'bg-emerald-950 border border-emerald-800'
      }`}>
        <div className="min-w-0 max-w-full space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
              isCancelled ? 'bg-red-900 text-red-200' : 'bg-emerald-800 text-emerald-200'
            }`}>
              {isCancelled ? 'Cancelled Order' : 'Live Consignment Tracking'}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-300 break-all">Bill #{order.invoiceNumber}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white break-words break-all">
            Order #{order.orderId}
          </h1>

          <p className="text-xs text-neutral-300">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href={`/invoices/${order.orderId}`}
            id="view-bill-btn"
            target="_blank"
            className="bg-white text-black font-bold text-xs px-5 py-3 rounded-full hover:bg-neutral-100 flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <span>📄</span>
            <span>Print Official Bill of Supply</span>
          </Link>

          <Link
            href={`/support?category=ORDER&orderId=${order.orderId}`}
            className="border border-neutral-600 hover:border-white text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <span>💬</span>
            <span>Support Ticket</span>
          </Link>

          <Link
            href="/search?category=All"
            className="border border-neutral-700 hover:border-white text-neutral-300 hover:text-white font-medium text-xs px-5 py-3 rounded-full transition-all whitespace-nowrap"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Consignment Stepper, Facility Tracking Log, Assistance */}
        <div className="lg:col-span-2 space-y-8 min-w-0 max-w-full">
          
          {/* Status Progression Card */}
          <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Consignment Status
                </span>
                <h2 className="text-lg font-black text-neutral-900 mt-0.5">
                  {isCancelled ? 'Order Cancelled Before Dispatch' : STAGES[currentStageIndex]?.label || order.orderStatus}
                </h2>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Estimated SLA
                </span>
                <div className="text-xs font-bold text-emerald-800">
                  {tracking?.estimatedDelivery || 'Within 24-48 Hours (10 km Rural Delivery)'}
                </div>
              </div>
            </div>

            {/* Carrier & Tracking Code Bar */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs min-w-0">
              <div className="min-w-0">
                <span className="text-neutral-500 font-medium">Carrier:</span>{' '}
                <strong className="text-neutral-900 font-bold break-words">{carrierName}</strong>
              </div>
              <div className="min-w-0">
                <span className="text-neutral-500 font-medium">Waybill Consignment:</span>{' '}
                <strong className="font-mono text-black font-bold break-all bg-white px-2.5 py-1 rounded-md border border-neutral-200">
                  {trackingNumber}
                </strong>
              </div>
            </div>

            {/* Stepper Graphic */}
            {!isCancelled ? (
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {STAGES.map((stg, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div key={stg.key} className="flex flex-col items-center p-3 rounded-2xl transition-all min-w-0 bg-neutral-50/50">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-lg mb-2 font-bold transition-all shadow-sm ${
                            isCurrent
                              ? 'bg-black text-white ring-4 ring-neutral-300 scale-105'
                              : isPassed
                              ? 'bg-emerald-700 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          {stg.icon}
                        </div>
                        <span className={`text-[11px] font-black leading-tight break-words ${
                          isCurrent ? 'text-black' : isPassed ? 'text-emerald-800' : 'text-neutral-400'
                        }`}>
                          {stg.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-black uppercase text-white bg-black px-2 py-0.5 rounded-full mt-1.5 shadow-xs">
                            Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>⛔</span>
                  <span>Consignment Cancelled Prior to Dispatch</span>
                </div>
                <p className="text-[11px] text-red-700">
                  This order was cancelled before dispatch. Any pre-authorized charges will be refunded to your original payment method.
                </p>
              </div>
            )}
          </div>

          {/* Refund Details Card (If active) */}
          {activeRefund && (
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Refund Tracking &amp; Settlement
                    </h3>
                    <p className="text-[10px] text-amber-700">7-Day Village Assurance Statutory Policy</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                  activeRefund.status === 'PROCESSED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : activeRefund.status === 'APPROVED'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : activeRefund.status === 'REJECTED'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {activeRefund.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-neutral-500">Refund Amount:</span>{' '}
                  <strong className="text-neutral-900 font-black text-sm">₹{activeRefund.amount || order.totalPaid}</strong>
                </div>
                {activeRefund.refundId && (
                  <div className="break-all">
                    <span className="text-neutral-500">Refund Reference ID:</span>{' '}
                    <strong className="font-mono text-neutral-900">{activeRefund.refundId}</strong>
                  </div>
                )}
                {activeRefund.reason && (
                  <div className="sm:col-span-2 text-neutral-700 break-words">
                    <span className="text-neutral-500">Recorded Reason:</span> {activeRefund.reason}
                  </div>
                )}
                {activeRefund.adminNotes && (
                  <div className="sm:col-span-2 text-neutral-700 break-words bg-white/70 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-neutral-500 font-semibold">Store Settlement Note:</span> {activeRefund.adminNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage-by-Stage Facility Event Timeline */}
          <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 min-w-0">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h2 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                Live Facility Event Timeline
              </h2>
              <span className="text-[10px] font-mono text-neutral-400">
                {order.timeline?.length || 0} events logged
              </span>
            </div>

            <div className="relative border-l-2 border-black ml-4 space-y-6 pl-6 my-4 min-w-0">
              {order.timeline?.map((event: any, idx: number) => (
                <div key={idx} className="relative group min-w-0">
                  {/* Node Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-black ring-4 ring-neutral-100 shadow-sm"></div>

                  <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 transition-all min-w-0 space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 min-w-0">
                      <h3 className="font-black text-xs sm:text-sm text-neutral-900 break-words">
                        {event.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                        {new Date(event.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 break-words leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-2 text-[10px] font-bold text-neutral-500 flex items-center gap-1.5 break-words">
                      <span>📍</span>
                      <span className="break-all">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assistance or Return Request Section */}
          {!activeRefund && !isCancelled && (
            <div className="bg-white border border-neutral-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  7-Day Village Assurance Policy &amp; Returns
                </h3>
              </div>

              {refundSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs space-y-1">
                  <div className="font-bold">✓ Return / Refund Request Received</div>
                  <p className="text-[11px] text-emerald-700">
                    Your request has been forwarded to store admin. Our village runner will verify the saree/fabric and contact you at {order.customerPhone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestRefund} className="space-y-3 text-xs">
                  <p className="text-neutral-500 leading-relaxed text-[11px]">
                    If you are not fully satisfied with handloom weave, size cut, or fabric quality, you may request an inspection and full refund within 7 days of delivery:
                  </p>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please describe reason for return (e.g. Size exchange requested, color preference, or weave query)..."
                    className="w-full p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-black h-24 transition-all"
                  ></textarea>
                  {refundError && <p className="text-[11px] text-red-600 font-semibold">{refundError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmittingRefund}
                    className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-full transition-all disabled:opacity-50"
                  >
                    {isSubmittingRefund ? 'Submitting...' : 'Submit Return / Refund Request'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Destination Details, Items Purchased, Dynamic Origin Store */}
        <div className="space-y-6 min-w-0 max-w-full">
          
          {/* Destination Details Card */}
          <div className="bg-neutral-50 border border-neutral-200/80 p-6 rounded-3xl space-y-3 text-xs shadow-sm min-w-0">
            <span className="font-black uppercase tracking-wider text-neutral-400 text-[10px]">
              Delivery Destination
            </span>
            <div className="font-black text-base text-black break-words">
              {order.customerName}
            </div>
            <div className="text-neutral-600 leading-relaxed break-words">
              {order.streetAddress}<br />
              {order.villageOrCity}, {order.district}, {order.state} - <strong className="text-black">{order.pinCode}</strong>
            </div>
            <div className="pt-3 border-t border-neutral-200/80 text-neutral-700 space-y-1">
              <div className="break-all">Phone: <strong className="text-black">{order.customerPhone}</strong></div>
              <div className="break-all">Email: <strong className="text-black">{order.customerEmail}</strong></div>
            </div>
          </div>

          {/* Garments in Consignment */}
          <div className="bg-white border border-neutral-200/80 p-6 rounded-3xl space-y-4 text-xs shadow-sm min-w-0">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="font-black uppercase tracking-wider text-neutral-400 text-[10px]">
                Garments in Package ({order.items?.length || 0})
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Verified
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-start gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-neutral-900 break-words">{item.title}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Size: {item.size} • Qty: {item.qty}</div>
                  </div>
                  <div className="font-black text-neutral-900 text-right shrink-0">
                    ₹{item.totalAmount}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Village Discount:</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping (10 km Rural SLA):</span>
                <span className="font-bold text-emerald-800">
                  {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2.5 flex justify-between font-black text-base text-black">
                <span>Total Amount:</span>
                <span>₹{order.totalPaid}</span>
              </div>
              <div className="text-[10px] text-neutral-500 pt-1.5 flex justify-between items-center">
                <span>Payment Mode:</span>
                <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>
          </div>

          {/* Village Store Origin Details (Zero Hardcoding - from Database storeSettings) */}
          <div className="bg-neutral-950 text-white p-6 rounded-3xl text-xs space-y-3 shadow-md min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div className="font-black text-emerald-400 tracking-wide break-words">{storeName}</div>
            </div>
            
            <div className="text-neutral-300 text-[11px] leading-relaxed break-words">
              {storeAddress}
            </div>

            <div className="pt-3 border-t border-neutral-800 text-[11px] space-y-1 text-neutral-400">
              <div className="break-all">Phone: <strong className="text-white">{storePhone}</strong></div>
              <div className="break-all">Email: <strong className="text-white">{storeEmail}</strong></div>
            </div>

            <div className="pt-2">
              <Link
                href={`/support?category=ORDER&orderId=${order.orderId}`}
                className="w-full block text-center bg-white/10 hover:bg-white text-neutral-200 hover:text-black py-2 rounded-xl text-[11px] font-bold transition-all"
              >
                Open Ticket for Order #{order.orderId}
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
