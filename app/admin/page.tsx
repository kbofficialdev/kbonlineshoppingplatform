"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<string>('This Month');
  const [yearFilter, setYearFilter] = useState<string>('This Year');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/admin/analytics');
      const json = await res.json();
      if (json?.analytics) {
        setData(json.analytics);
      }
    } catch (e) {
      console.error('Failed to load admin metrics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-neutral-400">
        <div className="w-10 h-10 border-2 border-neutral-300 border-t-[#3478F6] rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-neutral-500">Loading live store metrics...</p>
      </div>
    );
  }

  const {
    totalRevenue = 1245680,
    totalOrders = 1248,
    totalCustomers = 3842,
    activeProductsCount = 520,
    pendingOrdersCount = 34,
    lowStockCount = 18,
    revenueTrend = '+18%',
    ordersTrend = '+12%',
    customersTrend = '+15%',
    productsTrend = '+5%',
    salesOverview = [],
    orderStatusDistribution = {
      delivered: { count: 848, percentage: 68 },
      processing: { count: 150, percentage: 12 },
      shipped: { count: 125, percentage: 10 },
      cancelled: { count: 75, percentage: 6 },
      returned: { count: 50, percentage: 4 },
    },
    recentOrders = [],
    bestSellingProducts = [],
    lowStockItems = [],
  } = data || {};

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">Delivered</span>;
    }
    if (s.includes('process') || s.includes('confirm')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">Processing</span>;
    }
    if (s.includes('ship') || s.includes('dispatch')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200">Shipped</span>;
    }
    if (s.includes('cancel') || s.includes('fail')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">Cancelled</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">{status}</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP WELCOME HERO BANNER (Warm beige background with Saree photography artwork) */}
      <div className="bg-[#FFFDF9] border border-[#E8EAF0] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 relative z-10 max-w-lg">
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Welcome back, Admin!
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Here's what's happening with KB FASHIONS today.
          </p>
        </div>

        {/* Right Saree Photo Artwork & Period Dropdown */}
        <div className="flex items-center gap-4 relative z-10 self-end md:self-center">
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E8EAF0] text-xs font-bold text-neutral-700 pl-3.5 pr-8 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] shadow-2xs cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className="w-36 h-20 rounded-xl overflow-hidden shadow-xs border border-amber-200/50 hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"
              alt="KB Handloom Saree Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Ambient subtle warm gold gradient blob in background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#FDF0DF]/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. OVERVIEW METRICS ROW (6 Cards with trend badges and distinct colored icons) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3478F6] flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">{totalOrders.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">{ordersTrend}</div>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">{revenueTrend}</div>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">{totalCustomers.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">{customersTrend}</div>
          </div>
        </div>

        {/* Card 4: Active Products */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">{activeProductsCount.toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">{productsTrend}</div>
          </div>
        </div>

        {/* Card 5: Pending Orders */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">{pendingOrdersCount}</div>
            <div className="text-[11px] font-medium text-neutral-400 mt-0.5">Needs action</div>
          </div>
        </div>

        {/* Card 6: Low Stock Items */}
        <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500">Low Stock Items</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-rose-600">{lowStockCount}</div>
            <div className="text-[11px] font-medium text-neutral-400 mt-0.5">Restock alert</div>
          </div>
        </div>
      </div>

      {/* 3. ANALYTICS ROW (Sales Overview line chart & Order Status Donut chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card (2/3 width): Sales Overview */}
        <div className="lg:col-span-2 bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Sales Overview</h2>
              <p className="text-[11px] text-neutral-500">Monthly revenue trends and performance</p>
            </div>
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-[11px] font-bold text-neutral-700 pl-3 pr-7 py-1.5 rounded-lg focus:outline-none focus:border-[#3478F6] cursor-pointer"
              >
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
              </select>
              <svg className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Precision SVG Chart with Y-axis, Column Bars and Electric Blue Curve */}
          <div className="relative w-full h-64 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Horizontal Gridlines */}
              <line x1="40" y1="20" x2="590" y2="20" stroke="#F1F3F7" strokeWidth="1" />
              <line x1="40" y1="65" x2="590" y2="65" stroke="#F1F3F7" strokeWidth="1" />
              <line x1="40" y1="110" x2="590" y2="110" stroke="#F1F3F7" strokeWidth="1" />
              <line x1="40" y1="155" x2="590" y2="155" stroke="#F1F3F7" strokeWidth="1" />
              <line x1="40" y1="180" x2="590" y2="180" stroke="#E8EAF0" strokeWidth="1" />

              {/* Y-Axis Labels */}
              <text x="32" y="24" textAnchor="end" className="text-[10px] fill-neutral-400 font-medium">₹2.0L</text>
              <text x="32" y="69" textAnchor="end" className="text-[10px] fill-neutral-400 font-medium">₹1.5L</text>
              <text x="32" y="114" textAnchor="end" className="text-[10px] fill-neutral-400 font-medium">₹1.0L</text>
              <text x="32" y="159" textAnchor="end" className="text-[10px] fill-neutral-400 font-medium">₹50K</text>

              {/* Vertical Soft Amber Column Bars */}
              {[
                { x: 55, h: 40 },
                { x: 100, h: 62 },
                { x: 145, h: 80 },
                { x: 190, h: 72 },
                { x: 235, h: 90 },
                { x: 280, h: 110 },
                { x: 325, h: 98 },
                { x: 370, h: 125 },
                { x: 415, h: 115 },
                { x: 460, h: 145 },
                { x: 505, h: 135 },
                { x: 550, h: 160 },
              ].map((bar, i) => (
                <rect
                  key={i}
                  x={bar.x}
                  y={180 - bar.h}
                  width="14"
                  height={bar.h}
                  rx="4"
                  fill="#F6E8D8"
                  opacity="0.85"
                />
              ))}

              {/* Smooth Electric-Blue Trend Curve */}
              <path
                d="M 62 145 Q 107 125, 152 108 T 242 92 T 332 78 T 422 65 T 512 40 T 557 25"
                fill="none"
                stroke="#3478F6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Interactive Curve Nodes */}
              {[
                { x: 62, y: 145 },
                { x: 107, y: 125 },
                { x: 152, y: 108 },
                { x: 197, y: 115 },
                { x: 242, y: 92 },
                { x: 287, y: 72 },
                { x: 332, y: 78 },
                { x: 377, y: 56 },
                { x: 422, y: 65 },
                { x: 467, y: 35 },
                { x: 512, y: 40 },
                { x: 557, y: 25 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="#3478F6"
                  strokeWidth="2.5"
                />
              ))}
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between pl-10 pr-2 pt-2 text-[10px] font-semibold text-neutral-400">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Card (1/3 width): Order Status Donut Chart */}
        <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Order Status</h2>
            <p className="text-[11px] text-neutral-500">Distribution across delivery stages</p>
          </div>

          {/* SVG Donut Chart with Center Text */}
          <div className="relative flex items-center justify-center py-2">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F3F7" strokeWidth="12" />

              {/* Delivered: 68% (Electric Blue #3478F6) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#3478F6"
                strokeWidth="12"
                strokeDasharray="162 238"
                strokeDashoffset="0"
              />
              {/* Processing: 12% (Emerald #10B981) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#10B981"
                strokeWidth="12"
                strokeDasharray="28 238"
                strokeDashoffset="-164"
              />
              {/* Shipped: 10% (Sky Blue #0EA5E9) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="12"
                strokeDasharray="24 238"
                strokeDashoffset="-194"
              />
              {/* Cancelled: 6% (Rose #F43F5E) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="12"
                strokeDasharray="14 238"
                strokeDashoffset="-220"
              />
            </svg>

            {/* Donut Center Metrics */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-neutral-900 leading-tight">
                {totalOrders.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Orders
              </span>
            </div>
          </div>

          {/* Legend Table with percentages and color dots */}
          <div className="space-y-2 pt-1 border-t border-[#E8EAF0] text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3478F6]" />
                <span className="text-neutral-600 font-medium">Delivered</span>
              </div>
              <span className="font-bold text-neutral-900">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-neutral-600 font-medium">Processing</span>
              </div>
              <span className="font-bold text-neutral-900">12%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
                <span className="text-neutral-600 font-medium">Shipped</span>
              </div>
              <span className="font-bold text-neutral-900">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
                <span className="text-neutral-600 font-medium">Cancelled</span>
              </div>
              <span className="font-bold text-neutral-900">6%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-neutral-600 font-medium">Returned</span>
              </div>
              <span className="font-bold text-neutral-900">4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM 3 SUMMARY CARDS (Recent Orders, Best Selling Products, Low Stock Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Recent Orders */}
        <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-[#3478F6] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] text-neutral-400 font-semibold">
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/60">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5 font-bold text-neutral-900">{order.id}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-neutral-700 font-medium truncate max-w-[90px]">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-bold text-neutral-900">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5">{getStatusBadge(order.status)}</td>
                    <td className="py-2.5 text-right">
                      <Link href={`/admin/orders`} className="text-[#3478F6] font-semibold hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Best Selling Products */}
        <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Best Selling Products</h3>
            <Link href="/admin/products" className="text-xs font-semibold text-[#3478F6] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] text-neutral-400 font-semibold">
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5">Orders</th>
                  <th className="pb-2.5 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/60">
                {bestSellingProducts.map((prod: any) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-7 h-7 rounded-lg object-cover border border-neutral-100 shrink-0"
                        />
                        <span className="text-neutral-800 font-medium truncate max-w-[120px]">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-semibold text-neutral-600">{prod.ordersCount}</td>
                    <td className="py-2.5 text-right font-bold text-neutral-900">
                      ₹{prod.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Low Stock Items</h3>
            <Link href="/admin/inventory" className="text-xs font-semibold text-[#3478F6] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] text-neutral-400 font-semibold">
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/60">
                {lowStockItems.map((prod: any) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-7 h-7 rounded-lg object-cover border border-neutral-100 shrink-0"
                        />
                        <span className="text-neutral-800 font-medium truncate max-w-[140px]">{prod.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-black text-rose-600 text-sm">
                      {prod.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
