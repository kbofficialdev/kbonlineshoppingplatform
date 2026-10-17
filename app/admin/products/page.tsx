"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from store inventory?`)) return;

    try {
      const res = await fetch(`/api/catalog/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`✓ Product "${name}" successfully deleted.`);
        fetchProducts();
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-kb-md font-bold">
          {actionMessage}
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-kbBorder pb-4">
        <div>
          <h1 className="text-2xl font-black text-kbBlack">Product & Inventory Management</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage all garments, pricing, and stock levels in database</p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-kb-pill hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>➕</span>
          <span>Add New Garment</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inventory by title or category..."
          className="w-full px-4 py-2.5 rounded-kb-pill border border-kbBorder bg-white text-xs focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading products from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-kbBorder rounded-kb-md p-10 text-center text-xs text-neutral-500">
          No products matched your search.
        </div>
      ) : (
        <div className="bg-white border border-kbBorder rounded-kb-md shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-kbBorder text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Garment Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(product => {
                const img = product.images?.[0]?.data;
                const isLowStock = product.stockQuantity <= 15;

                return (
                  <tr key={product.productId} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 w-16">
                      <div className="w-12 h-14 bg-kbCardBg rounded overflow-hidden border border-kbBorder flex items-center justify-center">
                        {img ? (
                          <img src={img} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-400">KB</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/products/${product.productId}`} className="font-bold text-neutral-900 hover:underline block">
                        {product.name}
                      </Link>
                      <span className="text-[10px] text-neutral-400">{product.productId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-black">
                      ₹{product.price}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 text-[11px]">
                      {product.origin}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${product.productId}/edit`}
                        className="text-xs font-bold text-neutral-700 hover:text-black underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.productId, product.name)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

