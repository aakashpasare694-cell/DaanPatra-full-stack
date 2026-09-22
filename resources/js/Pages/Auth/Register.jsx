import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f6eee9] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Background Soft Glow Circles */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-[#eee4dd] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white text-3xl font-black mb-4 shadow-lg shadow-orange-500/20">
            🐘
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight">
            Register Trust Account
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Create your festival trust & donation management workspace
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Trust Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Trust / Organization Name
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={data.trust_name}
                onChange={(e) => setData('trust_name', e.target.value)}
                placeholder="Shree Ganesh Utsav Mandal"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
            {errors.trust_name && (
              <p className="text-rose-600 text-xs mt-1 font-bold">{errors.trust_name}</p>
            )}
          </div>

          {/* User Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin User Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="contact@ganpatitrust.org"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1 font-bold">{errors.email}</p>
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
                placeholder="Minimum 8 characters"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1 font-bold">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full mt-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {processing ? (
              <span className="inline-block animate-spin font-bold">↻ Creating Account...</span>
            ) : (
              <>
                <span>Create Trust Account</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center pt-6 border-t border-[#eee4dd]">
          <p className="text-xs text-slate-500 font-medium">
            Already have a trust account?{' '}
            <Link href={route('login')} className="font-extrabold text-amber-600 hover:text-amber-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
