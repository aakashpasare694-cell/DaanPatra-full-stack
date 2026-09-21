import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    trust_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-saffron-500 selection:text-white">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-saffron-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 glass-panel"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-600 via-saffron-500 to-gold-500 text-white text-3xl font-bold mb-4 shadow-xl shadow-saffron-500/25">
            🐘
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-slate-100 tracking-tight">
            Register Trust Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create your festival trust & donation management workspace
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Trust Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Trust / Organization Name
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={data.trust_name}
                onChange={(e) => setData('trust_name', e.target.value)}
                placeholder="Shree Ganesh Utsav Mandal"
                className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                required
              />
            </div>
            {errors.trust_name && (
              <p className="text-red-400 text-xs mt-1 font-medium">{errors.trust_name}</p>
            )}
          </div>

          {/* User Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin User Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="contact@ganpatitrust.org"
                className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold rounded-xl shadow-lg shadow-saffron-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {processing ? (
              <span className="inline-block animate-spin font-bold">↻ Creating Account...</span>
            ) : (
              <>
                <span>Create Trust Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Already have a trust account?{' '}
            <Link href={route('login')} className="font-bold text-saffron-400 hover:text-saffron-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
