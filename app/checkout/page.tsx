"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModalAlert } from '@/components/ModalContext';
import { useToast } from '@/components/ToastContext';
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('COD');

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

  const handlePlaceOrder = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
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
        })
      });

      const data = await res.json();

      if (res.status === 401 || data.requiresAuth) {
        setIsSubmitting(false);
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
      {/* Title & Multi-step Breadcrumbs */}
      <div className="border-b border-kbBorder pb-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-kbBlack">Checkout</h1>
            <p className="text-xs text-neutral-500 mt-1">Direct from KB FASHIONS (Kalwaral, Telangana) to your door</p>
          </div>
          {/* Step Badges */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'}`}>
              1. Delivery Details
            </span>
            <span>→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'}`}>
              2. Payment & Confirmation
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-kb-md font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Step Form */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg space-y-6 shadow-sm">
              <h2 className="text-base font-black text-kbBlack uppercase tracking-wider text-xs">
                Step 1: Contact & Delivery Address
              </h2>

              {/* Hyper-Local Village Delivery Zone (10 km Radius of PIN 503145) & Google Maps Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                        Direct Delivery Service Area: 10 km Radius (PIN 503145)
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Direct doorstep delivery from KB FASHIONS, Kalwaral village, Kamareddy, Telangana.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    ✓ 10 KM SERVICE RADIUS
                  </span>
                </div>

                {/* Village Quick Selection */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-800 block mb-2">
                    Quick-Select Your Village within 10 km of Kalwaral Store:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCAL_VILLAGES_503145.map((v) => {
                      const isSelected = villageOrCity.toLowerCase() === v.name.toLowerCase() && pinCode === '503145';
                      return (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => selectLocalVillage(v.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-kb-blue text-white shadow-sm ring-2 ring-blue-300'
                              : 'bg-white border border-slate-200 text-neutral-700 hover:border-kb-blue hover:text-kb-blue'
                          }`}
                        >
                          <span>{v.name}</span>
                          <span className="text-[10px] opacity-75 font-normal">({v.distance})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Interactive Google Map with 10km Visual Area */}
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-neutral-100 relative h-48 sm:h-56">
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
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-neutral-800 shadow-sm border border-black/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Google Maps Delivery Radius • Kalwaral Center (PIN 503145)</span>
                  </div>
                </div>

                {/* Postal Eligibility Feedback */}
                {pinCode === '503145' ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                    <span>✓</span>
                    <span>
                      <strong>Eligible for Direct Doorstep Delivery:</strong> Address is within the 10 km Kalwaral radius under PIN 503145. Local village delivery applied.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                    <span>ℹ️</span>
                    <span>
                      <strong>Outer Postal Delivery:</strong> PIN {pinCode} is outside the direct 10 km Kalwaral radius. Orders will be dispatched safely via India Post Speed Post.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recipient's name"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Mobile Phone (+91) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit Indian phone number"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">Email Address (for Bill & Live Tracking) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">House / Building / Street Address *</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House number, Street name, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">PIN Code (6 Digits) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 503145 or 560038"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Village / Town / City *</label>
                  <input
                    type="text"
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    placeholder="Village or City name"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Mandal / Sub-District / Area</label>
                  <input
                    type="text"
                    value={mandalOrArea || ''}
                    onChange={(e) => setMandalOrArea(e.target.value)}
                    placeholder="Mandal or Locality"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District name"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Telangana, Karnataka, Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-kbBorder flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-kb-blue text-white text-sm font-semibold px-8 py-3.5 rounded-kb-pill hover:bg-blue-600 transition-all shadow-sm"
                >
                  Continue to Payment Selection →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-black text-kbBlack uppercase tracking-wider text-xs">
                  Step 2: Choose Payment Method
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-neutral-500 hover:text-black underline"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Delivery Summary Review */}
              <div className="bg-kbLight p-4 rounded-kb-sm text-xs space-y-1 border border-kbBorder">
                <div className="font-bold text-neutral-900">Delivering to: {name} ({phone})</div>
                <div className="text-neutral-600">{streetAddress}, {villageOrCity}, {district}, {state} - {pinCode}</div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className={`block border p-4 rounded-kb-md cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-kbBorder hover:border-neutral-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs text-neutral-900">Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Pay cash or scan courier UPI QR code when garment arrives at your doorstep. Zero extra charges.
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                </label>

                <label className={`block border p-4 rounded-kb-md cursor-pointer transition-all ${
                  paymentMethod === 'UPI' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-kbBorder hover:border-neutral-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs text-neutral-900">Instant UPI Payment</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Google Pay, PhonePe, Paytm, or BHIM UPI instant verification.
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`block border p-4 rounded-kb-md cursor-pointer transition-all ${
                  paymentMethod === 'CARD' ? 'border-black bg-neutral-50 ring-1 ring-black' : 'border-kbBorder hover:border-neutral-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-xs text-neutral-900">Debit / Credit Card & NetBanking</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        All major Indian debit/credit cards and netbanking supported.
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-kbBorder flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-neutral-600 hover:text-black"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  id="confirm-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="bg-kb-blue text-white text-sm font-semibold px-8 py-3.5 rounded-kb-pill hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <SmoothLoader size="xs" color="white" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Place Order Now →</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Order Items Summary */}
        <div className="bg-kbSurfaceAlt border border-kbBorder p-6 rounded-kb-lg space-y-4">
          <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider">
            Order Items ({cart.items.length})
          </h3>

          <div className="divide-y divide-kbBorder text-xs max-h-72 overflow-y-auto">
            {cart.items.map((item: any, idx: number) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-neutral-900 line-clamp-1">{item.name}</div>
                  <div className="text-[10px] text-neutral-500">
                    {item.cutLength ? `✂ Cut: ${item.cutLength}m • ` : ''}Size: {item.size} • Qty: {item.qty}
                  </div>
                </div>
                <div className="font-bold text-black text-right">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-kbBorder pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span>₹{cart.subtotal}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount:</span>
                <span>-₹{cart.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping:</span>
              <span>{cart.shippingFee === 0 ? 'FREE' : `₹${cart.shippingFee}`}</span>
            </div>
            <div className="border-t border-kbBorder pt-2 flex justify-between font-black text-base text-black">
              <span>Total Payable:</span>
              <span>₹{cart.total}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded text-[10px] text-neutral-500 border border-kbBorder">
            Dispatched from: <strong>KB FASHIONS</strong>, Kalwaral(Vil), Kamareddy(D), Telangana (503145).
          </div>
        </div>
      </div>

      {isSubmitting && (
        <SmoothLoadingOverlay
          message="Confirming Order with Kalwaral Store..."
          submessage="Validating local 10 km delivery coverage, stock, and generating bill of supply..."
        />
      )}
    </div>
  );
}
