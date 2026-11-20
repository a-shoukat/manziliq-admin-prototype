import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Scale,
  ScrollText,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type { User } from '../lib/supabase';
import {
  demoAuditLogs,
  demoDisputes,
  demoListings,
  demoUsers,
  demoVerifications,
  salesChartData,
  societyShare,
} from '../data/demo';

type ViewId = 'overview' | 'analytics' | 'users' | 'verification' | 'moderation' | 'disputes' | 'audit';

const NAV: { id: ViewId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, badge: '6' },
  { id: 'verification', label: 'Verification Queue', icon: <FileCheck2 className="w-4 h-4" />, badge: '2' },
  { id: 'moderation', label: 'Content Moderation', icon: <ShieldCheck className="w-4 h-4" />, badge: '2' },
  { id: 'disputes', label: 'Disputes', icon: <Scale className="w-4 h-4" />, badge: '2' },
  { id: 'audit', label: 'Audit Logs', icon: <ScrollText className="w-4 h-4" /> },
];

const VIEW_TITLES: Record<ViewId, { title: string; sub: string }> = {
  overview: { title: 'Governance & Executive Control Center', sub: 'Platform overview — societies, bookings, flags and disputes at a glance.' },
  analytics: { title: 'System Analytics', sub: 'Sales, bookings and society share across the platform.' },
  users: { title: 'User Management', sub: 'All platform accounts — buyers, dealers, society admins.' },
  verification: { title: 'Verification Queue', sub: 'CNIC, licence and NOC documents awaiting review.' },
  moderation: { title: 'Listing Queue', sub: 'Property listings awaiting approval or flagged by the system.' },
  disputes: { title: 'Dispute Management', sub: 'Title and boundary cases currently open.' },
  audit: { title: 'Audit Logs', sub: 'Who did what, and when — platform activity record.' },
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
    Flagged: 'bg-rose-50 text-rose-700 border-rose-200',
    Open: 'bg-rose-50 text-rose-700 border-rose-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return `text-[11px] font-bold px-2 py-0.5 rounded-full border ${map[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`;
};

const BarChart: React.FC = () => {
  const max = Math.max(...salesChartData.map((d) => d.salesPKR));
  return (
    <div>
      <div className="flex items-end gap-2 h-44">
        {salesChartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] font-bold text-slate-500">{d.salesPKR}M</span>
            <div
              className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-300"
              style={{ height: `${(d.salesPKR / max) * 72}%` }}
              title={`${d.month}: PKR ${d.salesPKR}M, ${d.bookings} bookings`}
            />
            <span className="text-[10px] font-bold text-slate-400">{d.month}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 mt-3">Monthly sales (PKR millions) • Jan – Aug • Sample data</p>
    </div>
  );
};

const Donut: React.FC = () => {
  const total = societyShare.reduce((s, x) => s + x.value, 0);
  let offset = 25;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="16" />
        {societyShare.map((s) => {
          const frac = s.value / total;
          const el = (
            <circle
              key={s.name}
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${frac * 100} ${100 - frac * 100}`}
              strokeDashoffset={offset}
              pathLength={100}
            />
          );
          offset -= frac * 100;
          return el;
        })}
        <text x="60" y="57" textAnchor="middle" className="fill-slate-900" fontSize="18" fontWeight="800">4</text>
        <text x="60" y="73" textAnchor="middle" className="fill-slate-400" fontSize="9">societies</text>
      </svg>
      <ul className="space-y-2 text-xs">
        {societyShare.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="font-semibold text-slate-700">{s.name}</span>
            <span className="text-slate-400 ml-auto">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onSignOut }) => {
  const [view, setView] = useState<ViewId>('overview');
  const [toast, setToast] = useState<string | null>(null);

  const demoAction = (label: string) => {
    setToast(`Prototype — “${label}” is a demo action. Nothing was saved.`);
    window.setTimeout(() => setToast(null), 3200);
  };

  const displayName =
    (user.user_metadata && typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name) ||
    user.email?.split('@')[0] ||
    'Admin';

  const viewTitle = VIEW_TITLES[view];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-slate-950 text-slate-300 min-h-screen sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <span className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <div className="font-display font-black text-lg text-white leading-none">MANZILIQ</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Admin Prototype</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Platform Super Admin</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
                view === item.id ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${view === item.id ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-display font-black text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{displayName}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
            </div>
            <button
              onClick={onSignOut}
              title="Sign out"
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-slate-950 text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="font-display font-black">MANZILIQ</span>
          </div>
          <button onClick={onSignOut} className="p-2 rounded-lg hover:bg-white/10" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="md:hidden flex gap-1.5 overflow-x-auto bg-slate-950 px-3 pb-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${view === item.id ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-900 font-bold text-[11px] px-2 py-0.5 rounded border border-indigo-200">
                Platform Super Admin
              </span>
              <span className="bg-amber-100 text-amber-800 font-bold text-[11px] px-2 py-0.5 rounded border border-amber-200">
                PROTOTYPE — sample data
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900 mt-1.5">{viewTitle.title}</h1>
            <p className="text-xs text-slate-500">{viewTitle.sub}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-500">
            <Search className="w-4 h-4" />
            <input
              placeholder="Search (visual only)"
              className="bg-transparent outline-none text-sm w-44 placeholder:text-slate-400"
              readOnly
            />
          </div>
          <button
            onClick={() => demoAction('Review Pending Queue')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            Review Pending Queue (2)
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto">
          {view === 'overview' && (
            <>
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Platform Super Admin • Real Estate &amp; Municipal Oversight
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">Governance &amp; Executive Control Center</h2>
                  <p className="text-xs text-slate-300">
                    Authorized Officer: <strong>{displayName}</strong> ({user.email})
                  </p>
                </div>
                <button
                  onClick={() => demoAction('Add Property')}
                  className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  + Add Property
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Housing Societies', value: '4 Projects', note: '100% TMA Verified', noteClass: 'text-emerald-700', icon: <Building2 className="w-5 h-5" />, iconClass: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Gross Bookings GMV', value: 'PKR 48.2M', note: '62 Token Agreements', noteClass: 'text-slate-500', icon: <TrendingUp className="w-5 h-5" />, iconClass: 'bg-blue-50 text-blue-700' },
                  { label: 'Duplicate Flags', value: '2 Detected', note: 'Auto-filtered from public', noteClass: 'text-slate-500', icon: <AlertTriangle className="w-5 h-5" />, iconClass: 'bg-amber-50 text-amber-700' },
                  { label: 'Title Disputes', value: '1 Case Active', note: 'Plot 12-A Frozen', noteClass: 'text-rose-600', icon: <Scale className="w-5 h-5" />, iconClass: 'bg-rose-50 text-rose-700' },
                ].map((c) => (
                  <div key={c.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
                      <div className="text-2xl font-display font-black text-slate-900 mt-1">{c.value}</div>
                      <div className={`text-[11px] font-semibold mt-0.5 ${c.noteClass}`}>{c.note}</div>
                    </div>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${c.iconClass}`}>{c.icon}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-display font-bold text-slate-900">Sales Overview</h3>
                  <p className="text-[11px] text-slate-400 mb-4">Gross bookings value by month • Sample data</p>
                  <BarChart />
                </div>
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-display font-bold text-slate-900">Listings by Society</h3>
                  <p className="text-[11px] text-slate-400 mb-4">Share of active listings • Sample data</p>
                  <Donut />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-900">Listing Queue — awaiting review</h3>
                  <button onClick={() => setView('moderation')} className="text-xs font-bold text-indigo-700 hover:underline">
                    Open moderation →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="px-5 py-3 font-bold">Listing</th>
                        <th className="px-5 py-3 font-bold">Society</th>
                        <th className="px-5 py-3 font-bold">Price</th>
                        <th className="px-5 py-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoListings.filter((l) => l.status === 'Pending').map((l) => (
                        <tr key={l.id} className="border-b border-slate-50">
                          <td className="px-5 py-3 font-semibold text-slate-800">{l.title}</td>
                          <td className="px-5 py-3 text-slate-500">{l.society}</td>
                          <td className="px-5 py-3 text-slate-500">{l.price}</td>
                          <td className="px-5 py-3"><span className={statusBadge(l.status)}>{l.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'analytics' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Platform Users', value: '128 Users', note: '+12 this month' },
                  { label: 'Active Listings', value: '86 Listings', note: 'Across 4 societies' },
                  { label: 'Conversion Rate', value: '18.4%', note: 'Views → token bookings' },
                ].map((c) => (
                  <div key={c.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
                    <div className="text-2xl font-display font-black text-slate-900 mt-1">{c.value}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{c.note}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-display font-bold text-slate-900">Monthly Sales &amp; Bookings</h3>
                <p className="text-[11px] text-slate-400 mb-4">Sample data — Jan to Aug</p>
                <BarChart />
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-display font-bold text-slate-900">Listings by Society</h3>
                <p className="text-[11px] text-slate-400 mb-4">Sample data</p>
                <Donut />
              </div>
            </>
          )}

          {view === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-900">All Users ({demoUsers.length})</h3>
                <p className="text-[11px] text-slate-400">Sample data — actions are disabled in this prototype.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-3 font-bold">User</th>
                      <th className="px-5 py-3 font-bold">Role</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 font-bold">Joined</th>
                      <th className="px-5 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{u.role}</td>
                        <td className="px-5 py-3"><span className={statusBadge(u.status)}>{u.status}</span></td>
                        <td className="px-5 py-3 text-slate-500">{u.joined}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => demoAction('Suspend user')} className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                              Suspend
                            </button>
                            <button onClick={() => demoAction('Approve user')} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'verification' && (
            <div className="space-y-4">
              {demoVerifications.map((v) => (
                <div key={v.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="text-xs text-slate-500">{v.type} • Submitted {v.submitted}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Documents: {v.doc}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => demoAction('Approve verification')} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => demoAction('Reject verification')} className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-slate-400">Sample data — verification documents are not real files in this prototype.</p>
            </div>
          )}

          {view === 'moderation' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-900">Listing Queue ({demoListings.length})</h3>
                <p className="text-[11px] text-slate-400">Sample data — approve / reject are disabled in this prototype.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-3 font-bold">Listing</th>
                      <th className="px-5 py-3 font-bold">Dealer</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoListings.map((l) => (
                      <tr key={l.id} className="border-b border-slate-50">
                        <td className="px-5 py-3">
                          <div className="font-semibold text-slate-800">{l.title}</div>
                          <div className="text-xs text-slate-400">{l.society} • {l.price}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{l.dealer}</td>
                        <td className="px-5 py-3"><span className={statusBadge(l.status)}>{l.status}</span></td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => demoAction('Approve listing')} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                              Approve
                            </button>
                            <button onClick={() => demoAction('Reject listing')} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'disputes' && (
            <div className="space-y-4">
              {demoDisputes.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{d.plot} — {d.society}</div>
                      <div className="text-xs text-slate-500">Filed by {d.filedBy}</div>
                    </div>
                    <span className={statusBadge(d.status)}>{d.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">{d.summary}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => demoAction('Open dispute case')} className="text-[11px] font-bold px-3 py-2 rounded-lg bg-slate-900 text-white">
                      Open case
                    </button>
                    <button onClick={() => demoAction('Resolve dispute')} className="text-[11px] font-bold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Mark resolved
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-slate-400">Sample data — dispute cases are illustrative only.</p>
            </div>
          )}

          {view === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-900">Audit Logs</h3>
                <p className="text-[11px] text-slate-400">Sample data — platform activity record.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-3 font-bold">Time</th>
                      <th className="px-5 py-3 font-bold">Actor</th>
                      <th className="px-5 py-3 font-bold">Action</th>
                      <th className="px-5 py-3 font-bold">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoAuditLogs.map((a) => (
                      <tr key={a.id} className="border-b border-slate-50">
                        <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{a.time}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{a.actor}</td>
                        <td className="px-5 py-3 text-slate-600">{a.action}</td>
                        <td className="px-5 py-3 text-slate-500">{a.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Demo toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-[92vw]">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
};
