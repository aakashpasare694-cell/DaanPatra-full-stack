import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  History,
  Users,
  Lock,
  Settings as SettingsIcon,
  Search,
  Bell,
  Plus
} from 'lucide-react';

export default function AppLayout({ children, activeTab = 'donations', actionButton }) {
  const { auth } = usePage().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trustName = auth?.trust?.trust_name || 'Shree Ganesha Trust';
  const userName = auth?.user?.name || 'Aakash Pasare';
  const userRole = auth?.user?.role || 'admin';
  const isAdmin = !userRole || userRole.toLowerCase() === 'admin';

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
    { id: 'donations', name: 'Donations', href: route('donations.index'), icon: HeartHandshake },
    { id: 'reports', name: 'Reports & Ledger', href: route('reports.index'), icon: FileText },
    { id: 'activity-logs', name: 'Activity Logs', href: route('activity-logs.index'), icon: History },
    { id: 'users', name: 'Trust Members', href: route('users.index'), icon: Users },
    { id: 'settings', name: 'Settings', href: route('settings.receipt'), icon: SettingsIcon },
  ];

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen w-full bg-[#f6eee9] text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* DESKTOP FULL SCREEN LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#eee4dd] p-6 h-screen sticky top-0 justify-between flex-shrink-0 z-20">
        
        <div>
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20">
              🐘
            </div>
            <div>
              <h1 className="font-heading font-black text-slate-900 text-xl tracking-tight leading-none">
                Vargani
              </h1>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                Trust ERP
              </span>
            </div>
          </div>

          {/* User Profile Avatar & Badge */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#faf5f2] border border-[#f0e4dc] mb-6">
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 right-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                Online
              </div>
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">{userName}</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{auth?.user?.email}</p>
            <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
            }`}>
              {isAdmin ? <ShieldCheck className="w-3 h-3 text-amber-600" /> : <Lock className="w-3 h-3 text-slate-500" />}
              {isAdmin ? 'Trust Admin' : 'Normal User'}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#faf4ef]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="pt-4 border-t border-[#eee4dd]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-30 overflow-hidden">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#0EA5E9" d="M44.7,-59.4C56.6,-49.8,64.1,-34.5,67.6,-18.2C71.1,-1.9,70.6,15.4,63.7,29.7C56.8,44,43.5,55.3,28.4,61.4C13.3,67.5,-3.6,68.4,-19.9,64.2C-36.2,60,-51.9,50.7,-61.7,36.8C-71.5,22.9,-75.4,4.4,-72,-12.3C-68.6,-29,-57.9,-43.9,-44.1,-53.2C-30.3,-62.5,-15.2,-66.2,0.9,-67.4C17,-68.6,32.8,-69,44.7,-59.4Z" transform="translate(40 180)" />
          </svg>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-[#eee4dd] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-base">
            🐘
          </div>
          <div>
            <span className="font-heading font-black text-slate-900 text-base">
              Vargani
            </span>
            <p className="text-[10px] text-slate-500">{trustName}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#eee4dd] p-5 space-y-2 z-30 shadow-xl"
          >
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 mt-4 border-t border-slate-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN MAIN WORKSPACE CONTENT */}
      <div className="flex-1 bg-white p-6 md:p-8 flex flex-col min-w-0 min-h-screen">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#eee4dd]">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hello, {userName.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5 font-medium">
              Today is {currentDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf4ef] border border-[#eee4dd] flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#faf4ef] border border-[#eee4dd] flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2"></span>
            </div>
            
            {actionButton ? actionButton : (
              <Link
                href={route('donations.index')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>New Donation</span>
              </Link>
            )}
          </div>
        </div>

        {/* Normal User Warning */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Read-Only Access Mode:</span> You are logged in as a Normal User. View access is open, but creation and edits require Trust Admin permission.
            </div>
          </div>
        )}

        {/* Page Body */}
        <div className="flex-1">
          {children}
        </div>

      </div>

    </div>
  );
}
