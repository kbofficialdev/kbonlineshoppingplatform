"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json?.analytics) {
        setData(json.analytics);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading admin metrics...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    lowStockCount = 0,
    ordersByStatus = {},
    recentOrders = [],
    storeInfo = {},
  } = data || {};

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-kbBlack">Enterprise Dashboard</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Real-time metrics for {storeInfo?.officialName || 'KB FASHIONS'} • Kalwaral, Telangana
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-kbBorder p-5 rounded-kb-md shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Revenue</span>
          <div className="text-3xl font-black text-black">₹{totalRevenue}</div>
          <p className="text-[11px] text-emerald-700 font-semibold">✓ Net sales (GST Exempted)</p>
        </div>

        <div className="bg-white border border-kbBorder p-5 rounded-kb-md shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Consignments</span>
          <div className="text-3xl font-black text-black">{totalOrders}</div>
          <p className="text-[11px] text-neutral-500">Orders placed across India</p>
        </div>

        <div className="bg-white border border-kbBorder p-5 rounded-kb-md shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Registered Customers</span>
          <div className="text-3xl font-black text-black">{totalCustomers}</div>
          <p className="text-[11px] text-neutral-500">Active customer accounts</p>
        </div>

        <div className="bg-white border border-kbBorder p-5 rounded-kb-md shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Low Stock Warnings</span>
          <div className="text-3xl font-black text-amber-600">{lowStockCount}</div>
          <p className="text-[11px] text-neutral-500">Products with stock &le; 15 units</p>
        </div>
      </div>

      {/* Orders Stage Breakdown */}
      <div className="bg-white border border-kbBorder p-6 rounded-kb-md shadow-sm space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-neutral-800">
          Live Consignment Pipeline by Stage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-black">{ordersByStatus.ORDER_PLACED || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Order Placed</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-amber-600">{ordersByStatus.CONFIRMED || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Confirmed & Packed</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-blue-600">{ordersByStatus.DISPATCHED || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Dispatched in Transit</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-indigo-600">{ordersByStatus.OUT_FOR_DELIVERY || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Out for Delivery</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-emerald-600">{ordersByStatus.DELIVERED || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Delivered</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
            <span className="block text-2xl font-black text-neutral-400">{ordersByStatus.CANCELLED || 0}</span>
            <span className="text-[10px] font-bold text-neutral-500">Cancelled / Refunded</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-kbBorder p-6 rounded-kb-md shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-800">
            Recent Consignments
          </h2>
          <Link href="/admin/orders" className="text-xs font-bold text-neutral-600 hover:text-black underline">
            Manage All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-kbBorder text-neutral-400 text-[10px] uppercase font-bold">
                <th className="py-2.5">Order ID</th>
                <th className="py-2.5">Customer</th>
                <th className="py-2.5">Location</th>
                <th className="py-2.5">Total Paid</th>
                <th className="py-2.5">Stage</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.map((ord: any) => (
                <tr key={ord.orderId} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 font-mono font-bold">{ord.orderId}</td>
                  <td className="py-3">
                    <span className="font-bold block">{ord.customerName}</span>
                    <span className="text-[10px] text-neutral-400">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3 text-neutral-600">{ord.villageOrCity}, {ord.state}</td>
                  <td className="py-3 font-extrabold text-black">₹{ord.totalPaid}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ord.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'DISPATCHED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/orders/${ord.orderId}`}
                      className="bg-black text-white px-3 py-1.5 rounded-kb-pill text-[10px] font-bold hover:bg-neutral-800"
                    >
                      Update Stage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

