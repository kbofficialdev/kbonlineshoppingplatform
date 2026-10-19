"use client";

import React, { useState, useEffect } from 'react';
import { authFetch } from '@/lib/clientAuth';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageCount: number;
  usageLimit?: number | null;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New / Edit Coupon Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrderAmount, setMinOrderAmount] = useState('999');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('500');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/coupons');
      const data = await res.json();
      if (data?.coupons && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error('Error fetching coupons:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue) || 10,
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        isActive,
      };

      let res: Response;
      if (editingId) {
        res = await authFetch(`/api/coupons/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({
          text: editingId ? `✓ Coupon "${payload.code}" updated successfully.` : `✓ Coupon "${payload.code}" created successfully.`,
          type: 'success',
        });
        resetForm();
        fetchCoupons();
      } else {
        setMessage({ text: data.error || 'Failed to save coupon', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: 'Network error communicating with coupons API', type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await authFetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      if (res.ok) {
        fetchCoupons();
        setMessage({
          text: `✓ Coupon "${coupon.code}" status changed to ${!coupon.isActive ? 'Active' : 'Inactive'}.`,
          type: 'success',
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.error('Error toggling coupon status:', e);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) return;

    try {
      const res = await authFetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: `✓ Coupon "${couponCode}" deleted.`, type: 'success' });
        fetchCoupons();
      } else {
        setMessage({ text: data.error || 'Failed to delete coupon', type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'Error deleting coupon', type: 'error' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinOrderAmount(coupon.minOrderAmount.toString());
    setMaxDiscountAmount(coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toString() : '');
    setExpiryDate(coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '');
    setIsActive(coupon.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('20');
    setMinOrderAmount('999');
    setMaxDiscountAmount('500');
    setExpiryDate('2026-12-31');
    setIsActive(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Offers & Promotions</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Create and manage live discount coupons, minimum order limits, and seasonal campaign codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500">Live Coupons:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-600 border border-blue-200">
            {coupons.length}
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold border transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 1. CREATE / EDIT COUPON CARD */}
      <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-900">
            {editingId ? `Edit Coupon: ${code}` : 'Generate New Promotional Coupon'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-neutral-500 hover:text-black font-semibold underline"
            >
              Cancel Edit & Add New
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Coupon Code */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. DIWALI30"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-mono font-bold uppercase focus:outline-none focus:border-[#3478F6] focus:bg-white bg-neutral-50/50"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-bold focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 cursor-pointer"
              >
                <option value="PERCENTAGE">Percentage (% Off)</option>
                <option value="FLAT">Flat Amount (₹ Off)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Discount Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
              </label>
              <input
                type="number"
                required
                min="1"
                max={discountType === 'PERCENTAGE' ? '100' : '10000'}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'PERCENTAGE' ? '20' : '250'}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-bold focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
              />
            </div>

            {/* Min Order Amount */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="999"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-bold focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Max Discount Cap */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Max Discount Cap (₹) <span className="text-neutral-400 font-normal">(Optional for %)</span>
              </label>
              <input
                type="number"
                min="0"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-medium focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-medium focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
              />
            </div>

            {/* Active Toggle & Submit */}
            <div className="flex items-center justify-between gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#3478F6] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span className="font-bold text-neutral-800 text-xs">Active Coupon</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#3478F6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Coupon' : 'Save & Publish Coupon'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. REAL-TIME COUPONS TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Active Database Coupons</h3>
          <span className="text-xs text-neutral-400">Synchronized live with Cart & Checkout</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-400">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            No promotional coupons found. Generate your first coupon above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Order</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Total Usages</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/70">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-blue-600 text-sm">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% Off` : `₹${c.discountValue} Flat Off`}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      ₹{c.minOrderAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'None'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-800">
                      {c.usageCount} orders
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                      {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          className="text-[#3478F6] font-bold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.code)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                          title="Delete Coupon"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
