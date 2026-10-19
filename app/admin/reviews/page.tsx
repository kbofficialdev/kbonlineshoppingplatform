"use client";

import React, { useState } from 'react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      customer: 'Priya Sharma',
      product: 'Banarasi Silk Saree',
      rating: 5,
      date: '12 Oct 2026',
      comment: 'Authentic handloom weave, rich zari pallu and arrived safely under local delivery.',
      status: 'APPROVED',
    },
    {
      id: 'rev-2',
      customer: 'Rahul Verma',
      product: "Men's Kurta Set",
      rating: 5,
      date: '11 Oct 2026',
      comment: 'Raymond fine suiting fabric cut was exact. Very pleased with stitching advice.',
      status: 'APPROVED',
    },
    {
      id: 'rev-3',
      customer: 'Anjali Rao',
      product: 'Designer Kurti',
      rating: 4,
      date: '10 Oct 2026',
      comment: 'Pure cotton feel, comfortable daily wear. Quick dispatch.',
      status: 'APPROVED',
    },
    {
      id: 'rev-4',
      customer: 'Kiran Reddy',
      product: 'Traditional Double Pancha Dhoti',
      rating: 5,
      date: '08 Oct 2026',
      comment: 'Traditional gold zari border was top quality for village temple festive function.',
      status: 'APPROVED',
    },
  ]);

  const handleToggleStatus = (id: string) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'APPROVED' ? 'HIDDEN' : 'APPROVED' };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Customer Reviews</h1>
        <p className="text-xs text-neutral-500 font-medium">Verify and moderate verified purchaser feedback.</p>
      </div>

      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900">{rev.customer}</td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-700">{rev.product}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex text-amber-400">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-xs">{rev.comment}</td>
                  <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">{rev.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      rev.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(rev.id)}
                      className="text-[#3478F6] font-bold hover:underline"
                    >
                      {rev.status === 'APPROVED' ? 'Hide' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

