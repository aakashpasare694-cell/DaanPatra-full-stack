import React from 'react';

export default function TraditionalReceiptCard({ donation, settings = {} }) {
  // Default fallbacks matching the user's uploaded reference image
  const defaultSettings = {
    header_mantra: '॥ श्री गणेशाय नमः ॥',
    trust_name: 'श्री गणेश मित्र मंडळ',
    utsav_name: 'गणेश उत्सव 2026',
    address: '123, लक्ष्मी नगर, पुणे - 411001, महाराष्ट्र',
    registration_number: 'Reg. No. : F/12345/PUNE/2020',
    contact_number: '+91 98765 43210',
    theme_color: '#7f1d1d', // Deep Crimson Red
    show_toran: true,
    show_watermark: true,
    thank_you_note: 'Thank you for your generous contribution',
    footer_slogan: '॥ गणपती बाप्पा मोरया ॥',
    signatory_title: 'For SHREE GANESH MITRA MANDAL',
    signatory_subtitle: 'Authorized Signatory',
  };

  const config = { ...defaultSettings, ...settings };

  // Sample donation data for live preview if donation prop is partial
  const sampleDonation = {
    receipt_number: 'GNR-2026-000125',
    donation_date: new Date().toISOString(),
    donor_name: 'Mr. Rahul Sharma',
    donor_mobile: '98765 43210',
    donor_email: 'rahul@example.com',
    amount: 5001,
    amount_in_words: 'Rupees Five Thousand One Only',
    payment_method: 'UPI',
    payment_status: 'Paid',
    collected_by: 'Rajesh Sharma',
    ...donation
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const themeStyle = {
    backgroundColor: config.theme_color || '#7f1d1d',
  };

  return (
    <div className="relative w-full bg-[#fbf6ea] text-slate-900 font-serif border-4 border-[#b45309] rounded-2xl p-5 md:p-8 shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:border-2 print:p-4">
      
      {/* MARIGOLD GARLAND / TORAN TOP DECORATION */}
      {config.show_toran && (
        <div className="absolute top-0 inset-x-0 h-4 flex items-center justify-between px-2 overflow-hidden pointer-events-none opacity-90">
          <div className="flex w-full justify-between items-center text-xs text-amber-600">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="text-amber-500 font-bold text-xs">🌼🍃</span>
            ))}
          </div>
        </div>
      )}

      {/* BACKGROUND WATERMARK (GANESHA / TEMPLE ART) */}
      {config.show_watermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="text-[180px] font-bold text-amber-900">🐘</span>
        </div>
      )}

      {/* INNER DOUBLE BORDER FRAME */}
      <div className="border border-[#d97706]/60 p-4 md:p-6 rounded-xl space-y-6 relative z-10">
        
        {/* HEADER SECTION: MANTRA, LOGO, TRUST DETAILS & RECEIPT NO */}
        <div className="text-center space-y-1 pb-4 border-b border-[#d97706]/40 relative">
          
          {/* Top Sanskrit Mantra */}
          <p className="text-xs font-semibold text-[#7f1d1d] tracking-widest font-mono">
            {config.header_mantra}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
            
            {/* Left: Lord Ganesha Idol Photo / Artwork */}
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-600/80 p-1 flex items-center justify-center shadow-lg shadow-amber-900/10">
                <img 
                  src="/images/ganesha-idol.svg" 
                  alt="Lord Ganesha Idol" 
                  className="w-full h-full object-contain drop-shadow" 
                />
              </div>
            </div>

            {/* Middle: Trust Name & Address */}
            <div className="md:col-span-6 text-center space-y-1">
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-[#7f1d1d] tracking-tight leading-tight">
                {config.trust_name}
              </h2>
              <p className="font-bold text-sm text-amber-900">
                {config.utsav_name}
              </p>
              <p className="text-xs text-slate-700 max-w-sm mx-auto leading-relaxed">
                {config.address}
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-600 font-medium">
                {config.registration_number && <span>{config.registration_number}</span>}
                <span>📞 {config.contact_number}</span>
              </div>
            </div>

            {/* Right: Receipt No & Date Box */}
            <div className="md:col-span-3 md:border-l border-[#d97706]/40 md:pl-4 text-center md:text-right space-y-1">
              <h3 className="font-heading font-black text-base md:text-lg text-[#7f1d1d] tracking-wider uppercase">
                DONATION RECEIPT
              </h3>
              <div className="text-xs space-y-0.5 text-slate-800">
                <p><span className="text-slate-600 font-medium">Receipt No. :</span> <strong className="font-mono font-bold text-[#7f1d1d]">{sampleDonation.receipt_number}</strong></p>
                <p><span className="text-slate-600 font-medium">Date :</span> <strong>{sampleDonation.donation_date ? new Date(sampleDonation.donation_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</strong></p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 1: DONOR DETAILS */}
        <div className="bg-[#f5ebd6]/60 p-4 rounded-xl border border-[#d97706]/30 space-y-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-bold text-[#7f1d1d] uppercase tracking-wider text-xs border-b border-[#d97706]/30 pb-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#7f1d1d] text-white flex items-center justify-center text-[10px]">👤</span>
            <span>DONOR DETAILS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 text-slate-800">
            <div className="md:col-span-3 text-slate-600 font-medium">Donor Name</div>
            <div className="md:col-span-9 font-bold text-slate-900">: {sampleDonation.donor_name}</div>

            <div className="md:col-span-3 text-slate-600 font-medium">Mobile Number</div>
            <div className="md:col-span-9 font-semibold text-slate-900">: {sampleDonation.donor_mobile}</div>

            {sampleDonation.donor_email && (
              <>
                <div className="md:col-span-3 text-slate-600 font-medium">Email</div>
                <div className="md:col-span-9 text-slate-800">: {sampleDonation.donor_email}</div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 2: HERO AMOUNT RECEIVED BANNER */}
        <div 
          style={themeStyle}
          className="text-white p-4 md:p-6 rounded-2xl shadow-xl text-center relative overflow-hidden my-4 border-2 border-amber-400/40"
        >
          <div className="text-xs uppercase tracking-widest font-semibold text-amber-200 mb-1 flex items-center justify-center gap-2">
            <span>❖</span> DONATION RECEIVED <span>❖</span>
          </div>
          <div className="font-heading text-3xl md:text-5xl font-black tracking-tight text-white my-1">
            ₹ {formatCurrency(sampleDonation.amount)}
          </div>
          <p className="text-xs md:text-sm italic font-medium text-amber-100 mt-1">
            {sampleDonation.amount_in_words || 'Rupees Five Thousand One Only'}
          </p>
        </div>

        {/* SECTION 3: PAYMENT METHOD & DETAILS */}
        <div className="bg-[#f5ebd6]/60 p-4 rounded-xl border border-[#d97706]/30 space-y-2 text-xs md:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800">
            
            <div className="md:col-span-4 flex items-center gap-2 text-slate-600 font-medium">
              <span className="text-amber-700 font-bold">⚡</span> Payment Method
            </div>
            <div className="md:col-span-8 font-bold text-slate-900">: {sampleDonation.payment_method}</div>

            <div className="md:col-span-4 flex items-center gap-2 text-slate-600 font-medium">
              <span className="text-amber-700 font-bold">#</span> Transaction ID
            </div>
            <div className="md:col-span-8 font-mono font-semibold text-slate-900">: {sampleDonation.receipt_number || 'UPI123456789'}</div>

            <div className="md:col-span-4 flex items-center gap-2 text-slate-600 font-medium">
              <span className="text-amber-700 font-bold">₹</span> Amount
            </div>
            <div className="md:col-span-8 font-bold text-[#7f1d1d] text-base">: ₹ {formatCurrency(sampleDonation.amount)}</div>

            <div className="md:col-span-4 flex items-center gap-2 text-slate-600 font-medium">
              <span className="text-amber-700 font-bold">📜</span> Amount in Words
            </div>
            <div className="md:col-span-8 font-semibold italic text-slate-800">: {sampleDonation.amount_in_words}</div>

          </div>
        </div>

        {/* SECTION 4: DONATION PURPOSE */}
        <div className="bg-[#f5ebd6]/60 p-4 rounded-xl border border-[#d97706]/30 text-xs md:text-sm space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[#7f1d1d] text-xs">
            <span>🪷</span>
            <span>Donation Purpose</span>
          </div>
          <div className="flex items-start gap-2 pt-1">
            <span className="w-4 h-4 rounded-full bg-[#7f1d1d] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</span>
            <div>
              <p className="font-bold text-slate-900">{config.utsav_name}</p>
              <p className="text-xs text-slate-700 mt-0.5">
                The above amount has been received towards the {config.utsav_name} / social activity fund.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: FOOTER & SIGNATORY */}
        <div className="pt-4 border-t border-[#d97706]/40 flex flex-col md:flex-row md:items-end justify-between gap-4 text-xs">
          
          {/* Bottom Left: Festival Motto */}
          <div className="text-slate-800 space-y-1">
            <div className="text-2xl">🐘</div>
            <p className="font-bold text-sm text-[#7f1d1d]">{config.footer_slogan}</p>
          </div>

          {/* Center Calligraphy */}
          <div className="text-center my-2 md:my-0">
            <p className="font-serif italic font-bold text-base text-[#7f1d1d]">
              {config.thank_you_note}
            </p>
            <p className="text-[10px] text-amber-800 mt-0.5">🪷 🪷 🪷</p>
          </div>

          {/* Bottom Right: Signatory Box */}
          <div className="text-center md:text-right space-y-1">
            <p className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">{config.signatory_title}</p>
            
            {/* Digital Signature Representation */}
            <div className="py-2 flex justify-center md:justify-end">
              <svg className="w-24 h-8 text-[#7f1d1d]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 20 Q 25 5, 40 20 T 70 10 T 90 25" />
              </svg>
            </div>

            <p className="font-bold text-xs text-slate-900">{config.signatory_subtitle}</p>
            <p className="text-[9px] text-slate-500 max-w-[200px] leading-tight">
              This receipt is system generated and does not require a physical signature.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
