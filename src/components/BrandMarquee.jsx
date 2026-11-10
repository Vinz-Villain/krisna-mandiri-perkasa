import React from 'react';

export default function BrandMarquee({ onSelectBrand, brands = [] }) {
  // Baris 1: Brand manufaktur pneumatik & katup
  const row1Brands = [
    {
      name: 'ASCO',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
              ASCO
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-red-600 tracking-widest uppercase">
            Emerson
          </span>
        </div>
      ),
    },
    {
      name: 'Norgren',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] sm:text-[11px] tracking-wider">
            IMI
          </span>
          <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans">
            NORGREN
          </span>
        </div>
      ),
    },
    {
      name: 'Aventics',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-black tracking-widest text-slate-900 font-sans">
            AVENTICS
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-400 uppercase">
            An Emerson Brand
          </span>
        </div>
      ),
    },
    {
      name: 'Numatics',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-700 font-sans lowercase">
            numatics<span className="text-emerald-500 font-normal text-xs">®</span>
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-wider uppercase">
            Motion Control
          </span>
        </div>
      ),
    },
    {
      name: 'Airtac',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black italic tracking-tight text-blue-700 font-sans">
            AirTAC
          </span>
        </div>
      ),
    },
    {
      name: 'SMC',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-600 font-sans">
            SMC
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Corporation
          </span>
        </div>
      ),
    },
    {
      name: 'Festo',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tracking-widest text-[#0091DA] font-sans">
            FESTO
          </span>
        </div>
      ),
    },
  ];

  // Baris 2: Brand instrumentasi, fluida, sensor & penggerak
  const row2Brands = [
    {
      name: 'Winters',
      renderLogo: () => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-sky-700 flex items-center justify-center relative shrink-0">
            <span className="w-2.5 h-0.5 bg-sky-700 transform -rotate-45 origin-left"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-700 absolute"></span>
          </div>
          <div className="text-left leading-none">
            <span className="text-base sm:text-lg font-black tracking-wider text-slate-900 block font-sans">
              WINTERS
            </span>
            <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 tracking-wider">
              INSTRUMENTS
            </span>
          </div>
        </div>
      ),
    },
    {
      name: 'HYDAC',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black tracking-widest text-red-600 font-sans">
            HYDAC
          </span>
          <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
            Fluid Technology
          </span>
        </div>
      ),
    },
    {
      name: 'Barksdale',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-base sm:text-lg font-black tracking-tight text-amber-700 font-sans uppercase">
            Barksdale
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            Control Products
          </span>
        </div>
      ),
    },
    {
      name: 'Findeva',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-600 flex items-center justify-center text-white font-bold text-[10px] shadow-xs shrink-0">
            <i className="fa-solid fa-plus text-[9px]"></i>
          </div>
          <span className="text-base sm:text-lg font-black tracking-wider text-slate-900 font-sans uppercase">
            findeva
          </span>
        </div>
      ),
    },
    {
      name: 'Camozzi',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-base sm:text-lg font-black tracking-wide text-slate-800 font-sans">
            CAMOZZI
          </span>
          <span className="text-[8px] sm:text-[9px] font-semibold text-sky-600 tracking-wider uppercase">
            Automation
          </span>
        </div>
      ),
    },
    {
      name: 'Parker',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-amber-500 text-slate-900 flex items-center justify-center font-black text-xs shadow-xs shrink-0">
            P
          </span>
          <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans">
            Parker
          </span>
        </div>
      ),
    },
    {
      name: 'CKD',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black tracking-wider text-sky-700 font-sans">
            CKD
          </span>
          <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
            Pneumatics
          </span>
        </div>
      ),
    },
  ];

  // Integrasikan merek kustom dari CRUD
  const knownBrandNames = new Set([
    ...row1Brands.map((b) => b.name.toLowerCase()),
    ...row2Brands.map((b) => b.name.toLowerCase()),
  ]);

  const customBrandItems = (brands || [])
    .filter((b) => b.name && !knownBrandNames.has(b.name.toLowerCase()))
    .map((b) => ({
      name: b.name,
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-base sm:text-lg font-black tracking-wider text-slate-900 font-sans uppercase">
            {b.name}
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-red-600 tracking-widest uppercase">
            {b.origin || 'Industrial'}
          </span>
        </div>
      ),
    }));

  const finalRow1 = [
    ...row1Brands,
    ...customBrandItems.slice(0, Math.ceil(customBrandItems.length / 2)),
  ];
  const finalRow2 = [
    ...row2Brands,
    ...customBrandItems.slice(Math.ceil(customBrandItems.length / 2)),
  ];

  // Duplikat array agar continuous seamless loop
  const row1Items = [...finalRow1, ...finalRow1, ...finalRow1];
  const row2Items = [...finalRow2, ...finalRow2, ...finalRow2];

  const handleBrandClick = (brandName) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    }
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Centered Section Header inspired by SMK Telkom */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-red-600 tracking-tight leading-tight mb-3 font-sans">
          Merek yang Kami Sediakan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Kami menyediakan berbagai produk dari merek-merek industri terkemuka untuk memenuhi kebutuhan industri Anda. Didukung pilihan produk berkualitas serta layanan pengadaan yang andal, kami siap menjadi solusi kebutuhan industri Anda.
        </p>
      </div>

      {/* Marquee Carousel Container */}
      <div className="relative w-full overflow-hidden space-y-4 sm:space-y-6">
        {/* Left & Right Soft Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Row 1: Scrolling Left */}
        <div className="marquee-group relative w-full overflow-hidden">
          <div className="flex items-center gap-3.5 sm:gap-6 animate-marquee-left w-max py-1">
            {row1Items.map((brand, idx) => (
              <div
                key={`r1-${brand.name}-${idx}`}
                onClick={() => handleBrandClick(brand.name)}
                className="w-48 sm:w-60 md:w-64 h-20 sm:h-24 md:h-28 bg-white rounded-2xl border border-slate-200/90 hover:border-red-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 sm:p-5 cursor-pointer shrink-0 hover:scale-[1.03] active:scale-95 group/card"
                title={`Lihat suku cadang ${brand.name}`}
              >
                <div className="transition-transform duration-300 group-hover/card:scale-105">
                  {brand.renderLogo()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right (Reverse) */}
        <div className="marquee-group relative w-full overflow-hidden">
          <div className="flex items-center gap-3.5 sm:gap-6 animate-marquee-right w-max py-1">
            {row2Items.map((brand, idx) => (
              <div
                key={`r2-${brand.name}-${idx}`}
                onClick={() => handleBrandClick(brand.name)}
                className="w-48 sm:w-60 md:w-64 h-20 sm:h-24 md:h-28 bg-white rounded-2xl border border-slate-200/90 hover:border-red-500 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 sm:p-5 cursor-pointer shrink-0 hover:scale-[1.03] active:scale-95 group/card"
                title={`Lihat suku cadang ${brand.name}`}
              >
                <div className="transition-transform duration-300 group-hover/card:scale-105">
                  {brand.renderLogo()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
