"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [cart, setCart] = useState<any>({ items: [], subtotal: 0, total: 0, shippingFee: 0, discountAmount: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customer Delivery State
  const [name, setName] = useState<string>('Rahul Sharma');
  const [phone, setPhone] = useState<string>('9876543210');
  const [email, setEmail] = useState<string>('customer@example.com');
  const [streetAddress, setStreetAddress] = useState<string>('42, Industrial Layout, Indiranagar');
  const [villageOrCity, setVillageOrCity] = useState<string>('Bengaluru');
  const [mandalOrArea, setMandalOrArea] = useState<string>('Indiranagar');
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [state, setState] = useState<string>('Karnataka');
  const [pinCode, setPinCode] = useState<string>('560038');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('COD');

  useEffect(() => {
    fetchCartAndUser();
  }, []);

  const fetchCartAndUser = async () => {
    try {
      setIsLoading(true);
      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      setCart(cartData);

      // Pre-fill user data if logged in
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData?.authenticated && userData.user) {
        setName(userData.user.name || '');
        setEmail(userData.user.email || '');
        setPhone(userData.user.phone?.replace('+91', '') || '');
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
      setErrorMsg("Please enter your full name (at least 2 characters)");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim().replace(/^\+91/, ''))) {
      setErrorMsg("Please enter a valid 10-digit Indian phone number");
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg("Please enter a valid email address for order notifications");
      return false;
    }
    if (!streetAddress.trim() || streetAddress.length < 5) {
      setErrorMsg("Please enter complete street or house address");
      return false;
    }
    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode.trim())) {
      setErrorMsg("Please enter a valid 6-digit postal PIN code");
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
      const res = await fetch('/api/orders', {
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
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        // Redirect directly to the dedicated order timeline page!
        router.push(`/orders/${data.order.orderId}`);
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with server');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Preparing checkout...</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Your shopping bag is empty</h1>
        <p className="text-xs text-neutral-500 mt-2">Add items to your bag before checking out.</p>
        <Link href="/search?category=All" className="inline-block mt-4 bg-black text-white text-xs font-bold px-6 py-3 rounded-full">
          Browse Collections
        </Link>
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
                  className="bg-black text-white text-xs font-bold px-8 py-3.5 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md"
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
                  className="bg-emerald-800 text-white text-xs font-bold px-8 py-3.5 rounded-kb-pill hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order Now →'}
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
                  <div className="text-[10px] text-neutral-400">Size: {item.size} • Qty: {item.qty}</div>
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
    </div>
  );
}
