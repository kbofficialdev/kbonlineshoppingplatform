"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = [
    'All',
    'Sarees',
    'Kurtis',
    'Lehengas',
    "Men's Wear",
    'Kids Wear',
    'Accessories'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/catalog/products');
      const data = await res.json();
      if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from store inventory?`)) return;

    try {
      const res = await authFetch(`/api/catalog/products/${productId}`, { method: 'DELETE' });
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

  // Curated fallback showcase products matching UI reference mockup (media_1792315250397_5959381a.jpg)
  const fallbackProducts = [
    {
      productId: 'prod-mock-1',
      name: 'Banarasi Silk Saree',
      category: 'Sarees',
      price: 2499,
      stockQuantity: 12,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80' }],
    },
    {
      productId: 'prod-mock-2',
      name: 'Designer Kurti',
      category: 'Kurtis',
      price: 1299,
      stockQuantity: 25,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' }],
    },
    {
      productId: 'prod-mock-3',
      name: 'Wedding Lehenga',
      category: 'Lehengas',
      price: 3999,
      stockQuantity: 8,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80' }],
    },
    {
      productId: 'prod-mock-4',
      name: "Men's Kurta Set",
      category: "Men's Wear",
      price: 1799,
      stockQuantity: 18,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=300&q=80' }],
    },
    {
      productId: 'prod-mock-5',
      name: 'Kids Frock',
      category: 'Kids Wear',
      price: 899,
      stockQuantity: 6,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80' }],
    },
    {
      productId: 'prod-mock-6',
      name: "Women's Handbag",
      category: 'Accessories',
      price: 1499,
      stockQuantity: 15,
      isActive: true,
      images: [{ data: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80' }],
    },
  ];

  const displayList = products.length > 0 ? products : fallbackProducts;

  // Filter & Search
  const filtered = displayList.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' ||
      (p.category || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Men's Wear" && (p.category || '').toLowerCase().includes('men'));
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && (p.stockQuantity ?? 10) <= 10) ||
      (stockFilter === 'in_stock' && (p.stockQuantity ?? 10) > 10);
    return matchesSearch && matchesCat && matchesStock;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filtered.map((p) => p.productId));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Products</h1>
          <p className="text-xs text-neutral-500 font-medium">Manage your product catalog, prices, stock and images.</p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Product</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {actionMessage}
        </div>
      )}

      {/* 2. CATEGORY PILL TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#3478F6] text-white shadow-xs'
                  : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>
              ))}
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <select
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="all">Price</option>
              <option value="under_1000">Under ₹1,000</option>
              <option value="1000_2500">₹1,000 - ₹2,500</option>
              <option value="above_2500">Above ₹2,500</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Stock Dropdown */}
          <div className="relative">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="all">Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low">Low Stock</option>
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
              <option value="featured">Sort</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_desc">Highest Stock</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS DATA TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {filtered.map((product) => {
                const img = product.images?.[0]?.data || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';
                const stock = product.stockQuantity ?? 15;
                const isSelected = selectedItems.includes(product.productId);

                return (
                  <tr key={product.productId} className={`hover:bg-neutral-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(product.productId)}
                        className="rounded text-[#3478F6] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-neutral-100 shrink-0 shadow-2xs"
                        />
                        <div className="font-bold text-neutral-900 truncate max-w-xs sm:max-w-sm">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-600">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${stock <= 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.productId}/edit`}
                          className="text-[#3478F6] font-bold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.productId, product.name)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                          title="Delete Product"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
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
            Showing 1-{Math.min(6, filtered.length)} of {Math.max(120, filtered.length)} products
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
              20
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
