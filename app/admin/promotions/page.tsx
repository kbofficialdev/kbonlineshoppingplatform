"use client";

import React, { useState } from 'react';

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState([
    { code: 'FESTIVE30', discount: '30% Off', minOrder: 2000, usages: 142, status: 'Active', expiry: '31 Dec 2026' },
    { code: 'VILLAGEFREESHIP', discount: 'Free Delivery', minOrder: 0, usages: 489, status: 'Active', expiry: 'Never (PIN 503145)' },
    { code: 'WELCOME100', discount: '₹100 Off', minOrder: 999, usages: 312, status: 'Active', expiry: '31 Dec 2026' },
    { code: 'GADWAL2026', discount: '15% Off Handlooms', minOrder: 1500, usages: 88, status: 'Active', expiry: '15 Nov 2026' },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setCoupons([
      { code: newCode.toUpperCase(), discount: newDiscount || '10% Off', minOrder: 999, usages: 0, status: 'Active', expiry: '31 Dec 2026' },
      ...coupons,
    ]);
    setMessage(`✓ Promotional Coupon "${newCode.toUpperCase()}" generated.`);
    setNewCode('');
    setNewDiscount('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Offers & Promotions</h1>
        <p className="text-xs text-neutral-500 font-medium">Manage discount codes, vouchers, and festive campaigns.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {message}
        </div>
      )}

      {/* Create Coupon Card */}
      <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-4">Generate Promotional Coupon</h3>
        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. DIWALI20"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-mono font-bold uppercase focus:outline-none focus:border-[#3478F6]"
            />
          </div>
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Discount Description</label>
            <input
              type="text"
              required
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              placeholder="e.g. 20% Off or ₹250 Off"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-bold focus:outline-none focus:border-[#3478F6]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#3478F6] text-white font-bold rounded-xl hover:bg-blue-600 shadow-xs transition-colors"
            >
              Generate Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Usages</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-blue-600 text-sm">{c.code}</td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">{c.discount}</td>
                  <td className="py-3.5 px-4 text-neutral-600">₹{c.minOrder}</td>
                  <td className="py-3.5 px-4 font-bold text-neutral-800">{c.usages} orders</td>
                  <td className="py-3.5 px-4 text-neutral-500">{c.expiry}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {c.status}
                    </span>
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
