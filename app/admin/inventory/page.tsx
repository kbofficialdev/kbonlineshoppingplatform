"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const defaultInventory = [
    { id: 'inv-1', name: 'Kanjivaram Saree', category: 'Sarees', stock: 3, threshold: 10, unitPrice: 3499, status: 'CRITICAL', sku: 'KB-SAREE-KANJ-01' },
    { id: 'inv-2', name: 'Designer Kurti', category: 'Kurtis', stock: 5, threshold: 15, unitPrice: 1299, status: 'LOW_STOCK', sku: 'KB-KURTI-DES-02' },
    { id: 'inv-3', name: 'Kids Frock', category: 'Kids Wear', stock: 4, threshold: 12, unitPrice: 899, status: 'LOW_STOCK', sku: 'KB-KIDS-FRK-03' },
    { id: 'inv-4', name: "Men's Kurta Set", category: "Men's Wear", stock: 6, threshold: 15, unitPrice: 1799, status: 'LOW_STOCK', sku: 'KB-MENS-KRT-04' },
    { id: 'inv-5', name: "Women's Sandals", category: 'Accessories', stock: 8, threshold: 20, unitPrice: 1499, status: 'LOW_STOCK', sku: 'KB-ACC-SNDL-05' },
    { id: 'inv-6', name: 'Banarasi Silk Saree', category: 'Sarees', stock: 12, threshold: 10, unitPrice: 2499, status: 'HEALTHY', sku: 'KB-SAREE-BAN-06' },
    { id: 'inv-7', name: 'Wedding Lehenga', category: 'Lehengas', stock: 8, threshold: 5, unitPrice: 3999, status: 'HEALTHY', sku: 'KB-LEH-WED-07' },
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products && Array.isArray(data.products) && data.products.length > 0) {
        setItems(data.products.map((p: any) => ({
          id: p.productId,
          name: p.name,
          category: p.category,
          stock: p.stockQuantity ?? 10,
          threshold: 15,
          unitPrice: p.price,
          status: (p.stockQuantity ?? 10) <= 5 ? 'CRITICAL' : ((p.stockQuantity ?? 10) <= 15 ? 'LOW_STOCK' : 'HEALTHY'),
          sku: `KB-${p.category.substring(0, 3).toUpperCase()}-${p.productId.slice(-4).toUpperCase()}`,
        })));
      } else {
        setItems(defaultInventory);
      }
    } catch (e) {
      setItems(defaultInventory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setItems(items.map((i) => {
      if (i.id === id) {
        const newStock = Math.max(0, i.stock + delta);
        return {
          ...i,
          stock: newStock,
          status: newStock <= 5 ? 'CRITICAL' : (newStock <= 15 ? 'LOW_STOCK' : 'HEALTHY'),
        };
      }
      return i;
    }));
    setMessage(`✓ Stock level updated for item ${id}.`);
    setTimeout(() => setMessage(null), 2500);
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'low' && (item.status === 'LOW_STOCK' || item.status === 'CRITICAL')) ||
      (filter === 'out' && item.stock === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Inventory & Stock Tracking</h1>
        <p className="text-xs text-neutral-500 font-medium">Monitor physical garments stock in Kalwaral store.</p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {message}
        </div>
      )}

      {/* Filter toolbar */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, category..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === 'all' ? 'bg-[#3478F6] text-white' : 'bg-neutral-100 text-neutral-600'}`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === 'low' ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}
          >
            Low Stock Alerts (18)
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-600">{item.sku}</td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-neutral-600">{item.category}</td>
                  <td className="py-3.5 px-4 font-black text-base text-neutral-900">{item.stock}</td>
                  <td className="py-3.5 px-4 text-neutral-500">{item.threshold}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : item.status === 'LOW_STOCK'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1 border border-[#E8EAF0] rounded-lg p-0.5 bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => handleUpdateStock(item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-neutral-700 hover:bg-white"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStock(item.id, 5)}
                        className="w-6 h-6 rounded flex items-center justify-center font-bold text-neutral-700 hover:bg-white"
                      >
                        +
                      </button>
                    </div>
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

