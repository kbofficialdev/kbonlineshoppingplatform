"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModalAlert } from '@/components/ModalContext';

type TabType = 'profile' | 'orders' | 'tracking' | 'addresses' | 'payments' | 'security' | 'settings';

function CustomerAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showModal } = useModalAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Tracking state
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    villageOrCity: '',
    mandalOrArea: '',
    district: '',
    state: '',
    pinCode: '',
    preferredLanguage: 'en',
    smsUpdates: true,
    whatsappUpdates: true,
    bio: '',
  });

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Address Form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    tag: 'Home',
    streetAddress: '',
    villageOrCity: '',
    mandalOrArea: 'Sadasivanagar',
    district: 'Kamareddy',
    state: 'Telangana',
    pinCode: '503145',
    isDefault: false,
  });

  // Payment Method Form state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'UPI',
    label: '',
    identifier: '',
    isDefault: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['profile', 'orders', 'tracking', 'addresses', 'payments', 'security', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setTrackingQuery(orderIdParam);
      fetchTracking(orderIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/account/profile');
      if (res.status === 401) {
        window.location.href = '/auth/signin?redirect=/account&reason=auth_required';
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setProfileForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          villageOrCity: data.user.villageOrCity || 'Kalwaral',
          mandalOrArea: data.user.mandalOrArea || 'Sadasivanagar',
          district: data.user.district || 'Kamareddy',
          state: data.user.state || 'Telangana',
          pinCode: data.user.pinCode || '503145',
          preferredLanguage: data.user.preferredLanguage || 'en',
          smsUpdates: data.user.smsUpdates !== false,
          whatsappUpdates: data.user.whatsappUpdates !== false,
          bio: data.user.bio || '',
        });
        setAddresses(data.addresses || []);
        setPaymentMethods(data.paymentMethods || []);

        // Fetch user orders
        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
          if (ordersData.orders?.length > 0 && !trackingQuery) {
            setTrackingQuery(ordersData.orders[0].orderId);
            fetchTracking(ordersData.orders[0].orderId);
          }
        }
      }
    } catch (e) {
      window.location.href = '/auth/signin?redirect=/account&reason=auth_required';
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showModal({
        type: 'warning',
        title: 'Invalid File',
        message: 'Please choose a valid image file (PNG, JPG, WebP, SVG).',
        primaryBtn: { text: 'Understood' },
      });
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showModal({
        type: 'warning',
        title: 'Image Too Large',
        message: 'Profile image size must be under 4MB.',
        primaryBtn: { text: 'Understood' },
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/account/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarData: dataUrl }),
        });
        const result = await res.json();
        if (result.success) {
          setUser((prev: any) => ({ ...prev, avatar: result.avatarUrl }));
          showModal({
            type: 'success',
            title: 'Avatar Updated!',
            message: 'Your profile picture has been saved securely to the database.',
            primaryBtn: { text: 'Done' },
          });
        } else {
          showModal({
            type: 'error',
            title: 'Upload Failed',
            message: result.error || 'Could not update profile photo.',
            primaryBtn: { text: 'Understood' },
          });
        }
      } catch (err) {
        showModal({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to upload image. Please try again.',
          primaryBtn: { text: 'Understood' },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({ ...prev, ...data.user }));
        showModal({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your customer profile and preferences have been updated successfully.',
          primaryBtn: { text: 'Done' },
        });
      } else {
        showModal({
          type: 'error',
          title: 'Update Error',
          message: data.error || 'Failed to update profile.',
          primaryBtn: { text: 'Try Again' },
        });
      }
    } catch (e) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to update profile.',
        primaryBtn: { text: 'Understood' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showModal({
        type: 'warning',
        title: 'Passwords Do Not Match',
        message: 'New password and confirmation must match exactly.',
        primaryBtn: { text: 'Correct Password' },
      });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showModal({
          type: 'success',
          title: 'Password Changed Successfully',
          message: 'Your security password has been updated. Please remember your new password.',
          primaryBtn: { text: 'Done' },
        });
      } else {
        showModal({
          type: 'error',
          title: 'Failed to Change Password',
          message: data.error || 'Current password was incorrect.',
          primaryBtn: { text: 'Try Again' },
        });
      }
    } catch (e) {
      showModal({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to change password.',
        primaryBtn: { text: 'Understood' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchTracking = async (orderId: string) => {
    if (!orderId.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();
      if (data.success) {
        setTrackingData(data.tracking);
      } else {
        setTrackingData(null);
        setTrackingError(data.error || 'No consignment found with this order ID.');
      }
    } catch (e) {
      setTrackingError('Failed to fetch tracking data. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingAddressId
        ? `/api/account/addresses/${editingAddressId}`
        : '/api/account/addresses';
      const method = editingAddressId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddressModal(false);
        setEditingAddressId(null);
        await loadAccountData();
        showModal({
          type: 'success',
          title: editingAddressId ? 'Address Updated' : 'Address Saved',
          message: 'Delivery address has been saved in your database records.',
          primaryBtn: { text: 'Done' },
        });
      } else {
        showModal({
          type: 'error',
          title: 'Address Error',
          message: data.error || 'Failed to save address.',
          primaryBtn: { text: 'Try Again' },
        });
      }
    } catch (e) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to save address.',
        primaryBtn: { text: 'Understood' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        showModal({
          type: 'success',
          title: 'Address Removed',
          message: 'The address has been removed from your saved list.',
          primaryBtn: { text: 'Done' },
        });
      }
    } catch (e) {}
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/account/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentModal(false);
        setPaymentForm({ type: 'UPI', label: '', identifier: '', isDefault: false });
        await loadAccountData();
        showModal({
          type: 'success',
          title: 'Payment Method Saved',
          message: 'Payment preference added to your authenticated account.',
          primaryBtn: { text: 'Done' },
        });
      } else {
        showModal({
          type: 'error',
          title: 'Payment Setup Error',
          message: data.error || 'Failed to save payment method.',
          primaryBtn: { text: 'Try Again' },
        });
      }
    } catch (e) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to save payment method.',
        primaryBtn: { text: 'Understood' },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const res = await fetch(`/api/account/payment-methods/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
        showModal({
          type: 'success',
          title: 'Payment Method Removed',
          message: 'Payment preference removed.',
          primaryBtn: { text: 'Done' },
        });
      }
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (e) {
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-neutral-600">Loading Customer Account...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ============================================================== */}
      {/* 1. TOP CUSTOMER PROFILE HEADER CARD                           */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-transparent pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          {/* Avatar with Upload Trigger */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white shadow-lg bg-neutral-900 flex items-center justify-center text-white text-xl font-bold">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  id="customer-profile-avatar-img"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            
            {/* Overlay Camera Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
              title="Click to Upload New Profile Picture"
            >
              <span>📷</span>
              <span>Change</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Identifiers */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-kb-black tracking-tight" id="customer-name-heading">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-kb-blue border border-blue-200 uppercase tracking-wider">
                {user.role}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Verified
              </span>
            </div>

            <p className="text-xs text-neutral-500 font-mono">
              {user.email} • {user.phone}
            </p>
            <p className="text-xs text-neutral-600">
              📍 {user.villageOrCity}, {user.district}, {user.state} ({user.pinCode})
            </p>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end relative z-10 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
          <div className="text-right hidden sm:block mr-2">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Store Orders</div>
            <div className="text-lg font-black text-kb-black">{orders.length} Consignments</div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-full border border-kb-blue text-kb-blue hover:bg-blue-50 text-xs font-bold transition-colors"
          >
            📷 Upload Photo
          </button>
          <button
            onClick={handleLogout}
            id="account-logout-btn"
            className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 text-xs font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TAB NAVIGATION BAR                                          */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold no-scrollbar">
        {[
          { id: 'profile', label: '👤 Profile & Details' },
          { id: 'orders', label: `📦 My Orders (${orders.length})` },
          { id: 'tracking', label: '🚚 Parcel Tracking' },
          { id: 'addresses', label: `📍 Saved Addresses (${addresses.length})` },
          { id: 'payments', label: `💳 Payment Methods (${paymentMethods.length})` },
          { id: 'security', label: '🔒 Password & Security' },
          { id: 'settings', label: '⚙️ Preferences' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              router.push(`/account?tab=${tab.id}`);
            }}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-kb-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 3. TAB CONTENT PANELS                                          */}
      {/* ============================================================== */}

      {/* TAB A: PROFILE & DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-kb-black">Personal Profile & Location</h2>
            <p className="text-xs text-neutral-500">
              Manage your personal information, delivery location in Telangana, and fabric preferences.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-neutral-100 text-neutral-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-neutral-400">Email is linked to authentication credentials</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Village / City</label>
                <input
                  type="text"
                  value={profileForm.villageOrCity}
                  onChange={(e) => setProfileForm({ ...profileForm, villageOrCity: e.target.value })}
                  placeholder="e.g. Kalwaral"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mandal / Area</label>
                <input
                  type="text"
                  value={profileForm.mandalOrArea}
                  onChange={(e) => setProfileForm({ ...profileForm, mandalOrArea: e.target.value })}
                  placeholder="e.g. Sadasivanagar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">District</label>
                <input
                  type="text"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  placeholder="e.g. Kamareddy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  placeholder="e.g. Telangana"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={profileForm.pinCode}
                  onChange={(e) => setProfileForm({ ...profileForm, pinCode: e.target.value })}
                  placeholder="503145"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Customer Notes / Fabric Sizing Preferences</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3}
                placeholder="Mention typical saree blouse measurements, favorite colors, or unstitched meter preferences..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 active:scale-98 transition-all shadow-md disabled:opacity-50"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB B: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-kb-black">Order History & Consignments</h2>
              <p className="text-xs text-neutral-500">Track delivery stages and download statutory retail bills of supply</p>
            </div>
            <Link
              href="/search?category=All"
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-black text-xs font-bold text-neutral-700 transition-colors"
            >
              + Shop More Garments
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3">
              <div className="text-4xl">🛍️</div>
              <h3 className="text-base font-bold text-kb-black">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500">Explore authentic Gadwal handlooms and fine Raymond unstitched fabrics.</p>
              <Link href="/search?category=All" className="inline-block px-5 py-2 rounded-full bg-kb-blue text-white text-xs font-bold">
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-kb-blue transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-black">Order #{order.orderId}</span>
                        <span className="text-xs text-neutral-400 font-mono">• Bill #{order.invoiceNumber}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'CONFIRMED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="text-base font-black text-black">
                        ₹{order.totalPaid}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-neutral-700">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-black">{item.qty}x</span>
                          <span>{item.title}</span>
                          {item.cutLength && (
                            <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                              ✂ {item.cutLength}m cut
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-400">({item.size})</span>
                        </div>
                        <span className="font-mono font-medium">₹{item.totalAmount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Steppers */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-neutral-100 gap-2">
                    <div className="text-[11px] text-neutral-500">
                      Payment: <strong className="text-black">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTrackingQuery(order.orderId);
                          fetchTracking(order.orderId);
                          setActiveTab('tracking');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-kb-blue hover:bg-blue-100 text-xs font-bold transition-colors"
                      >
                        🚚 Track Parcel
                      </button>
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-black text-xs font-semibold text-neutral-700 transition-colors"
                      >
                        Timeline Stepper
                      </Link>
                      <Link
                        href={`/invoices/${order.orderId}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-black text-xs font-semibold text-neutral-700 transition-colors"
                      >
                        📄 Bill of Supply
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: PARCEL TRACKING */}
      {activeTab === 'tracking' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-kb-black">Real-Time Consignment & Parcel Tracking</h2>
            <p className="text-xs text-neutral-500">
              Live tracking from Kalwaral shop dispatch to your destination address.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={trackingQuery}
              onChange={(e) => setTrackingQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-2026-1001)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none font-mono"
            />
            <button
              onClick={() => fetchTracking(trackingQuery)}
              disabled={trackingLoading}
              className="px-5 py-2 rounded-xl bg-kb-blue text-white text-xs font-bold hover:brightness-110 disabled:opacity-50"
            >
              {trackingLoading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {trackingError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {trackingError}
            </div>
          )}

          {trackingData && (
            <div className="space-y-6 pt-2">
              {/* Consignment Overview Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">AWB Tracking #</span>
                  <span className="font-mono font-bold text-black text-sm">{trackingData.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Courier Partner</span>
                  <span className="font-bold text-black">{trackingData.courierPartner}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Destination</span>
                  <span className="text-neutral-700">{trackingData.destination}</span>
                </div>
              </div>

              {/* Stage Stepper Visualizer */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Dispatch Milestones</h3>
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {trackingData.stages?.map((stage: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        stage.completed
                          ? 'bg-kb-blue border-kb-blue text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}>
                        {stage.completed ? '✓' : idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${stage.isCurrent ? 'text-kb-blue' : 'text-black'}`}>
                            {stage.label}
                          </span>
                          {stage.isCurrent && (
                            <span className="px-2 py-0.2 bg-blue-100 text-kb-blue rounded-full text-[9px] font-bold animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB D: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-kb-black">Saved Delivery Addresses</h2>
              <p className="text-xs text-neutral-500">Manage residential, shop, and village shipping locations</p>
            </div>
            <button
              onClick={() => {
                setEditingAddressId(null);
                setAddressForm({
                  name: user.name || '',
                  phone: user.phone || '',
                  tag: 'Home',
                  streetAddress: '',
                  villageOrCity: 'Kalwaral',
                  mandalOrArea: 'Sadasivanagar',
                  district: 'Kamareddy',
                  state: 'Telangana',
                  pinCode: '503145',
                  isDefault: addresses.length === 0,
                });
                setShowAddressModal(true);
              }}
              className="px-4 py-2 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              + Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border transition-all ${
                  addr.isDefault
                    ? 'border-kb-blue bg-blue-50/20 ring-1 ring-kb-blue/30'
                    : 'border-slate-200 hover:border-slate-400 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-black">{addr.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-kb-blue text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAddressId(addr.id);
                        setAddressForm({ ...addr });
                        setShowAddressModal(true);
                      }}
                      className="text-[11px] font-semibold text-kb-blue hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[11px] font-semibold text-neutral-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {addr.streetAddress}<br />
                  {addr.villageOrCity}, {addr.district}, {addr.state} - {addr.pinCode}
                </p>
                <div className="text-xs text-neutral-500 mt-2 font-mono">
                  📞 {addr.phone}
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Address In-Page Form */}
          {showAddressModal && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-black">
                  {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
                </h3>
                <button onClick={() => setShowAddressModal(false)} className="text-xs text-neutral-400 hover:text-black">
                  ✕ Cancel
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">House / Street Address</label>
                    <input
                      type="text"
                      value={addressForm.streetAddress}
                      onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Village / City</label>
                    <input
                      type="text"
                      value={addressForm.villageOrCity}
                      onChange={(e) => setAddressForm({ ...addressForm, villageOrCity: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={addressForm.pinCode}
                      onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="addrDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-kb-blue"
                  />
                  <label htmlFor="addrDefault" className="text-xs text-neutral-700">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110"
                  >
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB E: PAYMENT METHODS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-kb-black">Saved Payment Methods</h2>
              <p className="text-xs text-neutral-500">Manage UPI VPA handles and payment preferences</p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              + Add Payment Method
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-400 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                    {pm.type === 'UPI' ? '📱' : pm.type === 'CARD' ? '💳' : '🏦'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black flex items-center gap-2">
                      <span>{pm.label}</span>
                      {pm.isDefault && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-kb-blue text-white">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{pm.identifier}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePaymentMethod(pm.id)}
                  className="text-xs text-neutral-400 hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {showPaymentModal && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-black">Add Payment Preference</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-xs text-neutral-400 hover:text-black">✕</button>
              </div>
              <form onSubmit={handleSavePaymentMethod} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Type</label>
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="CARD">Debit / Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Label Name</label>
                  <input
                    type="text"
                    value={paymentForm.label}
                    onChange={(e) => setPaymentForm({ ...paymentForm, label: e.target.value })}
                    placeholder="e.g. My Primary PhonePe UPI"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">VPA Handle / Masked Number</label>
                  <input
                    type="text"
                    value={paymentForm.identifier}
                    onChange={(e) => setPaymentForm({ ...paymentForm, identifier: e.target.value })}
                    placeholder="e.g. username@okaxis"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pmDefault"
                    checked={paymentForm.isDefault}
                    onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-kb-blue"
                  />
                  <label htmlFor="pmDefault" className="text-neutral-700">Set as default payment method</label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 rounded-full border border-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-full bg-kb-blue text-white font-bold hover:brightness-110"
                  >
                    {isSaving ? 'Saving...' : 'Save Preference'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB F: SECURITY & PASSWORD RESETS */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-kb-black">Change Security Password</h2>
            <p className="text-xs text-neutral-500">
              Ensure your customer account remains protected with strong credentials.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
              />
              <span className="text-[10px] text-neutral-400">Must be at least 8 characters long</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-kb-blue focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-kb-blue hover:underline"
              >
                Forgot your password?
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-kb-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB G: SETTINGS & PREFERENCES */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-kb-black">Shopping & Notification Preferences</h2>
            <p className="text-xs text-neutral-500">
              Customize language and updates for your village shopping experience.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-black">Preferred Shopping Language</div>
                <div className="text-[11px] text-neutral-500">Telugu (తెలుగు) or English support across the platform</div>
              </div>
              <select
                value={profileForm.preferredLanguage}
                onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value })}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-black">WhatsApp Order Tracking Notifications</div>
                <div className="text-[11px] text-neutral-500">Receive dispatch and delivery updates directly on WhatsApp</div>
              </div>
              <input
                type="checkbox"
                checked={profileForm.whatsappUpdates}
                onChange={(e) => setProfileForm({ ...profileForm, whatsappUpdates: e.target.checked })}
                className="w-5 h-5 rounded text-kb-blue"
              />
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-black">SMS Dispatch Alerts</div>
                <div className="text-[11px] text-neutral-500">Receive OTP and transit SMS messages</div>
              </div>
              <input
                type="checkbox"
                checked={profileForm.smsUpdates}
                onChange={(e) => setProfileForm({ ...profileForm, smsUpdates: e.target.checked })}
                className="w-5 h-5 rounded text-kb-blue"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleProfileSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerAccountPage() {
  return (
    <React.Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-neutral-600">Loading Customer Account...</p>
      </div>
    }>
      <CustomerAccountContent />
    </React.Suspense>
  );
}
