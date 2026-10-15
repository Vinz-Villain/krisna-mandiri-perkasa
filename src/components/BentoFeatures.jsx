import React, { useState } from 'react';

export default function BentoFeatures({ onOpenRfq }) {
  const [activeTab, setActiveTab] = useState('kecepatan');

  const tabContents = {
    kecepatan: {
      badge: 'Zero Downtime',
      title: 'Distribusi Kilat & Siap Kirim Hari Ini',
      description:
        'Pemberhentian lini mesin pabrik bernilai jutaan rupiah per menit. KMP mempertahankan ribuan SKU komponen pneumatik dan suku cadang siap kirim dari gudang Cikarang & Jakarta dengan opsi Same-Day Dispatch.',
      metrics: [
        { label: 'Dispatch Gudang', val: '< 2 Jam' },
        { label: 'Ketepatan Lead Time', val: '99.4%' },
      ],
    },
    orisinalitas: {
      badge: '100% Genuine Certified',
      title: 'Sertifikasi Pabrikan Asli & Garansi Resmi',
      description:
        'Seluruh komponen ASCO, Numatics, Aventics, Norgren, Airtac, dan brand lainnya didatangkan melalui rantai pasok manufaktur terverifikasi dengan Certificate of Conformance (CoC) dan garansi produk pabrik.',
      metrics: [
        { label: 'Jaminan Orisinal', val: '100%' },
        { label: 'Dokumen Sertifikasi', val: 'Lengkap' },
      ],
    },
    teknis: {
      badge: 'Engineering Support',
      title: 'Bantuan Pencocokan Part Alternatif (Cross-Reference)',
      description:
        'Menemui part lama yang diskontinu atau indent lama dari luar negeri? Tim teknis KMP siap mencarikan nomor part ekuivalen presisi tanpa mengubah dudukan mekanikal atau konfigurasi fluida mesin Anda.',
      metrics: [
        { label: 'Akurasi Penggantian', val: '100%' },
        { label: 'Konsultasi Teknis', val: 'Gratis' },
      ],
    },
  };

  const currentTab = tabContents[activeTab];

  return (
    <section id="keunggulan" className="py-16 sm:py-20 relative bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold mb-3">
              <i className="fa-solid fa-shield-halved text-xs"></i>
              <span>Keunggulan Kompetitif KMP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Mengapa Pabrik Terkemuka <br />
              <span className="text-[#DF9235]">Mempercayakan KMP?</span>
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md text-left">
            Kombinasi stok gudang melimpah, keaslian terjamin, serta kecepatan respon surat penawaran harga (RFQ) menjadikan kami mitra andalan departemen pengadaan pabrik di seluruh Indonesia.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Bento Card 1: Interactive Tab Card (Kiri Besar - Span 7) */}
          <div className="md:col-span-7 bg-white rounded-[32px] p-7 sm:p-9 border border-slate-200/90 shadow-card flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-6">
              {/* Tab Switcher Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'kecepatan', label: 'Kecepatan Pengiriman', icon: 'fa-truck-fast' },
                  { id: 'orisinalitas', label: 'Keaslian & Garansi', icon: 'fa-certificate' },
                  { id: 'teknis', label: 'Bantuan Teknis', icon: 'fa-screwdriver-wrench' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <i className={`fa-solid ${tab.icon} text-[11px] text-[#DF9235]`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-mono font-bold text-[#DF9235] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
                  {currentTab.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                  {currentTab.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  {currentTab.description}
                </p>
              </div>
            </div>

            {/* Metrics & Action Row */}
            <div className="pt-8 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {currentTab.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">{m.val}</div>
                    <div className="text-xs text-slate-500 font-semibold">{m.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={onOpenRfq}
                className="px-5 py-2.5 rounded-full bg-[#DF9235] hover:bg-[#C97E25] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <span>Ajukan Penawaran Resmi</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>

          {/* Bento Card 2: Legalitas & Faktur Pajak Resmi (Kanan Atas - Span 5) */}
          <div className="md:col-span-5 bg-slate-900 text-white rounded-[32px] p-7 sm:p-9 border border-slate-800 shadow-card flex flex-col justify-between relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF9235]/15 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#DF9235] text-xl shadow-inner">
                <i className="fa-solid fa-file-shield"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black leading-tight">
                  Legalitas Perusahaan Lengkap & Faktur Pajak Resmi
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Sebagai badan usaha resmi (CV. Krisna Mandiri Perkasa), kami menerbitkan faktur pajak elektronik, penawaran berkop resmi (Quotation), serta siap memenuhi prosedur vendor procurement korporasi Anda.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-400"></i>
                PKP Resmi & NPWP Valid
              </span>
              <span className="font-mono text-slate-500">e-Faktur PPN Ready</span>
            </div>
          </div>

          {/* Bento Card 3: 500+ Pabrik Rekanan & Wilayah Distribusi (Bawah Kiri - Span 6) */}
          <div className="md:col-span-6 bg-white rounded-[32px] p-7 sm:p-8 border border-slate-200/90 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#DF9235] text-lg">
                  <i className="fa-solid fa-industry"></i>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  500+ Manufaktur Aktif
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 leading-snug">
                Penyedia Utama di Kawasan Industri Nasional
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Melayani pengiriman harian ke Kawasan Industri Jababeka, MM2100, GIIC Cikarang, KIIC Karawang, Surya Cipta, Rungkut Surabaya, hingga Medan dan Morowali.
              </p>
            </div>

            {/* Badges Kawasan */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {['Jababeka', 'MM2100 Cikarang', 'KIIC Karawang', 'Surya Cipta', 'SIER Surabaya', 'KIK Kendal'].map(
                (loc) => (
                  <span
                    key={loc}
                    className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                  >
                    {loc}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Bento Card 4: Konsultasi Teknis & Layanan Kilat RFQ (Bawah Kanan - Span 6) */}
          <div className="md:col-span-6 bg-gradient-to-br from-amber-500/10 via-white to-white rounded-[32px] p-7 sm:p-8 border border-[#DF9235]/30 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#DF9235] text-white flex items-center justify-center text-lg shadow-md shadow-[#DF9235]/30">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sales Engineer Online
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 leading-snug">
                Konsultasi Spesifikasi & Sebut Harga Kilat
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kirimkan foto nameplate part lama atau nomor katalog yang Anda cari via WhatsApp. Tim teknisi kami akan merespon ketersediaan stok, harga, dan alternatifnya dalam hitungan menit.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-500">
                Hotline: <strong className="text-slate-900">+62 896 5958 6363</strong>
              </div>
              <a
                href="https://wa.me/6289659586363?text=Halo%20KMP%2C%20saya%20butuh%20konsultasi%20part%20pneumatik"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <i className="fa-brands fa-whatsapp text-[#DF9235]"></i>
                <span>Tanya Engineer</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
