import React from 'react';
import kmpLogo from '../assets/logo-kmp.png';

export default function Footer({ onFilterCategory, onFilterBrand }) {
  const displayWhatsApp = '+62 896 5958 6363';

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={kmpLogo}
                alt="Logo CV. Krisna Mandiri Perkasa"
                className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-sm"
              />
              <div>
                <div className="font-black text-white text-sm tracking-tight">
                  CV. KRISNA MANDIRI PERKASA
                </div>
                <div className="text-[11px] text-slate-400">
                  Mitra Pengadaan Suku Cadang Industri
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Distributor spesialis pengadaan komponen pneumatik, silinder ISO aktuator, katup solenoid kendali fluida, unit FRL, dan suku cadang mesin otomasi pabrik berstandar internasional di Indonesia.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
              <div>📍 Kantor & Distribusi: Jakarta & Kawasan Industri Cikarang</div>
              <div>⚡ Status Badan Usaha: CV Resmi • PKP & e-Faktur</div>
            </div>
          </div>

          {/* Quick Categories (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">
              Kategori Produk
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Silinder Pneumatik',
                'Katup Solenoid',
                'Filter & Regulator (FRL)',
                'Fitting & Selang Udara',
                'Sensor & Pressure Gauge',
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onFilterCategory) onFilterCategory(cat);
                      const el = document.getElementById('katalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#DF9235] transition-colors text-left"
                  >
                    • {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">
              Merek Resmi
            </h4>
            <ul className="space-y-1.5 text-xs">
              {['ASCO', 'Numatics', 'Aventics', 'Norgren', 'Airtac', 'Camozzi'].map(
                (brand) => (
                  <li key={brand}>
                    <button
                      onClick={() => {
                        if (onFilterBrand) onFilterBrand(brand);
                        const el = document.getElementById('katalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hover:text-[#DF9235] transition-colors"
                    >
                      {brand}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact & Support (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">
              Layanan Penawaran
            </h4>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
              <div className="text-[11px] text-slate-400">Hotline Sales & RFQ:</div>
              <div className="font-mono font-bold text-white text-sm">
                {displayWhatsApp}
              </div>
              <div className="text-[11px] text-slate-400">
                Jam Kerja: Senin - Sabtu (08:30 - 17:00 WIB)
              </div>
              <a
                href="https://wa.me/6289659586363"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-full bg-[#DF9235] hover:bg-[#C97E25] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Hubungi Sales WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} CV. Krisna Mandiri Perkasa (KMP). Hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-6">
            <a href="#katalog" className="hover:text-slate-300">Katalog Online</a>
            <a href="#keunggulan" className="hover:text-slate-300">Keunggulan</a>
            <a href="#sektor" className="hover:text-slate-300">Sektor Industri</a>
            <a href="#faq" className="hover:text-slate-300">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
