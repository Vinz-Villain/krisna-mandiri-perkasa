import React, { useState } from 'react';

export default function IndustrySectorsSection({ onFilterCategory }) {
  const [activeSector, setActiveSector] = useState(0);

  const sectors = [
    {
      id: 'automotive',
      name: 'Otomotif & Manufaktur',
      icon: 'fa-car',
      highlight: 'Siklus Kerja Jutaan Kali Tanpa Henti',
      desc: 'Mendukung jalur perakitan robotik, jig clamping, press mesin stamping, dan conveyor transfer dengan silinder ISO 15552 dan katup pneumatik berkecepatan tinggi.',
      recommendedParts: ['Silinder Aventics PRA', 'Numatics Mark 8 Valve', 'Fitting Logam Presisi'],
      categoryTarget: 'Silinder Pneumatik',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'food-bev',
      name: 'Makanan & Minuman (F&B)',
      icon: 'fa-utensils',
      highlight: 'Standar Kebersihan Higienis & Food Grade',
      desc: 'Unit filter regulator (FRL) bebas aerosol oli, katup solenoid stainless steel tahan cuci steam, dan selang polyurethane tahan jamur untuk lini pengemasan makanan.',
      recommendedParts: ['Norgren Excelon FRL BL84', 'Katup ASCO 8210 Brass/SS', 'Selang PU Food Grade'],
      categoryTarget: 'Filter & Regulator (FRL)',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'packaging',
      name: 'Kemasan & Percetakan',
      icon: 'fa-box-archive',
      highlight: 'Akurasi Pengaturan Tekanan & Vakum Tinggi',
      desc: 'Sistem pick-and-place kecepatan tinggi, silinder compact pemotong presisi, dan regulator udara berpresisi tinggi untuk mesin flexo, offset, dan folding carton.',
      recommendedParts: ['Airtac SC Cylinder', 'Camozzi Compact Valve', 'Pressure Regulator Gauge'],
      categoryTarget: 'Silinder Pneumatik',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'pharma',
      name: 'Kimia & Farmasi',
      icon: 'fa-flask-vial',
      highlight: 'Tahan Korosi & Gas Kimia Agresif',
      desc: 'Solenoid valve khusus berbahan tahan korosi, seal Viton dan PTFE tahan suhu ekstrim, serta pressure transmitter tahan ledakan (explosion proof).',
      recommendedParts: ['ASCO Explosion Proof Coils', 'Barksdale Pressure Switch', 'Viton Sealed Valves'],
      categoryTarget: 'Katup Solenoid',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const current = sectors[activeSector];

  const handleInspectSector = (cat) => {
    if (onFilterCategory) {
      onFilterCategory(cat);
    }
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sektor" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Ambient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#DF9235]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold font-mono">
            <i className="fa-solid fa-industry"></i>
            <span>APLIKASI LINTAS SEKTOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Dipercaya di Berbagai <span className="text-[#DF9235]">Lini Industri</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Setiap industri memiliki spesifikasi lingkungan mekanis yang unik. KMP menyediakan portofolio komponen yang telah teruji memenuhi standar masing-masing sektor pabrik.
          </p>
        </div>

        {/* Interactive Sector Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {sectors.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setActiveSector(idx)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeSector === idx
                  ? 'bg-[#DF9235] text-white shadow-lg shadow-[#DF9235]/30 scale-105'
                  : 'bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80'
              }`}
            >
              <i className={`fa-solid ${sec.icon} text-sm`}></i>
              <span>{sec.name}</span>
            </button>
          ))}
        </div>

        {/* Active Sector Display Showcase Card */}
        <div className="bg-slate-800/80 rounded-[32px] border border-slate-700 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Image */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-700">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#DF9235] text-white px-3 py-1 rounded-full font-bold">
                  {current.highlight}
                </span>
              </div>
            </div>

            {/* Information & Recommendations */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#DF9235] font-bold">
                  Sektor Manufaktur: {current.name}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {current.highlight}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {current.desc}
                </p>
              </div>

              {/* Recommended Components Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Komponen Rekomendasi KMP:
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.recommendedParts.map((part, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-200 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                      {part}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleInspectSector(current.categoryTarget)}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <span>Lihat Katalog untuk Sektor Ini</span>
                  <i className="fa-solid fa-arrow-right text-xs text-[#DF9235]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
