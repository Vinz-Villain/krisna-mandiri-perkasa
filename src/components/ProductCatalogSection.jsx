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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'
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

            {/* View Mode & Reset Controls */}
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              {/* Reset filter button if active */}
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 hover:text-rose-700 font-bold underline"
                  title="Reset Filter"
                >
                  Reset
                </button>
              )}

              {/* View mode toggle */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <i className="fa-solid fa-grid-2"></i>
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Compact List View"
                >
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
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
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gudang Siap Kirim (Dispatch Nasional)</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: GRID VIEW (Fresh modern tech cards)                    */}
        {/* ============================================================== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[28px] border border-slate-200 p-5 flex flex-col justify-between hover:shadow-card-hover hover:border-[#DF9235]/60 transition-all duration-300 group relative"
              >
                <div>
                  {/* Photo & Badges */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative h-56 bg-slate-50 rounded-[22px] border border-slate-100 p-4 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-amber-50/20 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-48 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Brand Pill */}
                    <span className="absolute top-3.5 left-3.5 bg-slate-900 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {product.brand}
                    </span>

                    {/* Stock Status Pill */}
                    <span className="absolute top-3.5 right-3.5 bg-white/95 border border-slate-200 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {product.stockStatus}
                    </span>

                    {/* Hover Quick Zoom Hint */}
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
                        <i className="fa-solid fa-eye text-[#DF9235]"></i>
                        Lihat Spesifikasi
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-4 space-y-2.5 text-left">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-[#DF9235] tracking-wider uppercase">
                        SKU: {product.sku}
                      </span>
                      <span className="text-slate-400 truncate max-w-[140px]">
                        {product.categoryName || product.category}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-extrabold text-base text-slate-900 group-hover:text-[#DF9235] transition-colors leading-snug cursor-pointer line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Specs Badge */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 truncate">
                      {product.specsBadge}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-5 mt-4 border-t border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Tanya WA */}
                    <a
                      href={getProductWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center active:scale-95"
                    >
                      <i className="fa-brands fa-whatsapp text-sm text-[#DF9235]"></i>
                      <span>Tanya WA</span>
                    </a>

                    {/* Tambah ke RFQ */}
                    <button
                      onClick={() => handleQuickAddRfq(product)}
                      className={`py-2.5 px-3 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center active:scale-95 ${
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
                      <span>
                        {addedAnimationId === product.id ? 'Ditambahkan!' : '+ Minta RFQ'}
                      </span>
                    </button>
                  </div>

                  {/* Detail Link */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-800 py-1 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Buka Rincian Spesifikasi & Gambar Detail</span>
                    <i className="fa-solid fa-chevron-right text-[9px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: COMPACT LIST VIEW (Professional procurement table)      */}
        {/* ============================================================== */}
        {viewMode === 'compact' && (
          <div className="bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Komponen</th>
                    <th className="py-3.5 px-4">Merek / SKU</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Kategori</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Spesifikasi Singkat</th>
                    <th className="py-3.5 px-4 text-center">Stok</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-amber-50/30 transition-colors group cursor-pointer"
                    >
                      <td
                        onClick={() => onSelectProduct(product)}
                        className="py-3 px-4 font-bold max-w-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                          <div className="font-extrabold text-slate-900 group-hover:text-[#DF9235] line-clamp-1">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-900">{product.brand}</span>
                        <div className="text-[11px] text-slate-500">{product.sku}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-slate-600">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-slate-500 font-mono text-[11px] max-w-xs truncate">
                        {product.specsBadge}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 inline-block">
                          {product.stockStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getProductWhatsAppUrl(product)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-900 text-white hover:bg-black transition-colors"
                            title="Chat WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp text-xs text-[#DF9235]"></i>
                          </a>
                          <button
                            onClick={() => handleQuickAddRfq(product)}
                            className="p-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                            title="Tambah ke RFQ"
                          >
                            <i className="fa-solid fa-file-circle-plus text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
              href={`https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(`Halo CV. Krisna Mandiri Perkasa, saya sedang mencari part: ${searchQuery}. Apakah ada stoknya atau tipe alternatifnya?`)}`}
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
