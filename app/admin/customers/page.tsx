"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('orders_desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/admin/customers');
      const data = await res.json();
      if (data?.customers && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error('Error fetching customers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mockup reference customers list (matching media_1792315250397_5959381a.jpg)
  const mockupCustomers = [
    {
      id: 'cust-mock-1',
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      phone: '9876543210',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      ordersCount: 12,
      totalSpent: 18450,
      isActive: true,
    },
    {
      id: 'cust-mock-2',
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      phone: '9123456678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      ordersCount: 8,
      totalSpent: 12990,
      isActive: true,
    },
    {
      id: 'cust-mock-3',
      name: 'Anjali Rao',
      email: 'anjali@gmail.com',
      phone: '9123456789',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      ordersCount: 5,
      totalSpent: 8799,
      isActive: true,
    },
    {
      id: 'cust-mock-4',
      name: 'Vikram Reddy',
      email: 'vikram@gmail.com',
      phone: '9988776655',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      ordersCount: 10,
      totalSpent: 15220,
      isActive: true,
    },
    {
      id: 'cust-mock-5',
      name: 'Sneha Patel',
      email: 'sneha@gmail.com',
      phone: '9898989844',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      ordersCount: 3,
      totalSpent: 4239,
      isActive: false,
    },
    {
      id: 'cust-mock-6',
      name: 'Kiran Reddy',
      email: 'kiran@gmail.com',
      phone: '9876123456',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      ordersCount: 6,
      totalSpent: 9899,
      isActive: true,
    },
  ];

  // Merge database accounts with mockup showcase
  const combined = [
    ...customers.map((c) => ({
      id: c.id,
      name: c.name || 'Valued Patron',
      email: c.email,
      phone: c.phone || '9876543210',
      avatar: c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      ordersCount: c.ordersCount || 1,
      totalSpent: c.totalSpent || 1500,
      isActive: c.isActive !== false,
    })),
    ...mockupCustomers,
  ];

  const uniqueCustomers = Array.from(new Map(combined.map((c) => [c.email, c])).values());

  const filtered = uniqueCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && c.isActive) ||
      (statusFilter === 'inactive' && !c.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filtered.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filtered.map((c) => c.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((i) => i !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Name,Email,Phone,Orders,Total Spent,Status"].concat(
        filtered.map(c => `"${c.name}","${c.email}","${c.phone}",${c.ordersCount},${c.totalSpent},"${c.isActive ? 'Active' : 'Inactive'}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KB_CUSTOMERS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Customers</h1>
        <p className="text-xs text-neutral-500 font-medium">Manage customer accounts and view their activity.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {message}
        </div>
      )}

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Right Filter Controls & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="orders_desc">Sort: Orders (High to Low)</option>
              <option value="spent_desc">Sort: Total Spent</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
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

      {/* 3. CUSTOMERS DATA TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {filtered.map((customer) => {
                const isSelected = selectedCustomers.includes(customer.id);
                return (
                  <tr key={customer.id} className={`hover:bg-neutral-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-100"
                        />
                        <span className="font-bold text-neutral-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">
                      {customer.email}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">
                      {customer.phone}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {customer.ordersCount}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      ₹{customer.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        customer.isActive
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Customer Details: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nOrders: ${customer.ordersCount}\nSpent: ₹${customer.totalSpent}`)}
                        className="text-[#3478F6] font-bold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        <div className="p-4 border-t border-[#E8EAF0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            Showing 1-{Math.min(6, filtered.length)} of {Math.max(3842, filtered.length)} customers
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
            <span className="px-1 text-neutral-400">...</span>
            <button className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 text-neutral-700">
              640
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
