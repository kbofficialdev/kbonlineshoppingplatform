"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearClientSession, getStoredToken } from '@/lib/clientAuth';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';

type AccountTab = 'menu' | 'profile' | 'orders' | 'tracking' | 'addresses' | 'payments' | 'security';

function AccountManagementContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab') as AccountTab | null;

  // On mobile, if no explicit tab is in URL, default to 'menu' (the Modern Account card)
  // On desktop, default to 'profile'
  const [activeTab, setActiveTab] = useState<AccountTab>(paramTab || 'menu');
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

  // Password Change Form State
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

  useEffect(() => {
    if (paramTab) {
      setActiveTab(paramTab);
    }
  }, [paramTab]);

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

        // Sync local form state
        setName(data.profile.name || '');
        setPhone(data.profile.phone || '');
        setVillageOrCity(data.profile.villageOrCity || 'Kalwaral');
        setMandalOrArea(data.profile.mandalOrArea || 'Sadasivanagar');
        setDistrict(data.profile.district || 'Kamareddy');
        setState(data.profile.state || 'Telangana');
        setPinCode(data.profile.pinCode || '503145');
        setPreferredLanguage(data.profile.preferredLanguage || 'en');
        setSmsUpdates(data.profile.smsUpdates !== false);
        setWhatsappUpdates(data.profile.whatsappUpdates !== false);
        setBio(data.profile.bio || '');

        if (data.orders?.length > 0 && !trackingData) {
          fetchTracking(data.orders[0].orderId || data.orders[0].id);
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error loading account data.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Avatar Upload Handler
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

        const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
        const res = await fetch('/api/account/avatar', {
          method: 'POST',
          headers,
          body: JSON.stringify({ avatarData: dataUrl }),
        });

        const data = await res.json();
        if (data.success && data.avatar) {
          setProfile((prev: any) => ({ ...prev, avatar: data.avatar }));
          showToast({
            type: 'success',
            title: 'Avatar Updated',
            message: 'Your profile avatar has been saved and updated across the store.',
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

  // Save Profile Handler
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
          smsUpdates,
          whatsappUpdates,
          bio: bio.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, ...data.profile }));
        setStatusMessage({ type: 'success', text: '✓ Profile details saved successfully!' });
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your personal details have been saved.',
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: data.error || 'Could not save profile details.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error saving profile' });
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to store server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter both current and new password' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match' });
      showToast({
        type: 'warning',
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.',
      });
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
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: data.error || 'Incorrect current password or invalid new password.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error updating password' });
    } finally {
      setIsSaving(false);
    }
  };

  // Add Address Handler
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
          isDefault: addrIsDefault,
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
          message: 'New village delivery address registered.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error adding address' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Address Handler
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

  // Add Payment Method Handler
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const res = await fetch('/api/account/payment-methods', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: payType,
          label: payLabel.trim(),
          identifier: payIdentifier.trim(),
          isDefault: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.paymentMethod) {
        setPaymentMethods((prev) => [data.paymentMethod, ...prev]);
        setShowPaymentForm(false);
        setPayLabel('');
        setPayIdentifier('');
        showToast({
          type: 'success',
          title: 'Payment Method Saved',
          message: 'New payment method linked securely.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error saving payment method' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Payment Method Handler
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
        showToast({
          type: 'info',
          title: 'Payment Method Removed',
          message: 'Payment option was deleted.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error deleting payment method' });
    }
  };

  // Fetch Tracking Handler
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
      }
    } catch (e) {}
  };

  // Sign Out Handler
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

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center">
        <SmoothLoader size="md" color="black" label="Loading your customer account..." />
      </div>
    );
  }

  // Modern UI Inspiration Menu Items List
  const MENU_ITEMS = [
    {
      id: 'profile',
      label: 'Your Profile',
      subtitle: `${profile?.villageOrCity || 'Kalwaral'}, ${profile?.district || 'Kamareddy'}`,
      badge: 'Details & Avatar',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      action: () => setActiveTab('profile'),
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      subtitle: `${paymentMethods.length} saved (UPI & Cards)`,
      badge: 'UPI & Cards',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      action: () => setActiveTab('payments'),
    },
    {
      id: 'orders',
      label: 'My Orders',
      subtitle: `${orders.length} orders placed`,
      badge: orders.length > 0 ? `${orders.length}` : undefined,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      action: () => setActiveTab('orders'),
    },
    {
      id: 'tracking',
      label: 'Live Consignment Tracking',
      subtitle: 'Real-time 10 km Local Runner Tracking',
      badge: 'Live',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      action: () => setActiveTab('tracking'),
    },
    {
      id: 'addresses',
      label: 'Delivery Addresses',
      subtitle: `${addresses.length} saved addresses (PIN 503145)`,
      badge: `${addresses.length}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      action: () => setActiveTab('addresses'),
    },
    {
      id: 'security',
      label: 'Account Security & Settings',
      subtitle: 'Password, 5-min OTP protection',
      badge: 'Protected',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      action: () => setActiveTab('security'),
    },
    {
      id: 'support',
      label: 'Contact Us & Support Tickets',
      subtitle: '24-hour SLA guaranteed online care',
      badge: '24h SLA',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
      href: '/support',
    },
    {
      id: 'refunds',
      label: 'Returns & Cancellation Policy',
      subtitle: '7-day handloom return guarantee',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      ),
      href: '/policies/refunds',
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      subtitle: 'Statutory village artisan trade terms',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      href: '/policies/terms',
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      subtitle: '100% data protection & zero resale',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      href: '/policies/privacy',
    },
    {
      id: 'logout',
      label: 'Log Out',
      subtitle: 'Safely end your session',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-rose-600">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
      action: handleSignOut,
      isDanger: true,
    },
  ];

  // Hidden Avatar Input
  const renderAvatarInput = () => (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleAvatarUpload}
      accept="image/*"
      className="hidden"
      id="account-avatar-file-input"
    />
  );

  // Modern UI Inspiration Card Component (Reusable for Mobile Full View and Desktop Sidebar)
  const renderModernAccountMenuCard = () => (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 select-none">
      {/* User Header Row with Signature Double Blue Ring Avatar */}
      <div
        onClick={() => {
          if (activeTab === 'profile') {
            fileInputRef.current?.click();
          } else {
            setActiveTab('profile');
          }
        }}
        className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer mb-2"
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Double-Ring Avatar */}
          <div className="relative group shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-kb-blue p-0.5 bg-black flex items-center justify-center overflow-hidden shadow-sm">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-white font-black text-sm sm:text-base">
                  {profile?.name?.slice(0, 2).toUpperCase() || 'KB'}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold text-white">
              Edit
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight truncate">
              Welcome back
            </h2>
            <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
              {profile?.name || 'Manage your account'}
            </p>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              {profile?.email}
            </p>
          </div>
        </div>

        <span className="text-neutral-400 font-bold text-xl ml-2 shrink-0">›</span>
      </div>

      <div className="border-t border-slate-100 my-2"></div>

      {/* Divided Menu Rows with Clean Stroke Icons and Chevrons */}
      <div className="divide-y divide-slate-100/90 text-sm">
        {MENU_ITEMS.map((item) => {
          const isItemActive = activeTab === item.id;
          const content = (
            <div
              className={`flex items-center justify-between py-3.5 px-3 rounded-2xl transition-all cursor-pointer group ${
                isItemActive
                  ? 'bg-neutral-100 text-black font-black'
                  : item.isDanger
                  ? 'hover:bg-rose-50 text-rose-600'
                  : 'hover:bg-slate-50 text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-6 h-6 flex items-center justify-center shrink-0 ${
                    isItemActive
                      ? 'text-kb-blue'
                      : item.isDanger
                      ? 'text-rose-600'
                      : 'text-neutral-800 group-hover:text-black'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm font-bold ${item.isDanger ? 'text-rose-600' : 'text-neutral-900'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-slate-100 text-neutral-600 border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5 hidden sm:block">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <span className={`text-sm font-bold shrink-0 ml-2 ${isItemActive ? 'text-black' : 'text-neutral-400'}`}>
                ›
              </span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="block">
                {content}
              </Link>
            );
          }

          return (
            <div key={item.id} onClick={item.action}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
      {renderAvatarInput()}

      {/* Top Mobile Header (Matching Inspiration UI: Brand Logo + My Account Title) */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 sm:hidden">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-xl font-black text-black">KB</span>
            <span className="w-2 h-2 rounded-full bg-kb-blue mb-1"></span>
          </Link>
          <span className="text-lg font-black text-black tracking-tight">My Account</span>
        </div>

        {activeTab !== 'menu' && (
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs font-bold text-kb-blue bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1"
          >
            <span>‹ Menu</span>
          </button>
        )}
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

      {/* ========================================================================= */}
      {/* RESPONSIVE LAYOUT                                                         */}
      {/* Mobile: Shows Modern Card Menu when activeTab === 'menu'                 */}
      {/* Desktop: Shows Modern Menu on left + Active Tab Workspace on right        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Modern Account Menu Card */}
        <div className={`md:col-span-5 lg:col-span-4 ${activeTab !== 'menu' ? 'hidden md:block' : 'block'}`}>
          {renderModernAccountMenuCard()}
        </div>

        {/* RIGHT COLUMN: Interactive Workspaces (Profile, Orders, Addresses, etc.) */}
        <div className={`md:col-span-7 lg:col-span-8 ${activeTab === 'menu' ? 'hidden md:block' : 'block'}`}>
          {/* Mobile Back Button when inside a workspace */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setActiveTab('menu')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs hover:bg-neutral-50"
            >
              <span>‹ Back to Account Menu</span>
            </button>
          </div>

          {/* TAB 1: YOUR PROFILE & PERSONAL DETAILS */}
          {(activeTab === 'profile' || activeTab === 'menu') && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-black">Your Profile &amp; Village Landmark</h3>
                  <p className="text-xs text-neutral-500">Ancestral customer profile under PIN 503145</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-slate-100 hover:bg-slate-200 text-black transition-colors"
                >
                  📷 Change Avatar
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Full Legal / Display Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Mobile Contact Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Village / City *</label>
                    <input
                      type="text"
                      value={villageOrCity}
                      onChange={(e) => setVillageOrCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Mandal / Area</label>
                    <input
                      type="text"
                      value={mandalOrArea}
                      onChange={(e) => setMandalOrArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">District *</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-100 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e: any) => setPreferredLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
                    >
                      <option value="en">English (Official)</option>
                      <option value="te">తెలుగు (Telugu Regional)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Patron Notes &amp; Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Regular patron of pure Gadwal handlooms and Raymond custom cuts."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-black">My Order Consignments ({orders.length})</h3>
                  <p className="text-xs text-neutral-500">Official Bills of Supply under Section 23 CGST exemption</p>
                </div>
                <Link
                  href="/search?category=All"
                  className="px-4 py-1.5 rounded-full bg-kb-blue text-white text-xs font-bold hover:brightness-110"
                >
                  + New Order
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 space-y-2">
                  <span className="text-3xl">📦</span>
                  <p className="text-xs font-bold">No orders placed yet.</p>
                  <Link href="/search?category=All" className="text-xs text-kb-blue hover:underline font-semibold block">
                    Explore Kalwaral Handloom Catalog →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 hover:border-black transition-colors space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div>
                          <span className="font-mono font-bold text-black mr-2">#{ord.orderId || ord.id}</span>
                          <span className="text-neutral-400">• {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status || 'PROCESSING'}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-600 space-y-1">
                        <div>Patron: <strong>{ord.customerName}</strong> ({ord.customerPhone})</div>
                        <div>Delivery: {ord.streetAddress}, {ord.villageOrCity} ({ord.pincode})</div>
                        <div className="text-sm font-bold text-black pt-1">Total Paid: ₹{ord.total} (GST Exempt)</div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                        <Link
                          href={`/invoices/${ord.orderId || ord.id}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700"
                        >
                          📜 View Bill of Supply
                        </Link>
                        <button
                          onClick={() => {
                            setActiveTab('tracking');
                            fetchTracking(ord.orderId || ord.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-neutral-800"
                        >
                          🚚 Live Tracking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE TRACKING */}
          {activeTab === 'tracking' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-black">Live Consignment Tracking</h3>
                <p className="text-xs text-neutral-500">From Kalwaral handloom center to your doorstep</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. ORD-2026-1001)"
                  value={trackingSearchId}
                  onChange={(e) => setTrackingSearchId(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={() => fetchTracking(trackingSearchId)}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
                >
                  Track
                </button>
              </div>

              {trackingData ? (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-black">Status: {trackingData.currentStatus}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        {trackingData.estimatedDelivery}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">Carrier: {trackingData.carrier} (Tracking: {trackingData.trackingCode})</p>
                  </div>

                  <div className="space-y-3 pl-2">
                    {trackingData.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div>
                          <div className={`font-bold ${step.completed ? 'text-black' : 'text-neutral-400'}`}>{step.title}</div>
                          <div className="text-[11px] text-neutral-500">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 text-center py-6">Enter an Order ID to view real-time stage progression.</p>
              )}
            </div>
          )}

          {/* TAB 4: DELIVERY ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-black">Delivery Addresses ({addresses.length})</h3>
                  <p className="text-xs text-neutral-500">10 km local village radius under PIN 503145</p>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800"
                >
                  {showAddressForm ? '✕ Close' : '+ Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-black">Register New Delivery Address</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Phone"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street / House Number / Landmark"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Village / Town"
                      value={addrVillage}
                      onChange={(e) => setAddrVillage(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="District"
                      value={addrDistrict}
                      onChange={(e) => setAddrDistrict(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={addrPin}
                      onChange={(e) => setAddrPin(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="px-5 py-2 rounded-full bg-black text-white font-bold">
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-black">{addr.name}</span>
                      <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-full">{addr.tag}</span>
                    </div>
                    <p className="text-xs text-neutral-600">{addr.streetAddress}, {addr.villageOrCity}, {addr.district} - {addr.pinCode}</p>
                    <p className="text-xs text-neutral-500">📞 {addr.phone}</p>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[11px] text-rose-600 font-bold hover:underline pt-1 block"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-black">Payment Methods ({paymentMethods.length})</h3>
                  <p className="text-xs text-neutral-500">Verified UPI handles, RuPay, and village COD preferences</p>
                </div>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800"
                >
                  {showPaymentForm ? '✕ Close' : '+ Add Method'}
                </button>
              </div>

              {showPaymentForm && (
                <form onSubmit={handleAddPayment} className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-black">Link New Payment Option</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={payType}
                      onChange={(e: any) => setPayType(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold"
                    >
                      <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                      <option value="CARD">Debit / Credit Card</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Label (e.g. My GPay or SBI Card)"
                      value={payLabel}
                      onChange={(e) => setPayLabel(e.target.value)}
                      required
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder={payType === 'UPI' ? 'UPI ID (e.g. name@okhdfcbank)' : 'Card Number (•••• •••• •••• 1234)'}
                    value={payIdentifier}
                    onChange={(e) => setPayIdentifier(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="px-5 py-2 rounded-full bg-black text-white font-bold">
                      Save Method
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="p-4 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-black">{pm.label}</span>
                      <span className="text-[10px] bg-blue-50 text-kb-blue font-bold px-2 py-0.5 rounded-full">{pm.type}</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono">{pm.identifier}</p>
                    <button
                      onClick={() => handleDeletePayment(pm.id)}
                      className="text-[11px] text-rose-600 font-bold hover:underline pt-2 block"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACCOUNT SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-black">Account Security &amp; Password</h3>
                <p className="text-xs text-neutral-500">Secured with 5-minute OTP and bcrypt cryptographic hashing</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-full bg-black text-white font-bold hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-200 text-xs text-neutral-600 space-y-1">
                <div className="font-bold text-black">🛡️ Multi-Factor Protection Status</div>
                <p>• Account locks automatically after 5 consecutive failed attempts for 10 minutes.</p>
                <p>• Orders require 6-digit OTP verification valid for strictly 5 minutes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-28 text-center">
          <SmoothLoader size="md" color="black" label="Loading account..." />
        </div>
      }
    >
      <AccountManagementContent />
    </Suspense>
  );
}
