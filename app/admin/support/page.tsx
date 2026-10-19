"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';
import { useModalAlert } from '@/components/ModalContext';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';
import { detectAbuseLanguage } from '@/lib/abuseFilter';

export default function AdminSupportPage() {
  const { showModal } = useModalAlert();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected ticket for review/reply
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);
  const [replyAbuseWarning, setReplyAbuseWarning] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, [filterStatus, filterPriority]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      let query = `/api/support/tickets?`;
      if (filterStatus !== 'ALL') query += `status=${filterStatus}&`;
      if (filterPriority !== 'ALL') query += `priority=${filterPriority}&`;

      const res = await authFetch(query);
      const data = await res.json();
      if (data.success) {
        const loaded = data.tickets || [];
        setTickets(loaded);
        // If a ticket was previously selected, keep it updated
        if (selectedTicket) {
          const fresh = loaded.find((t: any) => t.id === selectedTicket.id);
          if (fresh) setSelectedTicket(fresh);
        }
      } else {
        showToast({ type: 'error', title: 'Error', message: data.error || 'Could not load tickets' });
      }
    } catch (e) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to connect to support API' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setReplyAbuseWarning(null);
  };

  const handleReplyChange = (val: string) => {
    setReplyText(val);
    const check = detectAbuseLanguage(val);
    if (check.hasAbuse) {
      setReplyAbuseWarning(`⚠️ Inappropriate phrasing detected: "${check.flaggedWords.join(', ')}"`);
    } else {
      setReplyAbuseWarning(null);
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const check = detectAbuseLanguage(replyText);
    if (check.hasAbuse) {
      showToast({
        type: 'warning',
        title: 'Review Phrasing',
        message: 'Admin replies must adhere to professional guidelines.',
      });
      return;
    }

    try {
      setIsSubmittingReply(true);
      const res = await authFetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Reply Dispatched',
          message: 'Response posted to customer ticket thread.',
        });
        setReplyText('');

        // Refresh selected ticket
        const updatedRes = await authFetch(`/api/support/tickets/${selectedTicket.id}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setSelectedTicket(updatedData.ticket);
        }
        loadTickets();
      } else {
        showModal({
          type: 'error',
          title: 'Reply Failed',
          message: data.error || 'Could not send response.',
        });
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Network Error', message: 'Failed to post reply' });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleUpdateStatus = async (statusToSet: string) => {
    if (!selectedTicket) return;
    try {
      const res = await authFetch(`/api/support/tickets/${selectedTicket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusToSet }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast({
          type: 'success',
          title: 'Status Updated',
          message: `Ticket marked as ${statusToSet.replace(/_/g, ' ')}`,
        });
        setSelectedTicket(data.ticket);
        loadTickets();
      } else {
        showToast({
          type: 'error',
          title: 'Status Transition Error',
          message: data.error || 'Invalid ticket status transition',
        });
      }
    } catch (e) {
      showToast({ type: 'error', title: 'Error', message: 'Could not update ticket status' });
    }
  };

  const getAllowedTicketStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'OPEN':
        return [
          { value: 'OPEN', label: 'OPEN' },
          { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
          { value: 'WAITING_FOR_CUSTOMER', label: 'WAITING FOR CUSTOMER' },
          { value: 'RESOLVED', label: 'RESOLVED' },
          { value: 'CLOSED', label: 'CLOSED' },
        ];
      case 'IN_PROGRESS':
      case 'WAITING_FOR_CUSTOMER':
      case 'REOPENED':
        return [
          { value: currentStatus, label: currentStatus.replace(/_/g, ' ') },
          { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
          { value: 'WAITING_FOR_CUSTOMER', label: 'WAITING FOR CUSTOMER' },
          { value: 'RESOLVED', label: 'RESOLVED' },
          { value: 'CLOSED', label: 'CLOSED' },
        ].filter((item, idx, self) => self.findIndex(i => i.value === item.value) === idx);
      case 'RESOLVED':
        return [
          { value: 'RESOLVED', label: 'RESOLVED' },
          { value: 'REOPENED', label: 'REOPENED' },
          { value: 'CLOSED', label: 'CLOSED' },
        ];
      case 'CLOSED':
        return [
          { value: 'CLOSED', label: 'CLOSED (Terminal)' }
        ];
      default:
        return [];
    }
  };

  const applyTemplate = (text: string) => {
    setReplyText(text);
  };

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticketNumber?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.customerName?.toLowerCase().includes(q) ||
      t.customerEmail?.toLowerCase().includes(q) ||
      t.orderId?.toLowerCase().includes(q)
    );
  });

  const openTicketsCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_CUSTOMER').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Support Desk &amp; Resolution</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#3478F6] border border-blue-200">
              Live Dispatch Desk
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Real-time customer issue triage, dispute resolution, and conversation thread management.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={loadTickets}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border border-[#E8EAF0] bg-white text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>↻</span>
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8EAF0] p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total Tickets</div>
          <div className="text-2xl font-black text-neutral-900">{tickets.length}</div>
          <div className="text-[10px] text-neutral-400">All registered customer issues</div>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Awaiting First Reply</div>
          <div className="text-2xl font-black text-amber-600">{openTicketsCount}</div>
          <div className="text-[10px] text-amber-700 font-semibold">Priority SLA queue (within 2h)</div>
        </div>

        <div className="bg-white border border-blue-200 bg-blue-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">In Active Discussion</div>
          <div className="text-2xl font-black text-[#3478F6]">{inProgressCount}</div>
          <div className="text-[10px] text-blue-600">Patron or support replying</div>
        </div>

        <div className="bg-white border border-emerald-200 bg-emerald-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Resolved Tickets</div>
          <div className="text-2xl font-black text-emerald-600">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">100% resolution compliance</div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket #, subject, customer, email, order..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8EAF0] text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 focus:bg-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'].map((st) => {
            const isActive = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#08090C] text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace(/_/g, ' ')}
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-neutral-500">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E8EAF0] bg-neutral-50 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#3478F6]"
          >
            <option value="ALL">All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 4. MASTER-DETAIL SPLIT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* TICKET QUEUE LIST (Left: 5 cols on lg) */}
        <div className={`lg:col-span-5 bg-white border border-[#E8EAF0] rounded-2xl shadow-2xs overflow-hidden ${selectedTicket ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 border-b border-[#E8EAF0] bg-neutral-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              Support Inquiries ({filteredTickets.length})
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">Sorted by newest</span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <SmoothLoader size="md" label="Loading support tickets..." />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-20 text-center text-xs text-neutral-400 space-y-2">
              <div className="text-3xl">🎫</div>
              <p className="font-semibold text-neutral-700">No support tickets found</p>
              <p>Adjust your search query or status filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8EAF0] max-h-[720px] overflow-y-auto">
              {filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const isOpen = t.status === 'OPEN';
                const isProgress = t.status === 'IN_PROGRESS';
                const isResolved = t.status === 'RESOLVED';
                const isWaiting = t.status === 'WAITING_FOR_CUSTOMER';

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={`p-4 transition-all cursor-pointer text-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-blue-50/40 border-l-4 border-l-[#3478F6]'
                        : 'hover:bg-neutral-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                          {t.ticketNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          isOpen
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : isProgress
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : isWaiting
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : isResolved
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {t.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {t.priority === 'URGENT' && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          🚨 Urgent
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs sm:text-sm line-clamp-1">
                        {t.subject}
                      </h4>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {t.messages?.[t.messages.length - 1]?.message || 'No messages yet'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-600">
                        <span>👤 {t.customerName}</span>
                        {t.orderId && <span className="text-[#3478F6] font-semibold">• #{t.orderId}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💬 {t.messages?.length || 1}</span>
                        <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CONVERSATION & RESOLUTION STUDIO (Right: 7 cols on lg) */}
        <div className={`lg:col-span-7 bg-white border border-[#E8EAF0] rounded-2xl shadow-2xs overflow-hidden ${!selectedTicket ? 'hidden lg:block' : 'block'}`}>
          {!selectedTicket ? (
            <div className="py-32 px-6 text-center text-xs text-neutral-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center text-2xl mx-auto">
                💬
              </div>
              <h3 className="font-bold text-neutral-800 text-sm">No Ticket Selected</h3>
              <p className="max-w-sm mx-auto text-neutral-500">
                Select any support ticket from the queue on the left to inspect customer details, review message history, and post official responses.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full min-h-[640px]">
              {/* Studio Header */}
              <div className="p-4 sm:p-5 border-b border-[#E8EAF0] bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="lg:hidden px-2.5 py-1 text-xs font-bold bg-neutral-200 text-neutral-800 rounded-lg"
                    >
                      ← Back
                    </button>
                    <span className="font-mono font-black text-sm bg-white border border-[#E8EAF0] px-2.5 py-1 rounded-xl text-neutral-900 shadow-2xs">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-neutral-700 bg-white border border-[#E8EAF0] px-2.5 py-1 rounded-xl shadow-2xs">
                      {selectedTicket.category?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Quick Status Control */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Lifecycle:</span>
                    <select
                      value={selectedTicket.status}
                      disabled={selectedTicket.status === 'CLOSED'}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#E8EAF0] bg-white text-xs font-bold text-neutral-900 shadow-2xs focus:outline-none focus:border-[#3478F6] disabled:opacity-50"
                    >
                      {getAllowedTicketStatuses(selectedTicket.status).map((stg) => (
                        <option key={stg.value} value={stg.value}>{stg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-neutral-900">{selectedTicket.subject}</h3>
                  <div className="text-[11px] text-neutral-500 mt-0.5 flex flex-wrap gap-2">
                    <span>Opened: {new Date(selectedTicket.createdAt).toLocaleString('en-IN')}</span>
                    {selectedTicket.orderId && (
                      <>
                        <span>•</span>
                        <Link href={`/admin/orders`} className="text-[#3478F6] font-bold hover:underline">
                          Linked Order #{selectedTicket.orderId}
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* Customer Details Strip */}
                <div className="p-3 bg-white rounded-xl border border-[#E8EAF0] text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">Patron Name</span>
                    <strong className="text-neutral-900">{selectedTicket.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="text-neutral-700 truncate block">{selectedTicket.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-mono text-neutral-700">{selectedTicket.customerPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Message Thread Scroll Area */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[360px] bg-neutral-50/30">
                {selectedTicket.messages?.map((m: any) => {
                  const isAdmin = m.senderRole === 'ADMIN' || m.senderRole === 'SUPPORT_AGENT';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-neutral-400 mb-1 font-medium flex items-center gap-1.5">
                        <span className="font-bold text-neutral-700">{m.senderName}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                          isAdmin
                            ? 'bg-[#08090C] text-white rounded-tr-xs'
                            : 'bg-white text-neutral-900 border border-[#E8EAF0] rounded-tl-xs'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Canned Artisan Templates */}
              <div className="p-3 bg-white border-t border-[#E8EAF0] space-y-1.5">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Quick Artisan Response Presets:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate("Namaste! We have physically verified your handloom saree cut length on our measuring table in Kalwaral store with the certified buffer.")}
                    className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-lg text-[11px] font-medium text-neutral-700 transition-colors"
                  >
                    ✂ Cut Length Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Namaste! Your consignment has been dispatched via DTDC Express. Tracking number will be active within 2 hours.")}
                    className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-lg text-[11px] font-medium text-neutral-700 transition-colors"
                  >
                    📦 Dispatched with DTDC
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Your transaction has been verified with Cashfree gateway. The refund has been initiated to your source UPI/account within 48h.")}
                    className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-lg text-[11px] font-medium text-neutral-700 transition-colors"
                  >
                    💳 Refund Authorized
                  </button>
                </div>
              </div>

              {/* Response Composer Form */}
              <form onSubmit={handleSendAdminReply} className="p-4 bg-white border-t border-[#E8EAF0] space-y-3">
                <div>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => handleReplyChange(e.target.value)}
                    placeholder="Type official reply to customer thread... (Bilingual English & Telugu supported)"
                    disabled={selectedTicket.status === 'CLOSED'}
                    className="w-full p-3 rounded-xl border border-[#E8EAF0] text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] disabled:opacity-50 resize-none bg-neutral-50/50 focus:bg-white"
                  />
                  {replyAbuseWarning && (
                    <div className="text-xs text-rose-600 font-semibold mt-1">
                      {replyAbuseWarning}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] text-neutral-400">
                    Pressing send logs message to live patron ticket thread.
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedTicket.status === 'OPEN' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('IN_PROGRESS')}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#E8EAF0] hover:bg-neutral-50 text-neutral-700 transition-colors"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('RESOLVED')}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyText.trim() || selectedTicket.status === 'CLOSED'}
                      className="px-5 py-2 bg-[#3478F6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                    >
                      {isSubmittingReply ? 'Dispatching...' : 'Send Reply →'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
