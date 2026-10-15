import React, { useState, useEffect } from 'react';
import kmpLogo from '../assets/logo-kmp.png';

export default function Navbar({ rfqCount, onOpenRfq, onQuickSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const defaultWhatsAppNumber = '6289659586363';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Katalog Produk', href: '#katalog' },
    { label: 'Layanan Penawaran', href: '#layanan' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/80 backdrop-blur-md py-3.5 border-b border-slate-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={kmpLogo}
                alt="Logo CV. Krisna Mandiri Perkasa"
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" title="Ready to supply"></span>
            </div>
            <div>
              <div className="font-black text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-[#DF9235] transition-colors leading-tight flex items-center gap-1.5">
                <span>CV. KRISNA MANDIRI PERKASA</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
                Pemasok & Distributor Suku Cadang Industri
              </p>
            </div>
          </div>

          {/* Center: Floating Pill Capsule Menu */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-xs shadow-sm transition-all"
            >
              Beranda
            </a>
            <a
              href="#katalog"
              className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              Katalog Produk
            </a>
            <a
              href="#layanan"
              className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              Layanan Penawaran
            </a>
            <a
              href="#faq"
              className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Action Buttons (ala Referensi: Track/Search Pill + Dark Pill CTA) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Tombol RFQ Cart / Track Status */}
            <button
              onClick={onOpenRfq}
              className="relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-sm hover:border-[#DF9235]/60 active:scale-95"
            >
              <i className="fa-solid fa-file-invoice text-slate-500 text-xs"></i>
              <span className="hidden sm:inline">Daftar RFQ</span>
              <span className="sm:hidden">RFQ</span>
              {rfqCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#DF9235] text-white text-[10px] flex items-center justify-center font-extrabold animate-bounce">
                  {rfqCount}
                </span>
              )}
            </button>

            {/* Primary Dark Pill Button: Minta Penawaran / Chat WA */}
            <a
              href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent('Halo CV. Krisna Mandiri Perkasa (KMP), saya ingin meminta penawaran resmi suku cadang industri.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-full flex items-center gap-2 shadow-sm transition-all hover:shadow-md active:scale-95 group"
            >
              <span>Minta Penawaran</span>
              <i className="fa-solid fa-arrow-right text-[11px] text-[#DF9235] transition-transform group-hover:translate-x-0.5"></i>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-sm"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xs`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-card space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 font-bold text-slate-900"
              >
                Beranda
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF9235] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hotline KMP: +62 896 5958 6363</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Fast Response
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
