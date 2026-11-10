import React from 'react';

export default function CtaBanner({ onOpenRfq }) {
  const defaultWhatsAppNumber = '6289659586363';

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Radial Glow & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#DC2626]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-red-400 text-xs font-mono font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
          <span>MITRA STRATEGIS OTOMASI & PNEUMATIK PABRIK</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Cegah Downtime Mesin Pabrik Anda Hari Ini bersama{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] via-rose-500 to-red-500">
            KMP
          </span>
        </h2>

        <p className="mt-4 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Dapatkan suku cadang orisinal berkualitas tinggi, kepastian pengadaan terpercaya, dan respon surat penawaran harga resmi (Quotation) dalam hitungan menit.
        </p>

        {/* CTA Buttons Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onOpenRfq}
            className="px-7 py-3.5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-[#DC2626]/30 transition-all hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-file-invoice"></i>
            <span>Minta Penawaran Resmi (RFQ)</span>
          </button>

          <a
            href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent('Halo CV. Krisna Mandiri Perkasa, kami ingin meminta penawaran suku cadang mesin pabrik.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <i className="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
            <span>Hubungi WhatsApp Sales</span>
          </a>
        </div>

        {/* Features Checklist */}
        <div className="mt-10 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-check text-[#DC2626]"></i>
            100% Produk Original Bergaransi
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-check text-[#DC2626]"></i>
            Faktur Pajak Elektronik Lengkap
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-check text-[#DC2626]"></i>
            Pengiriman Cepat Seluruh Indonesia
          </span>
        </div>
      </div>
    </section>
  );
}
