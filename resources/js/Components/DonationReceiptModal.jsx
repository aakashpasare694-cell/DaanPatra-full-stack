import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { 
  X, 
  Printer, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';

export default function DonationReceiptModal({ donation, trustName, onClose }) {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleResendReceipt = (channel) => {
    router.post(
      route('donations.sendReceipt', donation._id),
      { channel },
      {
        onSuccess: () => {
          toast.success(`Receipt sent via ${channel.toUpperCase()} successfully!`);
        },
        onError: () => {
          toast.error(`Failed to send receipt via ${channel}.`);
        }
      }
    );
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(donation.amount);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden glass-panel my-8"
        >
          {/* Top Modal Header */}
          <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2 text-saffron-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Official Digital Receipt</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PRINTABLE RECEIPT CARD CONTENT */}
          <div className="p-6 md:p-8 space-y-6 print:p-0 print:bg-white print:text-black">
            
            {/* Receipt Header / Logo & Trust Title */}
            <div className="text-center pb-6 border-b border-dashed border-slate-700/80 print:border-gray-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-saffron-600 to-gold-500 text-white text-3xl font-bold mb-3 shadow-lg shadow-saffron-600/30 print:shadow-none">
                🐘
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-extrabold text-slate-100 print:text-black tracking-tight">
                {trustName || 'Shree Ganesha Seva Trust'}
              </h2>
              <p className="text-xs text-saffron-400 print:text-gray-600 font-medium mt-1">
                Ganpati Festival & Social Welfare Initiatives
              </p>
              <span className="inline-block bg-saffron-500/10 border border-saffron-500/30 print:bg-gray-100 text-saffron-300 print:text-gray-800 text-[11px] font-semibold px-3 py-1 rounded-full mt-2">
                DONATION ACKNOWLEDGMENT RECEIPT
              </span>
            </div>

            {/* Receipt Key Bar */}
            <div className="grid grid-cols-2 gap-4 bg-slate-800/40 print:bg-gray-100 p-4 rounded-2xl border border-slate-700/40 print:border-gray-200">
              <div>
                <span className="text-[11px] text-slate-400 print:text-gray-500 font-medium block">Receipt Number</span>
                <span className="font-mono font-bold text-saffron-400 print:text-black text-base">
                  {donation.receipt_number}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 print:text-gray-500 font-medium block">Date</span>
                <span className="font-semibold text-slate-200 print:text-black text-sm">
                  {donation.donation_date ? new Date(donation.donation_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* Donor & Payment Details Grid */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/60 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600 font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500 print:hidden" /> Donor Name:
                </span>
                <span className="font-bold text-slate-100 print:text-black">{donation.donor_name}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800/60 print:border-gray-200">
                <span className="text-slate-400 print:text-gray-600 font-medium flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-slate-500 print:hidden" /> Mobile:
                </span>
                <span className="font-semibold text-slate-200 print:text-black">{donation.donor_mobile}</span>
              </div>

              {donation.donor_email && (
                <div className="flex justify-between py-2 border-b border-slate-800/60 print:border-gray-200">
                  <span className="text-slate-400 print:text-gray-600 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500 print:hidden" /> Email:
                  </span>
                  <span className="text-slate-300 print:text-black">{donation.donor_email}</span>
                </div>
              )}

              <div className="flex justify-between py-3 border-b border-slate-800/60 print:border-gray-200 items-center">
                <span className="text-slate-400 print:text-gray-600 font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500 print:hidden" /> Payment Method / Status:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200 print:text-black">{donation.payment_method}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    donation.payment_status === 'Paid' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 print:bg-amber-100 print:text-amber-800'
                  }`}>
                    {donation.payment_status}
                  </span>
                </div>
              </div>

              {/* Amount Highlight Box */}
              <div className="bg-gradient-to-r from-saffron-950/40 via-saffron-900/20 to-slate-800/40 p-4 rounded-2xl border border-saffron-500/30 print:bg-gray-50 print:border-gray-300 my-4 text-center">
                <span className="text-xs text-saffron-300 print:text-gray-600 font-semibold uppercase tracking-wider block mb-1">
                  Donation Amount Received
                </span>
                <div className="font-heading text-3xl font-extrabold text-emerald-400 print:text-emerald-700">
                  {formattedAmount}
                </div>
                <p className="text-xs italic text-slate-300 print:text-gray-700 mt-1">
                  ({donation.amount_in_words})
                </p>
              </div>

              <div className="flex justify-between py-2 text-xs text-slate-400 print:text-gray-600">
                <span>Collected By: <strong className="text-slate-200 print:text-black">{donation.collected_by}</strong></span>
                <span>Authorized Signatory</span>
              </div>
            </div>

            {/* Thank you note */}
            <div className="text-center pt-4 border-t border-dashed border-slate-700/80 print:border-gray-300">
              <p className="text-xs font-medium text-saffron-300 print:text-gray-800">
                "Thank you for supporting our Ganpati festival and social initiatives." 🙏
              </p>
            </div>

          </div>

          {/* MODAL FOOTER ACTIONS */}
          <div className="no-print p-6 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleResendReceipt('email')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" /> Send Email
              </button>
              <button
                onClick={() => handleResendReceipt('whatsapp')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
              </button>
              <button
                onClick={() => handleResendReceipt('sms')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-400" /> SMS
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-saffron-600 hover:bg-saffron-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-saffron-600/25 transition-all"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
