import React from 'react';

export default function BrandMarquee({ onSelectBrand }) {
  const brands = [
    { name: 'ASCO', origin: 'USA', specialty: 'Solenoid Valves & Fluid Control' },
    { name: 'Numatics', origin: 'USA', specialty: 'Lapped-Spool Directional Valves' },
    { name: 'Aventics', origin: 'Germany', specialty: 'ISO 15552 Pneumatic Cylinders' },
    { name: 'Norgren', origin: 'UK', specialty: 'Excelon FRL Air Preparation' },
    { name: 'Airtac', origin: 'Taiwan', specialty: 'Industrial Cylinders & Solenoid' },
    { name: 'Barksdale', origin: 'Germany', specialty: 'Pressure Transducers & Valves' },
    { name: 'Findeva', origin: 'Switzerland', specialty: 'Turbine Pneumatic Vibrators' },
    { name: 'Winters', origin: 'Canada', specialty: 'Precision Pressure Gauges' },
    { name: 'HYDAC', origin: 'Germany', specialty: 'Industrial Fluid Technology' },
    { name: 'Camozzi', origin: 'Italy', specialty: 'Automation & Fittings' },
  ];

  // Duplikat array agar continuous loop
  const marqueeItems = [...brands, ...brands];

  const handleBrandClick = (brandName) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    }
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-8 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      {/* Background Gradient Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DF9235]/60 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DF9235] animate-pulse"></span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
            Merek Resmi & Standar Otomasi Global
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Klik logo merek untuk memfilter katalog suku cadang secara instan
        </p>
      </div>

      {/* Marquee Container with Mask Fading Gradients */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="flex items-center gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max py-2">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              onClick={() => handleBrandClick(brand.name)}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-[#DF9235] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 group/item"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-xs text-[#DF9235] group-hover/item:text-amber-400">
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="font-extrabold text-xs sm:text-sm text-white group-hover/item:text-[#DF9235] transition-colors flex items-center gap-1.5">
                  <span>{brand.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">
                    [{brand.origin}]
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 max-w-[160px] truncate">
                  {brand.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
