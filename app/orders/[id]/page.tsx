"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundSubmitted, setRefundSubmitted] = useState<boolean>(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data?.order) {
        setOrder(data.order);
        setStore(data.store);
      }
    } catch (e) {
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
    try {
      const res = await fetch('/api/admin/refunds', {
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
      } else {
        setRefundError(data.error || 'Failed to submit refund request');
      }
    } catch (e) {
      setRefundError('Error submitting refund request');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading live consignment timeline...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">Could not locate order ID #{id}.</p>
        <Link href="/" className="inline-block mt-4 bg-black text-white text-xs font-bold px-6 py-3 rounded-full">
          Back to Store
        </Link>
      </div>
    );
  }

  const STAGES = [
    { key: 'ORDER_PLACED', label: '1. Order Placed', icon: '📝' },
    { key: 'CONFIRMED', label: '2. Confirmed & Packed', icon: '📦' },
    { key: 'DISPATCHED', label: '3. Dispatched in Transit', icon: '🚚' },
    { key: 'OUT_FOR_DELIVERY', label: '4. Out for Delivery', icon: '🛵' },
    { key: 'DELIVERED', label: '5. Delivered', icon: '✅' },
  ];

  const currentStageIndex = STAGES.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white rounded-kb-xl p-6 sm:p-8 mb-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <span>✓ Order Successfully Recorded</span>
            <span>•</span>
            <span>Bill #{order.invoiceNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Order #{order.orderId}
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/invoices/${order.orderId}`}
            id="view-bill-btn"
            target="_blank"
            className="bg-white text-black font-bold text-xs px-5 py-3 rounded-kb-pill hover:bg-neutral-100 flex items-center gap-2 shadow-sm"
          >
            <span>📄</span>
            <span>Print Official Bill of Supply</span>
          </Link>
          <Link
            href="/search?category=All"
            className="border border-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-kb-pill hover:border-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Stage-by-Stage Live Timeline Representation */}
        <div className="lg:col-span-2 space-y-8">
          {/* Horizontal Stepper Bar */}
          <div className="bg-white border border-kbBorder p-6 rounded-kb-lg shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-6">
              Consignment Progress Status
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {STAGES.map((stg, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stg.key} className="flex flex-col items-center p-2 rounded-kb-sm">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base mb-2 font-bold transition-all ${
                        isCurrent
                          ? 'bg-black text-white ring-4 ring-neutral-200'
                          : isPassed
                          ? 'bg-emerald-800 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {stg.icon}
                    </div>
                    <span className={`text-[11px] font-bold ${isCurrent ? 'text-black' : isPassed ? 'text-emerald-800' : 'text-neutral-400'}`}>
                      {stg.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-semibold text-white bg-black px-2 py-0.2 rounded-full mt-1">
                        Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {order.courierPartner && (
              <div className="mt-6 pt-4 border-t border-neutral-100 bg-neutral-50 p-3.5 rounded-kb-sm flex flex-wrap justify-between items-center text-xs">
                <div>
                  <span className="text-neutral-500">Carrier:</span>{' '}
                  <strong className="text-black">{order.courierPartner}</strong>
                </div>
                <div>
                  <span className="text-neutral-500">Tracking Consignment #:</span>{' '}
                  <strong className="font-mono text-black">{order.trackingNumber || 'Assigned'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Stage-by-Stage Vertical Event Timeline */}
          <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg shadow-sm space-y-6">
            <h2 className="text-base font-black text-kbBlack uppercase tracking-wider text-xs">
              Live Stage-by-Stage Tracking Log
            </h2>

            <div className="relative border-l-2 border-black ml-4 space-y-8 pl-6 my-4">
              {order.timeline?.map((event: any, idx: number) => (
                <div key={idx} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-black border-4 border-white shadow"></div>

                  <div className="bg-kbLight p-4 rounded-kb-md border border-kbBorder">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-1">
                      <h3 className="font-bold text-sm text-neutral-900">{event.title}</h3>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(event.timestamp).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-1">{event.description}</p>

                    <div className="mt-2 text-[10px] font-semibold text-neutral-500 flex items-center gap-1">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund / Assistance Form (Embedded In-Page, Zero Modals!) */}
          <div className="bg-white border border-kbBorder p-6 rounded-kb-lg shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Need Assistance or Returns?
            </h3>
            {refundSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-kb-sm text-xs">
                ✓ Your return/refund request has been submitted to KB FASHIONS shop admin. We will review and contact you at {order.customerPhone}.
              </div>
            ) : (
              <form onSubmit={handleRequestRefund} className="space-y-3 text-xs">
                <p className="text-neutral-500">
                  7-Day Village Assurance Policy. If you are not satisfied with fit or fabric, enter details below:
                </p>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for return/refund (e.g. Size exchange requested or fabric preference)..."
                  className="w-full p-3 rounded-kb-sm border border-kbBorder bg-kbLight text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black h-20"
                ></textarea>
                {refundError && <p className="text-[11px] text-red-600">{refundError}</p>}
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-kb-pill transition-all"
                >
                  Submit Return / Refund Request
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Delivery & Order Details Summary */}
        <div className="space-y-6">
          {/* Recipient Details */}
          <div className="bg-kbSurfaceAlt border border-kbBorder p-6 rounded-kb-lg space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-800 text-[11px]">
              Delivery Destination
            </h3>
            <div className="font-bold text-sm text-black">{order.customerName}</div>
            <div className="text-neutral-600 leading-relaxed">
              {order.streetAddress}<br />
              {order.villageOrCity}, {order.district}, {order.state} - <strong>{order.pinCode}</strong>
            </div>
            <div className="pt-2 border-t border-kbBorder text-neutral-700">
              <div>Phone: <strong>{order.customerPhone}</strong></div>
              <div>Email: <strong>{order.customerEmail}</strong></div>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="bg-white border border-kbBorder p-6 rounded-kb-lg space-y-4 text-xs shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-neutral-800 text-[11px]">
              Garments in Package ({order.items?.length})
            </h3>

            <div className="divide-y divide-kbBorder">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-neutral-900">{item.title}</div>
                    <div className="text-[10px] text-neutral-500">Size: {item.size} • Qty: {item.qty}</div>
                  </div>
                  <div className="font-bold text-black text-right">
                    ₹{item.totalAmount}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-kbBorder pt-3 space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Village Discount:</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="border-t border-kbBorder pt-2 flex justify-between font-black text-base text-black">
                <span>Amount Paid:</span>
                <span>₹{order.totalPaid}</span>
              </div>
              <div className="text-[10px] text-neutral-500 pt-1">
                Payment: <strong className="text-neutral-800">{order.paymentMethod}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Village Store Origin Details */}
          <div className="bg-neutral-900 text-white p-5 rounded-kb-lg text-xs space-y-2">
            <div className="font-bold text-emerald-400">KB FASHIONS (Kalwaral)</div>
            <div className="text-neutral-300 font-mono text-[11px] leading-relaxed">
              3-55/1, Kalwaral(Vil), Sadasivanagar(M), Kamareddy(D), Telangana, 503145.
            </div>
            <div className="text-neutral-400 text-[10px] pt-1">
              Need immediate help? Call store owner at <strong>+91 7989768200</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
