import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { PRODUCTS_CATALOG } from './catalogData';
import ProductDetailModal from './ProductDetailModal';
import RfqModal from './RfqModal';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandMarquee from './components/BrandMarquee';
import ProductCatalogSection from './components/ProductCatalogSection';
import FaqSection from './components/FaqSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import InteractiveAssistantWidget from './components/InteractiveAssistantWidget';
import FloatingRfqBar from './components/FloatingRfqBar';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [activeTabFilter, setActiveTabFilter] = useState('Semua');

  // Modal & Cart States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [rfqCart, setRfqCart] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Kontak resmi WhatsApp KMP
  const defaultWhatsAppNumber = '6289659586363';
  const displayWhatsApp = '+62 896 5958 6363';

  // Inisialisasi Lenis Smooth Momentum Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Pantau scroll untuk tombol Back-to-Top
    const onLenisScroll = (e) => {
      setShowScrollTop(e.scroll > 400);
    };
    lenis.on('scroll', onLenisScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Hentikan scroll background saat modal aktif
  useEffect(() => {
    if (selectedProduct || isRfqOpen) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
  }, [selectedProduct, isRfqOpen]);

  // Framer Motion Spring Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Smooth Scroll Helper
  const smoothScrollTo = (target) => {
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format link WhatsApp untuk produk spesifik
  const getProductWhatsAppUrl = (product) => {
    const text = `Halo CV. Krisna Mandiri Perkasa (KMP), saya ingin meminta penawaran harga resmi untuk produk:
*${product.name}*
• Kode SKU: ${product.sku}
• Merek: ${product.brand}
• Kategori: ${product.category}

Mohon dapat dikirimkan surat penawaran resminya. Terima kasih.`;
    return `https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  // RFQ Cart Handlers
  const handleAddToRfq = (product, qty = 1) => {
    setRfqCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const handleRemoveRfqItem = (productId) => {
    setRfqCart((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleClearRfqCart = () => {
    setRfqCart([]);
  };

  // Quick Tab Filter Handler di Hero
  const handleQuickTabClick = (tab) => {
    setActiveTabFilter(tab);
    if (tab === 'Semua') {
      setSelectedCategory('all');
    } else if (tab === 'Silinder') {
      setSelectedCategory('Silinder Pneumatik');
    } else if (tab === 'Katup Solenoid') {
      setSelectedCategory('Katup Solenoid');
    } else if (tab === 'Filter (FRL)') {
      setSelectedCategory('Filter & Regulator (FRL)');
    } else if (tab === 'Fitting & Selang') {
      setSelectedCategory('Fitting & Selang Udara');
    } else if (tab === 'Pressure Gauge') {
      setSelectedCategory('Sensor & Pressure Gauge');
    }

    smoothScrollTo('#katalog');
  };

  // Filtering Produk
  const filteredProducts = PRODUCTS_CATALOG.filter((product) => {
    const matchesCat =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand =
      selectedBrand === 'all' ||
      product.brand.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesQuery =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesBrand && matchesQuery;
  });

  const categoriesList = [
    'all',
    ...Array.from(new Set(PRODUCTS_CATALOG.map((p) => p.category))),
  ];

  const brandsList = [
    'all',
    'ASCO',
    'Numatics',
    'Aventics',
    'Norgren',
    'Airtac',
    'Barksdale',
    'Findeva',
    'Winters',
    'HYDAC',
    'Camozzi',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#DF9235]/25 selection:text-slate-900 flex flex-col relative">
      {/* 0. Top Ambient Glow Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#DF9235] via-amber-400 to-[#DF9235] origin-left z-[70] shadow-[0_0_10px_rgba(223,146,53,0.7)] pointer-events-none"
      />

      {/* 1. Floating Modern Header / Navbar */}
      <Navbar
        rfqCount={rfqCart.length}
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 2. Hero Section Interaktif & Fresh */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onQuickTabClick={handleQuickTabClick}
        activeTabFilter={activeTabFilter}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToRfq={handleAddToRfq}
      />

      {/* 3. Infinite Logo Marquee Brand Resmi */}
      <BrandMarquee
        onSelectBrand={(brandName) => {
          setSelectedBrand(brandName);
          smoothScrollTo('#katalog');
        }}
      />

      {/* 4. Katalog Suku Cadang Interaktif */}
      <ProductCatalogSection
        products={filteredProducts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        categoriesList={categoriesList}
        brandsList={brandsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToRfq={handleAddToRfq}
        getProductWhatsAppUrl={getProductWhatsAppUrl}
        displayWhatsApp={displayWhatsApp}
        defaultWhatsAppNumber={defaultWhatsAppNumber}
      />

      {/* 5. Interactive FAQ Accordion */}
      <FaqSection
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 6. Modern Call-to-Action Banner */}
      <CtaBanner
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 7. Sleek Tech Footer */}
      <Footer
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          smoothScrollTo('#katalog');
        }}
        onFilterBrand={(brand) => {
          setSelectedBrand(brand);
          smoothScrollTo('#katalog');
        }}
      />

      {/* 8. Floating Smart Industrial Assistant Widget */}
      <InteractiveAssistantWidget
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          smoothScrollTo('#katalog');
        }}
        onFilterBrand={(b) => {
          setSelectedBrand(b);
          smoothScrollTo('#katalog');
        }}
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 9. Floating Smooth Back-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={handleScrollToTop}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title="Kembali ke Atas"
          >
            <i className="fa-solid fa-arrow-up text-xs text-[#DF9235] group-hover:-translate-y-0.5 transition-transform"></i>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 10. Sticky Bottom RFQ Notification Bar */}
      <FloatingRfqBar
        items={rfqCart}
        onOpenRfq={() => setIsRfqOpen(true)}
        onClearCart={handleClearRfqCart}
      />

      {/* 11. Modal Detail Produk & RFQ Penawaran */}
      {selectedProduct && (
        <ProductDetailModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToRfq={handleAddToRfq}
          onDirectWhatsApp={(prod) => {
            window.open(
              getProductWhatsAppUrl(prod),
              '_blank',
              'noopener,noreferrer'
            );
          }}
        />
      )}

      {isRfqOpen && (
        <RfqModal
          isOpen={isRfqOpen}
          onClose={() => setIsRfqOpen(false)}
          items={rfqCart}
          onRemoveItem={handleRemoveRfqItem}
          onClearCart={handleClearRfqCart}
        />
      )}
    </div>
  );
}
