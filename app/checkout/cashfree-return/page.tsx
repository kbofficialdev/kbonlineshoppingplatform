"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SmoothLoader } from '@/components/SmoothLoader';

function CashfreeReturnContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setErrorMessage('No Order ID found in return query string.');
      return;
    }

    async function verifyPayment() {
      try {
        setLoading(true);
        const res = await fetch(`/api/payments/cashfree/verify?order_id=${encodeURIComponent(orderId as string)}`);
        const data = await res.json();

        if (res.ok && data.success && data.is_paid) {
          setVerified(true);
          setOrder(data.order);
        } else {
          setVerified(false);
          setOrder(data.order || null);
          setErrorMessage(data.message || `Payment could not be confirmed. Status: ${data.order_status || 'UNKNOWN'}`);
        }
      } catch (err: any) {
        setVerified(false);
        setErrorMessage(`Error contacting verification service: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xl space-y-6">
        
        {loading ? (
          <div className="text-center py-12 space-y-4">
            <div className="flex justify-center">
              <SmoothLoader size="lg" color="black" />
            </div>
            <h2 className="text-lg font-black text-neutral-900">Verifying Payment with Cashfree...</h2>
            <p className="text-xs text-neutral-500">
              Please do not close this window. We are securing your transaction confirmation.
            </p>
          </div>
        ) : verified ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Captured via Cashfree Sandbox
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 pt-2">
                Order Confirmed!
              </h1>
              <p className="text-xs text-neutral-500">
                Thank you for your patronage with KB Fashions, Kalwaral.
              </p>
            </div>

            {/* Order Details Card */}
            {order && (
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Order ID:</span>
                  <span className="font-mono font-bold text-neutral-900">{order.orderId}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Invoice Number:</span>
                  <span className="font-mono font-bold text-neutral-900">{order.invoiceNumber}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Total Paid:</span>
                  <span className="font-black text-base text-neutral-900">₹{order.totalPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Delivery Address:</span>
                  <span className="text-right font-medium text-neutral-800 max-w-[220px]">
                    {order.villageOrCity}, PIN {order.pinCode} (10 km Local Delivery)
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              {order && (
                <>
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm"
                  >
                    Track Consignment Live →
                  </Link>

                  <Link
                    href={`/invoices/${order.orderId}`}
                    target="_blank"
                    className="px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all"
                  >
                    View Bill of Supply 📄
                  </Link>
                </>
              )}

              <Link
                href="/"
                className="px-5 py-3 rounded-full border border-neutral-200 text-neutral-700 hover:text-black text-xs font-semibold transition-all"
              >
                Return to Store
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto shadow-inner">
              ⚠️
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Payment Incomplete / Exited
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 pt-2">
                Transaction Status
              </h1>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                {errorMessage || 'Your transaction was not completed or you exited before concluding the payment.'}
              </p>
            </div>

            {order && (
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Order ID:</span>
                  <span className="font-mono font-bold text-neutral-900 break-all">{order.orderId}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">Payable Amount:</span>
                  <span className="font-black text-neutral-900">₹{order.totalPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Current Gateway Status:</span>
                  <span className="font-bold text-amber-800">{order.paymentStatus || 'PENDING'}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/checkout"
                className="px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm"
              >
                Retry Payment at Checkout →
              </Link>

              {order && (
                <Link
                  href={`/orders/${order.orderId}`}
                  className="px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all"
                >
                  View Order Details
                </Link>
              )}

              <Link
                href="/support"
                className="px-5 py-3 rounded-full border border-neutral-200 text-neutral-700 hover:text-black text-xs font-semibold transition-all"
              >
                Support Tickets
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CashfreeReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <SmoothLoader size="lg" color="black" />
            <p className="text-xs text-neutral-500 font-medium">Loading Cashfree Payment Verification...</p>
          </div>
        </div>
      }
    >
      <CashfreeReturnContent />
    </Suspense>
  );
}

