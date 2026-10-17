"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data?.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-kbBorder pb-4 mb-8 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-kbBlack">My Orders</h1>
          <p className="text-xs text-neutral-500 mt-1">Track consignments and download statutory retail bills of supply</p>
        </div>
        <Link href="/search?category=All" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
          ← Shop More Collections
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-kbSurfaceAlt border border-kbBorder rounded-kb-lg p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="text-4xl">📦</div>
          <h2 className="text-lg font-bold">No orders found</h2>
          <p className="text-xs text-neutral-500">
            You haven't placed any orders yet. Explore our genuine cottons from Kalwaral.
          </p>
          <Link
            href="/search?category=All"
            className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border border-kbBorder rounded-kb-lg p-6 shadow-sm hover:border-black transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-kbBorder gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-black">Order #{order.orderId}</span>
                    <span className="text-xs text-neutral-400 font-mono">• Bill #{order.invoiceNumber}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.orderStatus === 'DISPATCHED'
                      ? 'bg-blue-100 text-blue-800'
                      : order.orderStatus === 'CONFIRMED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-base font-extrabold text-black">
                    ₹{order.totalPaid}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-kbLight p-3 rounded-kb-sm border border-kbBorder flex justify-between items-center">
                    <div>
                      <div className="font-bold text-neutral-900">{item.title}</div>
                      <div className="text-[10px] text-neutral-500">Size: {item.size} • Qty: {item.qty}</div>
                    </div>
                    <div className="font-bold text-black">₹{item.totalAmount}</div>
                  </div>
                ))}
              </div>

              {/* Actions: View Timeline & View Bill */}
              <div className="pt-2 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div className="text-neutral-500">
                  Recipient: <strong>{order.customerName}</strong> ({order.villageOrCity}, {order.state})
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="bg-black text-white px-4 py-2 rounded-kb-pill font-bold hover:bg-neutral-800 transition-all"
                  >
                    View Live Timeline →
                  </Link>
                  <Link
                    href={`/invoices/${order.orderId}`}
                    target="_blank"
                    className="border border-kbBorder hover:border-black px-4 py-2 rounded-kb-pill font-semibold text-neutral-700 hover:text-black transition-all"
                  >
                    📄 Bill of Supply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
