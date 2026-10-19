"use client";

import React, { useState } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'KB Store Administrator',
      email: 'kb.official.admin@gmail.com',
      role: 'ADMIN',
      phone: '+91 7989768200',
      lastActive: 'Just now',
      status: 'Active',
    },
    {
      id: 'usr-2',
      name: 'Kalwaral Store Runner',
      email: 'runner@kbfashions.in',
      role: 'LOGISTICS_RUNNER',
      phone: '+91 9876543210',
      lastActive: '2 hours ago',
      status: 'Active',
    },
    {
      id: 'usr-3',
      name: 'Rural Support Agent',
      email: 'support@kbfashions.in',
      role: 'SUPPORT_AGENT',
      phone: '+91 9123456789',
      lastActive: 'Yesterday',
      status: 'Active',
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Users & Staff Roles</h1>
          <p className="text-xs text-neutral-500 font-medium">Control backoffice privileges, logistics runners, and support agents.</p>
        </div>

        <button
          type="button"
          onClick={() => alert('Invite Staff Member Dialog')}
          className="inline-flex items-center gap-2 bg-[#3478F6] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Invite Staff</span>
        </button>
      </div>

      <div className="bg-white border border-[#E8EAF0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAF0] bg-neutral-50/70 text-neutral-500 font-bold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]/70">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-900">{u.name}</div>
                    <div className="text-[11px] text-neutral-500">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-700">{u.phone}</td>
                  <td className="py-3.5 px-4 text-neutral-500">{u.lastActive}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Edit staff role: ${u.name}`)}
                      className="text-[#3478F6] font-bold hover:underline"
                    >
                      Edit Role
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

