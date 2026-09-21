import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Building2,
  HeartHandshake
} from 'lucide-react';

export default function AppLayout({ children, activeTab = 'donations' }) {
  const { auth } = usePage().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trustName = auth?.trust?.trust_name || 'Ganpati Festival Trust';
  const userName = auth?.user?.name || 'Trust Member';

  const navItems = [
    { id: 'donations', name: 'Dashboard / Donations', href: route('donations.index'), icon: LayoutDashboard },
    { id: 'reports', name: 'Reports & Expenses', href: route('reports.index'), icon: FileText },
  ];

  const handleLogout = () => {
    router.post(route('logout'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900/80 border-r border-slate-800/80 p-5 sticky top-0 h-screen glass-panel">
        
        {/* Trust Branding */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 via-saffron-500 to-gold-500 flex items-center justify-center shadow-lg shadow-saffron-500/20 text-white font-bold text-xl">
            🐘
          </div>
          <div className="overflow-hidden">
            <h1 className="font-heading font-bold text-slate-100 text-base leading-snug truncate" title={trustName}>
              {trustName}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded-full mt-1">
              <ShieldCheck className="w-3 h-3" /> Verified Trust
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-saffron-600 to-saffron-500 text-white shadow-md shadow-saffron-600/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-saffron-200" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick Trust Stat Footer */}
        <div className="mt-auto pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/40 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <HeartHandshake className="w-4 h-4 text-saffron-400" />
              <span>Social & Cultural Festival</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ganpati Festival Utsav 2026 Management System
            </p>
          </div>

          {/* User & Logout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 flex items-center justify-center font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate">{auth?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-saffron-600 flex items-center justify-center text-white font-bold text-sm">
            🐘
          </div>
          <span className="font-heading font-bold text-slate-100 text-sm truncate max-w-[200px]">
            {trustName}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-[57px] bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 p-4 z-30 shadow-2xl"
          >
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm ${
                      isActive ? 'bg-saffron-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 mt-4 border-t border-slate-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
