import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import TraditionalReceiptCard from '@/Components/TraditionalReceiptCard';
import { 
  X, 
  Printer, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  Sparkles
} from 'lucide-react';

export default function DonationReceiptModal({ donation, trustName, onClose }) {
  const { auth } = usePage().props;
  const receiptSettings = auth?.trust?.receipt_settings || {};

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white border border-[#eee4dd] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* FIXED TOP MODAL HEADER */}
          <div className="no-print flex items-center justify-between px-6 py-4 border-b border-[#eee4dd] bg-[#faf4ef] sticky top-0 z-20 flex-shrink-0">
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm md:text-base">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Official Festival Donation Receipt</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-full transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE INNER RECEIPT CARD BODY */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 print:p-0 print:m-0">
            <TraditionalReceiptCard 
              donation={donation} 
              settings={receiptSettings} 
            />
          </div>

          {/* FIXED BOTTOM ACTION BAR */}
          <div className="no-print p-4 md:p-6 bg-[#faf4ef] border-t border-[#eee4dd] flex-shrink-0 space-y-3 sticky bottom-0 z-20">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleResendReceipt('email')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-[#eee4dd] shadow-sm transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-600" /> Send Email
              </button>
              <button
                onClick={() => handleResendReceipt('whatsapp')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-[#eee4dd] shadow-sm transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
              </button>
              <button
                onClick={() => handleResendReceipt('sms')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-[#eee4dd] shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-purple-600" /> SMS
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4 text-amber-400" /> Print / Download PDF Receipt
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs md:text-sm rounded-xl transition-colors"
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
