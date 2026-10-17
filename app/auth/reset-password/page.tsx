"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SmoothLoader } from '@/components/SmoothLoader';
import { useToast } from '@/components/ToastContext';
import AuthBanner from '@/components/AuthBanner';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your password has been reset successfully. Redirecting to sign in...',
        });
        setTimeout(() => router.push('/auth/signin'), 2000);
      } else {
        setErrorMsg(data.error || 'Failed to reset password');
        showToast({
          type: 'error',
          title: 'Reset Failed',
          message: data.error || 'Invalid or expired reset token.',
        });
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Heritage Visual Banner */}
      <div className="lg:col-span-6 xl:col-span-7">
        <AuthBanner
          title="Set New Secure Password"
          subtitle="Create a new strong password to regain access to your KB FASHIONS patron account."
          badge="Encrypted Token Verification"
        />
      </div>

      {/* Right Column: Clean Form Card */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50/60">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-black">New Password</h1>
            <p className="text-xs text-neutral-500">
              Enter and confirm your new password
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-6 rounded-2xl text-center space-y-3">
              <div className="text-3xl">✓</div>
              <p className="font-bold text-sm">Password Successfully Updated!</p>
              <p className="text-neutral-600">Redirecting to sign-in page...</p>
              <Link href="/auth/signin" className="inline-block mt-2 font-bold text-black underline">
                Click here to Sign In Now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  New Password (Min 6 Characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SmoothLoader size="xs" color="white" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Save New Password &amp; Sign In →</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-neutral-500">
            Remembered your password?{' '}
            <Link href="/auth/signin" className="font-bold text-black underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <SmoothLoader size="md" color="black" label="Loading Reset Password..." />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
