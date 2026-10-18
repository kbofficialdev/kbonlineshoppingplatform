"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';
import { useModalAlert } from '@/components/ModalContext';
import { useToast } from '@/components/ToastContext';
import { useLoadingOverlay } from '@/components/LoadingOverlayContext';
import { SmoothLoader } from '@/components/SmoothLoader';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export default function SupportPage() {
  const { showModal } = useModalAlert();
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoadingOverlay();

  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal: Create Ticket
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [trackTicketNum, setTrackTicketNum] = useState<string>('');
  const [guestMode, setGuestMode] = useState<'CREATE' | 'TRACK'>('CREATE');

  const [newCategory, setNewCategory] = useState<string>('ORDER_ISSUE');
  const [newPriority, setNewPriority] = useState<string>('MEDIUM');
  const [newOrderId, setNewOrderId] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [abuseWarning, setAbuseWarning] = useState<string | null>(null);

  // Selected Ticket Conversation Modal
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [replyAbuseWarning, setReplyAbuseWarning] = useState<string | null>(null);

  useEffect(() => {
    loadSupportData();
  }, [filterStatus]);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      const userRes = await authFetch('/api/auth/me');
      const userData = await userRes.json();

      if (!userData?.authenticated) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      setUser(userData.user);

      // Load tickets
      const url = filterStatus === 'ALL'
        ? '/api/support/tickets'
        : `/api/support/tickets?status=${filterStatus}`;
      const [ticketsRes, ordersRes] = await Promise.all([
        authFetch(url),
        authFetch('/api/orders')
      ]);

      const ticketsData = await ticketsRes.json();
      const ordersData = await ordersRes.json();

      if (ticketsData.success) {
        setTickets(ticketsData.tickets || []);
      }
      if (ordersData.orders) {
        setOrders(ordersData.orders || []);
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not load support tickets. Please retry.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time abuse validation for new ticket
  const handleMessageChange = (val: string) => {
    setNewMessage(val);
    const check = detectAbuseLanguage(val);
    if (check.hasAbuse) {
      setAbuseWarning(`⚠️ Inappropriate language detected: "${check.flaggedWords.join(', ')}". Please keep discussions respectful.`);
    } else {
      setAbuseWarning(null);
    }
  };

  const handleReplyChange = (val: string) => {
    setReplyMessage(val);
    const check = detectAbuseLanguage(val);
    if (check.hasAbuse) {
      setReplyAbuseWarning(`⚠️ Inappropriate language detected: "${check.flaggedWords.join(', ')}". Please keep discussions respectful.`);
    } else {
      setReplyAbuseWarning(null);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide both a subject and details for your ticket.',
      });
      return;
    }

    const check1 = detectAbuseLanguage(newSubject);
    const check2 = detectAbuseLanguage(newMessage);
    if (check1.hasAbuse || check2.hasAbuse) {
      showModal({
        type: 'error',
        title: 'Prohibited Language Detected',
        message: 'Your ticket contains abusive or vulgar words. KB Fashions fosters a courteous community. Please revise your words before submitting.',
      });
      return;
    }

    if (!user) {
      if (!guestName.trim()) {
        showToast({
          type: 'warning',
          title: 'Name Required',
          message: 'Please enter your name so our support team can address you.',
        });
        return;
      }
      if (!guestEmail.trim()) {
        showToast({
          type: 'warning',
          title: 'Email Required',
          message: 'Please enter your email so we can send ticket updates & responses.',
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      showLoader('Submitting ticket to Kalwaral Support Desk...');
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('kb_session_token')
            ? { Authorization: `Bearer ${localStorage.getItem('kb_session_token')}` }
            : {}),
        },
        body: JSON.stringify({
          customerName: !user ? guestName.trim() : undefined,
          customerEmail: !user ? guestEmail.trim() : undefined,
          customerPhone: !user ? guestPhone.trim() : undefined,
          subject: newSubject.trim(),
          category: newCategory,
          priority: newPriority,
          orderId: newOrderId.trim() || null,
          message: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Ticket Raised',
          message: data.message,
        });
        setShowCreateModal(false);
        setNewSubject('');
        setNewMessage('');
        setNewOrderId('');
        if (data.ticket) {
          setSelectedTicket(data.ticket);
        }
        if (user) {
          loadSupportData();
        }
      } else {
        showModal({
          type: 'error',
          title: 'Unable to Raise Ticket',
          message: data.error || 'Failed to submit ticket. Please retry.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not connect to ticket service.',
      });
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const check = detectAbuseLanguage(replyMessage);
    if (check.hasAbuse) {
      showModal({
        type: 'error',
        title: 'Prohibited Language Detected',
        message: 'Your reply contains abusive or disrespectful words. Please remove them to proceed.',
      });
      return;
    }

    try {
      setIsSendingReply(true);
      showLoader('Posting reply to ticket thread...');
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('kb_session_token')
            ? { Authorization: `Bearer ${localStorage.getItem('kb_session_token')}` }
            : {}),
        },
        body: JSON.stringify({
          message: replyMessage.trim(),
          customerEmail: user ? undefined : (guestEmail.trim() || selectedTicket.customerEmail),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Reply Sent',
          message: 'Your message has been added to the ticket thread.',
        });
        setReplyMessage('');
        // Refresh active ticket
        const updatedRes = await fetch(`/api/support/tickets/${selectedTicket.id}?email=${encodeURIComponent(selectedTicket.customerEmail)}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setSelectedTicket(updatedData.ticket);
        }
        if (user) {
          loadSupportData();
        }
      } else {
        showModal({
          type: 'error',
          title: 'Reply Failed',
          message: data.error || 'Could not post your reply.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not send reply.',
      });
    } finally {
      setIsSendingReply(false);
      hideLoader();
    }
  };

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTicketNum.trim()) {
      showToast({
        type: 'warning',
        title: 'Reference Required',
        message: 'Please enter your Ticket Reference (e.g. TKT-2026-...) or registered Email.',
      });
      return;
    }
    showLoader('Searching ticket records...');
    try {
      const q = trackTicketNum.trim();
      const isEmail = q.includes('@');
      const url = isEmail
        ? `/api/support/tickets?email=${encodeURIComponent(q)}`
        : `/api/support/tickets?ticketNumber=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success && data.tickets && data.tickets.length > 0) {
        setSelectedTicket(data.tickets[0]);
        showToast({
          type: 'success',
          title: 'Ticket Found',
          message: `Opened Ticket #${data.tickets[0].ticketNumber}`,
        });
      } else {
        showModal({
          type: 'error',
          title: 'Ticket Not Found',
          message: `No active support record found matching "${q}". Please check your ticket number or submit a new inquiry below.`,
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Search Error',
        message: 'Could not connect to ticket service.',
      });
    } finally {
      hideLoader();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>Open</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>In Progress</span>;
      case 'WAITING_FOR_CUSTOMER':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>Action Required</span>;
      case 'REOPENED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-200"><span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>Reopened</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">✓ Resolved</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">Closed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ========================================================= */}
        {/* HERO BANNER: TRANSPARENT SUPPORT WITH VILLAGE HERITAGE    */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
              <span>🏛️ కల్వరాల్ వస్త్ర సహాయ వేదిక</span>
              <span>•</span>
              <span>Online Streamlined Patron Support</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Patron Care &amp; Support Desk
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Every handloom garment, precision unstitched suiting cut, and postal consignment from our Kalwaral store is backed by transparent, direct online ticketing. No lost emails, no delays.
            </p>

            {/* SLA Reassurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="text-amber-400 font-bold text-base">⚡ 24 Hours</div>
                <div className="text-[11px] text-neutral-400">Guaranteed Resolution SLA</div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="text-emerald-400 font-bold text-base">🧵 Master Weavers</div>
                <div className="text-[11px] text-neutral-400">Direct Craft Guidance</div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="text-sky-400 font-bold text-base">📦 10 km / Post</div>
                <div className="text-[11px] text-neutral-400">Live Delivery Dispatch</div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="text-purple-400 font-bold text-base">⚖️ Rule 5(9)</div>
                <div className="text-[11px] text-neutral-400">Statutory Grievance Desk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Support Desk (Unauthenticated Access) */}
        {!user && !isLoading && (
          <div className="space-y-6">
            {/* Guest Action Header & Mode Toggle */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Accessible To All Patrons
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 mt-2">
                    KB Fashions Grievance & Artisan Support Desk
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    No account required. Submit inquiries, product questions, or statutory grievances directly.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="guest-tab-create-btn"
                    onClick={() => setGuestMode('CREATE')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                      guestMode === 'CREATE'
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    ➕ Raise a Ticket
                  </button>
                  <button
                    type="button"
                    id="guest-tab-track-btn"
                    onClick={() => setGuestMode('TRACK')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                      guestMode === 'TRACK'
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    🔍 Track Ticket
                  </button>
                  <Link
                    href="/auth/signin?redirect=/support"
                    className="px-4 py-2 text-xs font-bold rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-all ml-1"
                  >
                    Sign In →
                  </Link>
                </div>
              </div>

              {/* Mode 1: Raise Ticket Form */}
              {guestMode === 'CREATE' && (
                <form onSubmit={handleCreateTicket} className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900 bg-white"
                      >
                        <option value="ORDER_ISSUE">Order / Delivery Inquiries</option>
                        <option value="WEAVING_ADVICE">Artisan / Fabric Consultation</option>
                        <option value="DELIVERY_STATUS">10 km Local Delivery</option>
                        <option value="PRODUCT_QUERY">Product Details & Sizes</option>
                        <option value="BILLING_PAYMENT">Payment & Refund</option>
                        <option value="GRIEVANCE_RULE_5_9">Consumer Rule 5(9) Grievance</option>
                        <option value="OTHER">General Feedback / Inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Priority</label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900 bg-white"
                      >
                        <option value="LOW">Low (48h SLA)</option>
                        <option value="MEDIUM">Standard (24h SLA)</option>
                        <option value="HIGH">High (12h SLA)</option>
                        <option value="URGENT">Urgent (6h SLA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Order ID (Optional)</label>
                      <input
                        type="text"
                        value={newOrderId}
                        onChange={(e) => setNewOrderId(e.target.value)}
                        placeholder="e.g. KB-172900"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Subject / Summary *</label>
                    <input
                      type="text"
                      required
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Brief summary of your inquiry..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Detailed Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={newMessage}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      placeholder="Describe your inquiry in detail. Our Kalwaral village support desk responds directly..."
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900 resize-none"
                    ></textarea>
                    {abuseWarning && (
                      <p className="text-xs text-red-600 font-semibold mt-1">{abuseWarning}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-neutral-400">
                      ⚡ Guaranteed response within 6–24 hours as per Rule 5(9)
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white text-xs font-bold px-8 py-3 rounded-full hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Support Ticket →'}
                    </button>
                  </div>
                </form>
              )}

              {/* Mode 2: Track Ticket by Number or Email */}
              {guestMode === 'TRACK' && (
                <form onSubmit={handleTrackTicket} className="pt-6 space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Ticket Reference Number or Registered Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={trackTicketNum}
                        onChange={(e) => setTrackTicketNum(e.target.value)}
                        placeholder="e.g. TKT-2026-12345 or your-email@domain.com"
                        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="submit"
                        className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-all shadow-sm"
                      >
                        Search
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      Enter the ticket number received upon submission, or the email address used to raise the inquiry.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area (Logged In) */}
        {user && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-black text-neutral-900">Your Active Support Tickets</h2>
                <p className="text-xs text-neutral-500">Track and respond to conversations with KB Fashions artisans.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  id="raise-ticket-btn"
                  className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-all shadow-md flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Raise New Ticket</span>
                </button>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {[
                { key: 'ALL', label: 'All Tickets' },
                { key: 'OPEN', label: 'Open' },
                { key: 'IN_PROGRESS', label: 'In Progress' },
                { key: 'WAITING_FOR_CUSTOMER', label: 'Needs My Reply' },
                { key: 'RESOLVED', label: 'Resolved' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    filterStatus === tab.key
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-neutral-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            {isLoading ? (
              <div className="py-16 text-center">
                <SmoothLoader size="md" label="Loading tickets from database..." />
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <div className="text-4xl">🎫</div>
                <h3 className="text-sm font-bold text-neutral-800">No Support Tickets Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {filterStatus === 'ALL'
                    ? "You haven't submitted any support requests yet. If you have any inquiries regarding your fabric order or delivery, raise a ticket."
                    : `No tickets matching filter "${filterStatus}".`}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="mt-2 text-xs font-bold text-blue-600 underline hover:text-blue-800"
                  >
                    Raise a support ticket now →
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-neutral-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {ticket.ticketNumber}
                        </span>
                        {getStatusBadge(ticket.status)}
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {ticket.category.replace('_', ' ')}
                        </span>
                        {ticket.priority === 'URGENT' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            🚨 Urgent SLA
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 truncate">
                        {ticket.subject}
                      </h3>

                      <p className="text-xs text-neutral-500 line-clamp-1">
                        Last message: {ticket.messages[ticket.messages.length - 1]?.message || 'No messages yet'}
                      </p>

                      <div className="text-[11px] text-neutral-400 flex items-center gap-3 pt-1">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{ticket.messages.length} message(s)</span>
                        {ticket.orderId && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">Order: #{ticket.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                        className="text-xs font-bold text-black bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full transition-colors"
                      >
                        Open Thread →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: RAISE A NEW SUPPORT TICKET                       */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black font-black text-xl"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-kb-gold uppercase tracking-wider">Online Assistance</div>
              <h2 className="text-xl font-black text-neutral-900">Raise a Support Ticket</h2>
              <p className="text-xs text-neutral-500">
                Directly connects to our Kalwaral village customer desk. All requests are addressed with full transparency and timestamped audit logs.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Issue Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="ORDER_ISSUE">Order Issue / Packaging</option>
                    <option value="DELIVERY_DELAY">Delivery Delay / Rural Courier</option>
                    <option value="HANDLOOM_QUALITY">Handloom Quality / Fabric Care</option>
                    <option value="PAYMENT_BILLING">Payment &amp; Bill of Supply</option>
                    <option value="ACCOUNT_ACCESS">Patron Account / Password</option>
                    <option value="GENERAL">General Village Store Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="LOW">Low (48 Hours SLA)</option>
                    <option value="MEDIUM">Medium (24 Hours SLA)</option>
                    <option value="HIGH">High (12 Hours SLA)</option>
                    <option value="URGENT">Urgent (6 Hours SLA)</option>
                  </select>
                </div>
              </div>

              {/* Related Order Dropdown */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Related Order (Optional)</label>
                <select
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">-- No specific order linked --</option>
                  {orders.map(o => (
                    <option key={o.id || o.orderId} value={o.orderId || o.id}>
                      #{o.orderId || o.id} - ₹{o.totalAmount} ({new Date(o.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cut length inquiry for Raymond fabric"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-neutral-700">Detailed Message *</label>
                  <span className="text-[10px] text-neutral-400">Respectful language enforced</span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue with order number, garment details, or delivery question..."
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black ${
                    abuseWarning ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-neutral-50'
                  }`}
                />
                {abuseWarning && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{abuseWarning}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!abuseWarning}
                  className="px-7 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <SmoothLoader size="xs" color="white" />
                      <span>Submitting Ticket...</span>
                    </>
                  ) : (
                    <span>Submit Support Ticket →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TICKET DETAILS & CONVERSATION THREAD             */}
      {/* ========================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative animate-scale-up max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black font-black text-xl"
            >
              ✕
            </button>

            {/* Header info */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                  {selectedTicket.ticketNumber}
                </span>
                {getStatusBadge(selectedTicket.status)}
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {selectedTicket.category.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-neutral-900">
                {selectedTicket.subject}
              </h2>

              <div className="text-[11px] text-neutral-500 flex flex-wrap gap-4">
                <span>Raised: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                {selectedTicket.firstResponseAt && (
                  <span className="text-emerald-700 font-semibold">
                    First Replied: {new Date(selectedTicket.firstResponseAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {selectedTicket.orderId && (
                  <span className="font-medium text-blue-600">Order: #{selectedTicket.orderId}</span>
                )}
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[220px] max-h-[360px]">
              {selectedTicket.messages.map((m: any) => {
                const isAdmin = m.senderRole === 'ADMIN' || m.senderRole === 'SUPPORT_AGENT';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-neutral-400 mb-1 font-medium">
                      {m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-slate-100 text-neutral-900 rounded-tl-sm border border-slate-200'
                          : 'bg-black text-white rounded-tr-sm shadow-sm'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer Form */}
            {selectedTicket.status !== 'CLOSED' ? (
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 space-y-3">
                <div className="relative">
                  <textarea
                    rows={2}
                    required
                    placeholder="Type your response to support staff..."
                    value={replyMessage}
                    onChange={(e) => handleReplyChange(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black ${
                      replyAbuseWarning ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-neutral-50'
                    }`}
                  />
                  {replyAbuseWarning && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">{replyAbuseWarning}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium bg-neutral-100/70 px-3 py-1.5 rounded-lg border border-neutral-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Status managed by KB Support Desk</span>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyMessage.trim() || !!replyAbuseWarning}
                      className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSendingReply ? 'Sending...' : 'Send Message →'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-neutral-50 p-3 rounded-xl text-center text-xs text-neutral-500 border border-neutral-200">
                This ticket has been closed. If you have any additional issues, please raise a new ticket.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

