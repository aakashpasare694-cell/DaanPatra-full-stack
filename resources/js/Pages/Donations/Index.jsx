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
  ChevronDown,
  FileText,
  User,
  Phone,
  Mail,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';

export default function Index({ summary, donations, pendingDonations, filters, flash }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'Trust Member';
  const trustName = auth?.trust?.trust_name || 'Shree Ganesha Trust';
  const isAdmin = !auth?.user?.role || auth?.user?.role?.toLowerCase() === 'admin';

  const [activeTab, setActiveTab] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'All');
  const [selectedMethod, setSelectedMethod] = useState(filters.method || 'All');

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

  useEffect(() => {
    if (flash?.createdDonation) {
      setSelectedReceipt(flash.createdDonation);
      toast.success('Donation recorded & digital receipt issued!');
    }
  }, [flash?.createdDonation]);

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
          toast.success('Donation record updated successfully.');
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
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingDonation(null);
    reset();
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

  const handleSendReceiptChannel = (id, channel) => {
    router.post(route('donations.sendReceipt', id), { channel }, {
      onSuccess: () => toast.success(`Receipt notification queued via ${channel.toUpperCase()}!`),
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
      <div className="space-y-8 pb-10">
        
        {/* SUMMARY STRIP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf4ef] border border-[#eee4dd] p-5 rounded-3xl">
          <div>
            <h2 className="font-heading font-extrabold text-slate-900 text-xl">
              Donations & Devotee Pledges
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Record incoming contributions, generate instant digital receipts, and track follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#eee4dd] px-4 py-2 rounded-2xl shadow-sm text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Collected</span>
              <span className="font-heading font-black text-emerald-600 text-sm">{formatCurrency(summary.collectedAmount)}</span>
            </div>
            <div className="bg-white border border-[#eee4dd] px-4 py-2 rounded-2xl shadow-sm text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Pending</span>
              <span className="font-heading font-black text-amber-600 text-sm">{formatCurrency(summary.pendingAmount)}</span>
            </div>
          </div>
        </div>

        {/* 1. FORM SECTION */}
        <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#eee4dd]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-slate-900">
                  {editingDonation ? `Edit Donation (${editingDonation.receipt_number})` : 'New Donation Entry'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingDonation ? 'Update donor or payment details' : 'Fill details below to issue an instant receipt'}
                </p>
              </div>
            </div>

            {editingDonation && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Donor Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Donor Full Name <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Patel"
                    value={data.donor_name}
                    onChange={(e) => setData('donor_name', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile"
                    value={data.donor_mobile}
                    onChange={(e) => setData('donor_mobile', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Amount (₹) <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="501"
                    value={data.amount}
                    onChange={handleAmountChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 text-sm font-bold focus:outline-none transition-colors"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              
              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Payment Method</label>
                <select
                  value={data.payment_method}
                  onChange={(e) => setData('payment_method', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm focus:outline-none font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  value={data.payment_status}
                  onChange={(e) => setData('payment_status', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm focus:outline-none font-medium"
                >
                  <option value="Paid">Paid (Instant Receipt)</option>
                  <option value="Pending">Pending (Pledge)</option>
                </select>
              </div>

              {/* Amount in Words */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount in Words</label>
                <input
                  type="text"
                  placeholder="Auto-generated or type custom"
                  value={data.amount_in_words}
                  onChange={(e) => setData('amount_in_words', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={processing || !isAdmin}
                className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all ${
                  isAdmin ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{editingDonation ? 'Update Donation' : 'Submit & Print Receipt'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. DONATIONS TABLE SECTION */}
        <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#eee4dd]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-[#faf4ef] text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Donations ({donations.data?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'pending'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Pending Follow-ups ({pendingDonations?.length || 0})
              </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search donor or receipt..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchFilter(e.target.value, selectedStatus, selectedMethod);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eee4dd] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee4dd] text-xs font-medium text-slate-700">
                {(activeTab === 'all' ? donations.data : pendingDonations)?.map((row) => (
                  <tr key={row._id} className="hover:bg-[#faf5f2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.receipt_number}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.donor_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.donor_mobile}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(row.amount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {row.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.payment_status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {row.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReceipt(row)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(row)}
                              className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {(activeTab === 'all' ? donations.data : pendingDonations)?.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No donation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* RECEIPT MODAL */}
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

function convertNumberToWords(amount) {
  const words = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (amount === 0) return "Zero Rupees Only";
  let str = "";
  if (Math.floor(amount / 100000) > 0) {
    str += convertNumberToWords(Math.floor(amount / 100000)).replace(" Rupees Only", "") + " Lakh ";
    amount %= 100000;
  }
  if (Math.floor(amount / 1000) > 0) {
    str += convertNumberToWords(Math.floor(amount / 1000)).replace(" Rupees Only", "") + " Thousand ";
    amount %= 1000;
  }
  if (Math.floor(amount / 100) > 0) {
    str += convertNumberToWords(Math.floor(amount / 100)).replace(" Rupees Only", "") + " Hundred ";
    amount %= 100;
  }
  if (amount > 0) {
    if (amount < 20) str += words[amount] + " ";
    else str += tens[Math.floor(amount / 10)] + " " + words[amount % 10] + " ";
  }
  return str.trim() + " Rupees Only";
}
