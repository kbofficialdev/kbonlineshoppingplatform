"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { authFetch } from '@/lib/clientAuth';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State for Stage Advance
  const [nextStage, setNextStage] = useState<string>('CONFIRMED');
  const [stageTitle, setStageTitle] = useState<string>('Order Confirmed & Inspected');
  const [stageDesc, setStageDesc] = useState<string>('Garments inspected for weaving quality and packed in eco-friendly wrapping at Kalwaral store.');
  const [stageLocation, setStageLocation] = useState<string>('KB FASHIONS, Kalwaral, Telangana');
  const [courierPartner, setCourierPartner] = useState<string>('KB 10km Express Runner');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

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
        if (data.order.courierPartner) setCourierPartner(data.order.courierPartner);
        if (data.order.trackingNumber) setTrackingNumber(data.order.trackingNumber);

        // Pre-configure next recommended stage
        if (data.order.orderStatus === 'ORDER_PLACED') {
          setNextStage('CONFIRMED');
          setStageTitle('Order Confirmed & Hand-Inspected');
          setStageDesc('Garments hand-inspected for weaving quality and packed at Kalwaral store.');
          setStageLocation('KB FASHIONS, Kalwaral, Telangana');
        } else if (data.order.orderStatus === 'CONFIRMED') {
          setNextStage('DISPATCHED');
          setStageTitle('Dispatched in Transit');
          setStageDesc('Consignment handed over to KB 10km Local Delivery runner.');
          setStageLocation('Kalwaral Delivery Hub, Telangana');
          setTrackingNumber(`KB-LOC-${Math.floor(10000000 + Math.random() * 90000000)}`);
        } else if (data.order.orderStatus === 'DISPATCHED') {
          setNextStage('OUT_FOR_DELIVERY');
          setStageTitle('Out for Delivery');
          setStageDesc('Consignment reached destination delivery office and dispatched with courier personnel.');
          setStageLocation(`${data.order.villageOrCity} Delivery Hub`);
        } else if (data.order.orderStatus === 'OUT_FOR_DELIVERY') {
          setNextStage('DELIVERED');
          setStageTitle('Consignment Delivered Successfully');
          setStageDesc('Delivered to recipient. Payment verified.');
          setStageLocation(`Customer Doorstep, ${data.order.villageOrCity}`);
        }
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvanceStage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await authFetch(`/api/orders/${id}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: nextStage,
          title: stageTitle,
          description: stageDesc,
          location: stageLocation,
          courierPartner: courierPartner || undefined,
          trackingNumber: trackingNumber || undefined,
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setSuccessMsg(`✓ Consignment stage successfully advanced to ${nextStage}!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to advance stage');
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading consignment monitor...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white p-10 text-center rounded-kb-md">
        <h2 className="text-lg font-bold">Order Not Found</h2>
        <Link href="/admin/orders" className="text-xs font-bold underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-kbBorder pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-kbBlack">Consignment Monitor: {order.orderId}</h1>
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              Bill #{order.invoiceNumber}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Current Stage: <strong className="text-emerald-800">{order.orderStatus}</strong> • Recipient: {order.customerName}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/invoices/${order.orderId}`}
            target="_blank"
            className="border border-kbBorder bg-white hover:border-black px-4 py-2 rounded-kb-pill text-xs font-bold text-neutral-800 flex items-center gap-1.5 shadow-sm"
          >
            <span>📄</span>
            <span>View Bill of Supply</span>
          </Link>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-neutral-600 hover:text-black px-4 py-2"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-4 rounded-kb-md font-bold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-kb-md font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Stage Progression Form & Timeline Log */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stage Progression Controller Form */}
          <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg shadow-sm space-y-6 text-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              Advance Consignment to Next Stage
            </h2>

            <form onSubmit={handleAdvanceStage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Target Stage *</label>
                  <select
                    value={nextStage}
                    onChange={(e) => setNextStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight font-bold text-black focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  >
                    <option value="CONFIRMED">CONFIRMED (Inspected & Packed)</option>
                    <option value="DISPATCHED">DISPATCHED (In Transit with Courier)</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (With Delivery Agent)</option>
                    <option value="DELIVERED">DELIVERED (Completed)</option>
                    <option value="CANCELLED">CANCELLED (Cancelled by Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Current Facility / Location *</label>
                  <input
                    type="text"
                    required
                    value={stageLocation}
                    onChange={(e) => setStageLocation(e.target.value)}
                    placeholder="e.g. Kamareddy Head Post Office"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">Stage Title *</label>
                  <input
                    type="text"
                    required
                    value={stageTitle}
                    onChange={(e) => setStageTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:outline-none focus:ring-1 focus:ring-black text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">Tracking Notes / Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={stageDesc}
                    onChange={(e) => setStageDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Courier Carrier</label>
                  <input
                    type="text"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    placeholder="KB 10km Express Runner, Local Runner, etc."
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Tracking Consignment Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. EK298371920IN"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight font-mono focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  id="advance-stage-btn"
                  disabled={isUpdating}
                  className="bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-kb-pill hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50"
                >
                  {isUpdating ? 'Advancing Stage...' : `Advance Stage to ${nextStage} →`}
                </button>
              </div>
            </form>
          </div>

          {/* Historical Stage Events Log */}
          <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg shadow-sm space-y-6 text-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
              Recorded Consignment Timeline History
            </h2>

            <div className="relative border-l-2 border-black ml-4 space-y-6 pl-6 my-2">
              {order.timeline?.map((evt: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-black border-2 border-white"></div>
                  <div className="bg-kbLight p-3.5 rounded border border-kbBorder">
                    <div className="flex justify-between items-baseline mb-1">
                      <strong className="text-black text-sm">{evt.title}</strong>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(evt.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-neutral-600">{evt.description}</p>
                    <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                      Facility: {evt.location} {evt.trackingNumber && `• Consignment: ${evt.trackingNumber}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recipient & Item Specifications */}
        <div className="space-y-6 text-xs">
          {/* Recipient Card */}
          <div className="bg-white border border-kbBorder p-5 rounded-kb-lg shadow-sm space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
              Customer & Delivery Address
            </h3>
            <div className="font-black text-sm text-black">{order.customerName}</div>
            <div className="text-neutral-600 leading-relaxed">
              {order.streetAddress}<br />
              {order.villageOrCity}, {order.district}, {order.state} - <strong>{order.pinCode}</strong>
            </div>
            <div className="pt-2 border-t border-kbBorder space-y-1">
              <div>Phone: <a href={`tel:${order.customerPhone}`} className="font-mono font-bold hover:underline">{order.customerPhone}</a></div>
              <div>Email: <a href={`mailto:${order.customerEmail}`} className="font-mono hover:underline">{order.customerEmail}</a></div>
            </div>
          </div>

          {/* Payment & Items */}
          <div className="bg-white border border-kbBorder p-5 rounded-kb-lg shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
              Ordered Garments ({order.items?.length})
            </h3>

            <div className="divide-y divide-neutral-100">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-neutral-900">{item.title}</div>
                    <div className="text-[10px] text-neutral-400">Size: {item.size} • Qty: {item.qty}</div>
                  </div>
                  <div className="font-bold text-black text-right">
                    ₹{item.totalAmount}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-kbBorder pt-3 space-y-1">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping:</span>
                <span>₹{order.shippingFee}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-black pt-1 border-t border-neutral-100">
                <span>Total Paid:</span>
                <span>₹{order.totalPaid}</span>
              </div>
              <div className="text-[10px] text-neutral-500 pt-1">
                Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

