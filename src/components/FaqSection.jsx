import React, { useState } from 'react';

export default function FaqSection({ onOpenRfq }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Apakah produk yang dijual 100% original?',
      a: 'KMP berkomitmen menyediakan produk original dari merek-merek industri terpercaya. Setiap pengadaan produk dilakukan melalui sumber pemasok yang dapat dipertanggungjawabkan untuk memastikan keaslian dan kualitas produk yang diterima pelanggan.',
    },
    {
      q: 'Apa saja brand yang didistribusikan KMP?',
      a: 'KMP menyediakan berbagai produk dari merek-merek ternama di bidang otomasi dan komponen industri, seperti ASCO, Numatics, Aventics, AirTAC, Barksdale, Findeva, Winters, HYDAC, dan brand ternama lainnya. Ketersediaan produk menyesuaikan kebutuhan dan permintaan pelanggan.',
    },
    {
      q: 'Bagaimana cara membeli produk KMP?',
      a: 'Pelanggan dapat menghubungi tim KMP melalui WhatsApp atau saluran komunikasi resmi yang tersedia. Silakan informasikan nama produk, merek, tipe, atau nomor part yang dibutuhkan. Tim kami akan membantu memeriksa ketersediaan produk, memberikan informasi harga, serta mengarahkan proses pemesanan hingga pengiriman.',
    },
    {
      q: 'Apakah KMP dapat membantu mencarikan persamaan produk?',
      a: 'Ya. KMP dapat membantu pelanggan mencari produk alternatif atau persamaan (equivalent product) berdasarkan merek, tipe, maupun spesifikasi teknis produk yang dibutuhkan. Tim kami akan membantu mengidentifikasi alternatif yang sesuai dengan mempertimbangkan spesifikasi, fungsi, dan kompatibilitas produk.',
    },
    {
      q: 'Apakah pelanggan dapat meminta penawaran harga (quotation)?',
      a: 'Tentu. Pelanggan dapat mengajukan permintaan penawaran harga (quotation) dengan menyampaikan detail produk, nomor part, jumlah kebutuhan, serta informasi pendukung lainnya. Tim KMP akan membantu menyiapkan penawaran harga sesuai dengan spesifikasi dan kebutuhan pengadaan pelanggan.',
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
            <i className="fa-solid fa-circle-question text-[#DC2626]"></i>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Pertanyaan Seputar <span className="text-[#DC2626]">Pengadaan KMP</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Seputar informasi mengenai suku cadang, prosedur RFQ dan pengiriman barang.
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
                    ? 'border-[#DC2626] bg-red-50/20 shadow-soft'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm sm:text-base group cursor-pointer"
                >
                  <span className="group-hover:text-[#DC2626] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#DC2626] text-white rotate-180 shadow-sm'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-red-100/80">
                    <p className="pt-3.5">
                      {faq.a}
                    </p>
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
              Konsultasikan langsung dengan tim kami via WhatsApp.
            </div>
          </div>
          <a
            href="https://wa.me/6289659586363?text=Halo%20KMP%2C%20saya%20memiliki%20pertanyaan%20mengenai%20pengadaan%20suku%20cadang."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-sm shrink-0"
          >
            <i className="fa-brands fa-whatsapp text-[#DC2626]"></i>
            <span>Chat Tim KMP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
