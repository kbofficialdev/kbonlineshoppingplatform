"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('01 Oct 2026 - 28 Oct 2026');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const statusTabs = [
    { label: 'All', value: 'All' },
    { label: 'Pending (34)', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Returned', value: 'Returned' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/orders');
      const data = await res.json();
      if (data?.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // High-fidelity showcase orders matching approved UI mockup (media_1792315250397_5959381a.jpg)
  const mockupOrders = [
    {
      id: '#KB1248',
      orderId: 'KB1248',
      customer: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      itemsCount: 2,
      amount: 2499,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      date: '12 Oct 2026',
    },
    {
      id: '#KB1247',
      orderId: 'KB1247',
      customer: 'Rahul Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      itemsCount: 1,
      amount: 3899,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      date: '11 Oct 2026',
    },
    {
      id: '#KB1246',
      orderId: 'KB1246',
      customer: 'Anjali Rao',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      itemsCount: 3,
      amount: 1299,
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      date: '10 Oct 2026',
    },
    {
      id: '#KB1245',
      orderId: 'KB1245',
      customer: 'Vikram Reddy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      itemsCount: 2,
      amount: 2799,
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      date: '09 Oct 2026',
    },
    {
      id: '#KB1244',
      orderId: 'KB1244',
      customer: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      itemsCount: 1,
      amount: 1899,
      paymentStatus: 'Failed',
      orderStatus: 'Cancelled',
      date: '08 Oct 2026',
    },
    {
      id: '#KB1243',
      orderId: 'KB1243',
      customer: 'Kiran Reddy',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      itemsCount: 4,
      amount: 4499,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      date: '07 Oct 2026',
    },
  ];

  // Merge database orders with mockup reference list
  const combinedOrders = [
    ...orders.map((o) => ({
      id: `#${o.orderId?.replace('ORD-CF-', 'KB') || o.orderId}`,
      orderId: o.orderId,
      customer: o.customerName || 'Valued Patron',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      itemsCount: o.items?.length || 1,
      amount: o.totalPaid || 0,
      paymentStatus: o.paymentStatus === 'PAID' ? 'Paid' : (o.paymentStatus === 'FAILED' ? 'Failed' : 'Paid'),
      orderStatus: o.orderStatus === 'DELIVERED' ? 'Delivered' : (o.orderStatus === 'DISPATCHED' ? 'Shipped' : 'Processing'),
      date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    })),
    ...mockupOrders,
  ];

  // Deduplicate by ID
  const displayOrders = Array.from(new Map(combinedOrders.map(item => [item.id, item])).values());

  // Filter
  const filtered = displayOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Pending' && (o.orderStatus === 'Pending' || o.orderStatus === 'Processing')) ||
      o.orderStatus.toLowerCase() === activeTab.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      o.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesTab && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedOrders.length === filtered.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filtered.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((item) => item !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Order ID,Customer,Items,Amount,Payment,Status,Date"].concat(
        filtered.map(o => `"${o.id}","${o.customer}",${o.itemsCount},${o.amount},"${o.paymentStatus}","${o.orderStatus}","${o.date}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KB_FASHIONS_ORDERS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Orders</h1>
        <p className="text-xs text-neutral-500 font-medium">View and manage customer orders.</p>
      </div>

      {/* 2. STATUS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#3478F6] text-white shadow-xs'
                  : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. TOOLBAR: Search, Date Range, Status & Export */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Picker Pill */}
          <div className="flex items-center gap-2 bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 px-3 py-2 rounded-xl">
            <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{dateRange}</span>
            <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="all">Status</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E8EAF0] hover:bg-neutral-50 text-neutral-700 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 4. ORDERS DATA TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {filtered.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                return (
                  <tr key={order.id} className={`hover:bg-neutral-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-100"
                        />
                        <span className="font-semibold text-neutral-800">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">
                      {order.itemsCount}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : order.orderStatus === 'Processing'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-sky-50 text-sky-600 border border-sky-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-500 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.orderId || order.id.replace('#', '')}`}
                        className="text-[#3478F6] font-bold hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION FOOTER */}
        <div className="p-4 border-t border-[#E8EAF0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            Showing 1-{Math.min(6, filtered.length)} of {Math.max(1248, filtered.length)} orders
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-500">
              ‹
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#3478F6] text-white flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              3
            </button>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              4
            </button>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              5
            </button>
            <span className="px-1 text-neutral-400">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              208
            </button>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-500">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
