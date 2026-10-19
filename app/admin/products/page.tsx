"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

interface Product {
  id: string;
  productId: string;
  name: string;
  title?: string;
  description?: string;
  category: string;
  productType?: string;
  brand?: string;
  fabric?: string;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  isActive?: boolean;
  tags?: string[];
  images?: Array<{ id?: string; data: string; isPrimary?: boolean }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Sarees');
  const [formPrice, setFormPrice] = useState('1499');
  const [formComparePrice, setFormComparePrice] = useState('1999');
  const [formStock, setFormStock] = useState('25');
  const [formFabric, setFormFabric] = useState('Pure Cotton');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('Handloom, Trending');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Sarees');
    setFormPrice('1499');
    setFormComparePrice('1999');
    setFormStock('25');
    setFormFabric('Pure Handloom Cotton');
    setFormDescription('Authentic artisan textile directly from Kalwaral weaving traditions.');
    setFormTags('Handloom, Trending');
    setFormImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
    setImagePreview('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name || '');
    setFormCategory(p.category || 'Sarees');
    setFormPrice(p.price?.toString() || '0');
    setFormComparePrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
    setFormStock(p.stockQuantity?.toString() || '0');
    setFormFabric(p.fabric || 'Pure Cotton');
    setFormDescription(p.description || '');
    setFormTags(p.tags ? p.tags.join(', ') : 'Handloom');
    const existingImg = p.images?.[0]?.data || '';
    setFormImageUrl(existingImg);
    setImagePreview(existingImg || null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', editingProduct?.productId || 'prod-custom');

      const res = await authFetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data?.url) {
        setFormImageUrl(data.url);
        setImagePreview(data.url);
        setActionMessage({ text: `✓ Image "${file.name}" uploaded successfully!`, type: 'success' });
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        // Fallback to FileReader base64 preview
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = ev.target?.result as string;
          setFormImageUrl(res);
          setImagePreview(res);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setIsSaving(true);
      const payload: any = {
        name: formName.trim(),
        title: formName.trim(),
        category: formCategory,
        price: parseFloat(formPrice) || 0,
        compareAtPrice: formComparePrice ? parseFloat(formComparePrice) : null,
        stockQuantity: parseInt(formStock, 10) || 0,
        fabric: formFabric.trim(),
        description: formDescription.trim(),
        tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
        imageUrl: formImageUrl.trim() || undefined,
        imageData: formImageUrl.startsWith('data:') ? formImageUrl : undefined,
      };

      let res: Response;
      if (editingProduct) {
        res = await authFetch(`/api/catalog/products/${editingProduct.productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch('/api/catalog/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: editingProduct
            ? `✓ Product "${formName}" updated successfully.`
            : `✓ New Product "${formName}" created successfully.`,
          type: 'success',
        });
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setActionMessage({ text: data.error || 'Failed to save product', type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: 'Network error saving product', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from inventory?`)) return;

    try {
      const res = await authFetch(`/api/catalog/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ text: `✓ Product "${name}" successfully deleted.`, type: 'success' });
        fetchProducts();
      } else {
        setActionMessage({ text: data.error || 'Failed to delete product', type: 'error' });
      }
    } catch (e) {
      setActionMessage({ text: 'Error deleting product', type: 'error' });
    } finally {
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // Filter products in real time
  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.productId?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'in_stock'
        ? (p.stockQuantity || 0) > 0
        : (p.stockQuantity || 0) <= 5;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sorting
  if (sortOrder === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedItems.length === paginated.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginated.map((p) => p.productId));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & ADD PRODUCT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Products Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage your live store catalogue, upload photography, update stock levels, and set discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold border transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* 2. CATEGORY PILL FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-[#E8EAF0] hover:bg-neutral-50'
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products by name, SKU, or category..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stock Filter */}
          <div className="relative">
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock (&gt; 0)</option>
              <option value="low">Low Stock (≤ 5)</option>
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
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <svg className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS DATA TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading products catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginated.length && paginated.length > 0}
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
                {paginated.map((product) => {
                  const isSelected = selectedItems.includes(product.productId);
                  const isLowStock = (product.stockQuantity || 0) <= 5;
                  const imgSrc = product.images?.[0]?.data || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';

                  return (
                    <tr
                      key={product.productId}
                      className={`hover:bg-neutral-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
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
                            src={imgSrc}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-neutral-100 bg-neutral-100"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 leading-snug">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              {product.productId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-600">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        ₹{product.price?.toLocaleString('en-IN')}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="block text-[10px] text-neutral-400 line-through font-normal">
                            ₹{product.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            isLowStock ? 'text-rose-600 font-bold' : 'text-neutral-700'
                          }`}
                        >
                          {product.stockQuantity ?? 0} in stock
                        </span>
                        {isLowStock && (
                          <span className="block text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                            Low Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {product.isActive !== false ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="text-[#3478F6] font-bold hover:underline"
                          >
                            Edit
                          </button>
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
        )}

        {/* 5. PAGINATION FOOTER */}
        <div className="p-4 border-t border-[#E8EAF0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            Showing {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}-
            {Math.min(filtered.length, currentPage * itemsPerPage)} of {filtered.length} products
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#3478F6] text-white shadow-xs'
                    : 'border border-[#E8EAF0] hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-[#E8EAF0] flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. ADD & EDIT PRODUCT MODAL (COMPLETE FULL-STACK EDITOR) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8EAF0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-4">
              <div>
                <h2 className="text-lg font-black text-neutral-900">
                  {editingProduct ? `Edit Garment: ${editingProduct.name}` : 'Add New Handloom Garment'}
                </h2>
                <p className="text-xs text-neutral-500">
                  Fill in product photography, pricing, stock levels, and fabric details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Authentic Gadwal Handloom Silk-Cotton Saree"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                />
              </div>

              {/* Category & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 cursor-pointer"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Fabric & Material</label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    placeholder="e.g. 100% Pure Mulberry Silk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Compare-at Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formComparePrice}
                    onChange={(e) => setFormComparePrice(e.target.value)}
                    placeholder="1999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & EXTERNAL URL SECTION */}
              <div className="border border-[#E8EAF0] p-4 rounded-2xl bg-neutral-50/50 space-y-3">
                <label className="block font-bold text-neutral-900">
                  Product Photography (Upload File or Paste Image URL)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-2xl border border-neutral-200 bg-white overflow-hidden shrink-0 flex items-center justify-center relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-neutral-400 text-center px-1">No Image Selected</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                      >
                        {isUploading ? 'Uploading...' : '📁 Choose Image File'}
                      </button>
                      <span className="text-[11px] text-neutral-500">PNG, JPG, WEBP</span>
                    </div>

                    {/* External URL Input */}
                    <div>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => {
                          setFormImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        placeholder="Or paste external product image URL (https://...)"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-mono text-[11px] text-neutral-800 focus:outline-none focus:border-[#3478F6] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Handloom, Trending, New Arrival"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the weave, border, and drape."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8EAF0] font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#3478F6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving Product...' : editingProduct ? 'Save Changes' : '+ Add Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
