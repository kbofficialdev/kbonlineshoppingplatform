"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
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
  const [step, setStep] = useState<number>(1);
  const [cart, setCart] = useState<any>({ items: [], subtotal: 0, total: 0, shippingFee: 0, discountAmount: 0 });
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer Delivery State
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('42, Main Street, Village Center');
  const [villageOrCity, setVillageOrCity] = useState<string>('Kalwaral');
  const [mandalOrArea, setMandalOrArea] = useState<string>('Sadasivanagar');
  const [district, setDistrict] = useState<string>('Kamareddy');
  const [state, setState] = useState<string>('Telangana');
  const [pinCode, setPinCode] = useState<string>('503145');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'CASHFREE' | 'COD' | 'UPI' | 'CARD'>('CASHFREE');

  // Statutory Policies & Terms Consent
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [agreeReturn, setAgreeReturn] = useState<boolean>(true);
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(true);

  // Checkout Confirmation OTP State
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
      message: `${vName} selected within 10 km delivery radius of 503145.`,
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

      // Verify user authentication
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

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInitiateOrderOtp = async () => {
    if (!agreeTerms || !agreeReturn || !agreePrivacy) {
      showToast({
        type: 'warning',
        title: 'Policy Consent Required',
        message: 'Please review and accept the statutory terms, return policy, and privacy policy before placing order.',
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
          amount: cart.total,
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage(`✓ Authorization code dispatched to ${email.trim()}`);
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

      // Use Cashfree.js with mode: "sandbox" to open checkout
      if (typeof window !== 'undefined' && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self"
        });
      } else {
        // Fallback directly to return URL if SDK not loaded or in mock environment
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
          paymentMethod,
          sessionId: effectiveSessionId,
          otp: finalOtp.trim(),
          termsAccepted: true,
        })
      });

      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        setIsSubmitting(false);
        hideLoader();
        showToast({
          type: 'warning',
          title: 'Sign In Required',
          message: 'Please sign in with your customer account to place your order.',
        });
        showModal({
          type: 'auth',
          title: 'Authentication Session Expired',
          message: 'Your account session has expired. Please sign in again to place your order.',
          primaryBtn: {
            text: 'Sign In to Proceed →',
            href: '/auth/signin?redirect=%2Fcheckout&reason=auth_required',
          },
          secondaryBtn: {
            text: 'Create New Account',
            href: '/auth/signup?redirect=%2Fcheckout',
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
        showModal({
          type: 'error',
          title: 'Unable to Place Order',
          message: data.error || 'Failed to register your order. Please review your details and try again.',
        });
      }
    } catch (e: any) {
      setIsSubmitting(false);
      hideLoader();
      setErrorMsg(e.message || 'Error communicating with server');
      showToast({
        type: 'error',
        title: 'Server Error',
        message: 'Could not connect to store server. Please try again.',
      });
      showModal({
        type: 'error',
        title: 'Communication Error',
        message: 'Could not communicate with the store servers. Please check your network connection.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center">
        <SmoothLoader size="md" color="black" label="Preparing checkout session..." />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🛍️</div>
        <h1 className="text-xl font-bold">Your shopping bag is empty</h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Add authentic village handlooms, unstitched suitings, or Gadwal sarees to your bag before checking out.
        </p>
        <div>
          <Link href="/search?category=All" className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors shadow-sm">
            Browse Garment Collections →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Cashfree Hosted Checkout Web SDK */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

      {/* Checkout Progress Header */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 mb-8 hover-elevate-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-neutral-100 text-neutral-800 border border-neutral-200 mb-1">
              Secure Village Store Checkout • PIN 503145
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">Checkout</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fulfillment directly from KB FASHIONS (Kalwaral Village, Telangana)
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                step === 1
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Delivery Details</span>
            </button>
            <span className="text-neutral-300">→</span>
            <button
              onClick={() => validateStep1() && setStep(2)}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                step === 2
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Payment &amp; Review</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-2xl font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Form Steps */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 rounded-3xl space-y-6 hover-elevate-card">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-neutral-900">
                    Step 1: Contact &amp; Delivery Destination
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Enter recipient and village coordinates for local runner delivery
                  </p>
                </div>
                <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                  📍 10 km Radius
                </span>
              </div>

              {/* Local Village Quick Selector & Google Map */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block">
                      Local Villages Covered within 10 km of Kalwaral Hub (PIN 503145)
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Tap your village for instant coordinate setup
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full">
                    Runner Dispatch
                  </span>
                </div>

                {/* Village Quick Selection Buttons */}
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
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className="text-[10px] opacity-60 font-normal">({v.distance})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Embedded Interactive Google Map */}
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-200 relative h-40 sm:h-48">
                  <iframe
                    title="KB Fashions 10km Delivery Radius - Kalwaral 503145"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://maps.google.com/maps?q=18.4285,78.2615&hl=en&z=12&output=embed"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-neutral-800 shadow-xs border border-black/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>10 km Doorstep Coverage Area • Kalwaral Center (PIN 503145)</span>
                  </div>
                </div>

                {/* Coverage Feedback */}
                {pinCode === '503145' ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                    <span>✓</span>
                    <span>
                      <strong>Eligible for Direct Local Delivery:</strong> Address is within the certified 10 km Kalwaral store radius under PIN 503145.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                    <span>⚠️</span>
                    <span>
                      <strong>Local Coverage Notice:</strong> Store deliveries are strictly operated within a 10 km radius of Kalwaral under PIN 503145.
                    </span>
                  </div>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Recipient Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recipient's legal name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Mobile Phone (10 Digits) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-mono text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-800 block mb-1">Email Address (for Bill of Supply &amp; Live Tracking) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-800 block mb-1">House Number / Street / Landmark *</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House number, Street name, agricultural landmark"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="503145"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-mono font-bold text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Village / Habitation *</label>
                  <input
                    type="text"
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    placeholder="Village name"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">Mandal / Sub-District</label>
                  <input
                    type="text"
                    value={mandalOrArea || ''}
                    onChange={(e) => setMandalOrArea(e.target.value)}
                    placeholder="Sadasivanagar"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kamareddy"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-800 block mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Telangana"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-xs sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Continue to Payment Selection</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 rounded-3xl space-y-6 hover-elevate-card">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-neutral-900">
                    Step 2: Payment Method &amp; Confirmation
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Select payment option and verify statutory e-commerce consents
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-neutral-500 hover:text-black underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Delivery Review Banner */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs space-y-1">
                <div className="font-bold text-neutral-900">
                  Delivering to: {name} ({phone})
                </div>
                <div className="text-neutral-600">
                  {streetAddress}, {villageOrCity}, {district}, {state} - {pinCode} (10 km Rural Delivery)
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                {/* Option 1: Cashfree Payments Hosted Checkout (Sandbox) */}
                <label className={`block border p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'CASHFREE'
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CASHFREE'}
                      onChange={() => setPaymentMethod('CASHFREE')}
                      className="mt-1 sm:mt-0 accent-black w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-neutral-900 flex items-center gap-2 flex-wrap">
                        <span>Cashfree Payments Hosted Checkout</span>
                        <span className="text-[10px] font-mono uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                          Sandbox
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Secure redirect checkout supporting UPI (GPay, PhonePe, Paytm), Debit &amp; Credit Cards, NetBanking, and Wallets via Cashfree API 2026-01-01.
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full shrink-0">
                      Instant Confirmation
                    </span>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery */}
                <label className={`block border p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 sm:mt-0 accent-black w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-neutral-900">
                        Cash on Delivery (COD) / Village Runner Handover
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Pay cash directly to the Kalwaral store runner upon physical delivery of your consignment. Requires 6-digit confirmation OTP.
                      </div>
                    </div>
                  </div>
                </label>

                {/* Option 3: Instant UPI */}
                <label className={`block border p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}>
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 sm:mt-0 accent-black w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-neutral-900">
                        Instant UPI Verification
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Direct merchant UPI transfer with 5-minute confirmation authorization.
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Statutory Policy Consents */}
              <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 block">
                  Mandatory Statutory Consents (Consumer Protection Rules 2020)
                </span>

                <div className="space-y-2.5 text-xs text-neutral-700">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-black focus:ring-black accent-black shrink-0"
                    />
                    <span className="leading-snug">
                      I have read and accept the <Link href="/policies/terms" target="_blank" className="font-bold underline text-black">Terms &amp; Conditions of Sale</Link> and agree to 10-km radius village delivery parameters.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeReturn}
                      onChange={(e) => setAgreeReturn(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-black focus:ring-black accent-black shrink-0"
                    />
                    <span className="leading-snug">
                      I accept the <Link href="/policies/refunds" target="_blank" className="font-bold underline text-black">Refund &amp; Return Policy</Link> (7-day window for packaged handloom garments).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-black focus:ring-black accent-black shrink-0"
                    />
                    <span className="leading-snug">
                      I consent to the <Link href="/policies/privacy" target="_blank" className="font-bold underline text-black">Privacy Policy</Link> and have noted the <Link href="/policies/statutory-declaration" target="_blank" className="font-bold underline text-black">Section 23 CGST Tax Exemption Notice</Link>.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-neutral-600 hover:text-black"
                >
                  ← Back to Address
                </button>

                {paymentMethod === 'CASHFREE' ? (
                  <button
                    type="button"
                    id="cashfree-pay-now-btn"
                    onClick={handleCashfreeCheckout}
                    disabled={isSubmitting || !agreeTerms || !agreeReturn || !agreePrivacy}
                    className="bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SmoothLoader size="xs" color="white" />
                        <span>Connecting to Cashfree...</span>
                      </>
                    ) : (
                      <span>Pay with Cashfree Hosted Checkout (₹{cart.total}) →</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    id="confirm-place-order-btn"
                    onClick={handleInitiateOrderOtp}
                    disabled={isSubmitting || !agreeTerms || !agreeReturn || !agreePrivacy}
                    className="bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <SmoothLoader size="xs" color="white" />
                        <span>Confirming Order...</span>
                      </>
                    ) : (
                      <span>Verify OTP &amp; Place Order (₹{cart.total}) →</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Order Confirmation OTP Popup */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-scale-up">
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-black font-black text-xl"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-neutral-100 text-black border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-xl">
                  🛡️
                </div>
                <h3 className="text-lg font-black text-neutral-900">Authorize Order Placement</h3>
                <p className="text-xs text-neutral-500">
                  Please enter the 6-digit confirmation code sent to <strong className="text-neutral-900">{email}</strong> to confirm your order of <strong>₹{cart.total}</strong>.
                </p>
                {otpSentMessage && (
                  <div className="text-[11px] font-bold text-neutral-800 bg-neutral-100 py-1 px-3 rounded-full inline-block border border-neutral-200">
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
                    className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 rounded-2xl border-2 border-neutral-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10px] text-center text-neutral-400 mt-1">
                    Strictly valid for 5 minutes. Check spam folder if not received in 30 seconds.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInitiateOrderOtp()}
                    disabled={isSendingOtp}
                    className="w-1/3 py-3 text-xs font-bold text-neutral-700 hover:text-black border border-neutral-200 rounded-full disabled:opacity-50"
                  >
                    {isSendingOtp ? 'Sending...' : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlaceOrder()}
                    disabled={isSubmitting || orderOtp.length !== 6}
                    className="w-2/3 py-3 text-xs font-black bg-black text-white hover:bg-neutral-800 rounded-full transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2"
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

        {/* Right Column (1 Col): Sticky Order Items Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 space-y-5 hover-elevate-card">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider">
                Order Items ({cart.items.length})
              </h3>
              <Link href="/cart" className="text-xs text-neutral-500 hover:text-black underline">
                Edit Bag
              </Link>
            </div>

            <div className="divide-y divide-neutral-100 text-xs max-h-72 overflow-y-auto pr-1">
              {cart.items.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900 line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {item.cutLength ? `✂ Cut: ${item.cutLength}m • ` : ''}Size: {item.size} • Qty: {item.qty}
                    </div>
                  </div>
                  <div className="font-bold text-neutral-900 text-right shrink-0">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal:</span>
                <span className="font-medium text-neutral-900">₹{cart.subtotal}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Festival Discount:</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 items-center">
                <span>10 km Doorstep Delivery:</span>
                <span className="font-bold text-neutral-900">
                  {cart.shippingFee === 0 ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      FREE
                    </span>
                  ) : (
                    `₹${cart.shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline font-black text-neutral-900">
                <span className="text-sm">Total Payable:</span>
                <span className="text-2xl">₹{cart.total}</span>
              </div>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-2xl text-[11px] text-neutral-600 border border-neutral-200 space-y-1">
              <div className="font-bold text-neutral-900">✓ Handloom Provenance Guaranteed</div>
              <p className="text-[10px] leading-relaxed">
                Dispatched directly from <strong>KB FASHIONS</strong>, Kalwaral Village, Kamareddy, Telangana (503145). Accompanied by authentic Bill of Supply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <SmoothLoadingOverlay
          message="Confirming Order with Kalwaral Store..."
          submessage="Validating local 10 km delivery coverage and generating Bill of Supply..."
        />
      )}
    </div>
  );
}
