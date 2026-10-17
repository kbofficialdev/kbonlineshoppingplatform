"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearClientSession, getStoredToken } from '@/lib/clientAuth';

type AccountTab = 'profile' | 'orders' | 'tracking' | 'addresses' | 'payments' | 'security' | 'settings';

function AccountManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as AccountTab) || 'profile';

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingSearchId, setTrackingSearchId] = useState<string>('');

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
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [bio, setBio] = useState('');

  // Password Change Form
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
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Payment Method Form State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payType, setPayType] = useState<'UPI' | 'CARD'>('UPI');
  const [payLabel, setPayLabel] = useState('');
  const [payIdentifier, setPayIdentifier] = useState('');

  // Avatar Upload Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadAccountData();
  }, []);

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
        setPaymentMethods(data.paymentMethods || []);

        // Sync state
        setName(data.profile.name || '');
        setPhone(data.profile.phone || '');
        setVillageOrCity(data.profile.villageOrCity || 'Kalwaral');
        setMandalOrArea(data.profile.mandalOrArea || 'Sadasivanagar');
        setDistrict(data.profile.district || 'Kamareddy');
        setState(data.profile.state || 'Telangana');
        setPinCode(data.profile.pinCode || '503145');
        setPreferredLanguage(data.profile.preferredLanguage || 'en');
        setSmsUpdates(data.profile.smsUpdates ?? true);
        setWhatsappUpdates(data.profile.whatsappUpdates ?? true);
        setBio(data.profile.bio || '');

        // If active orders exist, pre-populate tracking tab with most recent order
        if (data.orders && data.orders.length > 0) {
          fetchTracking(data.orders[0].orderId);
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error loading account details' });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload Profile Avatar (Stored in PostgreSQL db.productImages)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, SVG, WEBP)' });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

        const res = await fetch('/api/account/avatar', {
          method: 'POST',
          headers,
          body: JSON.stringify({ avatarData: base64Data }),
        });

        const data = await res.json();
        if (data.success) {
          setProfile((prev: any) => ({ ...prev, avatar: data.avatarUrl }));
          setStatusMessage({ type: 'success', text: '✓ Profile picture uploaded and stored in database successfully!' });
        } else {
          setStatusMessage({ type: 'error', text: data.error || 'Failed to upload profile picture' });
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error uploading avatar image' });
    } finally {
      setIsSaving(false);
    }
  };

  // Update Profile Information
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
          name,
          phone,
          villageOrCity,
          mandalOrArea,
          district,
          state,
          pinCode,
          preferredLanguage,
          smsUpdates,
          whatsappUpdates,
          bio,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, ...data.profile }));
        setStatusMessage({ type: 'success', text: '✓ Profile details saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error saving profile' });
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
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
        setStatusMessage({ type: 'success', text: '✓ Password changed successfully! Your account security is updated.' });
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

  // Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMessage(null);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: addrName || name,
          phone: addrPhone || phone,
          tag: addrTag,
          streetAddress: addrStreet,
          villageOrCity: addrVillage || villageOrCity,
          district: addrDistrict,
          state: addrState,
          pinCode: addrPin,
          isDefault: addrIsDefault,
        }),
      });

      const data = await res.json();
      if (data.success && data.address) {
        setAddresses((prev) => [...prev, data.address]);
        setShowAddressForm(false);
        setAddrStreet('');
        setStatusMessage({ type: 'success', text: '✓ New address added successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add address' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error creating address' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Address
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
        setStatusMessage({ type: 'success', text: '✓ Address removed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error deleting address' });
    }
  };

  // Add Payment Method
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMessage(null);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

      const res = await fetch('/api/account/payment-methods', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: payType,
          label: payLabel,
          identifier: payIdentifier,
          isDefault: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.paymentMethod) {
        setPaymentMethods((prev) => [...prev, data.paymentMethod]);
        setShowPaymentForm(false);
        setPayLabel('');
        setPayIdentifier('');
        setStatusMessage({ type: 'success', text: '✓ Payment method saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save payment method' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error saving payment method' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Payment Method
  const handleDeletePayment = async (id: string) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/account/payment-methods?id=${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
        setStatusMessage({ type: 'success', text: '✓ Payment method removed.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error deleting payment method' });
    }
  };

  // Fetch Tracking
  const fetchTracking = async (orderId: string) => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/tracking/${orderId.trim()}`, { headers });
      const data = await res.json();
      if (data.success && data.tracking) {
        setTrackingData(data.tracking);
        setTrackingSearchId(orderId);
      } else {
        setTrackingData(null);
        setStatusMessage({ type: 'error', text: data.error || 'Order tracking not found.' });
      }
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Failed to look up tracking.' });
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      clearClientSession();
      window.location.href = '/';
    } catch (e) {
      clearClientSession();
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-neutral-600">Loading your customer account...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Database-stored Profile Avatar with Click-to-Upload */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-kb-blue shadow-md bg-neutral-900 flex items-center justify-center text-xl font-black text-white">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile?.name?.slice(0, 2).toUpperCase() || 'KB'}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
              Change
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 id="customer-name-heading" className="text-2xl sm:text-3xl font-black text-kb-black">{profile?.name || 'Customer Account'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-kb-blue border border-blue-200 uppercase">
                {profile?.role || 'CUSTOMER'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
              <span>✉ {profile?.email}</span>
              <span>•</span>
              <span>📞 {profile?.phone}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">📍 {profile?.villageOrCity}, {profile?.district}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-bold rounded-kb-pill border border-slate-300 hover:border-black transition-colors"
          >
            📷 Upload Photo
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-xs font-bold rounded-kb-pill bg-neutral-100 hover:bg-rose-50 text-rose-600 border border-slate-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Modular Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px mb-8 scrollbar-none text-xs font-bold">
        {[
          { id: 'profile', label: '👤 Profile & Bio' },
          { id: 'orders', label: `📦 Orders (${orders.length})` },
          { id: 'tracking', label: '🚚 Live Tracking' },
          { id: 'addresses', label: `📍 Saved Addresses (${addresses.length})` },
          { id: 'payments', label: `💳 Payment Methods (${paymentMethods.length})` },
          { id: 'security', label: '🔒 Password & Security' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id as AccountTab);
              setStatusMessage(null);
            }}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-kb-blue text-kb-blue font-extrabold bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-neutral-500 hover:text-black hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PROFILE & PERSONAL DETAILS                              */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl">
          <div>
            <h2 className="text-xl font-black text-kb-black">Personal Profile & Village Details</h2>
            <p className="text-xs text-neutral-500 mt-1">Manage your identity, communication contact, and local village origin</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Phone Number (WhatsApp Verified)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Village / Town</label>
                <input
                  type="text"
                  value={villageOrCity}
                  onChange={(e) => setVillageOrCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Mandal / Area</label>
                <input
                  type="text"
                  value={mandalOrArea}
                  onChange={(e) => setMandalOrArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Postal PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Customer Bio / Fabric Preferences</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Mention your preferred saree designs, suiting cut lengths, or weaver instructions..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-kb-pill bg-kb-blue text-white text-xs font-bold hover:brightness-110 active:scale-98 transition-all shadow-md"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MY ORDERS & STAGE HISTORY                               */}
      {/* ============================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-kb-black">Order Consignments</h2>
              <p className="text-xs text-neutral-500">Track shipments, stage progression, and download retail Bills of Supply</p>
            </div>
            <Link
              href="/search?category=All"
              className="text-xs font-bold text-kb-blue hover:underline"
            >
              ← Browse More Fabrics
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="text-4xl">🛍️</div>
              <h3 className="text-base font-bold text-black">No Orders Yet</h3>
              <p className="text-xs text-neutral-500">
                You haven't placed any orders yet. Discover authentic handloom sarees and unstitched cuts directly from Kalwaral village.
              </p>
              <Link
                href="/search?category=All"
                className="inline-block px-6 py-3 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-md"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-kb-blue transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-black">Order #{order.orderId}</span>
                        <span className="text-xs text-neutral-400 font-mono">• Bill #{order.invoiceNumber}</span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
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

                  {/* Items Summary */}
                  <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-medium text-neutral-800">
                          {item.qty}x {item.title} {item.cutLength ? `(${item.cutLength}m cut)` : `(${item.size})`}
                        </span>
                        <span className="text-neutral-500 font-mono">₹{item.totalAmount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-500">
                      Payment: <strong className="text-black">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          fetchTracking(order.orderId);
                          setActiveTab('tracking');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-kb-blue font-bold hover:bg-blue-100 transition-colors"
                      >
                        🚚 Live Track
                      </button>
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-300 font-semibold hover:border-black transition-colors"
                      >
                        Stage Timeline →
                      </Link>
                      <Link
                        href={`/invoices/${order.orderId}`}
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors"
                      >
                        Bill of Supply 📄
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DEDICATED LIVE PARCEL TRACKING                          */}
      {/* ============================================================== */}
      {activeTab === 'tracking' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl space-y-8">
          <div>
            <h2 className="text-xl font-black text-kb-black">Real-Time Parcel Tracking</h2>
            <p className="text-xs text-neutral-500 mt-1">Track consignments dispatched from Kalwaral village to your delivery doorstep</p>
          </div>

          {/* Search by Order ID */}
          <div className="flex gap-3 max-w-md">
            <input
              type="text"
              value={trackingSearchId}
              onChange={(e) => setTrackingSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-2026-1001)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
            />
            <button
              onClick={() => fetchTracking(trackingSearchId)}
              className="px-5 py-2.5 rounded-xl bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              Track
            </button>
          </div>

          {trackingData ? (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* Consignment Header Card */}
              <div className="bg-neutral-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Shipment Consignment</div>
                  <div className="text-base font-black text-black mt-0.5">Order #{trackingData.orderId}</div>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">AWB Tracking: {trackingData.trackingNumber}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Logistics Partner</div>
                  <div className="text-xs font-bold text-black mt-0.5">{trackingData.courierPartner}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">Destination: {trackingData.destination}</div>
                </div>
              </div>

              {/* Visual 5-Stage Stepper Progression */}
              <div className="py-4">
                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {trackingData.stages?.map((stage: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                          stage.completed
                            ? 'bg-kb-blue text-white shadow-sm ring-4 ring-blue-50'
                            : 'bg-white border-2 border-slate-300 text-neutral-400'
                        }`}
                      >
                        {stage.completed ? '✓' : index + 1}
                      </div>
                      <div className="pt-1">
                        <div className="text-xs font-bold text-black flex items-center gap-2">
                          <span>{stage.label}</span>
                          {stage.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold animate-pulse">
                              LIVE STATUS
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-50 rounded-2xl border border-slate-200">
              Enter an Order ID above to track your consignment in real-time.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SAVED ADDRESSES                                         */}
      {/* ============================================================== */}
      {activeTab === 'addresses' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-kb-black">Saved Delivery Addresses</h2>
              <p className="text-xs text-neutral-500">Manage multiple delivery locations for village home and shop cuts</p>
            </div>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="px-4 py-2 rounded-kb-pill bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              {showAddressForm ? '✕ Cancel' : '+ Add New Address'}
            </button>
          </div>

          {/* New Address Form Modal/Inline */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-white border-2 border-kb-blue/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-black">New Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="Full recipient name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Street Address / House No / Landmark</label>
                  <input
                    type="text"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="House number, landmark, near temple/school..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={addrVillage}
                    onChange={(e) => setAddrVillage(e.target.value)}
                    placeholder="Kalwaral"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Address Tag</label>
                  <select
                    value={addrTag}
                    onChange={(e) => setAddrTag(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Village">Village / Ancestral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addrDefault"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-kb-blue"
                />
                <label htmlFor="addrDefault" className="text-xs text-neutral-700 font-medium">Set as default shipping address</label>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List Saved Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 relative hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-black">{addr.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-kb-blue border border-blue-200">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-neutral-400 hover:text-rose-600"
                    title="Remove address"
                  >
                    🗑
                  </button>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {addr.streetAddress}, {addr.villageOrCity}, {addr.district}, {addr.state} - {addr.pinCode}
                </p>
                <div className="text-[11px] text-neutral-500 font-mono">
                  📞 {addr.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PAYMENT METHODS                                         */}
      {/* ============================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-kb-black">Saved Payment Methods</h2>
              <p className="text-xs text-neutral-500">Secure UPI VPA IDs and tokenized cards for rapid one-click checkout</p>
            </div>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="px-4 py-2 rounded-kb-pill bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
            >
              {showPaymentForm ? '✕ Cancel' : '+ Add Payment Method'}
            </button>
          </div>

          {showPaymentForm && (
            <form onSubmit={handleAddPayment} className="bg-white border-2 border-kb-blue/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-black">Add Payment Preference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Method Type</label>
                  <select
                    value={payType}
                    onChange={(e) => setPayType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="CARD">Debit / Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Friendly Label</label>
                  <input
                    type="text"
                    value={payLabel}
                    onChange={(e) => setPayLabel(e.target.value)}
                    placeholder="e.g. My Primary PhonePe UPI"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {payType === 'UPI' ? 'UPI ID / VPA' : 'Masked Card Number'}
                  </label>
                  <input
                    type="text"
                    value={payIdentifier}
                    onChange={(e) => setPayIdentifier(e.target.value)}
                    placeholder={payType === 'UPI' ? 'yourname@okaxis or 7989768200@ybl' : '•••• •••• •••• 1234'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-1 focus:ring-kb-blue"
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
                >
                  Save Method
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 relative hover:border-black transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-black">{pm.label}</span>
                  <button
                    onClick={() => handleDeletePayment(pm.id)}
                    className="text-xs text-neutral-400 hover:text-rose-600"
                    title="Remove method"
                  >
                    🗑
                  </button>
                </div>
                <div className="text-xs font-mono text-neutral-600">{pm.identifier}</div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  ✓ Verified Secure Payment Option
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: SECURITY & PASSWORD CHANGE                              */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-2xl">
          <div>
            <h2 className="text-xl font-black text-kb-black">Password & Account Security</h2>
            <p className="text-xs text-neutral-500 mt-1">Manage credentials with automated 10-minute freeze protection against brute force</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your existing account password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">New Password (Min 8 Characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-kb-blue"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-kb-pill bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-md"
              >
                {isSaving ? 'Updating...' : 'Update Password →'}
              </button>

              <Link
                href="/auth/forgot-password"
                className="text-xs text-neutral-500 hover:text-black underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 text-xs text-neutral-600 space-y-1">
            <div className="font-bold text-black flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Account Freeze Policy:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              For your financial and personal protection, your account will automatically freeze for 10 minutes if 5 consecutive incorrect passwords or 3 incorrect OTPs are entered.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: SETTINGS & NOTIFICATIONS                                */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 max-w-2xl">
          <div>
            <h2 className="text-xl font-black text-kb-black">Account Preferences & Notifications</h2>
            <p className="text-xs text-neutral-500 mt-1">Configure language and order alert channels</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Preferred Shopping Language</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredLanguage('en')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    preferredLanguage === 'en'
                      ? 'border-kb-blue bg-blue-50 text-kb-blue'
                      : 'border-slate-200 text-neutral-700 hover:border-black'
                  }`}
                >
                  <span>English (Default)</span>
                  <span>{preferredLanguage === 'en' ? '✓' : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredLanguage('te')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between font-telugu ${
                    preferredLanguage === 'te'
                      ? 'border-kb-blue bg-blue-50 text-kb-blue'
                      : 'border-slate-200 text-neutral-700 hover:border-black'
                  }`}
                >
                  <span>తెలుగు (Telugu)</span>
                  <span>{preferredLanguage === 'te' ? '✓' : ''}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-neutral-800">Dispatch & Delivery Notifications</h3>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-black">WhatsApp Order Status Alerts</div>
                  <div className="text-[11px] text-neutral-500">Receive live dispatch AWB and OTP updates on WhatsApp</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="rounded text-kb-blue"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-black">SMS Notifications</div>
                  <div className="text-[11px] text-neutral-500">SMS updates for out-for-delivery & bill of supply receipts</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsUpdates}
                  onChange={(e) => setSmsUpdates(e.target.checked)}
                  className="rounded text-kb-blue"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-6 py-2.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110 shadow-sm"
              >
                Save Preferences
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Sign Out of All Devices →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-3 border-kb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-neutral-600">Loading your customer account...</p>
        </div>
      }
    >
      <AccountManagementContent />
    </Suspense>
  );
}
