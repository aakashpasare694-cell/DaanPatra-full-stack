import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Plus, 
  Wallet, 
  ArrowRight,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function Dashboard({ 
  metrics = {}, 
  charts = {}, 
  topDonors = [], 
  recentActivity = [] 
}) {
  const { auth } = usePage().props;

  // Defensive prop fallbacks to prevent React white-screen crashes
  const safeMetrics = {
    totalPledged: 0,
    collectedAmount: 0,
    pendingAmount: 0,
    totalExpenses: 0,
    netBalance: 0,
    donorCount: 0,
    ...metrics
  };

  const safeCharts = {
    paymentMethods: [],
    trends: [],
    statusBreakdown: [],
    expensesByCategory: [],
    ...charts
  };

  const safeTopDonors = Array.isArray(topDonors) ? topDonors : [];
  const safeRecentActivity = Array.isArray(recentActivity) ? recentActivity : [];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <AppLayout 
      activeTab="dashboard"
      actionButton={
        <Link
          href={route('donations.index')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Record Donation</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT & CENTER WORKSPACE (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 3 TOP COLORFUL SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Purple (Total Collection) */}
            <div className="bg-[#5c246f] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[170px]">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-purple-300 text-purple-900 font-bold text-xs flex items-center justify-center border-2 border-[#5c246f]">A</div>
                  <div className="w-7 h-7 rounded-full bg-purple-400 text-purple-900 font-bold text-xs flex items-center justify-center border-2 border-[#5c246f]">R</div>
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center border-2 border-[#5c246f]">+5</div>
                </div>
                <button className="text-white/70 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <div className="mt-4">
                <h3 className="font-heading font-extrabold text-lg leading-tight">Total Collection</h3>
                <p className="text-xs text-purple-200 mt-0.5">{formatCurrency(safeMetrics.collectedAmount)}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-purple-200">
                  <span>{safeMetrics.totalPledged > 0 ? Math.round((safeMetrics.collectedAmount / safeMetrics.totalPledged) * 100) : 0}% Target</span>
                  <span>{safeMetrics.donorCount} Devotees</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all" 
                    style={{ width: `${Math.min(100, safeMetrics.totalPledged > 0 ? Math.round((safeMetrics.collectedAmount / safeMetrics.totalPledged) * 100) : 0)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card 2: Soft Teal (Total Expenses) */}
            <div className="bg-[#5ebec4] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[170px]">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-teal-200 text-teal-900 font-bold text-xs flex items-center justify-center border-2 border-[#5ebec4]">E</div>
                  <div className="w-7 h-7 rounded-full bg-teal-300 text-teal-900 font-bold text-xs flex items-center justify-center border-2 border-[#5ebec4]">P</div>
                  <div className="w-7 h-7 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center border-2 border-[#5ebec4]">+8</div>
                </div>
                <button className="text-white/70 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <div className="mt-4">
                <h3 className="font-heading font-extrabold text-lg leading-tight">Total Expenses</h3>
                <p className="text-xs text-teal-100 mt-0.5">{formatCurrency(safeMetrics.totalExpenses)}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-teal-100">
                  <span>Expense Budget</span>
                  <span>Festival Setup</span>
                </div>
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: '46%' }}></div>
                </div>
              </div>
            </div>

            {/* Card 3: Coral Orange (Net Balance) */}
            <div className="bg-[#ff6b57] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[170px]">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-orange-200 text-orange-900 font-bold text-xs flex items-center justify-center border-2 border-[#ff6b57]">N</div>
                  <div className="w-7 h-7 rounded-full bg-amber-200 text-orange-900 font-bold text-xs flex items-center justify-center border-2 border-[#ff6b57]">B</div>
                  <div className="w-7 h-7 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center border-2 border-[#ff6b57]">+3</div>
                </div>
                <button className="text-white/70 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              </div>

              <div className="mt-4">
                <h3 className="font-heading font-extrabold text-lg leading-tight">Net Trust Balance</h3>
                <p className="text-xs text-orange-100 mt-0.5">{formatCurrency(safeMetrics.netBalance)}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-orange-100">
                  <span>Surplus Funds</span>
                  <span>Healthy</span>
                </div>
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: '73%' }}></div>
                </div>
              </div>
            </div>

          </div>

          {/* LOWER SECTION: RECENT DONATIONS & QUICK STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Recent Donations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-slate-900 text-base">
                  Recent Donations
                </h3>
                <Link href={route('donations.index')} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {safeTopDonors.slice(0, 3).map((donor, idx) => {
                  const borderColors = ['border-l-[#ff6b57]', 'border-l-[#5c246f]', 'border-l-[#5ebec4]'];
                  return (
                    <div 
                      key={idx}
                      className={`bg-white border border-[#eee4dd] border-l-4 ${borderColors[idx % 3]} p-4 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow`}
                    >
                      <div>
                        <h4 className="font-heading font-bold text-slate-900 text-sm">{donor.donor_name || donor.name || 'Anonymous'}</h4>
                        <p className="text-xs text-slate-500 font-medium">{donor.category || 'Festival Donation'} • {donor.payment_method || 'Cash'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(donor.amount)}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {safeTopDonors.length === 0 && (
                  <div className="p-6 text-center text-slate-400 bg-[#faf4ef] rounded-2xl border border-dashed border-[#e8ded8]">
                    No donations recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Stats & Festival Goal Widget */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">
                Trust Statistics
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#faf4ef] p-4 rounded-2xl text-center border border-[#eee4dd]">
                  <div className="font-black text-xl text-slate-900">{safeMetrics.donorCount}</div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">Devotees</div>
                </div>

                <div className="bg-[#faf4ef] p-4 rounded-2xl text-center border border-[#eee4dd]">
                  <div className="font-black text-xl text-emerald-600">
                    {safeMetrics.totalPledged > 0 ? Math.round((safeMetrics.collectedAmount / safeMetrics.totalPledged) * 100) : 0}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">Collected</div>
                </div>

                <Link 
                  href={route('donations.index')}
                  className="bg-white border-2 border-dashed border-[#e8ded8] hover:border-amber-400 p-4 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:bg-amber-500 transition-colors">+</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-1">Add New</div>
                </Link>
              </div>

              {/* Modern Graphic Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/70 p-5 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md">
                    2026 Utsav Goal
                  </span>
                  <h4 className="font-heading font-extrabold text-slate-900 text-lg mt-1.5">
                    {formatCurrency(safeMetrics.totalPledged)}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Grand Utsav Celebration & Bhandara Fund
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 flex-shrink-0">
                  🌺
                </div>
              </div>

            </div>

          </div>

          {/* DIAGRAMS ROW: COLLECTION TREND */}
          <div className="bg-[#faf4ef] border border-[#eee4dd] p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" /> Collection Trend Diagram
                </h3>
                <p className="text-xs text-slate-500">Daily financial breakdown</p>
              </div>
            </div>

            <div className="h-64 w-full bg-white p-4 rounded-2xl border border-[#eee4dd]">
              {safeCharts.trends && safeCharts.trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={safeCharts.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      formatter={(val) => [formatCurrency(val), 'Amount']}
                    />
                    <Area type="monotone" dataKey="Paid" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#paidGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No trend data available yet.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE PANEL: LIVE ACTIVITY FEED & CALENDAR */}
        <div className="lg:col-span-4 bg-[#faf4ef] border border-[#eee4dd] rounded-3xl p-6 flex flex-col space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#eee4dd]">
            <h3 className="font-heading font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              Activity Feed
            </h3>
            <div className="w-8 h-8 rounded-full bg-white border border-[#eee4dd] flex items-center justify-center text-slate-600 shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-3">
                Sep 22, 2026
              </span>
              <div className="space-y-4">
                {safeRecentActivity.slice(0, 5).map((act, i) => {
                  const borderColors = ['border-amber-500', 'border-emerald-500', 'border-sky-500', 'border-purple-500'];
                  return (
                    <div key={i} className="flex gap-3 text-xs">
                      <span className="font-bold text-slate-400 min-w-[45px] text-right pt-0.5">
                        {act.time || '10:00'}
                      </span>
                      <div className={`pl-3 border-l-2 ${borderColors[i % 4]} space-y-0.5`}>
                        <p className="font-bold text-slate-900 leading-snug">{act.user || act.title || 'Donation Recorded'}</p>
                        <p className="text-slate-500 font-medium">{act.action || act.subtitle || 'Receipt Generated'}</p>
                      </div>
                    </div>
                  );
                })}

                {safeRecentActivity.length === 0 && (
                  <div className="text-xs text-slate-400 italic">No recent system activity.</div>
                )}
              </div>
            </div>

            {/* Top Donors Quick Highlights */}
            <div className="pt-4 border-t border-[#eee4dd]">
              <h4 className="font-heading font-extrabold text-slate-900 text-sm mb-3">
                Top Benefactors
              </h4>
              <div className="space-y-2.5">
                {safeTopDonors.slice(0, 3).map((donor, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-2xl border border-[#eee4dd] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        {(donor.donor_name || donor.name || 'D').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs truncate max-w-[110px]">{donor.donor_name || donor.name}</p>
                        <p className="text-[10px] text-slate-400">{donor.receipt_number || 'Receipt Verified'}</p>
                      </div>
                    </div>
                    <span className="font-black text-amber-600 text-xs">{formatCurrency(donor.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
