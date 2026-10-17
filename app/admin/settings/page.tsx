"use client";

import React, { useState, useEffect } from 'react';
import { authFetch } from '@/lib/clientAuth';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    brandName: '',
    officialName: '',
    address: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pinCode: '',
    contactEmail: '',
    contactPhone: '',
    freeShippingThreshold: 999,
    flatShippingFee: 70,
    story: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/store/settings');
      const data = await res.json();
      if (data?.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await authFetch('/api/store/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Store enterprise settings updated successfully in database!');
        setSettings(data.settings);
        setTimeout(() => setMessage(null), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update store settings');
      }
    } catch (e: any) {
      setErrorMsg('Error communicating with server');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-kbBorder pb-4">
        <h1 className="text-2xl font-black text-kbBlack">Village Store & Enterprise Settings</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Dynamically stored in PostgreSQL database — reflected across all pages, bills, and footer
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-4 rounded-kb-md font-bold">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-4 rounded-kb-md font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-kbBorder p-6 sm:p-8 rounded-kb-lg space-y-6 shadow-sm text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Brand Name *</label>
            <input
              type="text"
              required
              value={settings.brandName || ''}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Official Registered Trade Name *</label>
            <input
              type="text"
              required
              value={settings.officialName || ''}
              onChange={(e) => setSettings({ ...settings, officialName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Complete Physical Shop Address *</label>
            <input
              type="text"
              required
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Village Name</label>
            <input
              type="text"
              value={settings.village || ''}
              onChange={(e) => setSettings({ ...settings, village: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Mandal / Taluk</label>
            <input
              type="text"
              value={settings.mandal || ''}
              onChange={(e) => setSettings({ ...settings, mandal: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">District</label>
            <input
              type="text"
              value={settings.district || ''}
              onChange={(e) => setSettings({ ...settings, district: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">State & PIN Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.state || ''}
                onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                className="w-2/3 px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
              />
              <input
                type="text"
                value={settings.pinCode || ''}
                onChange={(e) => setSettings({ ...settings, pinCode: e.target.value })}
                className="w-1/3 px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Customer Care Phone (+91) *</label>
            <input
              type="text"
              required
              value={settings.contactPhone || ''}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Official Support Email *</label>
            <input
              type="email"
              required
              value={settings.contactEmail || ''}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold || 999}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Standard Flat Shipping Fee (₹)</label>
            <input
              type="number"
              value={settings.flatShippingFee || 70}
              onChange={(e) => setSettings({ ...settings, flatShippingFee: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          {/* Section: Statutory Grievance Redressal Officer (Rules 2020) */}
          <div className="sm:col-span-2 pt-4 border-t border-kbBorder">
            <h3 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              Statutory Grievance Redressal Officer (Rule 5(9) Rules 2020)
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Officer details are displayed across the site, invoice slips, statutory declarations, and the Grievance Redressal policy page.
            </p>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Grievance Officer Name *</label>
            <input
              type="text"
              value={settings.grievanceOfficerName || ''}
              onChange={(e) => setSettings({ ...settings, grievanceOfficerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Officer Designation *</label>
            <input
              type="text"
              value={settings.grievanceOfficerDesignation || ''}
              onChange={(e) => setSettings({ ...settings, grievanceOfficerDesignation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Officer Direct Email Desk *</label>
            <input
              type="email"
              value={settings.grievanceOfficerEmail || ''}
              onChange={(e) => setSettings({ ...settings, grievanceOfficerEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Officer Helpline Phone *</label>
            <input
              type="text"
              value={settings.grievanceOfficerPhone || ''}
              onChange={(e) => setSettings({ ...settings, grievanceOfficerPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Officer Postal / Physical Chamber Address</label>
            <input
              type="text"
              value={settings.grievanceOfficerAddress || ''}
              onChange={(e) => setSettings({ ...settings, grievanceOfficerAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono"
            />
          </div>

          {/* Section: Delivery Radius & Tariffs */}
          <div className="sm:col-span-2 pt-4 border-t border-kbBorder">
            <h3 className="text-sm font-black text-black mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Local Delivery Radius &amp; Postal Tariffs
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Configure 10-km radius boundary, central pincode (503145), and villages eligible for local direct delivery.
            </p>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Local Delivery Radius (Kilometers)</label>
            <input
              type="number"
              value={settings.deliveryRadiusKm || 10}
              onChange={(e) => setSettings({ ...settings, deliveryRadiusKm: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Primary Hub Pincode</label>
            <input
              type="text"
              value={settings.deliveryPincode || '503145'}
              onChange={(e) => setSettings({ ...settings, deliveryPincode: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Villages Covered Under 10km Delivery (Comma-separated)</label>
            <input
              type="text"
              value={settings.deliveryVillages || ''}
              onChange={(e) => setSettings({ ...settings, deliveryVillages: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Tariff &amp; Postal Rates Description</label>
            <input
              type="text"
              value={settings.tariffDescription || ''}
              onChange={(e) => setSettings({ ...settings, tariffDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            />
          </div>

          {/* Section: Broadcast Policy Update Email to Customers */}
          <div className="sm:col-span-2 pt-4 border-t border-kbBorder bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
            <h3 className="text-sm font-black text-amber-950 mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
              Statutory Policy Change Email Broadcaster
            </h3>
            <p className="text-[11px] text-amber-800 mb-3">
              When statutory terms or policies are updated, notify all registered customer accounts via automated email broadcast.
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">Policy Title / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Terms of Service & 10km Delivery Radius Update"
                  value={settings.policyUpdateTitle || ''}
                  onChange={(e) => setSettings({ ...settings, policyUpdateTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-kb-sm border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-800 block mb-1">Summary of Modifications</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what changed for customers..."
                  value={settings.policyUpdateSummary || ''}
                  onChange={(e) => setSettings({ ...settings, policyUpdateSummary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-kb-sm border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
                ></textarea>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={!!settings.notifyCustomersOnPolicyChange}
                  onChange={(e) => setSettings({ ...settings, notifyCustomersOnPolicyChange: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span className="text-xs font-bold text-neutral-900">
                  Broadcast this policy update email to all registered patrons upon saving
                </span>
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">20-Year Heritage Story</label>
            <textarea
              rows={3}
              value={settings.story || ''}
              onChange={(e) => setSettings({ ...settings, story: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-kb-sm border border-kbBorder bg-kbLight focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-xs"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-kbBorder flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-black text-white text-xs font-bold px-8 py-3 rounded-kb-pill hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
          >
            {isSaving ? 'Saving Settings...' : 'Save Settings to Database'}
          </button>
        </div>
      </form>
    </div>
  );
}

