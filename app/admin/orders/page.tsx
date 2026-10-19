"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';

interface OrderItem {
  id: string;
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
}

interface OrderTimelineEvent {
  id: string;
  stage: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
}

interface Order {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  villageOrCity: string;
  streetAddress: string;
  pinCode: string;
  totalPaid: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  courierPartner?: string | null;
  trackingNumber?: string | null;
  createdAt: string;
  items: OrderItem[];
  timeline: OrderTimelineEvent[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Selected Order for Management Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOrderStatus, setModalOrderStatus] = useState<string>('CONFIRMED');
  const [modalPaymentStatus, setModalPaymentStatus] = useState<string>('CAPTURED');
  const [modalCourier, setModalCourier] = useState<string>('KB 10km Express Runner');
  const [modalTracking, setModalTracking] = useState<string>('');
  const [modalTimelineNote, setModalTimelineNote] = useState<string>('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<boolean>(false);
  const [paymentAttempts, setPaymentAttempts] = useState<any[]>([]);

  const statusTabs = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'ORDER_PLACED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Dispatched', value: 'DISPATCHED' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/orders');
      const data = await res.json();
      if (data?.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenManageModal = async (order: Order) => {
    setSelectedOrder(order);
    setModalOrderStatus(order.orderStatus);
    setModalPaymentStatus(order.paymentStatus);
    setModalCourier(order.courierPartner || 'KB 10km Express Runner');
    setModalTracking(order.trackingNumber || `KB-LOC-${Math.floor(100000 + Math.random() * 900000)}`);
    setModalTimelineNote(`Consignment stage updated by store management at Kalwaral hub.`);

    // Fetch individual order details including payment attempts
    try {
      const res = await authFetch(`/api/orders/${order.orderId}`);
      const data = await res.json();
      if (data?.paymentAttempts) {
        setPaymentAttempts(data.paymentAttempts);
      }
    } catch (e) {
      setPaymentAttempts([]);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdatingOrder(true);
      const res = await authFetch(`/api/orders/${selectedOrder.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: modalOrderStatus,
          paymentStatus: modalPaymentStatus,
          courierPartner: modalCourier,
          trackingNumber: modalTracking,
          timelineNote: modalTimelineNote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: `✓ Order #${selectedOrder.orderId} updated to ${modalOrderStatus}. Customer tracking updated.`,
          type: 'success',
        });
        setSelectedOrder(null);
        fetchOrders();
      } else {
        setActionMessage({ text: data.error || 'Failed to update order', type: 'error' });
      }
    } catch (err) {
      setActionMessage({ text: 'Error communicating with orders API', type: 'error' });
    } finally {
      setIsUpdatingOrder(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Filter orders in real time
  const filtered = orders.filter((o) => {
    const matchesTab =
      activeTab === 'All' || o.orderStatus?.toUpperCase() === activeTab.toUpperCase();

    const matchesSearch =
      !search ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Real-time orders pipeline, consignment stage updates, tracking assignment, and payment verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500">Total Live Orders:</span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-600 border border-blue-200">
            {orders.length} Orders
          </span>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold border transition-all ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* 2. ORDER STATUS TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E8EAF0] text-xs">
        {statusTabs.map((tab) => {
          const isSelected = activeTab === tab.value;
          const count =
            tab.value === 'All'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.value).length;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-3.5 py-2 font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#3478F6] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-neutral-200/70 text-neutral-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & TOOLBAR */}
      <div className="bg-white border border-[#E8EAF0] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer, or Invoice..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-[#E8EAF0] rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#3478F6] focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-[#E8EAF0] text-xs font-semibold text-neutral-700 px-3 py-2 rounded-xl focus:outline-none focus:border-[#3478F6] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="order_placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="out_for_delivery">Out For Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 4. ORDERS DATA TABLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            No orders match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Stage</th>
                  <th className="py-3 px-4">Courier / Tracking</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]/70">
                {filtered.map((order) => {
                  const isDelivered = order.orderStatus === 'DELIVERED';
                  const isDispatched = order.orderStatus === 'DISPATCHED' || order.orderStatus === 'OUT_FOR_DELIVERY';
                  const isPaid = order.paymentStatus === 'CAPTURED';

                  return (
                    <tr key={order.orderId} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                        <div>#{order.orderId}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">{order.invoiceNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-500">{order.customerPhone || order.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-600">
                        {order.items?.length || 1} item(s)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        ₹{order.totalPaid?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : isDispatched
                              ? 'bg-sky-50 text-sky-600 border-sky-200'
                              : order.orderStatus === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}
                        >
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 text-[11px]">
                        {order.trackingNumber ? (
                          <div>
                            <span className="font-mono font-semibold text-neutral-800">{order.trackingNumber}</span>
                            <span className="block text-[10px] text-neutral-400">{order.courierPartner}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenManageModal(order)}
                          className="px-3 py-1.5 bg-[#3478F6] hover:bg-blue-600 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                        >
                          Manage & Update →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. ORDER MANAGEMENT & STAGE ADVANCE MODAL                */}
      {/* ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E8EAF0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-4">
              <div>
                <h2 className="text-lg font-black text-neutral-900">
                  Manage Order #{selectedOrder.orderId}
                </h2>
                <p className="text-xs text-neutral-500">
                  Update fulfillment stage, assign courier partner, and log delivery events.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Order Summary & Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50/70 p-4 rounded-2xl border border-[#E8EAF0] text-xs">
              <div>
                <span className="font-bold text-neutral-500 block mb-1">Customer & Delivery:</span>
                <div className="font-bold text-neutral-900">{selectedOrder.customerName}</div>
                <div className="text-neutral-600">{selectedOrder.customerPhone} • {selectedOrder.customerEmail}</div>
                <div className="text-neutral-600 mt-1">{selectedOrder.streetAddress}, {selectedOrder.villageOrCity} - {selectedOrder.pinCode}</div>
              </div>
              <div>
                <span className="font-bold text-neutral-500 block mb-1">Billing Summary:</span>
                <div className="font-bold text-neutral-900">Invoice: {selectedOrder.invoiceNumber}</div>
                <div className="text-neutral-600">Subtotal: ₹{selectedOrder.subtotal} | Shipping: ₹{selectedOrder.shippingFee}</div>
                <div className="text-emerald-700 font-black text-sm mt-1">Total Paid: ₹{selectedOrder.totalPaid} ({selectedOrder.paymentMethod})</div>
              </div>
            </div>

            {/* PAYMENT ATTEMPTS AUDIT TRAIL */}
            {paymentAttempts.length > 0 && (
              <div className="border border-[#E8EAF0] p-4 rounded-2xl space-y-2">
                <span className="font-bold text-neutral-800 text-xs block">
                  💳 Payment Attempts Audit Log ({paymentAttempts.length} Total Attempts):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {paymentAttempts.map((tx) => (
                    <div
                      key={tx.id}
                      className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
                        tx.status === 'SUCCESS'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div>
                        <span className="font-bold">Attempt #{tx.attemptNumber}:</span> {tx.gateway} • ₹{tx.amount}
                        {tx.failureReason && (
                          <div className="text-[10px] text-rose-700 mt-0.5 font-medium">
                            Reason: {tx.failureReason}
                          </div>
                        )}
                      </div>
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-white border">
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update Form */}
            <form onSubmit={handleUpdateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order Status */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Fulfillment Stage *</label>
                  <select
                    value={modalOrderStatus}
                    onChange={(e) => setModalOrderStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 cursor-pointer"
                  >
                    <option value="ORDER_PLACED">ORDER PLACED (Initial Queue)</option>
                    <option value="CONFIRMED">CONFIRMED (Inspected & Packed)</option>
                    <option value="DISPATCHED">DISPATCHED (In Transit)</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (Local Runner)</option>
                    <option value="DELIVERED">DELIVERED (Doorstep Handover)</option>
                    <option value="CANCELLED">CANCELLED (Cancelled by Admin)</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Payment Status *</label>
                  <select
                    value={modalPaymentStatus}
                    onChange={(e) => setModalPaymentStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 cursor-pointer"
                  >
                    <option value="CAPTURED">CAPTURED (Payment Received)</option>
                    <option value="PENDING">PENDING (Awaiting Cash/Transfer)</option>
                    <option value="REFUNDED">REFUNDED (Returned to Patron)</option>
                    <option value="FAILED">FAILED (Transaction Declined)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Courier Partner */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Courier / Delivery Runner</label>
                  <input
                    type="text"
                    value={modalCourier}
                    onChange={(e) => setModalCourier(e.target.value)}
                    placeholder="e.g. KB 10km Express Runner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Consignment Tracking Number</label>
                  <input
                    type="text"
                    value={modalTracking}
                    onChange={(e) => setModalTracking(e.target.value)}
                    placeholder="e.g. KB-LOC-882910"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Timeline Update Note */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Customer Status Event Note (Visible on customer tracking page)
                </label>
                <textarea
                  rows={2}
                  value={modalTimelineNote}
                  onChange={(e) => setModalTimelineNote(e.target.value)}
                  placeholder="e.g. Garments inspected for handloom purity and dispatched with village runner."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EAF0] font-medium text-neutral-900 focus:outline-none focus:border-[#3478F6] bg-neutral-50/50 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8EAF0] text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingOrder}
                  className="px-6 py-2.5 bg-[#3478F6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isUpdatingOrder ? 'Saving...' : 'Save & Advance Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
