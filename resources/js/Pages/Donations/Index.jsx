import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AppLayout from '@/Layouts/AppLayout';
import DonationReceiptModal from '@/Components/DonationReceiptModal';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Trash2, 
  Calendar, 
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

export default function Index({ summary, donations, pendingDonations, filters, flash }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'Rajesh Sharma';
  const trustName = auth?.trust?.trust_name || 'Shree Ganesha Seva Trust';

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'All');
  const [selectedMethod, setSelectedMethod] = useState(filters.method || 'All');

  // Smart Form State
  const { data, setData, post, put, processing, reset, errors } = useForm({
    donor_name: '',
    donor_mobile: '',
    donor_email: '',
    amount: '',
    amount_in_words: '',
    payment_method: 'Cash',
    payment_status: 'Paid',
    follow_up_after_days: '1 Day',
    collected_by: userName,
  });

  // Automatically pop up receipt modal when a donation is created
  useEffect(() => {
    if (flash?.createdDonation) {
      setSelectedReceipt(flash.createdDonation);
      toast.success('Donation recorded successfully!');
    }
  }, [flash?.createdDonation]);

  // Client-side helper for quick auto-generating amount in words
  const handleAmountChange = (e) => {
    const val = e.target.value;
    setData('amount', val);

    if (val && !isNaN(val) && Number(val) > 0) {
      const words = convertNumberToWords(Number(val));
      setData((prev) => ({
        ...prev,
        amount: val,
        amount_in_words: words,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        amount: val,
        amount_in_words: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDonation) {
      put(route('donations.update', editingDonation._id), {
        onSuccess: () => {
          setEditingDonation(null);
          reset();
          toast.success('Donation updated successfully.');
        }
      });
    } else {
      post(route('donations.store'), {
        onSuccess: () => {
          reset();
        }
      });
    }
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setData({
      donor_name: donation.donor_name,
      donor_mobile: donation.donor_mobile,
      donor_email: donation.donor_email || '',
      amount: donation.amount,
      amount_in_words: donation.amount_in_words || '',
      payment_method: donation.payment_method,
      payment_status: donation.payment_status,
      follow_up_after_days: donation.follow_up_after_days || '1 Day',
      collected_by: donation.collected_by,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this donation record?')) {
      router.delete(route('donations.destroy', id), {
        onSuccess: () => toast.success('Donation deleted.'),
      });
    }
  };

  const handleMarkAsPaid = (id) => {
    router.post(route('donations.markAsPaid', id), {
      onSuccess: () => toast.success('Donation marked as Paid! Total collected updated.'),
    });
  };

  const handleSearchFilter = (newSearch, newStatus, newMethod) => {
    router.get(
      route('donations.index'),
      { search: newSearch, status: newStatus, method: newMethod },
      { preserveState: true, replace: true }
    );
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <AppLayout activeTab="donations">
      <div className="space-y-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-saffron-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Ganpati Festival 2026
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Donation Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Record new festival donations, issue instant digital receipts, and track pending follow-ups.
            </p>
          </div>
        </div>

        {/* 1. TOP SUMMARY WIDGETS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Amount */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 glass-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount</span>
              <div className="w-9 h-9 rounded-xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-slate-100">
              {formatCurrency(summary.totalAmount)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <span>Overall pledged donations</span>
            </p>
          </motion.div>

          {/* Card 2: Collected Amount */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 glass-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collected</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-emerald-400">
              {formatCurrency(summary.collectedAmount)}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
              <span>Received in bank & cash</span>
            </p>
          </motion.div>

          {/* Card 3: Pending Amount */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 glass-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-amber-400">
              {formatCurrency(summary.pendingAmount)}
            </div>
            <p className="text-[11px] text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
              <span>{pendingDonations?.length || 0} pending follow-ups</span>
            </p>
          </motion.div>

          {/* Card 4: Total Donors */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 glass-card relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Donors</span>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-slate-100">
              {summary.donorCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <span>Devotees & supporters</span>
            </p>
          </motion.div>

        </div>

        {/* 2. SMART DONATION FORM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 glass-panel shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-600/20 text-saffron-400 border border-saffron-500/30 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-100">
                  {editingDonation ? 'Edit Donation Record' : 'Record New Donation'}
                </h2>
                <p className="text-xs text-slate-400">
                  Fast 1-click workflow with automatic receipt generation & words conversion.
                </p>
              </div>
            </div>
            {editingDonation && (
              <button
                onClick={() => { setEditingDonation(null); reset(); }}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Donor Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Donor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Donor Full Name <span className="text-saffron-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.donor_name}
                  onChange={(e) => setData('donor_name', e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  required
                />
                {errors.donor_name && <p className="text-red-400 text-xs mt-1">{errors.donor_name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-saffron-400">*</span>
                </label>
                <input
                  type="tel"
                  value={data.donor_mobile}
                  onChange={(e) => setData('donor_mobile', e.target.value)}
                  placeholder="e.g. 9820112233"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  required
                />
                {errors.donor_mobile && <p className="text-red-400 text-xs mt-1">{errors.donor_mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Donor Email (Optional)
                </label>
                <input
                  type="email"
                  value={data.donor_email}
                  onChange={(e) => setData('donor_email', e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>

            </div>

            {/* Financial Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Amount Figure */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Donation Amount (₹) <span className="text-saffron-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-saffron-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={data.amount}
                    onChange={handleAmountChange}
                    placeholder="5000"
                    min="1"
                    className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-slate-100 placeholder-slate-500 outline-none transition-all"
                    required
                  />
                </div>
                {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
              </div>

              {/* Amount in Words */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Amount in Words</span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-generated / Editable</span>
                </label>
                <input
                  type="text"
                  value={data.amount_in_words}
                  onChange={(e) => setData('amount_in_words', e.target.value)}
                  placeholder="Five Thousand Rupees Only"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 italic outline-none transition-all"
                />
              </div>

            </div>

            {/* Payment Method & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={data.payment_method}
                  onChange={(e) => setData('payment_method', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online / UPI</option>
                  <option value="QR Code">QR Code</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Status
                </label>
                <select
                  value={data.payment_status}
                  onChange={(e) => setData('payment_status', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Conditional Follow-up After Days if Pending */}
              {data.payment_status === 'Pending' ? (
                <div>
                  <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Follow-up After
                  </label>
                  <select
                    value={data.follow_up_after_days}
                    onChange={(e) => setData('follow_up_after_days', e.target.value)}
                    className="w-full bg-amber-500/10 border border-amber-500/40 text-amber-200 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="1 Day" className="bg-slate-900 text-slate-100">1 Day</option>
                    <option value="2 Days" className="bg-slate-900 text-slate-100">2 Days</option>
                    <option value="3 Days" className="bg-slate-900 text-slate-100">3 Days</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Receiver / Collected By
                  </label>
                  <input
                    type="text"
                    value={data.collected_by}
                    onChange={(e) => setData('collected_by', e.target.value)}
                    placeholder="Member Name"
                    className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-saffron-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none"
                    required
                  />
                </div>
              )}

              {/* Action Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold rounded-xl shadow-lg shadow-saffron-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-sm"
                >
                  {processing ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{editingDonation ? 'Update Donation' : 'Save & Issue Receipt'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        {/* 3. TABS & LISTING HEADER */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            
            {/* Tab switchers */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-saffron-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Donations ({donations?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Follow-ups ({pendingDonations?.length || 0})</span>
              </button>
            </div>

            {/* Filter & Search controls */}
            {activeTab === 'all' && (
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearchFilter(e.target.value, selectedStatus, selectedMethod);
                    }}
                    placeholder="Search donor or receipt #"
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-saffron-500 w-48 md:w-60"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    handleSearchFilter(searchQuery, e.target.value, selectedMethod);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Paid">Paid Only</option>
                  <option value="Pending">Pending Only</option>
                </select>

                {/* Method Filter */}
                <select
                  value={selectedMethod}
                  onChange={(e) => {
                    setSelectedMethod(e.target.value);
                    handleSearchFilter(searchQuery, selectedStatus, e.target.value);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                >
                  <option value="All">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="QR Code">QR Code</option>
                  <option value="Cheque">Cheque</option>
                </select>

              </div>
            )}
          </div>

          {/* VIEW TAB 1: ALL DONATIONS TABLE / MOBILE CARDS */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              
              {/* DESKTOP TABLE */}
              <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden glass-panel">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Receipt No.</th>
                      <th className="py-3.5 px-4">Donor Name</th>
                      <th className="py-3.5 px-4">Mobile</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Receiver</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-medium text-slate-200">
                    {donations?.data?.length > 0 ? (
                      donations.data.map((donation) => (
                        <tr key={donation._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4 font-mono text-saffron-400 font-bold">
                            {donation.receipt_number}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-100">
                            {donation.donor_name}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {donation.donor_mobile}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            {formatCurrency(donation.amount)}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60">
                              {donation.payment_method}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              donation.payment_status === 'Paid'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}>
                              {donation.payment_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {donation.collected_by}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {donation.donation_date ? new Date(donation.donation_date).toLocaleDateString('en-IN') : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedReceipt(donation)}
                                className="p-1.5 text-slate-300 hover:text-saffron-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="View Digital Receipt"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(donation)}
                                className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                                title="Edit Record"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => handleDelete(donation._id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-slate-500">
                          No donation records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE RESPONSIVE CARDS */}
              <div className="md:hidden space-y-3">
                {donations?.data?.length > 0 ? (
                  donations.data.map((donation) => (
                    <div key={donation._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 glass-card space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-saffron-400">
                          {donation.receipt_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          donation.payment_status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {donation.payment_status}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h3 className="font-bold text-slate-100 text-sm">{donation.donor_name}</h3>
                          <p className="text-xs text-slate-400">{donation.donor_mobile}</p>
                        </div>
                        <div className="font-heading font-extrabold text-emerald-400 text-base">
                          {formatCurrency(donation.amount)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                        <span>Method: <strong className="text-slate-200">{donation.payment_method}</strong></span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedReceipt(donation)}
                            className="px-2.5 py-1 bg-saffron-600/20 text-saffron-400 rounded-lg font-medium text-xs"
                          >
                            Receipt
                          </button>
                          <button
                            onClick={() => handleDelete(donation._id)}
                            className="p-1 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No donation records found.
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              {donations?.links?.length > 3 && (
                <div className="flex items-center justify-center gap-1.5 pt-4">
                  {donations.links.map((link, idx) => (
                    <button
                      key={idx}
                      disabled={!link.url}
                      onClick={() => link.url && router.get(link.url)}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all ${
                        link.active
                          ? 'bg-saffron-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* VIEW TAB 2: PENDING DONATIONS WORKFLOW */}
          {activeTab === 'pending' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glass-panel space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Pending Donations & Follow-up Timers</span>
                </div>
                <span className="text-xs text-slate-400">
                  Update payment status to 'Paid' upon cash/online receipt.
                </span>
              </div>

              {pendingDonations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingDonations.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-800/40 border border-amber-500/20 rounded-2xl p-4 relative flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs text-amber-400 font-bold block mb-0.5">
                            {item.receipt_number}
                          </span>
                          <h4 className="font-bold text-slate-100 text-base">{item.donor_name}</h4>
                          <p className="text-xs text-slate-400">Mobile: {item.donor_mobile}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Pending Amount</span>
                          <span className="font-heading font-extrabold text-amber-400 text-lg">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Follow-up After:</span>
                          <strong className="text-amber-300">{item.follow_up_after_days || '1 Day'}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Calculated Follow-up Date:</span>
                          <span className="font-mono text-slate-200">{item.follow_up_date || 'Today'}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Assigned Receiver:</span>
                          <span className="text-slate-200">{item.collected_by}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedReceipt(item)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => handleMarkAsPaid(item._id)}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Received / Paid</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
                  <p className="font-semibold text-slate-400 text-sm">No Pending Donations!</p>
                  <p className="text-xs text-slate-500 mt-0.5">All pledges have been collected and verified.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* RECEIPT MODAL POPUP */}
      {selectedReceipt && (
        <DonationReceiptModal
          donation={selectedReceipt}
          trustName={trustName}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </AppLayout>
  );
}

// Client-side helper for amount in words conversion
function convertNumberToWords(amount) {
  const number = Math.round(amount);
  if (number === 0) return 'Zero Rupees Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n) {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  }

  return numToWords(number) + ' Rupees Only';
}
