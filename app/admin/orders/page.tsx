"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, [filterStage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const url = filterStage === 'ALL' ? '/api/orders' : `/api/orders?status=${filterStage}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const STAGES = [
    'ALL',
    'ORDER_PLACED',
    'CONFIRMED',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];

  const filtered = orders.filter(o =>
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-kbBorder pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Orders & Consignment Dispatch</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Stage-by-stage monitoring for orders originating from Kalwaral shop
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {STAGES.map(stg => (
            <button
              key={stg}
              onClick={() => setFilterStage(stg)}
              className={`px-3 py-1.5 rounded-kb-pill text-xs font-bold transition-all cursor-pointer ${
                filterStage === stg
                  ? 'bg-black text-white'
                  : 'bg-white border border-kbBorder text-neutral-600 hover:text-black hover:border-black'
              }`}
            >
              {stg.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Name..."
            className="w-full px-3.5 py-2 rounded-kb-pill border border-kbBorder bg-white text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-kbBorder rounded-kb-md p-10 text-center text-xs text-neutral-500">
          No orders found for selected filter.
        </div>
      ) : (
        <div className="bg-white border border-kbBorder rounded-kb-md shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-kbBorder text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                <th className="py-3 px-4">Order ID & Bill</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Delivery Town</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(order => (
                <tr key={order.orderId} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold block">{order.orderId}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">#{order.invoiceNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-neutral-900 block">{order.customerName}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-neutral-800">{order.villageOrCity}</span>
                    <span className="text-[10px] text-neutral-400 block">{order.state} - {order.pinCode}</span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600 font-semibold">
                    {order.items?.length || 1} item{order.items?.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-3 px-4 font-black text-black">
                    ₹{order.totalPaid}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                      {order.paymentMethod}
                    </span>
                    <span className="block text-[9px] text-neutral-400">{order.paymentStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      order.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'DISPATCHED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.orderStatus === 'CONFIRMED'
                        ? 'bg-amber-100 text-amber-800'
                        : order.orderStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/orders/${order.orderId}`}
                      className="bg-black text-white px-3 py-1.5 rounded-kb-pill text-[10px] font-bold hover:bg-neutral-800 transition-all inline-block"
                    >
                      Stage Monitor →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
