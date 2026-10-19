"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearClientSession, getStoredToken, authFetch } from '@/lib/clientAuth';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';

type AccountTab = 'overview' | 'orders' | 'transactions' | 'wishlist' | 'addresses' | 'profile' | 'security';

function AccountManagementContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab') as AccountTab | null;

  const [activeTab, setActiveTab] = useState<AccountTab>(paramTab || 'overview');
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<{ transactions: any[]; orderSummaries: any[] }>({ transactions: [], orderSummaries: [] });
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageOrCity, setVillageOrCity] = useState('');
  const [mandalOrArea, setMandalOrArea] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Telangana');
  const [pinCode, setPinCode] = useState('503145');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'te'>('en');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address Modal/Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrTag, setAddrTag] = useState<'Home' | 'Work' | 'Village' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrVillage, setAddrVillage] = useState('');
  const [addrDistrict, setAddrDistrict] = useState('Kamareddy');
  const [addrState, setAddrState] = useState('Telangana');
  const [addrPin, setAddrPin] = useState('503145');

  // Avatar Upload Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadAccountData();
    loadWishlist();
  }, []);

  useEffect(() => {
    if (paramTab) {
      setActiveTab(paramTab);
    }
  }, [paramTab]);

  const loadWishlist = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('kb_wishlist');
        if (stored) {
          setWishlist(JSON.parse(stored));
        }
      } catch (e) {}
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      const res = await fetch('/api/account/profile', { headers });

      if (res.status === 401) {
        window.location.href = '/auth/signin?redirect=%2Faccount&reason=auth_required';
        return;
      }

      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setOrders(data.orders || []);
        setAddresses(data.addresses || []);

        setName(data.profile.name || '');
        setPhone(data.profile.phone || '');
        setVillageOrCity(data.profile.villageOrCity || 'Kalwaral');
        setMandalOrArea(data.profile.mandalOrArea || 'Sadasivanagar');
        setDistrict(data.profile.district || 'Kamareddy');
        setState(data.profile.state || 'Telangana');
        setPinCode(data.profile.pinCode || '503145');
        setPreferredLanguage(data.profile.preferredLanguage || 'en');
      }
      loadTransactions();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error loading account data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const headers = getAuthHeaders();
      const res = await fetch('/api/account/transactions', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTransactionsData({
            transactions: data.transactions || [],
            orderSummaries: data.orderSummaries || [],
          });
        }
      }
    } catch (e) {
      console.error('Error loading transactions:', e);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'warning', title: 'Invalid Image', message: 'Please upload a valid image file.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: 'warning', title: 'File Too Large', message: 'Profile photo must be under 5 MB.' });
      return;
    }

    try {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) return;

        const res = await authFetch('/api/account/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarData: dataUrl }),
        });

        const data = await res.json();
        const newAvatar = data.avatar || data.avatarUrl;
        if (data.success && newAvatar) {
          setProfile((prev: any) => ({ ...prev, avatar: newAvatar }));
          showToast({
            type: 'success',
            title: 'Avatar Updated',
            message: 'Your profile photo has been updated.',
          });
        } else {
          showToast({ type: 'error', title: 'Upload Failed', message: data.error || 'Failed to update avatar.' });
        }
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Upload Error', message: err.message });
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMessage(null);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          villageOrCity: villageOrCity.trim(),
          mandalOrArea: mandalOrArea.trim(),
          district: district.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, ...data.profile }));
        setStatusMessage({ type: 'success', text: '✓ Profile details saved successfully!' });
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile details have been saved.',
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error saving profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter both current and new password' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: '✓ Password changed successfully!' });
        showToast({
          type: 'success',
          title: 'Password Changed',
          message: 'Your account password has been updated.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error updating password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: addrName.trim(),
          phone: addrPhone.trim(),
          tag: addrTag,
          streetAddress: addrStreet.trim(),
          villageOrCity: addrVillage.trim(),
          district: addrDistrict.trim(),
          state: addrState.trim(),
          pinCode: addrPin.trim(),
          isDefault: addresses.length === 0,
        }),
      });

      const data = await res.json();
      if (data.success && data.address) {
        setAddresses((prev) => [data.address, ...prev]);
        setShowAddressForm(false);
        setAddrName('');
        setAddrPhone('');
        setAddrStreet('');
        setAddrVillage('');
        showToast({
          type: 'success',
          title: 'Address Added',
          message: 'New delivery address registered.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error adding address' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/account/addresses?id=${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        showToast({
          type: 'info',
          title: 'Address Removed',
          message: 'Saved delivery address was deleted.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error deleting address' });
    }
  };

  const handleRemoveWishlist = (productId: string) => {
    const updated = wishlist.filter(p => (p.productId || p.id) !== productId);
    setWishlist(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kb_wishlist', JSON.stringify(updated));
    }
    showToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from your wishlist.',
    });
  };

  const handleMoveToBag = async (product: any) => {
    try {
      const res = await authFetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId || product.id,
          name: product.name,
          price: product.price,
          size: product.sizes?.[0] || 'M',
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast({
          type: 'success',
          title: 'Moved to Bag',
          message: `${product.name} added to your shopping cart.`,
        });
        handleRemoveWishlist(product.productId || product.id);
      }
    } catch (e) {}
  };

  const handleSignOut = async () => {
    try {
      showToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been safely signed out.',
      });
      await fetch('/api/auth/logout', { method: 'POST' });
      clearClientSession();
      window.location.href = '/';
    } catch (e) {
      clearClientSession();
      window.location.href = '/';
    }
  };

  // Metrics Calculations
  const totalOrdersCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const totalSaved = orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0) + (totalOrdersCount > 0 ? 500 : 0);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center">
        <SmoothLoader size="md" color="black" label="Loading customer dashboard..." />
      </div>
    );
  }

  // Navigation Items
  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'My Orders', icon: '📦', count: orders.length },
    { id: 'transactions', label: 'Payment History', icon: '💳', count: transactionsData.transactions.length },
    { id: 'wishlist', label: 'My Wishlist', icon: '🤍', count: wishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍', count: addresses.length },
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'security', label: 'Security & Password', icon: '🔒' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12">
      {/* Hidden Avatar Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
        id="account-avatar-file-input"
      />

      {/* Top Mobile Profile Card (Screen 4 Layout) */}
      <div className="md:hidden mb-6 bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-electricBlue p-0.5 bg-obsidian flex items-center justify-center overflow-hidden shadow-xs">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-white font-bold text-base">
                  {profile?.name?.slice(0, 2).toUpperCase() || 'KB'}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-electricBlue text-white flex items-center justify-center text-[10px] shadow-xs"
            >
              ✎
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-obsidian truncate">
              {profile?.name || 'Customer'}
            </h2>
            <p className="text-xs text-secondaryText truncate">
              {profile?.email}
            </p>
            {profile?.phone && (
              <p className="text-[11px] text-secondaryText truncate font-mono">
                +91 {profile.phone}
              </p>
            )}
          </div>

          {activeTab !== 'overview' && (
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-bold text-electricBlue bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"
            >
              ‹ Menu
            </button>
          )}
        </div>

        {/* Mobile Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-neutralBorder text-center">
          <div onClick={() => setActiveTab('orders')} className="cursor-pointer">
            <div className="text-base font-bold text-obsidian">{orders.length}</div>
            <div className="text-[10px] text-secondaryText">Orders</div>
          </div>
          <div onClick={() => setActiveTab('wishlist')} className="cursor-pointer">
            <div className="text-base font-bold text-obsidian">{wishlist.length}</div>
            <div className="text-[10px] text-secondaryText">Wishlist</div>
          </div>
          <div>
            <div className="text-base font-bold text-obsidian">₹{totalSpent}</div>
            <div className="text-[10px] text-secondaryText">Spent</div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Main Grid: Desktop Obsidian Sidebar + Content Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* DESKTOP OBSIDIAN SIDEBAR (Matching Screen 8) */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <div className="bg-obsidian text-white rounded-2xl p-6 shadow-md border border-neutral-800 space-y-6 sticky top-28">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-neutral-800">
              <div className="relative group shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-electricBlue p-0.5 bg-neutral-900 flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {profile?.name?.slice(0, 2).toUpperCase() || 'KB'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold"
                >
                  Edit
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm truncate text-white">
                  {profile?.name || 'Customer'}
                </div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {profile?.email}
                </div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AccountTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-electricBlue text-white shadow-xs font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-neutral-800 mt-4 space-y-1">
                <Link
                  href="/support"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
                >
                  <span>🎧</span>
                  <span>Support &amp; Help Desk</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all text-left"
                >
                  <span>🚪</span>
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* WORKSPACE AREA (Right Column on Desktop, Full view on Mobile) */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* TAB: OVERVIEW (Screen 8 Desktop / Screen 4 Menu on Mobile) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Desktop Welcome Banner */}
              <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-obsidian tracking-tight">
                    Welcome back, {profile?.name?.split(' ')[0] || 'Friend'} 👋
                  </h1>
                  <p className="text-xs text-secondaryText mt-1">
                    Manage your orders, saved addresses, and authentic handloom wishlist.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified Customer
                  </span>
                </div>
              </div>

              {/* 4 Metric Cards (Matching Approved Screen 8) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Orders */}
                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs hover:border-electricBlue transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-electricBlue flex items-center justify-center text-lg mb-3">
                    📦
                  </div>
                  <div className="text-2xl font-bold text-obsidian">{totalOrdersCount}</div>
                  <div className="text-xs text-secondaryText font-medium mt-0.5">Total Orders</div>
                </div>

                {/* 2. Wishlist Items */}
                <div
                  onClick={() => setActiveTab('wishlist')}
                  className="bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs hover:border-electricBlue transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center text-lg mb-3">
                    🤍
                  </div>
                  <div className="text-2xl font-bold text-obsidian">{wishlist.length}</div>
                  <div className="text-xs text-secondaryText font-medium mt-0.5">Wishlist Items</div>
                </div>

                {/* 3. Total Spent */}
                <div className="bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                    ₹
                  </div>
                  <div className="text-2xl font-bold text-obsidian">₹{totalSpent.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-secondaryText font-medium mt-0.5">Total Spent</div>
                </div>

                {/* 4. Total Saved */}
                <div className="bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                    🏷️
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">₹{totalSaved.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-secondaryText font-medium mt-0.5">Total Saved</div>
                </div>
              </div>

              {/* Mobile Menu List (Matching Screen 4) */}
              <div className="md:hidden bg-white rounded-2xl border border-neutralBorder divide-y divide-neutralBorder shadow-xs">
                {NAV_ITEMS.filter(item => item.id !== 'overview').map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AccountTab)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-bold text-obsidian">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-warmGray text-secondaryText font-bold border border-neutralBorder">
                          {item.count}
                        </span>
                      )}
                      <span className="text-secondaryText font-bold text-sm">›</span>
                    </div>
                  </button>
                ))}

                <Link
                  href="/support"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors block"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎧</span>
                    <span className="text-xs font-bold text-obsidian">Support &amp; Help Desk</span>
                  </div>
                  <span className="text-secondaryText font-bold text-sm">›</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-rose-50 text-rose-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🚪</span>
                    <span className="text-xs font-bold">Log Out</span>
                  </div>
                  <span className="font-bold text-sm">›</span>
                </button>
              </div>

              {/* Recent Orders Section (Matching Screen 8) */}
              <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                  <h2 className="text-base font-bold text-obsidian">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-electricBlue hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-secondaryText text-xs space-y-2">
                    <div className="text-3xl">📦</div>
                    <p className="font-medium">No orders placed yet.</p>
                    <Link href="/search?category=All" className="inline-block text-electricBlue font-bold underline">
                      Discover Handloom Collections →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-neutralBorder">
                    {orders.slice(0, 5).map((order: any) => {
                      const firstItem = order.items?.[0];
                      const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
                      const status = order.status || 'CONFIRMED';
                      const isDelivered = status === 'DELIVERED';
                      const isInTransit = status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY';

                      return (
                        <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-warmGray overflow-hidden relative shrink-0 border border-neutralBorder">
                              {firstItem?.image ? (
                                <Image
                                  src={firstItem.image}
                                  alt={firstItem.title || 'Order Item'}
                                  fill
                                  className="object-cover"
                                  unoptimized={firstItem.image.startsWith('http')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">🧵</div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-obsidian">
                                #{order.orderId || order.id}
                              </div>
                              <div className="text-[11px] text-secondaryText mt-0.5">
                                {dateStr} • {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isInTransit
                                ? 'bg-blue-50 text-electricBlue border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {status.replace(/_/g, ' ')}
                            </span>

                            <div className="text-right">
                              <div className="font-bold text-xs sm:text-sm text-obsidian">
                                ₹{order.totalAmount || order.total}
                              </div>
                            </div>

                            <Link
                              href={`/orders/${order.orderId || order.id}`}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-warmGray hover:bg-neutral-200 text-obsidian transition-colors shrink-0"
                            >
                              Track →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">My Orders</h2>
                  <p className="text-xs text-secondaryText mt-0.5">Track consignments and download Bills of Supply</p>
                </div>
                <span className="text-xs font-bold text-secondaryText bg-warmGray px-3 py-1 rounded-full border border-neutralBorder">
                  {orders.length} Total
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center text-secondaryText text-xs space-y-3">
                  <div className="text-4xl">🛍️</div>
                  <p className="font-medium">You have not placed any orders yet.</p>
                  <Link href="/search?category=All" className="inline-block bg-obsidian text-white px-6 py-2.5 rounded-xl font-bold">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border border-neutralBorder rounded-xl p-4 sm:p-5 hover:border-neutral-400 transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutralBorder text-xs">
                        <div>
                          <span className="font-bold text-obsidian text-sm">Order #{order.orderId || order.id}</span>
                          <span className="text-secondaryText ml-2 font-mono">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {order.status || 'CONFIRMED'}
                          </span>
                          <span className="font-bold text-obsidian text-sm">
                            ₹{order.totalAmount || order.total}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-neutralBorder text-xs">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-warmGray relative overflow-hidden shrink-0 border border-neutralBorder">
                                {item.image ? (
                                  <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized={item.image.startsWith('http')} />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs">🧵</div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-obsidian">{item.title}</div>
                                <div className="text-[11px] text-secondaryText">Qty: {item.qty} {item.size ? `• Size: ${item.size}` : ''}</div>
                              </div>
                            </div>
                            <div className="font-bold text-obsidian">₹{item.totalAmount || item.unitPrice * item.qty}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap gap-2 justify-end text-xs">
                        <Link
                          href={`/invoices/${order.orderId || order.id}`}
                          className="px-4 py-2 rounded-xl border border-neutralBorder text-obsidian hover:bg-neutral-50 font-bold"
                        >
                          Bill of Supply
                        </Link>
                        <Link
                          href={`/orders/${order.orderId || order.id}`}
                          className="px-4 py-2 rounded-xl bg-electricBlue text-white hover:bg-blue-600 font-bold shadow-xs"
                        >
                          Track Consignment →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYMENT HISTORY / TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-obsidian">Payment History &amp; Transaction Logs</h2>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Account-isolated record of all transaction attempts, payment gateways, and success/failure diagnostics.
                  </p>
                </div>
                <button
                  onClick={loadTransactions}
                  disabled={isLoadingTransactions}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-neutralBorder hover:bg-neutral-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <span>🔄</span>
                  <span>{isLoadingTransactions ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>

              {/* Transaction Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-neutralBorder p-4 shadow-xs">
                  <div className="text-xs font-bold text-secondaryText">Total Attempts</div>
                  <div className="text-2xl font-bold text-obsidian mt-1">{transactionsData.transactions.length}</div>
                </div>
                <div className="bg-white rounded-2xl border border-neutralBorder p-4 shadow-xs">
                  <div className="text-xs font-bold text-emerald-700">Successful</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {transactionsData.transactions.filter(t => t.status === 'SUCCESS').length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-neutralBorder p-4 shadow-xs">
                  <div className="text-xs font-bold text-rose-700">Failed / Retried</div>
                  <div className="text-2xl font-bold text-rose-600 mt-1">
                    {transactionsData.transactions.filter(t => t.status === 'FAILED').length}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-neutralBorder p-4 shadow-xs">
                  <div className="text-xs font-bold text-secondaryText">Orders Tracked</div>
                  <div className="text-2xl font-bold text-electricBlue mt-1">
                    {transactionsData.orderSummaries.length}
                  </div>
                </div>
              </div>

              {/* Order Summaries List */}
              {transactionsData.orderSummaries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutralBorder p-12 text-center text-secondaryText text-xs space-y-2">
                  <div className="text-3xl">💳</div>
                  <p className="font-bold text-obsidian">No payment transactions recorded yet.</p>
                  <p>When you initiate checkout or complete payments, attempt logs and gateway references will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactionsData.orderSummaries.map((summary: any) => {
                    const isSuccess = summary.finalStatus === 'SUCCESS';
                    return (
                      <div key={summary.orderId} className="bg-white rounded-2xl border border-neutralBorder p-5 shadow-xs space-y-4">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutralBorder">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-obsidian">Order #{summary.orderId}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isSuccess
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                {summary.finalStatus}
                              </span>
                            </div>
                            <div className="text-[11px] text-secondaryText mt-0.5">
                              Invoice: {summary.invoiceNumber} • Placed on {summary.createdAt ? new Date(summary.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="font-bold text-sm text-obsidian">₹{summary.totalAmount?.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-secondaryText">
                              {summary.attempts?.length || 1} attempt(s) • {summary.successCount} success, {summary.failedCount} failed
                            </div>
                          </div>
                        </div>

                        {/* Payment Attempts List */}
                        <div className="space-y-2.5">
                          <div className="text-[11px] font-bold text-secondaryText uppercase tracking-wider">
                            Transaction &amp; Gateway Attempt Log
                          </div>

                          {summary.attempts?.map((attempt: any, idx: number) => {
                            const isAttemptSuccess = attempt.status === 'SUCCESS';
                            return (
                              <div
                                key={attempt.id || idx}
                                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                                  isAttemptSuccess
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : 'bg-rose-50/50 border-rose-200'
                                }`}
                              >
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      isAttemptSuccess ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                    }`}>
                                      Attempt #{idx + 1}: {attempt.status}
                                    </span>
                                    <span className="font-bold text-obsidian">₹{attempt.amount}</span>
                                    <span className="text-[11px] text-secondaryText">via {attempt.gateway || 'CASHFREE'} ({attempt.method || 'ONLINE'})</span>
                                  </div>

                                  <div className="text-[11px] text-secondaryText font-mono">
                                    {attempt.createdAt ? new Date(attempt.createdAt).toLocaleString('en-IN') : 'N/A'}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-200/60">
                                  <div>
                                    <span className="text-secondaryText font-medium">Gateway Ref ID: </span>
                                    <span className="font-mono text-obsidian">{attempt.gatewayTransactionId || attempt.id}</span>
                                  </div>
                                  <div>
                                    <span className="text-secondaryText font-medium">Payment ID: </span>
                                    <span className="font-mono text-obsidian">{attempt.id}</span>
                                  </div>
                                </div>

                                {attempt.failureReason && (
                                  <div className="text-[11px] text-rose-700 bg-rose-100/70 p-2 rounded-lg font-medium">
                                    ⚠️ Failure Diagnostic: {attempt.failureReason}
                                  </div>
                                )}

                                {isAttemptSuccess && (
                                  <div className="text-[11px] text-emerald-800 bg-emerald-100/70 p-2 rounded-lg font-medium">
                                    ✓ Payment successfully captured and verified. Order authorized for fulfillment.
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">My Wishlist</h2>
                  <p className="text-xs text-secondaryText mt-0.5">Saved handlooms and festive collections</p>
                </div>
                <span className="text-xs font-bold text-secondaryText bg-warmGray px-3 py-1 rounded-full border border-neutralBorder">
                  {wishlist.length} Items
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-16 text-center text-secondaryText text-xs space-y-3">
                  <div className="text-4xl">🤍</div>
                  <p className="font-medium">Your wishlist is currently empty.</p>
                  <Link href="/search?category=All" className="inline-block bg-obsidian text-white px-6 py-2.5 rounded-xl font-bold">
                    Explore Sarees &amp; Handlooms →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item: any) => (
                    <div key={item.productId || item.id} className="border border-neutralBorder rounded-xl overflow-hidden p-3 space-y-3">
                      <div className="aspect-3/4 rounded-lg bg-warmGray relative overflow-hidden">
                        {item.images?.[0]?.data || item.image ? (
                          <Image
                            src={item.images?.[0]?.data || item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🧵</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-obsidian truncate">{item.name}</h3>
                        <div className="text-xs font-bold text-obsidian mt-1">₹{item.price}</div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => handleMoveToBag(item)}
                          className="flex-1 py-2 bg-electricBlue text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => handleRemoveWishlist(item.productId || item.id)}
                          className="px-3 py-2 border border-neutralBorder text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">Delivery Addresses</h2>
                  <p className="text-xs text-secondaryText mt-0.5">Manage doorstep delivery locations</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-electricBlue text-white hover:bg-blue-600 transition-colors shadow-xs"
                >
                  {showAddressForm ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-warmGray p-5 rounded-xl border border-neutralBorder space-y-4 text-xs">
                  <h3 className="font-bold text-obsidian text-sm">Add New Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-obsidian block mb-1">Recipient Name *</label>
                      <input
                        type="text"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-neutralBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-obsidian block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-neutralBorder bg-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-obsidian block mb-1">Street / House No. *</label>
                      <input
                        type="text"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-neutralBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-obsidian block mb-1">Village / City *</label>
                      <input
                        type="text"
                        value={addrVillage}
                        onChange={(e) => setAddrVillage(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-neutralBorder bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-obsidian block mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={addrPin}
                        onChange={(e) => setAddrPin(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-neutralBorder bg-white font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-obsidian text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr: any) => (
                  <div key={addr.id} className="border border-neutralBorder rounded-xl p-4 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-obsidian">{addr.name}</span>
                      <span className="text-[10px] uppercase font-bold bg-warmGray text-secondaryText px-2 py-0.5 rounded-full border border-neutralBorder">
                        {addr.tag || 'Home'}
                      </span>
                    </div>
                    <div className="text-xs text-secondaryText">
                      {addr.streetAddress}, {addr.villageOrCity}, {addr.district} - {addr.pinCode}
                    </div>
                    <div className="text-xs font-mono text-secondaryText">Phone: {addr.phone}</div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">Profile Settings</h2>
                  <p className="text-xs text-secondaryText mt-0.5">Manage your personal information</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-warmGray hover:bg-neutral-200 text-obsidian transition-colors border border-neutralBorder"
                >
                  Change Photo
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-obsidian block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-obsidian block mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-obsidian block mb-1">Village / City *</label>
                    <input
                      type="text"
                      value={villageOrCity}
                      onChange={(e) => setVillageOrCity(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-obsidian block mb-1">Mandal / Area</label>
                    <input
                      type="text"
                      value={mandalOrArea}
                      onChange={(e) => setMandalOrArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-obsidian block mb-1">District *</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-obsidian block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-electricBlue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-xs disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-neutralBorder p-6 shadow-xs space-y-6">
              <div className="border-b border-neutralBorder pb-4">
                <h2 className="text-base font-bold text-obsidian">Security &amp; Password</h2>
                <p className="text-xs text-secondaryText mt-0.5">Keep your account safe and protected</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="font-bold text-obsidian block mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-obsidian block mb-1">New Password (Min 6 characters) *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-obsidian block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-obsidian text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-28 text-center">
        <SmoothLoader size="md" color="black" label="Loading customer dashboard..." />
      </div>
    }>
      <AccountManagementContent />
    </Suspense>
  );
}
