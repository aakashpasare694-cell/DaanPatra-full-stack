import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/Layouts/AppLayout';
import TraditionalReceiptCard from '@/Components/TraditionalReceiptCard';
import { 
  Settings as SettingsIcon, 
  Sparkles, 
  Palette, 
  Save, 
  Eye, 
  Check
} from 'lucide-react';

export default function ReceiptSettings({ receiptSettings }) {
  const { auth } = usePage().props;
  const isAdmin = !auth?.user?.role || auth?.user?.role?.toLowerCase() === 'admin';

  const form = useForm({
    header_mantra: receiptSettings.header_mantra || '॥ श्री गणेशाय नमः ॥',
    trust_name: receiptSettings.trust_name || auth?.trust?.trust_name || 'श्री गणेश मित्र मंडळ',
    utsav_name: receiptSettings.utsav_name || 'गणेश उत्सव 2026',
    address: receiptSettings.address || auth?.trust?.address || '123, लक्ष्मी नगर, पुणे - 411001, महाराष्ट्र',
    registration_number: receiptSettings.registration_number || auth?.trust?.registration_number || 'Reg. No. : F/12345/PUNE/2020',
    contact_number: receiptSettings.contact_number || auth?.trust?.contact_number || '+91 98765 43210',
    theme_color: receiptSettings.theme_color || '#7f1d1d',
    show_toran: receiptSettings.show_toran ?? true,
    show_watermark: receiptSettings.show_watermark ?? true,
    thank_you_note: receiptSettings.thank_you_note || 'Thank you for your generous contribution',
    footer_slogan: receiptSettings.footer_slogan || '॥ गणपती बाप्पा मोरया ॥',
    signatory_title: receiptSettings.signatory_title || `For ${receiptSettings.trust_name || 'SHREE GANESH MITRA MANDAL'}`,
    signatory_subtitle: receiptSettings.signatory_subtitle || 'Authorized Signatory',
  });

  const colorPresets = [
    { name: 'Crimson Red', hex: '#7f1d1d' },
    { name: 'Saffron Amber', hex: '#c2410c' },
    { name: 'Royal Blue', hex: '#1e3a8a' },
    { name: 'Emerald Green', hex: '#065f46' },
    { name: 'Imperial Purple', hex: '#581c87' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only Trust Admins can save receipt layout settings.');
      return;
    }
    form.post(route('settings.receipt.update'), {
      onSuccess: () => {
        toast.success('Receipt layout & branding updated successfully!');
      }
    });
  };

  return (
    <AppLayout activeTab="settings">
      <div className="space-y-8 pb-12">
        
        {/* SUMMARY STRIP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf4ef] border border-[#eee4dd] p-5 rounded-3xl">
          <div>
            <h2 className="font-heading font-extrabold text-slate-900 text-xl">
              Receipt Layout & Branding Customizer
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Configure printable donation receipt header, mantra, trust logo, colors, and signatory details.
            </p>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CONTROLS */}
          <div className="lg:col-span-5 bg-white border border-[#eee4dd] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#eee4dd] text-amber-700 font-extrabold text-base">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Layout Configuration</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              
              {/* Header Mantra */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Header Sanskrit Mantra <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.data.header_mantra}
                  onChange={(e) => form.setData('header_mantra', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Trust Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Trust Full Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.data.trust_name}
                  onChange={(e) => {
                    form.setData('trust_name', e.target.value);
                    if (!form.data.signatory_title || form.data.signatory_title.startsWith('For ')) {
                      form.setData('signatory_title', `For ${e.target.value.toUpperCase()}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Utsav Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Festival Utsav Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.data.utsav_name}
                  onChange={(e) => form.setData('utsav_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Trust Registration Number
                </label>
                <input
                  type="text"
                  value={form.data.registration_number}
                  onChange={(e) => form.setData('registration_number', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Trust Address <span className="text-amber-600">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={form.data.address}
                  onChange={(e) => form.setData('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                ></textarea>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Helpline / Contact Phone <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.data.contact_number}
                  onChange={(e) => form.setData('contact_number', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600" /> Amount Banner Theme Color
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => form.setData('theme_color', preset.hex)}
                      className={`h-9 rounded-xl border-2 transition-all relative flex items-center justify-center ${
                        form.data.theme_color === preset.hex ? 'border-slate-900 scale-105 shadow-md' : 'border-transparent opacity-80'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    >
                      {form.data.theme_color === preset.hex && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#eee4dd]">
                <label className="flex items-center justify-between p-3 bg-[#faf5f2] rounded-xl border border-[#e8ded8] cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">Show Marigold Toran Garland Header</span>
                  <input
                    type="checkbox"
                    checked={form.data.show_toran}
                    onChange={(e) => form.setData('show_toran', e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#faf5f2] rounded-xl border border-[#e8ded8] cursor-pointer">
                  <span className="text-xs font-bold text-slate-700">Show Deity Background Watermark</span>
                  <input
                    type="checkbox"
                    checked={form.data.show_watermark}
                    onChange={(e) => form.setData('show_watermark', e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                </label>
              </div>

              {/* Thank You Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Footer Calligraphy Note
                </label>
                <input
                  type="text"
                  value={form.data.thank_you_note}
                  onChange={(e) => form.setData('thank_you_note', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Footer Slogan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Footer Slogan
                </label>
                <input
                  type="text"
                  value={form.data.footer_slogan}
                  onChange={(e) => form.setData('footer_slogan', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Signatory Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Signatory Organization Line
                </label>
                <input
                  type="text"
                  value={form.data.signatory_title}
                  onChange={(e) => form.setData('signatory_title', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Save Button */}
              {isAdmin && (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{form.processing ? 'Saving Layout...' : 'Save Receipt Configuration'}</span>
                  </button>
                </div>
              )}

            </form>
          </div>

          {/* LIVE PREVIEW COLUMN */}
          <div className="lg:col-span-7 space-y-4 sticky top-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Eye className="w-4 h-4" />
                <span>Live Interactive Receipt Preview</span>
              </div>
              <span className="text-xs text-slate-500">Updates live as you type</span>
            </div>

            <TraditionalReceiptCard settings={form.data} />
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
