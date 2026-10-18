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

  // Selected ticket for review/reply
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
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
        setTickets(data.tickets || []);
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
    setNewStatus(ticket.status);
    setReplyText('');
    setReplyAbuseWarning(null);
  };

  const handleReplyChange = (val: string) => {
    setReplyText(val);
    const check = detectAbuseLanguage(val);
    if (check.hasAbuse) {
      setReplyAbuseWarning(`⚠️ Inappropriate word detected: "${check.flaggedWords.join(', ')}"`);
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
          title: 'Reply Sent',
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
          message: `Ticket marked as ${statusToSet}`,
        });
        setSelectedTicket(data.ticket);
        loadTickets();
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

  const openTicketsCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-kbBorder pb-6">
        <div>
          <div className="text-xs font-bold text-kb-gold uppercase tracking-wider">Patron Relationship Hub</div>
          <h1 className="text-2xl font-black text-neutral-900">Support Desk &amp; Ticket Resolution</h1>
          <p className="text-xs text-neutral-500">
            Real-time, zero-mail online support system with bilingual profanity filtering and SLA accountability.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin"
            className="text-xs font-bold px-4 py-2 rounded-full border border-slate-200 hover:bg-neutral-100"
          >
            ← Admin Dashboard
          </Link>
          <button
            onClick={loadTickets}
            className="text-xs font-bold px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800"
          >
            ↻ Refresh Tickets
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-kbBorder p-4 rounded-2xl space-y-1">
          <div className="text-xs font-bold text-neutral-500">Total Inquiries</div>
          <div className="text-2xl font-black text-black">{tickets.length}</div>
          <div className="text-[10px] text-neutral-400">All registered issues</div>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/30 p-4 rounded-2xl space-y-1">
          <div className="text-xs font-bold text-amber-800">Open Awaiting First Reply</div>
          <div className="text-2xl font-black text-amber-700">{openTicketsCount}</div>
          <div className="text-[10px] text-amber-600 font-semibold">Priority SLA queue</div>
        </div>

        <div className="bg-white border border-blue-200 bg-blue-50/30 p-4 rounded-2xl space-y-1">
          <div className="text-xs font-bold text-blue-800">In Active Discussion</div>
          <div className="text-2xl font-black text-blue-700">{inProgressCount}</div>
          <div className="text-[10px] text-blue-600">Patron or staff replying</div>
        </div>

        <div className="bg-white border border-emerald-200 bg-emerald-50/30 p-4 rounded-2xl space-y-1">
          <div className="text-xs font-bold text-emerald-800">Resolved Patrons</div>
          <div className="text-2xl font-black text-emerald-700">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">100% Satisfaction SLA</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-kbBorder text-xs">
        <span className="font-bold text-neutral-700">Filter By:</span>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
                filterStatus === st ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-bold text-neutral-700">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-kbBorder bg-neutral-50 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent (6h)</option>
            <option value="HIGH">High (12h)</option>
            <option value="MEDIUM">Medium (24h)</option>
            <option value="LOW">Low (48h)</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-kbBorder rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <SmoothLoader size="md" label="Loading support tickets..." />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400 space-y-2">
            <div className="text-3xl">🎫</div>
            <p>No support tickets match the selected filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-kbBorder text-xs">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectTicket(t)}
                className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-black bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                      {t.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'OPEN' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      t.status === 'WAITING_FOR_CUSTOMER' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-neutral-600 uppercase text-[10px]">
                      {t.category.replace('_', ' ')}
                    </span>
                    {t.priority === 'URGENT' && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        🚨 Urgent
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-neutral-900 text-sm">
                    {t.subject}
                  </h3>

                  <div className="text-neutral-500 text-[11px] flex flex-wrap gap-3">
                    <span><strong>Customer:</strong> {t.customerName} ({t.customerPhone || t.customerEmail})</span>
                    <span>•</span>
                    <span><strong>Raised:</strong> {new Date(t.createdAt).toLocaleString()}</span>
                    {t.orderId && (
                      <>
                        <span>•</span>
                        <span className="text-blue-700 font-semibold">Order: #{t.orderId}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {t.messages.length} msg(s)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSelectTicket(t); }}
                    className="px-4 py-2 bg-black text-white rounded-full font-bold text-xs hover:bg-neutral-800 transition-colors"
                  >
                    Manage &amp; Reply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DRAWER / MODAL: TICKET RESOLUTION & THREAD                */}
      {/* ========================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative animate-scale-up max-h-[92vh] flex flex-col">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-black font-black text-xl"
            >
              ✕
            </button>

            {/* Header */}
            <div className="border-b border-kbBorder pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm bg-neutral-100 px-2.5 py-1 rounded border">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    {selectedTicket.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-700">Status:</span>
                  <select
                    value={selectedTicket.status}
                    disabled={selectedTicket.status === 'CLOSED'}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-kbBorder bg-neutral-50 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {getAllowedTicketStatuses(selectedTicket.status).map((stg) => (
                      <option key={stg.value} value={stg.value}>{stg.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-lg font-black text-neutral-900">{selectedTicket.subject}</h2>

              {/* Customer summary card */}
              <div className="bg-neutral-50 border border-kbBorder p-3 rounded-xl text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-neutral-500 block">Patron:</span>
                  <strong>{selectedTicket.customerName}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Contact:</span>
                  <span>{selectedTicket.customerEmail} | {selectedTicket.customerPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Linked Order:</span>
                  <span>{selectedTicket.orderId ? `#${selectedTicket.orderId}` : 'None'}</span>
                </div>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[200px] max-h-[320px]">
              {selectedTicket.messages.map((m: any) => {
                const isAdmin = m.senderRole === 'ADMIN' || m.senderRole === 'SUPPORT_AGENT';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-neutral-400 mb-1 font-medium">
                      {m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-black text-white rounded-tr-sm shadow-sm'
                          : 'bg-slate-100 text-neutral-900 rounded-tl-sm border border-slate-200'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Canned Templates */}
            <div className="space-y-1.5 border-t border-kbBorder pt-3">
              <div className="text-[11px] font-bold text-neutral-500">Quick Artisan Responses:</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => applyTemplate("Namaste! We have physically verified your cut length on our wooden measuring table in Kalwaral store with the extra buffer.")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full text-[11px] font-medium"
                >
                  ✂ Cut Length Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("Namaskaram! Our village delivery assistant will deliver your parcel today between 5:30 PM and 8:00 PM.")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full text-[11px] font-medium"
                >
                  🚚 Village Doorstep ETA
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("Namaste! The pure silk Gadwal handloom saree has passed our master weaver quality check and is sealed in dust-proof cotton packaging.")}
                  className="bg-neutral-100 hover:bg-neutral-200 px-3 py-1 rounded-full text-[11px] font-medium"
                >
                  🧵 Handloom Quality Verified
                </button>
              </div>
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendAdminReply} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  required
                  placeholder="Type official store reply to customer..."
                  value={replyText}
                  onChange={(e) => handleReplyChange(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black ${
                    replyAbuseWarning ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-neutral-50'
                  }`}
                />
                {replyAbuseWarning && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{replyAbuseWarning}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  ✓ Mark Resolved
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyText.trim() || !!replyAbuseWarning}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingReply ? 'Posting Reply...' : 'Post Admin Reply →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

