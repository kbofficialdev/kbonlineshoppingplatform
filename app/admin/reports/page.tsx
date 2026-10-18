"use client";

import React, { useState } from 'react';

export default function AdminReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('2026-Q3');

  const handleDownloadReport = () => {
    const csv = `Category,Orders,Revenue,Growth\nSarees,540,645000,+22%\nMen's Wear,280,295000,+16%\nKurtis,210,145000,+11%\nKids Wear,120,85000,+8%\nAccessories,98,75680,+14%`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KB_FASHIONS_SALES_REPORT_${reportPeriod}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-neutral-500 font-medium">Download statutory financial records and sales metrics.</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="inline-flex items-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export Financial CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase">Gross Merchandise Value</div>
          <div className="text-2xl font-black text-neutral-900">₹12,45,680</div>
          <div className="text-xs text-emerald-600 font-bold">+18% vs preceding period</div>
        </div>
        <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase">Tax-Exempt Retail Invoices</div>
          <div className="text-2xl font-black text-neutral-900">1,248 Bills</div>
          <div className="text-xs text-neutral-500 font-medium">Sec 23 CGST compliant</div>
        </div>
        <div className="bg-white border border-[#E8EAF0] p-6 rounded-2xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-neutral-500 uppercase">Average Order Value</div>
          <div className="text-2xl font-black text-neutral-900">₹998</div>
          <div className="text-xs text-blue-600 font-bold">Standard rural retail basket</div>
        </div>
      </div>

      {/* Revenue Breakdown by Category */}
      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">Department Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Consignments</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              <tr className="hover:bg-neutral-50/70">
                <td className="py-3.5 px-4 font-bold text-neutral-900">Gadwal & Handloom Sarees</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-600">540</td>
                <td className="py-3.5 px-4 font-black text-neutral-900">₹6,45,000</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">+22%</td>
              </tr>
              <tr className="hover:bg-neutral-50/70">
                <td className="py-3.5 px-4 font-bold text-neutral-900">Raymond & Arvind Men's Suitings</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-600">280</td>
                <td className="py-3.5 px-4 font-black text-neutral-900">₹2,95,000</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">+16%</td>
              </tr>
              <tr className="hover:bg-neutral-50/70">
                <td className="py-3.5 px-4 font-bold text-neutral-900">Daily Kurtis & Tunics</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-600">210</td>
                <td className="py-3.5 px-4 font-black text-neutral-900">₹1,45,000</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">+11%</td>
              </tr>
              <tr className="hover:bg-neutral-50/70">
                <td className="py-3.5 px-4 font-bold text-neutral-900">Kids Wear & Frocks</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-600">120</td>
                <td className="py-3.5 px-4 font-black text-neutral-900">₹85,000</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">+8%</td>
              </tr>
              <tr className="hover:bg-neutral-50/70">
                <td className="py-3.5 px-4 font-bold text-neutral-900">Accessories & Footwear</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-600">98</td>
                <td className="py-3.5 px-4 font-black text-neutral-900">₹75,680</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">+14%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
