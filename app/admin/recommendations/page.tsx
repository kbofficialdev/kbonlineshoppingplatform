"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/clientAuth';
import { useToast } from '@/components/ToastContext';
import { SmoothLoader } from '@/components/SmoothLoader';

export default function AdminRecommendationsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'BASKET' | 'INVENTORY' | 'RFM'>('EXECUTIVE');
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMLReport();
  }, []);

  const loadMLReport = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/admin/ml-analytics');
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        showToast({
          type: 'error',
          title: 'Analytics Error',
          message: data.error || 'Could not load ML recommendation model.',
        });
      }
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to ML analytics endpoint.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <SmoothLoader size="md" label="Running ML recommendation models on database orders..." />
      </div>
    );
  }

  const summary = report?.summaryMetrics || {
    averageOrderBasketSize: 1.2,
    topCoPurchasedPair: null,
    skusRequiringUrgentReorder: 0,
    vipCustomerCount: 0,
    estimatedCrossSellLiftRevenue: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">AI Recommendation &amp; Decision Engine</h1>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3478F6] border border-blue-200">
              Live ML Model
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Predictive machine learning algorithms trained on real database orders, market basket co-occurrences, and customer RFM profiles.
          </p>
        </div>

        <button
          onClick={loadMLReport}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E8EAF0] bg-white text-neutral-800 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>⚡</span>
          <span>Re-compute Models</span>
        </button>
      </div>

      {/* 2. OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8EAF0] p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Executive Decisions</div>
          <div className="text-2xl font-black text-neutral-900">{report?.executiveRecommendations?.length || 0}</div>
          <div className="text-[10px] text-neutral-400">Actionable strategic priorities</div>
        </div>

        <div className="bg-white border border-blue-200 bg-blue-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Association Rules Discovered</div>
          <div className="text-2xl font-black text-[#3478F6]">{report?.marketBasketRules?.length || 0}</div>
          <div className="text-[10px] text-blue-600 font-medium">Cross-sell bundle patterns</div>
        </div>

        <div className="bg-white border border-amber-200 bg-amber-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Stockout Vulnerabilities</div>
          <div className="text-2xl font-black text-amber-600">{summary.skusRequiringUrgentReorder}</div>
          <div className="text-[10px] text-amber-700 font-semibold">SKUs below safety stock point</div>
        </div>

        <div className="bg-white border border-emerald-200 bg-emerald-50/20 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">VIP Patron Cohort</div>
          <div className="text-2xl font-black text-emerald-600">{summary.vipCustomerCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Top lifetime revenue segment</div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('EXECUTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'EXECUTIVE'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
          }`}
        >
          🎯 Executive Recommendations ({report?.executiveRecommendations?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('BASKET')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'BASKET'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
          }`}
        >
          🧺 Market Basket &amp; Cross-Sell ({report?.marketBasketRules?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'INVENTORY'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
          }`}
        >
          📈 Demand Forecasting &amp; ROP ({report?.inventoryForecasts?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('RFM')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'RFM'
              ? 'bg-[#3478F6] text-white shadow-xs'
              : 'bg-white border border-[#E8EAF0] text-neutral-600 hover:text-black hover:border-neutral-300'
          }`}
        >
          👥 Customer RFM Segmentation ({report?.customerSegments?.length || 0})
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: EXECUTIVE RECOMMENDATIONS */}
      {activeTab === 'EXECUTIVE' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-200 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-xs font-bold text-blue-950">AI Executive Synthesis</h4>
              <p className="text-[11px] text-blue-900 mt-0.5 leading-relaxed">
                The ML recommendation engine analyzes live basket combinations, stock velocity, and customer recency to provide strategic directives for revenue growth and inventory optimization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report?.executiveRecommendations?.map((rec: any) => (
              <div
                key={rec.id}
                className="bg-white border border-[#E8EAF0] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      rec.category === 'CROSS_SELL'
                        ? 'bg-blue-50 text-[#3478F6] border border-blue-200'
                        : rec.category === 'INVENTORY'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : rec.category === 'MARKETING'
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {rec.category.replace(/_/g, ' ')}
                    </span>

                    <span className="text-[10px] font-extrabold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {rec.priority} PRIORITY
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-neutral-900 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Expected Impact:</span>
                    <span className="font-bold text-emerald-700">{rec.expectedRevenueImpact}</span>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-800 font-medium leading-relaxed">
                    <strong>Recommended Action:</strong> {rec.suggestedAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MARKET BASKET ANALYSIS */}
      {activeTab === 'BASKET' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8EAF0] rounded-2xl p-5 shadow-2xs space-y-1">
            <h3 className="font-bold text-sm text-neutral-900">Frequent Itemset Association Rules (Apriori Model)</h3>
            <p className="text-xs text-neutral-500">
              Identifies statistically significant pairs of products bought together. <strong>Lift &gt; 1.0</strong> indicates a strong positive affinity between items.
            </p>
          </div>

          {report?.marketBasketRules?.length === 0 ? (
            <div className="bg-white border border-[#E8EAF0] rounded-2xl p-12 text-center text-xs text-neutral-400 space-y-2">
              <div className="text-3xl">🧺</div>
              <p className="font-bold text-neutral-800">No multi-item basket pairs detected yet.</p>
              <p>As customers place multi-item orders, association rules will automatically appear here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-[#E8EAF0] text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">If Customer Buys (Antecedent)</th>
                      <th className="py-3 px-4">They Also Buy (Consequent)</th>
                      <th className="py-3 px-4 text-center">Confidence</th>
                      <th className="py-3 px-4 text-center">Lift Factor</th>
                      <th className="py-3 px-4 text-center">Orders</th>
                      <th className="py-3 px-4">Recommended Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EAF0] font-medium">
                    {report?.marketBasketRules?.map((rule: any, idx: number) => (
                      <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-neutral-900 max-w-xs truncate">
                          {rule.antecedentName}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#3478F6] max-w-xs truncate">
                          {rule.consequentName}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          {(rule.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                            rule.lift >= 2.0
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {rule.lift}x
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-neutral-600">
                          {rule.frequency}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 text-[11px] leading-relaxed">
                          {rule.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEMAND FORECASTING & INVENTORY */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8EAF0] rounded-2xl p-5 shadow-2xs space-y-1">
            <h3 className="font-bold text-sm text-neutral-900">Inventory Velocity &amp; Reorder Point (ROP) Forecasting</h3>
            <p className="text-xs text-neutral-500">
              Evaluates daily run-rates, remaining days of inventory cover, and handloom production lead times (14 days weaving + 7 days safety buffer).
            </p>
          </div>

          <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-[#E8EAF0] text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Handloom SKU / Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Stock on Hand</th>
                    <th className="py-3 px-4 text-center">Velocity (units/day)</th>
                    <th className="py-3 px-4 text-center">Days Cover</th>
                    <th className="py-3 px-4 text-center">Reorder Point</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Automated Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF0] font-medium">
                  {report?.inventoryForecasts?.map((item: any) => (
                    <tr key={item.productId} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900 max-w-xs truncate">
                        {item.productName}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                        {item.currentStock}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-600">
                        {item.dailyVelocity}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {item.daysOfInventoryLeft} d
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-600">
                        {item.reorderPoint}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.urgency === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : item.urgency === 'WARNING'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : item.urgency === 'OVERSTOCKED'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.urgency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 text-[11px] leading-relaxed">
                        {item.businessAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER RFM SEGMENTATION */}
      {activeTab === 'RFM' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8EAF0] rounded-2xl p-5 shadow-2xs space-y-1">
            <h3 className="font-bold text-sm text-neutral-900">Customer Lifecycle &amp; RFM Clustering</h3>
            <p className="text-xs text-neutral-500">
              Groups registered customer accounts by Recency (days since last purchase), Frequency (total orders), and Monetary total.
            </p>
          </div>

          <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-[#E8EAF0] text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Recency</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4 text-center">Total Spent</th>
                    <th className="py-3 px-4 text-center">Cohort Tier</th>
                    <th className="py-3 px-4">Actionable Nurture Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF0] font-medium">
                  {report?.customerSegments?.map((seg: any) => (
                    <tr key={seg.userId} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {seg.name}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {seg.email}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {seg.recencyDays === 999 ? 'Never' : `${seg.recencyDays}d ago`}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {seg.orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                        ₹{seg.monetaryTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          seg.segmentName === 'VIP Champion'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : seg.segmentName === 'Loyal Patron'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : seg.segmentName === 'High-Value At-Risk'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : seg.segmentName === 'Recent First-Timer'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {seg.segmentName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 text-[11px] leading-relaxed">
                        {seg.strategicAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

