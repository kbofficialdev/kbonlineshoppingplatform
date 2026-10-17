"use client";

import React, { useState, useEffect } from 'react';
import { authFetch } from '@/lib/clientAuth';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/admin/customers');
      const data = await res.json();
      if (data?.customers) {
        setCustomers(data.customers);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await authFetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        fetchCustomers();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-kbBorder pb-4">
        <h1 className="text-2xl font-black text-kbBlack">Customer Accounts</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Registered patrons across India ordering from KB FASHIONS Kalwaral store
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-kb-md font-bold">
          ✓ {message}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading customer records...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white border border-kbBorder rounded-kb-md p-10 text-center text-xs text-neutral-500">
          No registered customer accounts yet.
        </div>
      ) : (
        <div className="bg-white border border-kbBorder rounded-kb-md shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-kbBorder text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map(cust => (
                <tr key={cust.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">{cust.name}</td>
                  <td className="py-3 px-4 font-mono text-neutral-600">{cust.email}</td>
                  <td className="py-3 px-4 font-mono">{cust.phone}</td>
                  <td className="py-3 px-4 font-bold">{cust.ordersCount} order{cust.ordersCount > 1 ? 's' : ''}</td>
                  <td className="py-3 px-4 font-black text-black">₹{cust.totalSpent}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      cust.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cust.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(cust.id, cust.isActive)}
                      className={`text-xs font-bold underline ${
                        cust.isActive ? 'text-red-600 hover:text-red-800' : 'text-emerald-700 hover:text-emerald-900'
                      }`}
                    >
                      {cust.isActive ? 'Suspend Access' : 'Activate Account'}
                    </button>
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

