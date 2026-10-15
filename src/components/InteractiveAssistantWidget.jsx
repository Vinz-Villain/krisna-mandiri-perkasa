import React, { useState } from 'react';
import kmpLogo from '../assets/logo-kmp.png';

export default function InteractiveAssistantWidget({
  onFilterCategory,
  onFilterBrand,
  onOpenRfq,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const defaultWhatsAppNumber = '6289659586363';

  const quickPrompts = [
    {
      title: '🔍 Silinder Pneumatik ISO',
      desc: 'Filter silinder standar ISO 15552 Aventics/Airtac',
      action: () => {
        onFilterCategory('Silinder Pneumatik');
        const el = document.getElementById('katalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      title: '⚡ Katup Solenoid ASCO',
      desc: 'Filter katup fluida presisi ASCO & Numatics',
      action: () => {
        onFilterBrand('ASCO');
        onFilterCategory('Katup Solenoid');
        const el = document.getElementById('katalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      },
    },
    {
      title: '📋 Ajukan Surat Penawaran (RFQ)',
      desc: 'Buka formulir RFQ untuk penawaran resmi pabrik',
      action: () => {
        onOpenRfq();
        setIsOpen(false);
      },
    },
    {
      title: '🛠️ Cross-Reference Part Lama',
      desc: 'Tanya teknisi KMP untuk part yang diskontinu',
      action: () => {
        const text = 'Halo KMP, saya butuh bantuan cross-reference / pencocokan part pengganti untuk mesin pabrik.';
        window.open(`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
  ];

  const handleSendCustomMessage = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    const text = `Halo CV. Krisna Mandiri Perkasa (KMP), saya ingin bertanya:\n"${userMsg.trim()}"`;
    window.open(`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setUserMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover Window */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-[28px] border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF9235]/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white p-1 border-2 border-[#DF9235] shrink-0">
                <img src={kmpLogo} alt="KMP" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Asisten Suku Cadang KMP</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Online • Siap Membantu Pengadaan
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors relative z-10"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              👋 <strong>Selamat datang di KMP!</strong> Butuh nomor part tertentu, cek stok gudang hari ini, atau minta quotation resmi? Pilih bantuan cepat di bawah:
            </div>

            {/* Quick Prompts List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Pilihan Interaktif Cepat:
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={p.action}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-[#DF9235] transition-all flex items-start justify-between gap-2 group shadow-sm"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-[#DF9235]">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-[10px] text-slate-400 group-hover:text-[#DF9235] mt-1"></i>
                </button>
              ))}
            </div>

            {/* Direct Query Input */}
            <form onSubmit={handleSendCustomMessage} className="pt-2 border-t border-slate-100">
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Atau Ketik Nomor Part Mesin Anda:
              </label>
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-1 pl-3 border border-slate-200 focus-within:border-[#DF9235] focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Contoh: ASCO 8210 24VDC..."
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#DF9235] hover:bg-[#C97E25] text-white flex items-center justify-center text-xs shrink-0 transition-transform active:scale-95 shadow-sm"
                  title="Kirim ke WhatsApp"
                >
                  <i className="fa-solid fa-paper-plane text-[10px]"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Respon WhatsApp &lt; 15 menit</span>
            <span className="text-emerald-600 font-bold">Fast Dispatch</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-black text-white shadow-2xl border-2 border-white transition-all duration-300 hover:scale-105 active:scale-95"
        title="Asisten Cerdas Suku Cadang KMP"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DF9235] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DF9235]"></span>
        </span>
        <i className="fa-solid fa-headset text-sm text-[#DF9235] group-hover:rotate-12 transition-transform"></i>
        <span className="text-xs font-extrabold tracking-tight hidden sm:inline">
          {isOpen ? 'Tutup Asisten' : 'Konsultasi Suku Cadang'}
        </span>
      </button>
    </div>
  );
}
