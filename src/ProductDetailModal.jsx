import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailModal({ product, onClose, onAddToRfq, onDirectWhatsApp }) {
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = imagesList[activeImageIndex] || product.image;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 z-10 text-left"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#DF9235] text-white uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-slate-300 font-mono tracking-wider">
                SKU: {product.sku}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm cursor-pointer"
              title="Tutup Jendela"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-slate-900">
            {/* Top Grid: Image & Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full bg-slate-50 rounded-[28px] p-6 border border-slate-200 flex items-center justify-center relative group min-h-[230px]">
                  <img
                    src={currentImage}
                    alt={`${product.name} - ${activeImageIndex + 1}`}
                    className="max-h-52 object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-300"
                  />
                  {imagesList.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      Foto {activeImageIndex + 1} / {imagesList.length}
                    </span>
                  )}
                </div>

                {/* Multiple Slide Thumbnails */}
                {imagesList.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-3 w-full overflow-x-auto py-1">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl border p-1 transition-all bg-white shrink-0 overflow-hidden cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#DF9235] ring-2 ring-[#DF9235]/40 shadow-sm'
                            : 'border-slate-200 hover:border-slate-400 opacity-60 hover:opacity-100'
                        }`}
                        title={`Lihat Foto ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-bold text-[#DF9235] tracking-wider uppercase mb-1">
                    {product.categoryName || product.category}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <i className="fa-solid fa-certificate text-[#DF9235]"></i>
                    <span>Jaminan Mutu: <strong>100% Suku Cadang Original & Resmi</strong></span>
                  </div>
                </div>

                {/* Qty & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-full text-sm font-bold transition-colors cursor-pointer"
                      title="Kurangi Jumlah"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-slate-900">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-full text-sm font-bold transition-colors cursor-pointer"
                      title="Tambah Jumlah"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (onAddToRfq) onAddToRfq(product, qty);
                      onClose();
                    }}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <i className="fa-solid fa-file-invoice text-[#DF9235]"></i>
                    <span>+ Minta Penawaran (RFQ)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onDirectWhatsApp) onDirectWhatsApp(product, qty);
                    }}
                    className="bg-[#DF9235] hover:bg-[#C97E25] text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    <span>Tanya WA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
