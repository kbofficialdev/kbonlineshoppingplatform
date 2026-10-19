"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModalAlert } from '@/components/ModalContext';
import { useToast } from '@/components/ToastContext';
import { useLoadingOverlay } from '@/components/LoadingOverlayContext';
import { SmoothLoader, SmoothLoadingOverlay } from '@/components/SmoothLoader';
import { authFetch } from '@/lib/clientAuth';

const LOCAL_VILLAGES_503145 = [
  { name: 'Kalwaral', distance: '0 km (Store Hub)' },
  { name: 'Sadasivanagar', distance: '4 km' },
  { name: 'Padmavajiwadi', distance: '3.5 km' },
  { name: 'Dharmaraopet', distance: '5 km' },
  { name: 'Modegaon', distance: '6 km' },
  { name: 'Utnoor', distance: '7 km' },
  { name: 'Kuprial', distance: '7.5 km' },
  { name: 'Thippapur', distance: '8 km' },
  { name: 'Markovillage', distance: '8.5 km' },
  { name: 'Tukaramthanda', distance: '8.5 km' },
  { name: 'Jukkalwadi', distance: '9.2 km' },
  { name: 'Adloor', distance: '9.6 km' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { showModal } = useModalAlert();
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoadingOverlay();

  // 3-Step Checkout Flow
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cart, setCart] = useState<any>({ items: [], subtotal: 0, total: 0, shippingFee: 0, discountAmount: 0 });
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Customer Delivery Address
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('42, Main Street, Village Center');
  const [villageOrCity, setVillageOrCity] = useState<string>('Kalwaral');
  const [mandalOrArea, setMandalOrArea] = useState<string>('Sadasivanagar');
  const [district, setDistrict] = useState<string>('Kamareddy');
  const [state, setState] = useState<string>('Telangana');
  const [pinCode, setPinCode] = useState<string>('503145');

  // Step 2: Delivery Method Selection
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');

  // Step 3: Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'CASHFREE' | 'COD' | 'UPI'>('CASHFREE');
  const [isPaymentsEnabled, setIsPaymentsEnabled] = useState<boolean>(true);
  const [isCodEnabled, setIsCodEnabled] = useState<boolean>(true);
  const [paymentsNotice, setPaymentsNotice] = useState<string>('');

  // Statutory Consents
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [agreeReturn, setAgreeReturn] = useState<boolean>(true);
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(true);

  // OTP Confirmation
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [orderOtp, setOrderOtp] = useState<string>('');
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  const selectLocalVillage = (vName: string) => {
    setVillageOrCity(vName);
    setMandalOrArea('Sadasivanagar');
    setDistrict('Kamareddy');
    setState('Telangana');
    setPinCode('503145');
    showToast({
      type: 'info',
      title: 'Local Village Selected',
      message: `${vName} selected within certified 10 km hub radius.`,
    });
  };

  useEffect(() => {
    fetchCartAndUser();
  }, []);

  const fetchCartAndUser = async () => {
    try {
      setIsLoading(true);
      const cartRes = await authFetch('/api/cart');
      const cartData = await cartRes.json();
      setCart(cartData);

      const userRes = await authFetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated && userData.user) {
        setUser(userData.user);
        setName(userData.user.name || '');
        setEmail(userData.user.email || '');
        setPhone(userData.user.phone?.replace('+91', '') || '');
      } else {
        showModal({
          type: 'auth',
          title: 'Sign In Required for Checkout',
          message: 'You must have an active KB Fashions account session to enter delivery details and place an order.',
          primaryBtn: {
            text: 'Sign In to Proceed →',
            href: '/auth/signin?redirect=%2Fcheckout&reason=auth_required',
          },
          secondaryBtn: {
            text: 'Create New Account',
            href: '/auth/signup?redirect=%2Fcheckout',
          },
        });
      }

      try {
        const sRes = await fetch('/api/store/settings');
        if (sRes.ok) {
          const sData = await sRes.json();
          const settings = sData.storeSettings || sData.settings;
          if (settings) {
            const payOk = settings.isPaymentsEnabled !== false;
            const codOk = settings.isCodEnabled !== false;
            setIsPaymentsEnabled(payOk);
            setIsCodEnabled(codOk);
            setPaymentsNotice(settings.paymentsDisabledNotice || '');
            if (!payOk && codOk) {
              setPaymentMethod('COD');
            } else if (!codOk && payOk) {
              setPaymentMethod('CASHFREE');
            }
          }
        }
      } catch (err) {}
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = async (pin: string) => {
    setPinCode(pin);
    if (pin.length === 6) {
      try {
        const res = await fetch(`/api/orders/lookup-pin/${pin}`);
        const data = await res.json();
        if (data.success) {
          setVillageOrCity(data.city);
          setDistrict(data.city);
          setState(data.state);
        }
      } catch (e) {}
    }
  };

  const validateStep1 = () => {
    if (!name.trim() || name.length < 2) {
      showModal({
        type: 'warning',
        title: 'Full Name Required',
        message: 'Please enter recipient name (at least 2 characters) for the delivery consignment.',
      });
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim().replace(/^\+91/, ''))) {
      showModal({
        type: 'warning',
        title: 'Valid Phone Required',
        message: 'Please provide a valid 10-digit mobile number for courier tracking notifications.',
      });
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      showModal({
        type: 'warning',
        title: 'Email Address Required',
        message: 'Please enter a valid email address for statutory Bill of Supply delivery.',
      });
      return false;
    }
    if (!streetAddress.trim() || streetAddress.length < 5) {
      showModal({
        type: 'warning',
        title: 'Delivery Address Required',
        message: 'Please enter complete house/street address for accurate doorstep delivery.',
      });
      return false;
    }
    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode.trim())) {
      showModal({
        type: 'warning',
        title: 'Valid PIN Code Required',
        message: 'Please enter a valid 6-digit postal PIN code for delivery routing.',
      });
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const deliveryCost = deliveryMethod === 'EXPRESS' ? 99 : 0;
  const calculatedTotal = Math.max(0, (cart.subtotal || 0) - (cart.discountAmount || 0) + deliveryCost);

  const handleProceedToDelivery = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToPayment = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiateOrderOtp = async () => {
    if (!agreeTerms || !agreeReturn || !agreePrivacy) {
      showToast({
        type: 'warning',
        title: 'Policy Consent Required',
        message: 'Please review and accept store policies before placing an order.',
      });
      return;
    }

    setShowOtpModal(true);
    setIsSendingOtp(true);
    setOtpSentMessage(null);

    try {
      const res = await authFetch('/api/orders/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          amount: calculatedTotal,
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage(`✓ 6-digit authorization code dispatched to ${email.trim()}`);
        showToast({
          type: 'info',
          title: 'Order OTP Dispatched',
          message: `6-digit authorization code dispatched to ${email.trim()}`,
        });
      } else {
        setOtpSentMessage(data.error || 'Failed to dispatch OTP');
      }
    } catch (e: any) {
      setOtpSentMessage('Error communicating with server');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCashfreeCheckout = async () => {
    if (!agreeTerms || !agreeReturn || !agreePrivacy) {
      showToast({
        type: 'warning',
        title: 'Consent Required',
        message: 'Please review and accept our store policies before proceeding to payment.',
      });
      return;
    }

    if (!user) {
      showModal({
        type: 'auth',
        title: 'Sign In Required for Payment',
        message: 'Please sign in to your customer account to initiate payment.',
        primaryBtn: {
          text: 'Sign In to Proceed →',
          href: '/auth/signin?redirect=%2Fcheckout&reason=auth_required',
        },
      });
      return;
    }

    setIsSubmitting(true);
    showLoader('Connecting to Cashfree Secure Checkout Gateway...');
    try {
      const effectiveSessionId = user?.id || 'default-guest';
      const res = await authFetch('/api/payments/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            phone: phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim()}`,
            email: email.trim(),
            streetAddress: streetAddress.trim(),
            villageOrCity: villageOrCity.trim(),
            mandalOrArea: mandalOrArea?.trim() || null,
            district: district.trim(),
            state: state.trim(),
            pinCode: pinCode.trim(),
          },
          sessionId: effectiveSessionId,
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsSubmitting(false);
        hideLoader();
        showToast({
          type: 'error',
          title: 'Cashfree Error',
          message: data.error || 'Failed to initialize Cashfree payment session',
        });
        return;
      }

      showToast({
        type: 'info',
        title: 'Opening Cashfree',
        message: 'Redirecting to Cashfree Payments Hosted Checkout (Sandbox)...',
      });

      if (typeof window !== 'undefined' && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self"
        });
      } else {
        window.location.href = data.return_url;
      }
    } catch (err: any) {
      setIsSubmitting(false);
      hideLoader();
      showToast({
        type: 'error',
        title: 'Gateway Error',
        message: err.message || 'Error communicating with Cashfree',
      });
    }
  };

  const handlePlaceOrder = async (codeOverride?: string) => {
    const finalOtp = codeOverride || orderOtp;
    if (!finalOtp || finalOtp.trim().length !== 6) {
      showToast({
        type: 'warning',
        title: 'Enter Verification Code',
        message: 'Please enter the 6-digit OTP code sent to your email.',
      });
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    showLoader('Confirming order with Kalwaral Store Hub & locking consignment...');
    try {
      const effectiveSessionId = user?.id || 'default-guest';
      const res = await authFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: name.trim(),
            phone: phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim()}`,
            email: email.trim(),
            streetAddress: streetAddress.trim(),
            villageOrCity: villageOrCity.trim(),
            mandalOrArea: mandalOrArea?.trim() || null,
            district: district.trim(),
            state: state.trim(),
            pinCode: pinCode.trim(),
          },
          paymentMethod: paymentMethod === 'CASHFREE' ? 'COD' : paymentMethod,
          sessionId: effectiveSessionId,
          otp: finalOtp.trim(),
          termsAccepted: true,
        })
      });

      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        setIsSubmitting(false);
        hideLoader();
        showModal({
          type: 'auth',
          title: 'Authentication Session Expired',
          message: 'Your account session has expired. Please sign in again to place your order.',
          primaryBtn: {
            text: 'Sign In to Proceed →',
            href: '/auth/signin?redirect=%2Fcheckout&reason=auth_required',
          },
        });
        return;
      }

      if (data.success && data.order) {
        setIsSubmitting(false);
        hideLoader();
        showToast({
          type: 'success',
          title: 'Order Confirmed!',
          message: `✓ Order #${data.order.orderId} registered. Dispatched from Kalwaral store.`,
        });
        showModal({
          type: 'success',
          title: 'Order Placed Successfully!',
          message: `✓ Order #${data.order.orderId} has been confirmed with our Kalwaral store! Track consignment progress stage by stage.`,
          primaryBtn: {
            text: 'Track Order Progress →',
            href: `/orders/${data.order.orderId}`,
          },
          secondaryBtn: {
            text: 'View Bill of Supply',
            href: `/invoices/${data.order.orderId}`,
          },
        });
      } else {
        setIsSubmitting(false);
        hideLoader();
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
        showToast({
          type: 'error',
          title: 'Order Not Placed',
          message: data.error || 'Could not place order. Please review your details.',
        });
      }
    } catch (e: any) {
      setIsSubmitting(false);
      hideLoader();
      setErrorMsg(e.message || 'Error communicating with server');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center">
        <SmoothLoader size="md" color="black" label="Preparing secure checkout session..." />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-warmGray mx-auto flex items-center justify-center text-2xl">
          🛍️
        </div>
        <h1 className="text-2xl font-bold text-obsidian">Your shopping bag is empty</h1>
        <p className="text-sm text-secondaryText max-w-sm mx-auto">
          Add authentic village handlooms, unstitched suitings, or Gadwal sarees to your bag before checking out.
        </p>
        <div>
          <Link href="/search?category=All" className="inline-block bg-obsidian text-white text-xs font-bold px-7 py-3 rounded-full hover:bg-neutral-800 transition-colors shadow-sm">
            Browse Handloom Collections →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12">
      {/* Cashfree Hosted Checkout Web SDK */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

      {/* 3-Step Progress Stepper Header */}
      <div className="bg-white rounded-2xl border border-neutralBorder p-4 sm:p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-warmGray text-obsidian border border-neutralBorder mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Kalwaral Hub 10-km Radius • PIN 503145</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-obsidian tracking-tight">Checkout</h1>
          </div>

          {/* Stepper (1 Address -> 2 Delivery -> 3 Payment) */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
            {/* Step 1 */}
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                step === 1
                  ? 'bg-electricBlue text-white shadow-xs font-bold'
                  : step > 1
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'bg-warmGray text-secondaryText'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 1 ? 'bg-emerald-600 text-white' : 'bg-white/25 text-inherit'
              }`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span>Address</span>
            </button>

            <span className="text-neutral-300">——</span>

            {/* Step 2 */}
            <button
              onClick={() => validateStep1() && setStep(2)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                step === 2
                  ? 'bg-electricBlue text-white shadow-xs font-bold'
                  : step > 2
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                  : 'bg-warmGray text-secondaryText'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 2 ? 'bg-emerald-600 text-white' : 'bg-white/25 text-inherit'
              }`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span>Delivery</span>
            </button>

            <span className="text-neutral-300">——</span>

            {/* Step 3 */}
            <button
              onClick={() => validateStep1() && setStep(3)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                step === 3
                  ? 'bg-electricBlue text-white shadow-xs font-bold'
                  : 'bg-warmGray text-secondaryText'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              <span>Payment</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-xl font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Current Step Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="bg-white border border-neutralBorder p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">
                    1. Shipping &amp; Delivery Address
                  </h2>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Enter recipient and village coordinates for local runner delivery
                  </p>
                </div>
                <span className="text-[11px] font-bold text-neutral-700 bg-warmGray px-3 py-1 rounded-full border border-neutralBorder">
                  📍 10 km Hub
                </span>
              </div>

              {/* Local Village Quick Selector */}
              <div className="bg-warmGray/70 border border-neutralBorder rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-obsidian">
                    Local Villages Covered within 10 km (PIN 503145)
                  </span>
                  <span className="text-[10px] font-bold bg-white text-neutral-800 border border-neutralBorder px-2.5 py-0.5 rounded-full">
                    Direct Store Runner
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LOCAL_VILLAGES_503145.map((v) => {
                    const isSelected = villageOrCity.toLowerCase() === v.name.toLowerCase() && pinCode === '503145';
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => selectLocalVillage(v.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-obsidian text-white shadow-xs'
                            : 'bg-white border border-neutralBorder text-neutral-700 hover:border-obsidian'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="text-[10px] opacity-60 font-normal">({v.distance})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-obsidian block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-obsidian block mb-1">Mobile Phone (10 Digits) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue font-mono text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-obsidian block mb-1">Email Address (for Bill of Supply &amp; Notifications) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-obsidian block mb-1">House No. / Street Address / Landmark *</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House 42, Temple Street, Kalwaral"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-obsidian block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="503145"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue font-mono font-bold text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-obsidian block mb-1">Village / City *</label>
                  <input
                    type="text"
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    placeholder="Kalwaral"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-obsidian block mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kamareddy"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-obsidian block mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Telangana"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutralBorder bg-white focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue text-xs sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutralBorder flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToDelivery}
                  className="bg-electricBlue text-white hover:bg-blue-600 text-xs sm:text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Continue to Delivery Method</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div className="bg-white border border-neutralBorder p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">
                    2. Select Delivery Method
                  </h2>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Choose delivery speed for dispatch from Kalwaral Store Hub
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-electricBlue hover:underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Delivery Address Pill */}
              <div className="bg-warmGray p-3.5 rounded-xl border border-neutralBorder text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-obsidian block">{name} • {phone}</span>
                  <span className="text-secondaryText text-[11px]">{streetAddress}, {villageOrCity}, {district} - {pinCode}</span>
                </div>
                <button onClick={() => setStep(1)} className="text-[11px] font-bold text-electricBlue hover:underline">
                  Change
                </button>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <label className={`block border p-4 sm:p-5 rounded-xl cursor-pointer transition-all ${
                  deliveryMethod === 'STANDARD'
                    ? 'border-electricBlue bg-blue-50/20 shadow-xs'
                    : 'border-neutralBorder hover:border-neutral-400 bg-white'
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'STANDARD'}
                        onChange={() => setDeliveryMethod('STANDARD')}
                        className="accent-electricBlue w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-obsidian flex items-center gap-2">
                          <span>Standard Store Runner Delivery</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            FREE
                          </span>
                        </div>
                        <div className="text-[11px] text-secondaryText mt-0.5">
                          Direct doorstep delivery within 3-5 business days from Kalwaral hub.
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-emerald-700">
                      FREE
                    </div>
                  </div>
                </label>

                <label className={`block border p-4 sm:p-5 rounded-xl cursor-pointer transition-all ${
                  deliveryMethod === 'EXPRESS'
                    ? 'border-electricBlue bg-blue-50/20 shadow-xs'
                    : 'border-neutralBorder hover:border-neutral-400 bg-white'
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'EXPRESS'}
                        onChange={() => setDeliveryMethod('EXPRESS')}
                        className="accent-electricBlue w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-obsidian flex items-center gap-2">
                          <span>Express Priority Delivery</span>
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                            1-2 Days
                          </span>
                        </div>
                        <div className="text-[11px] text-secondaryText mt-0.5">
                          Priority expedited runner dispatch with real-time SMS status updates.
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-obsidian">
                      ₹99
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutralBorder flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-secondaryText hover:text-obsidian"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-electricBlue text-white hover:bg-blue-600 text-xs sm:text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Continue to Payment Selection</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="bg-white border border-neutralBorder p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-neutralBorder pb-4">
                <div>
                  <h2 className="text-base font-bold text-obsidian">
                    3. Payment &amp; Confirmation
                  </h2>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Select payment option and verify statutory consents
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-electricBlue hover:underline"
                >
                  ← Change Delivery
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {/* Cashfree Online */}
                <label className={`block border p-4 sm:p-5 rounded-xl transition-all ${
                  !isPaymentsEnabled
                    ? 'border-neutral-200 bg-neutral-100/60 opacity-60 cursor-not-allowed'
                    : paymentMethod === 'CASHFREE'
                    ? 'border-electricBlue bg-blue-50/20 shadow-xs cursor-pointer'
                    : 'border-neutralBorder hover:border-neutral-400 bg-white cursor-pointer'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      disabled={!isPaymentsEnabled}
                      checked={paymentMethod === 'CASHFREE'}
                      onChange={() => isPaymentsEnabled && setPaymentMethod('CASHFREE')}
                      className="mt-1 sm:mt-0 accent-electricBlue w-4 h-4 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-obsidian flex items-center gap-2 flex-wrap">
                        <span>Cashfree Secure Payments</span>
                        {isPaymentsEnabled ? (
                          <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Instant Confirmation
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                            Temporarily Paused
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-secondaryText mt-1">
                        Pay with UPI (GPay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking, and Wallets via Cashfree API.
                      </div>
                      {!isPaymentsEnabled && (
                        <div className="text-[11px] text-rose-700 font-semibold mt-1.5">
                          ⚠️ {paymentsNotice || 'Online payments are currently undergoing maintenance.'}
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`block border p-4 sm:p-5 rounded-xl transition-all ${
                  !isCodEnabled
                    ? 'border-neutral-200 bg-neutral-100/60 opacity-60 cursor-not-allowed'
                    : paymentMethod === 'COD'
                    ? 'border-electricBlue bg-blue-50/20 shadow-xs cursor-pointer'
                    : 'border-neutralBorder hover:border-neutral-400 bg-white cursor-pointer'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      disabled={!isCodEnabled}
                      checked={paymentMethod === 'COD'}
                      onChange={() => isCodEnabled && setPaymentMethod('COD')}
                      className="mt-1 sm:mt-0 accent-electricBlue w-4 h-4 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-obsidian flex items-center gap-2">
                        <span>Cash on Delivery (COD) / Store Runner Handover</span>
                        {!isCodEnabled && (
                          <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-secondaryText mt-1">
                        Pay cash directly to the Kalwaral store runner upon physical delivery. Requires 6-digit confirmation OTP.
                      </div>
                      {!isCodEnabled && (
                        <div className="text-[11px] text-rose-700 font-semibold mt-1.5">
                          ⚠️ Cash on Delivery is currently disabled. Please select online payment.
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Instant UPI */}
                <label className={`block border p-4 sm:p-5 rounded-xl transition-all ${
                  !isPaymentsEnabled
                    ? 'border-neutral-200 bg-neutral-100/60 opacity-60 cursor-not-allowed'
                    : paymentMethod === 'UPI'
                    ? 'border-electricBlue bg-blue-50/20 shadow-xs cursor-pointer'
                    : 'border-neutralBorder hover:border-neutral-400 bg-white cursor-pointer'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      disabled={!isPaymentsEnabled}
                      checked={paymentMethod === 'UPI'}
                      onChange={() => isPaymentsEnabled && setPaymentMethod('UPI')}
                      className="mt-1 sm:mt-0 accent-electricBlue w-4 h-4 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-obsidian flex items-center gap-2">
                        <span>Direct UPI Verification</span>
                        {!isPaymentsEnabled && (
                          <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                            Temporarily Paused
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-secondaryText mt-1">
                        Direct merchant UPI transfer with 5-minute confirmation authorization.
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Statutory Consents */}
              <div className="bg-warmGray p-4 sm:p-5 rounded-xl border border-neutralBorder space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-obsidian block">
                  Mandatory Store Consents
                </span>

                <div className="space-y-2 text-xs text-neutral-700">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-electricBlue focus:ring-electricBlue accent-electricBlue shrink-0"
                    />
                    <span className="leading-snug">
                      I have read and accept the <Link href="/policies/terms" target="_blank" className="font-bold underline text-obsidian">Terms &amp; Conditions</Link> and agree to 10-km radius village delivery parameters.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeReturn}
                      onChange={(e) => setAgreeReturn(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-electricBlue focus:ring-electricBlue accent-electricBlue shrink-0"
                    />
                    <span className="leading-snug">
                      I accept the <Link href="/policies/refunds" target="_blank" className="font-bold underline text-obsidian">Refund &amp; Return Policy</Link> (7-day window for packaged handlooms).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-electricBlue focus:ring-electricBlue accent-electricBlue shrink-0"
                    />
                    <span className="leading-snug">
                      I consent to the <Link href="/policies/privacy" target="_blank" className="font-bold underline text-obsidian">Privacy Policy</Link> and Section 23 CGST Tax Exemption Notice.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutralBorder flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-secondaryText hover:text-obsidian"
                >
                  ← Back to Delivery
                </button>

                {paymentMethod === 'CASHFREE' ? (
                  <button
                    type="button"
                    id="cashfree-pay-now-btn"
                    onClick={handleCashfreeCheckout}
                    disabled={isSubmitting || !agreeTerms || !agreeReturn || !agreePrivacy}
                    className="bg-electricBlue text-white hover:bg-blue-600 text-xs sm:text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SmoothLoader size="xs" color="white" />
                        <span>Connecting to Cashfree...</span>
                      </>
                    ) : (
                      <span>Pay ₹{calculatedTotal} with Cashfree →</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    id="confirm-place-order-btn"
                    onClick={handleInitiateOrderOtp}
                    disabled={isSubmitting || !agreeTerms || !agreeReturn || !agreePrivacy}
                    className="bg-obsidian text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SmoothLoader size="xs" color="white" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <span>Verify OTP &amp; Place Order (₹{calculatedTotal}) →</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-neutralBorder rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutralBorder pb-3">
              <h3 className="font-bold text-xs text-obsidian uppercase tracking-wider">
                Order Summary ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
              </h3>
              <Link href="/cart" className="text-xs text-electricBlue hover:underline font-semibold">
                Edit Bag
              </Link>
            </div>

            {/* Line items preview */}
            <div className="divide-y divide-neutralBorder text-xs max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex justify-between items-center gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-warmGray overflow-hidden relative shrink-0 border border-neutralBorder">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized={item.image.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🧵</div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-obsidian truncate">{item.name}</div>
                      <div className="text-[11px] text-secondaryText">
                        Qty: {item.qty} {item.size ? `• Size: ${item.size}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-obsidian shrink-0">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="border-t border-neutralBorder pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-secondaryText">
                <span>Subtotal:</span>
                <span className="font-medium text-obsidian">₹{cart.subtotal}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Savings:</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-secondaryText items-center">
                <span>Delivery:</span>
                <span className="font-bold text-obsidian">
                  {deliveryCost === 0 ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      FREE
                    </span>
                  ) : (
                    `₹${deliveryCost}`
                  )}
                </span>
              </div>

              <div className="border-t border-neutralBorder pt-3 flex justify-between items-baseline font-bold text-obsidian">
                <span className="text-sm">Total Payable:</span>
                <span className="text-xl text-obsidian">₹{calculatedTotal}</span>
              </div>
            </div>

            {/* Provenance Badge */}
            <div className="bg-warmGray p-3 rounded-xl text-[11px] text-secondaryText border border-neutralBorder space-y-1">
              <div className="font-bold text-obsidian flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Authentic Handloom Guaranteed</span>
              </div>
              <p className="text-[10px] leading-relaxed">
                Dispatched directly from <strong>KB FASHIONS</strong>, Kalwaral Village, Kamareddy, Telangana (503145) with official Bill of Supply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Order Confirmation OTP Popup */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-neutralBorder shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-secondaryText hover:text-obsidian font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-warmGray text-obsidian border border-neutralBorder rounded-full flex items-center justify-center mx-auto text-xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-obsidian">Authorize Order Placement</h3>
              <p className="text-xs text-secondaryText">
                Please enter the 6-digit confirmation code sent to <strong className="text-obsidian">{email}</strong> to confirm your order of <strong>₹{calculatedTotal}</strong>.
              </p>
              {otpSentMessage && (
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200">
                  {otpSentMessage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 text-center">
                  6-Digit Order Confirmation Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={orderOtp}
                  onChange={(e) => setOrderOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono font-bold tracking-widest py-2.5 px-4 rounded-xl border border-neutralBorder focus:border-electricBlue focus:outline-none focus:ring-1 focus:ring-electricBlue"
                />
                <p className="text-[10px] text-center text-neutral-400 mt-1">
                  Valid for 5 minutes. Check spam folder if not received in 30 seconds.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInitiateOrderOtp()}
                  disabled={isSendingOtp}
                  className="w-1/3 py-2.5 text-xs font-bold text-neutral-700 hover:text-obsidian border border-neutralBorder rounded-xl disabled:opacity-50"
                >
                  {isSendingOtp ? 'Sending...' : 'Resend'}
                </button>

                <button
                  type="button"
                  onClick={() => handlePlaceOrder()}
                  disabled={isSubmitting || orderOtp.length !== 6}
                  className="w-2/3 py-2.5 text-xs font-bold bg-electricBlue text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <SmoothLoader size="xs" color="white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Confirm Order →</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <SmoothLoadingOverlay
          message="Confirming Order with Kalwaral Store..."
          submessage="Validating local 10 km delivery coverage and generating Bill of Supply..."
        />
      )}
    </div>
  );
}
