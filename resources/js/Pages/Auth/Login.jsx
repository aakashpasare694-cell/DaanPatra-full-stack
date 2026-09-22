import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: 'admin@ganpatitrust.org',
    password: 'password123',
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  const handleFillDemo = (email, password) => {
    setData({
      email,
      password,
      remember: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f6eee9] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Background Soft Glow Circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-[#eee4dd] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white text-3xl font-black mb-3 shadow-lg shadow-orange-500/20">
            🐘
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
            Vargani Trust Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Sign in to your Ganpati Trust ERP & Financial Dashboard
          </p>
        </div>

        {/* Quick Clickable Demo Login Roles */}
        <div className="mb-6 space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Auto-Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@ganpatitrust.org', 'password123')}
              className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left hover:bg-amber-100 transition-all group"
            >
              <span className="text-xs font-black text-amber-900 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin Role
              </span>
              <span className="text-[10px] text-amber-700 font-medium block truncate">Full CRUD Privileges</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('user@ganpatitrust.org', 'password123')}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:bg-slate-100 transition-all group"
            >
              <span className="text-xs font-black text-slate-800 block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Normal User
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate">Read-Only Access</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              User Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="admin@ganpatitrust.org"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 font-bold">{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none font-bold">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="rounded border-[#e8ded8] text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-90 hover:scale-[1.01]"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2.5 text-amber-400 font-bold text-sm">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Opening Trust Dashboard...</span>
              </div>
            ) : (
              <>
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="mt-6 text-center pt-5 border-t border-[#eee4dd]">
          <p className="text-xs text-slate-500 font-medium">
            New Trust or Social Mandal?{' '}
            <Link href={route('register')} className="font-extrabold text-amber-600 hover:text-amber-700 transition-colors">
              Register Trust Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
