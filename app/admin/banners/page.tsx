"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'offers'>('banners');
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLink, setNewLink] = useState<string>('/collections/new');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data?.banners && Array.isArray(data.banners)) {
        setBanners(data.banners);
      }
    } catch (e) {
      console.error('Failed to load banners:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mockup showcase banners matching media_1792315250397_5959381a.jpg
  const defaultShowcaseBanners = [
    {
      id: 'ban-1',
      title: 'Festive Collection - Flat 30% Off',
      link: '/collections/festive',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    },
    {
      id: 'ban-2',
      title: 'New Arrivals - Latest Sarees',
      link: '/collections/new',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    },
    {
      id: 'ban-3',
      title: 'Wedding Collection',
      link: '/collections/wedding',
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    },
    {
      id: 'ban-4',
      title: "Men's Festive Wear",
      link: '/collections/mens',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    },
  ];

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBannerObj = {
      id: `ban-${Date.now()}`,
      title: newTitle,
      link: newLink,
      image: newImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
    };

    setBanners([newBannerObj, ...banners]);
    setMessage('✓ Banner campaign successfully created and deployed.');
    setShowAddModal(false);
    setNewTitle('');
    setNewImageUrl('');
    setTimeout(() => setMessage(null), 3000);
  };

  const displayBanners = banners.length > 0 ? banners : defaultShowcaseBanners;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Banners & Promotions</h1>
          <p className="text-xs text-neutral-500 font-medium">Manage homepage banners and promotional campaigns.</p>
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
          <span>Add Banner</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-xl font-bold">
          {message}
        </div>
      )}

      {/* 2. TABS */}
      <div className="flex items-center gap-2 border-b border-[#E8EAF0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'banners'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
          }`}
        >
          Banners
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'offers'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
          }`}
        >
          Offers & Coupons
        </button>
      </div>

      {/* 3. BANNERS CONTENT TABLE */}
      {activeTab === 'banners' ? (
        <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                  <th className="py-3.5 px-5">Banner</th>
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-5">Link</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/70">
                {displayBanners.map((banner: any) => (
                  <tr key={banner.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-4 px-5 w-44">
                      <div className="w-36 h-14 rounded-xl overflow-hidden border border-neutral-100 shadow-2xs">
                        <img
                          src={banner.image || banner.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-neutral-900 text-xs sm:text-sm">
                        {banner.title}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <code className="text-[11px] font-semibold text-[#3478F6] bg-blue-50 px-2 py-1 rounded-md">
                        {banner.link || banner.linkUrl || '/collections'}
                      </code>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-neutral-400">
                        {/* Eye / Preview */}
                        <button
                          type="button"
                          onClick={() => window.open(banner.link || '/', '_blank')}
                          className="p-1 hover:text-[#3478F6] transition-colors"
                          title="Preview Link"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => alert(`Editing banner: ${banner.title}`)}
                          className="p-1 hover:text-black transition-colors"
                          title="Edit Banner"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove banner "${banner.title}"?`)) {
                              setBanners(banners.filter((b) => b.id !== banner.id));
                            }
                          }}
                          className="p-1 hover:text-rose-600 transition-colors"
                          title="Delete Banner"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        </div>
      ) : (
        /* Offers & Coupons Content */
        <div className="bg-white border border-[#E8EAF0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">Active Store Coupons</h3>
            <button
              type="button"
              onClick={() => alert('New Coupon Creator')}
              className="text-xs font-bold text-[#3478F6] hover:underline"
            >
              + Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-blue-700 text-sm">FESTIVE30</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs text-neutral-600">Flat 30% discount on orders above ₹2,000</p>
              <div className="text-[11px] text-neutral-400">Expires: 31 Dec 2026</div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-700 text-sm">VILLAGEFREESHIP</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs text-neutral-600">Free delivery on 10 km Kalwaral local orders</p>
              <div className="text-[11px] text-neutral-400">Never expires • PIN 503145</div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-purple-700 text-sm">WELCOME100</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs text-neutral-600">₹100 instant off on first purchase</p>
              <div className="text-[11px] text-neutral-400">Valid for new accounts</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 z-10 border border-[#E8EAF0]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Add Homepage Banner</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Festive Silk Sarees - Flat 30% Off"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-900 focus:outline-none focus:border-[#3478F6]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Destination URL / Link</label>
                <input
                  type="text"
                  required
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="e.g. /collections/festive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-900 focus:outline-none focus:border-[#3478F6]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Image URL (High Resolution Photo)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-900 focus:outline-none focus:border-[#3478F6]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Recommended size: 1920x600 px (Desktop) / 800x600 px (Mobile)</p>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

