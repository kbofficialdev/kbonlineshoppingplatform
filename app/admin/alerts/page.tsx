"use client";

import React, { useState, useEffect } from 'react';
import { authFetch } from '@/lib/clientAuth';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';

export default function AdminAlertsBannersPage() {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingAlert, setSubmittingAlert] = useState<boolean>(false);
  const [submittingBanner, setSubmittingBanner] = useState<boolean>(false);

  // New Alert Form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'ANNOUNCEMENT' | 'OFFER' | 'URGENT' | 'WARNING' | 'INFO'>('ANNOUNCEMENT');
  const [displayLocation, setDisplayLocation] = useState<'TOP_BAR' | 'TOAST_ALERT' | 'BOTH'>('BOTH');
  const [badgeText, setBadgeText] = useState('✨ STORE UPDATE');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('View Details →');
  const [pushAsToastNow, setPushAsToastNow] = useState(true);

  // New Banner Form state
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('✨ NEW ARRIVAL');
  const [bannerImageUrl, setBannerImageUrl] = useState('/api/media/banner-tradition-meets-trend');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('/search?category=All');
  const [bannerCtaText, setBannerCtaText] = useState('Shop Collection');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, bannersRes] = await Promise.all([
        authFetch('/api/alerts?all=true'),
        fetch('/api/banners'),
      ]);

      const alertsData = await alertsRes.json();
      const bannersData = await bannersRes.json();

      if (alertsData?.alerts) setAlerts(alertsData.alerts);
      if (bannersData?.banners) setBanners(bannersData.banners);
    } catch (err) {
      showToast({ type: 'error', title: 'Fetch Error', message: 'Could not load alerts and banners' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) {
      showToast({ type: 'warning', title: 'Missing Fields', message: 'Title and message are required' });
      return;
    }

    try {
      setSubmittingAlert(true);
      const res = await authFetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle.trim(),
          message: alertMessage.trim(),
          type: alertType,
          displayLocation,
          badge: badgeText.trim() || null,
          linkUrl: linkUrl.trim() || null,
          linkText: linkText.trim() || null,
          isActive: true,
          isPushed: pushAsToastNow,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Alert Pushed Successfully',
          message: `✓ Alert "${alertTitle}" has been deployed live to the store.`,
        });
        setAlertTitle('');
        setAlertMessage('');
        fetchData();
      } else {
        showToast({ type: 'error', title: 'Failed to Push', message: data.error || 'Server error' });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setSubmittingAlert(false);
    }
  };

  const handleToggleAlert = async (id: string, currentStatus: boolean) => {
    try {
      const res = await authFetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        showToast({
          type: 'info',
          title: 'Alert Status Updated',
          message: `Alert is now ${!currentStatus ? 'ACTIVE' : 'INACTIVE'}.`,
        });
        fetchData();
      }
    } catch (err) {}
  };

  const handleDeleteAlert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    try {
      const res = await authFetch(`/api/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast({ type: 'warning', title: 'Alert Removed', message: 'Alert was deleted from database.' });
        fetchData();
      }
    } catch (err) {}
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImageUrl.trim()) {
      showToast({ type: 'warning', title: 'Missing Fields', message: 'Banner title and image URL are required' });
      return;
    }

    try {
      setSubmittingBanner(true);
      const res = await authFetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bannerTitle.trim(),
          subtitle: bannerSubtitle.trim(),
          badge: bannerBadge.trim(),
          imageUrl: bannerImageUrl.trim(),
          linkUrl: bannerLinkUrl.trim(),
          ctaText: bannerCtaText.trim(),
          category: 'HERO',
          isActive: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Banner Added',
          message: `✓ Carousel banner "${bannerTitle}" saved to database.`,
        });
        setBannerTitle('');
        setBannerSubtitle('');
        fetchData();
      } else {
        showToast({ type: 'error', title: 'Failed to Add Banner', message: data.error || 'Server error' });
      }
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setSubmittingBanner(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-kb-black">Live Alerts &amp; Showcase Banners</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Deploy live announcement bars, instant top-right alert toasts, and carousel artwork directly from the database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: CREATE & PUSH NEW ALERT                      */}
        {/* ========================================================= */}
        <div className="bg-white border border-kb-gray p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <span className="text-lg">📢</span>
            <div>
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                Push Live Customer Alert
              </h2>
              <p className="text-[11px] text-neutral-500">
                Pushes immediate notification bar or toast to all store visitors.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Alert Headline *</label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. 10 km Doorstep Delivery Active"
                className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                required
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Message Description *</label>
              <textarea
                rows={2}
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="e.g. Free direct village delivery within 10 km of Kalwaral Store under PIN 503145."
                className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Alert Style</label>
                <select
                  value={alertType}
                  onChange={(e: any) => setAlertType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-kb-gray bg-white font-semibold"
                >
                  <option value="ANNOUNCEMENT">Announcement (Black/Gold)</option>
                  <option value="OFFER">Special Offer (Electric Blue)</option>
                  <option value="URGENT">Urgent (Red / Urgent Notice)</option>
                  <option value="WARNING">Warning (Amber)</option>
                  <option value="INFO">Information (Slate Gray)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Display Target</label>
                <select
                  value={displayLocation}
                  onChange={(e: any) => setDisplayLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-kb-gray bg-white font-semibold"
                >
                  <option value="BOTH">Top Bar + Live Toast Alert</option>
                  <option value="TOP_BAR">Top Header Bar Only</option>
                  <option value="TOAST_ALERT">Top-Right Toast Alert Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. 🚚 LOCAL DELIVERY"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Link URL (Optional)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /policies/shipping"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pushToast"
                checked={pushAsToastNow}
                onChange={(e) => setPushAsToastNow(e.target.checked)}
                className="w-4 h-4 rounded text-kb-blue"
              />
              <label htmlFor="pushToast" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                Push immediately as top-right pop-up toast to active visitors
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingAlert}
              id="admin-push-alert-btn"
              className="w-full py-2.5 rounded-kb-pill bg-kb-blue text-white font-bold hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingAlert ? (
                <>
                  <SmoothLoader size="xs" color="white" />
                  <span>Pushing Alert to Database...</span>
                </>
              ) : (
                <span>🚀 Push Alert Live to Store</span>
              )}
            </button>
          </form>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CREATE NEW CAROUSEL BANNER                 */}
        {/* ========================================================= */}
        <div className="bg-white border border-kb-gray p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <span className="text-lg">🖼️</span>
            <div>
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
                Add Showcase Carousel Banner
              </h2>
              <p className="text-[11px] text-neutral-500">
                Artwork is stored in database and rendered edge-to-edge uncropped.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Banner Headline *</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="e.g. Wedding Season Pattu Silk Sarees"
                className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                required
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Subtitle / Description</label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Handcrafted pure zari borders from Kalwaral master weavers"
                className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="e.g. ✨ BRIDAL 2026"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={bannerCtaText}
                  onChange={(e) => setBannerCtaText(e.target.value)}
                  placeholder="e.g. Explore Pattu Silk"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Image Endpoint / URL *</label>
                <input
                  type="text"
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="/api/media/banner-tradition-meets-trend"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Destination Link</label>
                <input
                  type="text"
                  value={bannerLinkUrl}
                  onChange={(e) => setBannerLinkUrl(e.target.value)}
                  placeholder="/search?category=Sarees"
                  className="w-full px-3.5 py-2 rounded-lg border border-kb-gray bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-kb-blue font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingBanner}
              id="admin-add-banner-btn"
              className="w-full py-2.5 rounded-kb-pill bg-kb-black text-white font-bold hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingBanner ? (
                <>
                  <SmoothLoader size="xs" color="white" />
                  <span>Saving Banner...</span>
                </>
              ) : (
                <span>➕ Add Banner to Showcase Carousel</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVE STORE ALERTS TABLE                                 */}
      {/* ========================================================= */}
      <div className="bg-white border border-kb-gray rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
            Database Stored Customer Alerts ({alerts.length})
          </h2>
          <button
            onClick={fetchData}
            className="text-xs font-semibold text-kb-blue hover:underline"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <SmoothLoader size="sm" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No active alerts in database. Use the form above to push one.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 text-xs">
            {alerts.map((alert) => (
              <div key={alert.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alert.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {alert.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="font-bold text-neutral-900">{alert.title}</span>
                    {alert.badge && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        {alert.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 text-[11px]">{alert.message}</p>
                  <div className="text-[10px] text-neutral-400">
                    Location: {alert.displayLocation} • Type: {alert.type}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleAlert(alert.id, alert.isActive)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                      alert.isActive
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {alert.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SHOWCASE BANNERS TABLE                                    */}
      {/* ========================================================= */}
      <div className="bg-white border border-kb-gray rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wide">
          Active Carousel Banners in Database ({banners.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id || b.bannerId} className="border border-neutral-200 rounded-xl p-3 flex gap-3 items-center bg-neutral-50">
              <div className="w-20 h-14 bg-neutral-900 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-amber-700">{b.badge}</div>
                <div className="text-xs font-bold text-neutral-900 truncate">{b.title}</div>
                <div className="text-[10px] text-neutral-500 truncate">{b.subtitle}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✓ Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

