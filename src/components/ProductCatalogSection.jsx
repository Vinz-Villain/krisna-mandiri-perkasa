import React, { useState } from 'react';

export default function ProductCatalogSection({
  products,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  categoriesList,
  brandsList,
  onSelectProduct,
  onAddToRfq,
  getProductWhatsAppUrl,
  displayWhatsApp,
  defaultWhatsAppNumber,
}) {
  
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const handleQuickAddRfq = (product) => {
    onAddToRfq(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1500);
  };

  const categoryIcons = {
    'all': 'fa-grip',
    'Silinder Pneumatik': 'fa-compress',
    'Katup Solenoid': 'fa-toggle-on',
    'Filter & Regulator (FRL)': 'fa-filter',
    'Fitting & Selang Udara': 'fa-link',
    'Sensor & Pressure Gauge': 'fa-gauge-high',
  };

  return (
    <section id="katalog" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Katalog Komponen <span className="text-[#DF9235]">& Suku Cadang</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Telusuri suku cadang pneumatik, katup solenoid, unit FRL, dan aksesoris industri dari brand resmi terkemuka dengan spesifikasi teknis lengkap.
          </p>
        </div>

        {/* Interactive Filter Control Center */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 border border-slate-200 shadow-card space-y-5 mb-8">
          {/* Top Row: Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-[#DF9235] focus-within:ring-2 focus-within:ring-[#DF9235]/20 transition-all">
                <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Ketik kode part, SKU, atau nama suku cadang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <i className="fa-solid fa-layer-group text-slate-400 text-xs"></i>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  {categoriesList
                    .filter((c) => c !== 'all')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <i className="fa-solid fa-tag text-slate-400 text-xs"></i>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Merek</option>
                  {brandsList
                    .filter((b) => b !== 'all')
                    .map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Reset Controls */}
            <div className="md:col-span-2 flex items-center justify-end">
              {/* Reset filter button if active */}
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                  title="Reset Filter"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Chips Row */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Kategori:</span>
            {categoriesList.map((cat) => {
              const count =
                cat === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      categoryIcons[cat] || 'fa-folder'
                    } text-[10px] text-[#DF9235]`}
                  ></i>
                  <span>{cat === 'all' ? 'Semua Kategori' : cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Brand Pills Row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Merek:</span>
            {brandsList.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedBrand === brand
                    ? 'bg-[#DF9235] text-white font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {brand === 'all' ? 'Semua Brand' : brand}
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="flex items-center justify-between px-2 mb-6 text-xs text-slate-500 font-mono">
          <div>
            Menampilkan <strong>{products.length}</strong> jenis komponen industri
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#DF9235]"></span>
            <span>Pengadaan Komponen Resmi (Pengiriman Nasional)</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: GRID VIEW (2 cols on mobile, 2 on tablet, 3 on desktop)*/}
        {/* ============================================================== */}
        
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 md:gap-7">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-200 p-2 sm:p-4 md:p-5 flex flex-col justify-between hover:shadow-card-hover hover:border-[#DF9235]/60 transition-all duration-300 group relative"
              >
                <div>
                  {/* Photo & Badges */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-28 xs:h-36 sm:h-48 md:h-56 bg-slate-50 rounded-xl sm:rounded-[22px] border border-slate-100 p-1.5 sm:p-4 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-amber-50/20 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-24 xs:max-h-32 sm:max-h-40 md:max-h-48 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Brand Pill */}
                    <span className="absolute top-1.5 left-1.5 sm:top-3.5 sm:left-3.5 bg-slate-900 text-white text-[8px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-full shadow-sm">
                      {product.brand}
                    </span>

                    {/* Hover Quick Zoom Hint */}
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-eye text-[#DF9235]"></i>
                        Lihat Spesifikasi
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-2 sm:pt-4 space-y-1 sm:space-y-2 text-left">
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono">
                      <span className="font-bold text-[#DF9235] tracking-wider uppercase truncate max-w-full">
                        SKU: {product.sku}
                      </span>
                      <span className="text-slate-400 truncate hidden sm:inline max-w-[140px]">
                        {product.categoryName || product.category}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-extrabold text-[11px] sm:text-sm md:text-base text-slate-900 group-hover:text-[#DF9235] transition-colors leading-snug cursor-pointer line-clamp-2 min-h-[1.75rem] sm:min-h-[2.5rem]"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-1 sm:line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>

                    {/* Specs Badge */}
                    <div className="bg-slate-50 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200/80 font-mono text-[8px] sm:text-[11px] text-slate-700 truncate">
                      {product.specsBadge}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-slate-100 space-y-1 sm:space-y-2">
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    {/* Tanya WA */}
                    <a
                      href={getProductWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-full bg-slate-900 hover:bg-black text-white font-bold text-[9px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all text-center active:scale-95"
                    >
                      <i className="fa-brands fa-whatsapp text-xs sm:text-sm text-[#DF9235]"></i>
                      <span className="truncate">WA</span>
                    </a>

                    {/* Tambah ke RFQ */}
                    <button
                      onClick={() => handleQuickAddRfq(product)}
                      className={`py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-full border text-[9px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-center active:scale-95 ${
                        addedAnimationId === product.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          addedAnimationId === product.id
                            ? 'fa-check'
                            : 'fa-file-circle-plus'
                        } text-xs`}
                      ></i>
                      <span className="truncate">
                        {addedAnimationId === product.id ? 'OK' : '+ RFQ'}
                      </span>
                    </button>
                  </div>

                  {/* Detail Link */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full text-center text-[9px] sm:text-[11px] font-bold text-slate-500 hover:text-slate-800 py-0.5 sm:py-1 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Rincian & Foto</span>
                    <i className="fa-solid fa-chevron-right text-[7px] sm:text-[9px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>



        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-slate-300 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h4 className="font-extrabold text-lg text-slate-900">
              Suku Cadang Tidak Ditemukan
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}". KMP memiliki ribuan SKU offline yang siap kami carikan langsung untuk mesin Anda.
            </p>
            <a
              href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(`Halo CV. Krisna Mandiri Perkasa, saya sedang mencari part: ${searchQuery}. Apakah bisa dipesan atau ada rekomendasi tipe ekuivalennya?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs shadow-sm hover:bg-black transition-all"
            >
              <i className="fa-brands fa-whatsapp text-sm text-[#DF9235]"></i>
              <span>Tanyakan Suku Cadang Ini via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
