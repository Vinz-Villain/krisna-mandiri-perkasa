import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RfqModal({ isOpen, onClose, items = [], onRemoveItem, onClearCart }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectLocation: 'Kawasan Industri Cikarang / Jababeka',
    urgency: 'Segera (Ready Stock)',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const itemListText =
      items.length > 0
        ? items
            .map(
              (it, idx) =>
                `${idx + 1}. [${it.product.brand}] ${it.product.name}\n   - SKU: ${it.product.sku}\n   - Qty: ${it.qty} unit`
            )
            .join('\n\n')
        : '(Pertanyaan Penawaran Umum Komponen Industri)';

    const fullMessage = 
`*PERMINTAAN SEBUT HARGA RESMI (RFQ) - CV. KRISNA MANDIRI PERKASA*
─────────────────────────────────────
*Data Pemohon:*
• Nama: ${formData.name || '-'}
• Perusahaan / Pabrik: ${formData.company || '-'}
• Email: ${formData.email || '-'}
• No. Telp / WhatsApp: ${formData.phone || '-'}
• Lokasi Pabrik: ${formData.projectLocation}
• Kebutuhan: ${formData.urgency}

*Daftar Komponen yang Diminta:*
${itemListText}

*Catatan / Spesifikasi Khusus:*
${formData.notes || '-'}
─────────────────────────────────────
Mohon dikirimkan penawaran harga resmi (Quotation) & info ketersediaan stok segera. Terima kasih.`;

    const waNumber = '6289659586363';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      if (onClearCart) onClearCart();
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 z-10 text-left"
        >
          {/* Header */}
          <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                <i className="fa-solid fa-file-invoice text-[#DF9235]"></i>
                <span>Permintaan Penawaran Resmi (RFQ)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dapatkan surat penawaran resmi (Quotation) & info stok dari CV. Krisna Mandiri Perkasa
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-5 flex-1 text-slate-900">
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-emerald-600 text-xl"></i>
                <div className="text-xs">
                  <p className="font-bold">Permintaan RFQ Berhasil Diteruskan ke WhatsApp!</p>
                  <p className="text-emerald-700">Tim Sales Engineer KMP akan segera menyiapkan dokumen penawaran harga resmi.</p>
                </div>
              </div>
            )}

            {/* List items in Cart */}
            {items && items.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Komponen Terpilih ({items.length} Item)
                  </label>
                  {onClearCart && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      Kosongkan Semua
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{it.product.name}</div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {it.product.brand} • SKU: {it.product.sku} • Qty: <strong>{it.qty} unit</strong>
                        </div>
                      </div>
                      {onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(it.product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                          title="Hapus item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Penanggung Jawab"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Perusahaan / Pabrik *</label>
                <input
                  type="text"
                  required
                  placeholder="PT / CV / Pabrik"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">No. WhatsApp / HP *</label>
                <input
                  type="text"
                  required
                  placeholder="0812xxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Kantor</label>
                <input
                  type="email"
                  placeholder="procurement@perusahaan.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Lokasi Pabrik / Kawasan Industri</label>
                <input
                  type="text"
                  placeholder="Contoh: Kawasan MM2100 Cikarang, KIIC Karawang, SIER Surabaya, dll"
                  value={formData.projectLocation}
                  onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Tambahan / Kebutuhan Khusus</label>
                <textarea
                  rows="3"
                  placeholder="Tuliskan spesifikasi voltase, port size, kebutuhan part pengganti diskontinu..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9235]/30 focus:border-[#DF9235]"
                ></textarea>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Data diteruskan secara otomatis ke WhatsApp Sales Engineer KMP
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#DF9235] hover:bg-[#C97E25] text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>Kirim RFQ ke WhatsApp KMP</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
