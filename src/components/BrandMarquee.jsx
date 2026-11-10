import React, { useState } from 'react';

function BrandLogoRenderer({ brand }) {
  const [hasError, setHasError] = useState(false);
  const slug = (brand.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const imageSrc = brand.logo || `/brands/${slug}.png`;

  if (!hasError) {
    return (
      <img
        src={imageSrc}
        alt={brand.name}
        onError={() => setHasError(true)}
        className="max-h-8 sm:max-h-10 md:max-h-12 w-auto max-w-[130px] sm:max-w-[160px] object-contain transition-transform"
      />
    );
  }

  return brand.renderLogo ? (
    brand.renderLogo()
  ) : (
    <div className="flex flex-col items-center justify-center">
      <span className="text-base sm:text-lg font-black tracking-wider text-slate-900 font-sans uppercase">
        {brand.name}
      </span>
      <span className="text-[8px] sm:text-[9px] font-bold text-red-600 tracking-widest uppercase">
        {brand.origin || 'Industrial'}
      </span>
    </div>
  );
}

export default function BrandMarquee({ onSelectBrand }) {
  // Baris 1: 5 Merek resmi terverifikasi dari folder Logo Merk
  const row1Brands = [
    { name: 'ASCO' },
    { name: 'Norgren' },
    { name: 'Aventics' },
    { name: 'Numatics' },
    { name: 'Airtac' },
  ];

  // Baris 2: 5 Merek resmi terverifikasi dari folder Logo Merk
  const row2Brands = [
    { name: 'Winters' },
    { name: 'HYDAC' },
    { name: 'Barksdale' },
    { name: 'Findeva' },
    { name: 'Camozzi' },
  ];

  // Duplikat array agar continuous seamless loop saat animasi marquee berjalan
  const row1Items = [...row1Brands, ...row1Brands, ...row1Brands, ...row1Brands];
  const row2Items = [...row2Brands, ...row2Brands, ...row2Brands, ...row2Brands];

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
                  <BrandLogoRenderer brand={brand} />
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
                  <BrandLogoRenderer brand={brand} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
