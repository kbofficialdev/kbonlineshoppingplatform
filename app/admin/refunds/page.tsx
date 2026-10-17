"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/refunds');
      const data = await res.json();
      if (data?.refunds) {
        setRefunds(data.refunds);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRefund = async (refundId: string, status: 'APPROVED' | 'REJECTED') => {
    const notes = prompt(`Enter optional review note for ${status}:`) || '';

    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundId, status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        fetchRefunds();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-kbBorder pb-4">
        <h1 className="text-2xl font-black text-kbBlack">Refund & Return Requests</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review customer inquiries for returns, sizing adjustments, and refund claims
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
          <p className="text-xs">Loading refund requests...</p>
        </div>
      ) : refunds.length === 0 ? (
        <div className="bg-white border border-kbBorder rounded-kb-md p-10 text-center text-xs text-neutral-500">
          No pending refund requests. All customer orders in good standing.
        </div>
      ) : (
        <div className="bg-white border border-kbBorder rounded-kb-md shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-kbBorder text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Reason Stated by Customer</th>
                <th className="py-3 px-4">Claimed Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Requested At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {refunds.map(ref => (
                <tr key={ref.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold">
                    <Link href={`/admin/orders/${ref.orderId}`} className="hover:underline">
                      {ref.orderId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 max-w-xs">{ref.reason}</td>
                  <td className="py-3 px-4 font-black text-black">₹{ref.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ref.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ref.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px] font-mono">
                    {new Date(ref.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {ref.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleUpdateRefund(ref.id, 'APPROVED')}
                          className="bg-emerald-800 text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-emerald-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateRefund(ref.id, 'REJECTED')}
                          className="border border-red-300 text-red-700 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Processed</span>
                    )}
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
