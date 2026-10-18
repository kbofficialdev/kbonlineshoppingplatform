"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatImage, setNewCatImage] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const defaultCategories = [
    { id: 'cat-sarees', name: 'Sarees', count: 18, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-kurtis', name: 'Kurtis', count: 14, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-lehengas', name: 'Lehengas', count: 8, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-mens', name: "Men's Wear", count: 12, image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-kids', name: 'Kids Wear', count: 10, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-accessories', name: 'Accessories', count: 15, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80', status: 'Active' },
    { id: 'cat-festive', name: 'Festive & Handlooms', count: 9, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', status: 'Active' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/catalog/categories');
      const data = await res.json();
      if (data?.categories && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories.map((c: any) => ({
          id: c.id || c.name.toLowerCase().replace(/\s+/g, '-'),
          name: c.name,
          count: c.productCount || 12,
          image: c.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
          status: 'Active',
        })));
      } else {
        setCategories(defaultCategories);
      }
    } catch (e) {
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newObj = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      count: 0,
      image: newCatImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      status: 'Active',
    };

    setCategories([...categories, newObj]);
    setMessage(`✓ Category "${newCatName}" created successfully.`);
    setShowAddModal(false);
    setNewCatName('');
    setNewCatImage('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Categories</h1>
          <p className="text-xs text-neutral-500 font-medium">Organize garments into customer-facing departments.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Category</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {message}
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-[#E8EAF0] rounded-2xl overflow-hidden shadow-xs group hover:border-[#3478F6]/50 transition-all">
            <div className="h-36 w-full overflow-hidden bg-neutral-100 relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-neutral-800 shadow-2xs">
                {cat.count} items
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 text-sm">{cat.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {cat.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E8EAF0] text-xs">
                <Link href={`/admin/products?category=${encodeURIComponent(cat.name)}`} className="text-[#3478F6] font-bold hover:underline">
                  View Products →
                </Link>
                <button
                  type="button"
                  onClick={() => alert(`Edit category: ${cat.name}`)}
                  className="text-neutral-400 hover:text-black font-semibold"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 z-10 border border-[#E8EAF0]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Add New Category</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Silk Dupattas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-900 focus:outline-none focus:border-[#3478F6]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-900 focus:outline-none focus:border-[#3478F6]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8EAF0] font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3478F6] font-bold text-white hover:bg-blue-600 shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
