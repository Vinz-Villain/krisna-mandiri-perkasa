import React, { useState } from 'react';

export default function FaqSection({ onOpenRfq }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Apakah semua suku cadang & komponen dijamin 100% original?',
      a: 'Ya, seluruh produk merek ASCO, Numatics, Aventics, Norgren, Airtac, Barksdale, Findeva, Winters, HYDAC, dan Camozzi didatangkan langsung dari jalur manufaktur resmi bersertifikat dengan jaminan keaslian penuh dan dokumen Certificate of Conformance (CoC).',
    },
    {
      q: 'Bagaimana cara meminta Surat Penawaran Resmi (Quotation / RFQ)?',
      a: 'Anda dapat menekan tombol "Minta Penawaran (RFQ)", memilih komponen yang dibutuhkan, lalu mengirimkannya langsung melalui sistem formulir atau WhatsApp. Tim Sales Engineer KMP akan menerbitkan dokumen penawaran resmi berstempel perusahaan dalam waktu kurang dari 15-30 menit.',
    },
    {
      q: 'Apakah KMP melayani pengiriman darurat (Same-Day Dispatch)?',
      a: 'Tentu. Kami memahami bahwa penghentian mesin pabrik (downtime) menyebabkan kerugian besar. Untuk barang yang tersedia (ready stock), kami menyediakan pengiriman kilat langsung dari gudang Jakarta & Cikarang ke kawasan industri Jabodetabek, Cikarang, Karawang, dan sekitarnya pada hari yang sama.',
    },
    {
      q: 'Bagaimana jika nomor part yang kami butuhkan sudah diskontinu / tidak diproduksi?',
      a: 'KMP memiliki layanan Cross-Reference Engineering. Cukup kirimkan foto nameplate part lama atau spesifikasi teknisnya (port size, voltage, pressure, stroke). Tim teknis kami akan mencarikan part pengganti generasi terbaru dengan dudukan dan performa yang 100% kompatibel.',
    },
    {
      q: 'Apakah CV. Krisna Mandiri Perkasa menerbitkan Faktur Pajak resmi?',
      a: 'Ya, kami adalah Pengusaha Kena Pajak (PKP) resmi. Semua transaksi dapat disertai Faktur Pajak elektronik (e-Faktur PPN), surat jalan resmi, dan invoice formal untuk keperluan audit dan administrasi procurement perusahaan Anda.',
    },
  ];

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 relative bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
            <i className="fa-solid fa-circle-question text-[#DF9235]"></i>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Pertanyaan Seputar <span className="text-[#DF9235]">Pengadaan KMP</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Informasi lengkap mengenai jaminan suku cadang, prosedur RFQ, kepatuhan perpajakan, dan pengiriman darurat pabrik.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3.5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#DF9235] bg-amber-50/20 shadow-soft'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full py-4.5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm sm:text-base group"
                >
                  <span className="group-hover:text-[#DF9235] transition-colors">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#DF9235] text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800">
              Ada pertanyaan teknis spesifik yang belum terjawab?
            </div>
            <div className="text-[11px] text-slate-500">
              Konsultasikan langsung dengan teknisi suku cadang kami via WhatsApp.
            </div>
          </div>
          <a
            href="https://wa.me/6289659586363?text=Halo%20KMP%2C%20saya%20memiliki%20pertanyaan%20mengenai%20pengadaan%20suku%20cadang."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-sm shrink-0"
          >
            <i className="fa-brands fa-whatsapp text-[#DF9235]"></i>
            <span>Chat Tim Teknis</span>
          </a>
        </div>
      </div>
    </section>
  );
}
