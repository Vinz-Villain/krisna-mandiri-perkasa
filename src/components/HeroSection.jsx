import React, { useState, useEffect, useRef, useMemo } from 'react';

// Featured items for the 3D cylindrical carousel using real KMP products from D:\produk_kmp
const FEATURED_ITEMS = [
  {
    id: 'NORGREN-RM8000',
    badge: 'SILINDER PNEUMATIK',
    title: 'Norgren - Air Cylinder RM8000 Series',
    specs: 'RM/8000 Series • Double Acting • Standar ISO',
    image: '/products/norgren-air-cylinder-rm8000.jpg',
    stock: 'Standar ISO',
    category: 'Silinder Pneumatik',
    sku: 'RM/8025/M/100'
  },
  {
    id: 'NORGREN-ISO-STAR',
    badge: 'KATUP SOLENOID',
    title: 'Norgren - Iso Star Solenoid Valve',
    specs: 'ISO*Star Valve • Spool & Sleeve Presisi Tinggi',
    image: '/products/norgren-iso-star-solenoid-valve.jpg',
    stock: 'Norgren Asli',
    category: 'Katup Solenoid',
    sku: 'SXE9573-A70-00'
  },
  {
    id: 'NORGREN-B64G-REG',
    badge: 'FILTER & REGULATOR',
    title: 'Norgren - Olympian Plus Filter or Regulator B64G Series',
    specs: 'B64G Olympian Plus • Plug-in Modular FRL',
    image: '/products/norgren-olympian-plus-b64g.jpg',
    stock: 'Ready Stock',
    category: 'Filter & Regulator (FRL)',
    sku: 'B64G-4GK-AD3-RMN'
  },
  {
    id: 'NORGREN-B68G-REG',
    badge: 'FILTER & REGULATOR',
    title: 'Norgren - Olympian Plus FilterRegulator B68G Series',
    specs: 'B68G Olympian Plus • Heavy Duty Aliran Tinggi',
    image: '/products/norgren-olympian-plus-b68g.jpg',
    stock: 'Garansi Resmi',
    category: 'Filter & Regulator (FRL)',
    sku: 'B68G-8GK-AR3-RLN'
  },
  {
    id: 'NORGREN-VCB',
    badge: 'KATUP SOLENOID',
    title: 'Norgren - Solenoid Valve VCB Series',
    specs: 'VCB22D517A-AD213L • DC24V 3W • IP65',
    image: '/products/norgren-solenoid-valve-vcb.jpg',
    stock: 'Ready Stock',
    category: 'Katup Solenoid',
    sku: 'VCB22D517A-AD213L'
  },
  {
    id: 'NORGREN-V51',
    badge: 'KATUP SOLENOID',
    title: 'Norgren - Solenoid Valve V51 Series',
    specs: 'V51B517A-A2000 • Pmax 8 Bar • Respon Cepat',
    image: '/products/norgren-solenoid-valve-v51.jpg',
    stock: 'Ready Stock',
    category: 'Katup Solenoid',
    sku: 'V51B517A-A2000'
  },
  {
    id: 'NORGREN-V61',
    badge: 'KATUP SOLENOID',
    title: 'Norgren - Solenoid Valve V61 Series',
    specs: 'V61B513A • Profil Ramping Manifold Blok',
    image: '/products/norgren-solenoid-valve-v61.jpg',
    stock: 'Stok Tersedia',
    category: 'Katup Solenoid',
    sku: 'V61B513A-A213J'
  },
  {
    id: 'NORGREN-B64G',
    badge: 'AIR PREPARATION',
    title: 'Norgren - B64G Series',
    specs: 'B64G Series • Filter Udara Presisi Tinggi',
    image: '/products/norgren-b64g-series.jpg',
    stock: 'Garansi Resmi',
    category: 'Filter & Regulator (FRL)',
    sku: 'B64G-2GK-AD1-RMN'
  },
  {
    id: 'NORGREN-B68G',
    badge: 'AIR PREPARATION',
    title: 'Norgren - B68G Series',
    specs: 'B68G Series • Kapasitas Aliran Industri Berat',
    image: '/products/norgren-b68g-series.jpg',
    stock: 'Garansi Resmi',
    category: 'Filter & Regulator (FRL)',
    sku: 'B68G-6GK-AR1-RLN'
  }
];

// Helper to determine card dimensions by screen width
function getCardDimensions(width) {
  if (width < 380) return { cardWidth: 145, cardHeight: 95, cardGap: 8, key: 'mobile' };
  if (width < 640) return { cardWidth: 165, cardHeight: 108, cardGap: 12, key: 'mobile' };
  if (width < 1024) return { cardWidth: 280, cardHeight: 180, cardGap: 22, key: 'tablet' };
  return { cardWidth: 380, cardHeight: 240, cardGap: 34, key: 'desktop' };
}

// 3D Card Item Component
function CarouselCardItem({
  item,
  slotDiff,
  isMobile,
  cardWidth,
  cardHeight,
  isTransitioning,
  onSelectProduct
}) {
  const absDiff = Math.abs(slotDiff);
  const dir = slotDiff < 0 ? 1 : slotDiff > 0 ? -1 : 0;

  // Exact 3D formula matching Rencana Tuhan Studio
  let transformConfig;
  if (absDiff === 0) {
    transformConfig = {
      scale: isMobile ? 0.72 : 0.7,
      translateY: isMobile ? -50 : -90,
      translateX: 0,
      opacity: 0.95,
      zIndex: 10,
      rotateY: 0,
      rotateZ: 0
    };
  } else if (absDiff === 1) {
    transformConfig = {
      scale: isMobile ? 0.85 : 0.86,
      translateY: isMobile ? -10 : -15,
      translateX: dir * (isMobile ? 12 : 18),
      opacity: 1,
      zIndex: 5,
      rotateY: dir * (isMobile ? 12 : 16),
      rotateZ: -1.2 * dir
    };
  } else if (absDiff === 2) {
    transformConfig = {
      scale: 1,
      translateY: isMobile ? 25 : 45,
      translateX: 0,
      opacity: 1,
      zIndex: 2,
      rotateY: dir * (isMobile ? 22 : 30),
      rotateZ: -2.2 * dir
    };
  } else {
    transformConfig = {
      scale: 0.95,
      translateY: isMobile ? 35 : 55,
      translateX: 0,
      opacity: 0,
      zIndex: 0,
      rotateY: 38 * dir,
      rotateZ: -3 * dir
    };
  }

  const { scale, translateY, translateX, opacity, zIndex, rotateY, rotateZ } = transformConfig;
  const isVisible = opacity > 0;

  const handleClick = () => {
    if (onSelectProduct && isVisible) {
      onSelectProduct({
        id: item.id,
        name: item.title,
        category: item.badge,
        sku: item.sku,
        image: item.image,
        summary: item.specs,
        stockStatus: item.stock
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        flexShrink: 0,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transition: isTransitioning
          ? 'transform 1800ms cubic-bezier(0.35, 0, 0.15, 1), opacity 1800ms ease'
          : 'none',
        opacity,
        zIndex,
        willChange: 'transform, opacity'
      }}
      className={`relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group ${
        isVisible ? 'pointer-events-auto cursor-pointer hover:shadow-[0_20px_45px_-10px_rgba(223,146,53,0.4)]' : 'pointer-events-none'
      }`}
    >
      {/* Light Sheen Sweep Effect */}
      <div className="hero-sheen-effect" />

      {/* Real Product Image with subtle background fallback */}
      {item.image && isVisible ? (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95 group-hover:brightness-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
          <span className="text-slate-400 font-medium text-xs text-center px-2">{item.title}</span>
        </div>
      )}

      {/* Dark vignette gradient overlay for high text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

      {/* Top Badge */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-black/60 px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-md border border-amber-400/30">
          {item.badge}
        </span>
        <span className="hidden sm:inline-flex text-[9px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10 items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {item.stock}
        </span>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-2 sm:bottom-3.5 inset-x-2.5 sm:inset-x-3.5 flex flex-col items-start text-left z-10 pointer-events-none">
        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug line-clamp-1 drop-shadow-md group-hover:text-amber-300 transition-colors">
          {item.title}
        </h4>
        <p className="hidden sm:block text-[11px] font-medium text-slate-300 line-clamp-1">
          {item.specs}
        </p>
      </div>
    </div>
  );
}

// 3D Carousel Stage Component
function Curved3DCarouselStage({ onSelectProduct }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1400);
  const isInteracting = useRef(false);
  const resizeDebounce = useRef(null);
  const initialMount = useRef(true);

  // Multiply items to enable infinite smooth scrolling
  const flatList = useMemo(
    () => Array.from({ length: Math.max(6, Math.ceil(48 / FEATURED_ITEMS.length)) }, () => FEATURED_ITEMS).flat(),
    []
  );

  const initialCenterIndex = Math.floor(flatList.length / 2);
  const [currentIndex, setCurrentIndex] = useState(initialCenterIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { cardWidth, cardHeight, cardGap, key } = getCardDimensions(containerWidth);
  const cardStep = cardWidth + cardGap;
  const isMobile = key === 'mobile';
  const lastWidth = useRef(containerWidth);

  // Initial transition enable
  useEffect(() => {
    const t = setTimeout(() => setIsTransitioning(true), 80);
    return () => clearTimeout(t);
  }, []);

  // ResizeObserver for responsive width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = (w) => {
      if (Math.abs(lastWidth.current - w) < 2) return;
      const prevKey = getCardDimensions(lastWidth.current).key;
      const newKey = getCardDimensions(w).key;
      lastWidth.current = w;
      setContainerWidth(w);

      if (initialMount.current) {
        initialMount.current = false;
        if (prevKey !== newKey) {
          setIsTransitioning(false);
          setTimeout(() => setIsTransitioning(true), 60);
        }
        return;
      }

      if (prevKey !== newKey) {
        setIsTransitioning(false);
        isInteracting.current = true;
        if (resizeDebounce.current) clearTimeout(resizeDebounce.current);
        resizeDebounce.current = setTimeout(() => {
          isInteracting.current = false;
          setTimeout(() => setIsTransitioning(true), 60);
        }, 250);
      }
    };

    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === 'number' && w > 0) handleResize(w);
    });

    observer.observe(el);
    handleResize(el.offsetWidth || window.innerWidth);

    return () => {
      observer.disconnect();
      if (resizeDebounce.current) clearTimeout(resizeDebounce.current);
    };
  }, []);

  // Auto rotation interval (moves smoothly leftward every 2.8s)
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
      interval = setInterval(() => {
        if (!isInteracting.current && (typeof document === 'undefined' || !document.hidden)) {
          setIsTransitioning(true);
          setCurrentIndex((prev) => prev - 1);
        }
      }, 2800);
    }, 400);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Seamless jump reset when index gets low (infinite loop)
  useEffect(() => {
    if (currentIndex <= 8) {
      const timeout = setTimeout(() => {
        if (!isInteracting.current) {
          setIsTransitioning(false);
          setCurrentIndex((prev) => prev + 2 * FEATURED_ITEMS.length);
        }
      }, 1900);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const containerX = -currentIndex * cardStep - cardWidth / 2;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { isInteracting.current = true; }}
      onMouseLeave={() => { isInteracting.current = false; }}
      className="absolute inset-x-0 top-[38%] sm:top-[44%] md:top-1/2 -translate-y-1/2 h-[320px] sm:h-[480px] md:h-[620px] pointer-events-none select-none overflow-hidden z-[1]"
      aria-hidden="true"
    >
      <div style={{ position: 'absolute', inset: 0, perspective: '1100px', perspectiveOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate3d(${containerX}px, -50%, 0)`,
            transition: isTransitioning
              ? 'transform 1800ms cubic-bezier(0.35, 0, 0.15, 1)'
              : 'none',
            display: 'flex',
            gap: `${cardGap}px`,
            willChange: 'transform',
            transformStyle: 'preserve-3d'
          }}
        >
          {flatList.map((item, idx) => (
            <CarouselCardItem
              key={`${item.id}-${idx}`}
              item={item}
              slotDiff={idx - currentIndex}
              isMobile={isMobile}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              isTransitioning={isTransitioning}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  onQuickTabClick,
  activeTabFilter,
  onSelectProduct,
  onAddToRfq
}) {
  const quickFilterTabs = [
    { label: 'Semua Produk', value: 'Semua' },
    { label: 'Silinder Pneumatik', value: 'Silinder' },
    { label: 'Katup Solenoid', value: 'Katup Solenoid' },
    { label: 'Unit FRL (Filter)', value: 'Filter (FRL)' },
    { label: 'Fitting & Selang', value: 'Fitting & Selang' },
  ];

  const handleScrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[96dvh] w-full flex flex-col justify-center overflow-hidden bg-[#F8FAFC] pt-24 pb-14 sm:pt-28 sm:pb-16 font-sans">
      
      {/* 1. Atmospheric Ambient Lighting & Grid */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-[#F8FAFC]/95" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-amber-500/12 via-[#3B49DF]/8 to-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* 2. Genuine 3D Curved Cylindrical Carousel with Real Product Photos */}
      <Curved3DCarouselStage onSelectProduct={onSelectProduct} />

      {/* 3. Radial Soft Vignette Mask */}
      <div className="absolute inset-0 z-[5] pointer-events-none select-none bg-[radial-gradient(ellipse_70%_58%_at_50%_46%,rgba(248,250,252,0.92)_0%,rgba(248,250,252,0.55)_50%,transparent_85%)]" />

      {/* 4. Center Stage Content (Matching Screenshot 2026-10-15 230726.png) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Pill Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-4 sm:mb-5">
          <span className="h-2 w-2 rounded-full bg-[#DF9235]" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-800">
            DISTRIBUTOR RESMI SUKU CADANG & PNEUMATIK PABRIK
          </span>
        </div>

        {/* Headline: Clean, Non-Tilted (Suku Cadang Industri in Slate, Presisi & Otomasi Pabrik in Amber) */}
        <div className="flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
          <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-900 leading-tight">
            Suku Cadang Industri
          </h1>
          <h2 className="text-4xl min-[400px]:text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#DF9235] leading-tight pb-1">
            Presisi & Otomasi Pabrik
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          Pemasok terpercaya silinder pneumatik, katup solenoid presisi tinggi, dan unit FRL berstandar ISO dunia langsung ke lini produksi Anda tanpa jeda.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
          {/* Button 1: Solid Amber Pill */}
          <a
            href="https://wa.me/6289659586363?text=Halo%20CV.%20Krisna%20Mandiri%20Perkasa%2C%20saya%20ingin%20meminta%20penawaran%20harga%20resmi%20suku%20cadang."
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#DF9235] hover:bg-[#C97E25] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_16px_rgba(223,146,53,0.35)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group"
          >
            <span>MINTA PENAWARAN (RFQ)</span>
            <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </a>

          {/* Button 2: White Pill with Layer Icon */}
          <button
            onClick={handleScrollToCatalog}
            className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm tracking-wide border border-slate-200/90 shadow-xs flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 group"
          >
            <i className="fa-solid fa-layer-group text-xs text-[#DF9235]" />
            <span>JELAJAHI KATALOG</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE SEARCH & QUICK CATEGORY FILTER CAPSULE */}
        {/* ========================================================================= */}
        <div className="pt-6 sm:pt-8 w-full max-w-2xl mx-auto space-y-3.5">
          {/* Search Pill Input Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-full p-2 pl-5 sm:pl-6 shadow-md border border-slate-200/90 flex items-center justify-between gap-3 transition-all focus-within:ring-2 focus-within:ring-[#DF9235]/40 focus-within:border-[#DF9235]">
            <div className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nomor SKU, tipe part (ISO 15552, 4V210, GFR300), atau merek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1"
                  title="Hapus pencarian"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
            <button
              onClick={handleScrollToCatalog}
              className="px-5 py-2.5 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold shrink-0 transition-transform active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <span>Cari Part</span>
              <i className="fa-solid fa-arrow-right text-[10px] text-[#DF9235]" />
            </button>
          </div>

          {/* Quick Filter Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <i className="fa-solid fa-bolt text-[#DF9235] text-[11px]" />
              Kategori Cepat:
            </span>
            {quickFilterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onQuickTabClick(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTabFilter === tab.value
                    ? 'bg-[#DF9235] text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
