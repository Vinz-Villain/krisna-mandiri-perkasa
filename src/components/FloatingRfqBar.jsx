import React from 'react';

export default function FloatingRfqBar({ items = [], onOpenRfq, onClearCart }) {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-full px-4 sm:px-5 py-3 border border-slate-700/80 shadow-2xl flex items-center justify-between gap-3">
        {/* Left Count & Thumbnails */}
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#DF9235] text-white text-xs font-black flex items-center justify-center shrink-0">
            {items.length}
          </span>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight">
              {items.length} Komponen Dipilih
            </div>
            <div className="text-[10px] text-slate-400">
              Siap diterbitkan surat penawaran resmi (Quotation)
            </div>
          </div>
          <div className="text-xs font-bold sm:hidden">
            {items.length} Item RFQ
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearCart}
            className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors"
            title="Kosongkan keranjang"
          >
            Hapus
          </button>

          <button
            onClick={onOpenRfq}
            className="px-4 sm:px-5 py-2 rounded-full bg-[#DF9235] hover:bg-[#C97E25] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <i className="fa-solid fa-file-invoice text-xs"></i>
            <span>Buka RFQ</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
