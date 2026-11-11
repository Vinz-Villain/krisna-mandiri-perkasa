import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { PRODUCTS_CATALOG } from './catalogData';
import {
  initStorage,
  getProducts,
  getCategories,
  getBrands,
  refreshCatalogFromCloud,
  DEFAULT_CATEGORIES,
  DEFAULT_BRANDS,
  isDisallowedBrand,
} from './services/storageService';
import ProductDetailModal from './ProductDetailModal';
import RfqModal from './RfqModal';
import AdminDashboardModal from './components/admin/AdminDashboardModal';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BrandMarquee from './components/BrandMarquee';
import ProductCatalogSection from './components/ProductCatalogSection';
import FaqSection from './components/FaqSection';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import FloatingRfqBar from './components/FloatingRfqBar';
import ChatbotWidget from './components/ChatbotWidget';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [activeTabFilter, setActiveTabFilter] = useState('Semua');

  // Dynamic Catalog State from Storage / CRUD
  const [products, setProducts] = useState(PRODUCTS_CATALOG);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [brands, setBrands] = useState(DEFAULT_BRANDS);

  // Modal & Cart States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hash === '#admin' ||
      window.location.pathname === '/admin' ||
      window.location.pathname === '/admin/'
    );
  });
  const [rfqCart, setRfqCart] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Kontak resmi WhatsApp KMP
  const defaultWhatsAppNumber = '6289659586363';
  const displayWhatsApp = '+62 896 5958 6363';

  // Load dynamic data on mount
  const loadCatalogData = async () => {
    try {
      await initStorage();
      const [prodList, catList, brandList] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
      ]);
      if (prodList && prodList.length > 0) {
        setProducts(prodList.filter((p) => !isDisallowedBrand(p.brand)));
      }
      if (catList && catList.length > 0) setCategories(catList);
      if (brandList && brandList.length > 0) {
        setBrands(brandList.filter((b) => !isDisallowedBrand(b.name)));
      }

      // Sinkronisasi data live cloud Google Sheet di latar belakang
      const cloudData = await refreshCatalogFromCloud();
      if (cloudData) {
        if (cloudData.products && cloudData.products.length > 0) {
          setProducts(cloudData.products.filter((p) => !isDisallowedBrand(p.brand)));
        }
        if (cloudData.categories && cloudData.categories.length > 0) setCategories(cloudData.categories);
        if (cloudData.brands && cloudData.brands.length > 0) {
          setBrands(cloudData.brands.filter((b) => !isDisallowedBrand(b.name)));
        }
      }
    } catch (err) {
      console.error('Failed to load storage catalog:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await initStorage();
        const [prodList, catList, brandList] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ]);
        if (isMounted) {
          if (prodList && prodList.length > 0) {
            setProducts(prodList.filter((p) => !isDisallowedBrand(p.brand)));
          }
          if (catList && catList.length > 0) setCategories(catList);
          if (brandList && brandList.length > 0) {
            setBrands(brandList.filter((b) => !isDisallowedBrand(b.name)));
          }
        }

        // Ambil data live cloud Google Sheet
        const cloudData = await refreshCatalogFromCloud();
        if (isMounted && cloudData) {
          if (cloudData.products && cloudData.products.length > 0) {
            setProducts(cloudData.products.filter((p) => !isDisallowedBrand(p.brand)));
          }
          if (cloudData.categories && cloudData.categories.length > 0) setCategories(cloudData.categories);
          if (cloudData.brands && cloudData.brands.length > 0) {
            setBrands(cloudData.brands.filter((b) => !isDisallowedBrand(b.name)));
          }
        }
      } catch (err) {
        console.error('Failed to load storage catalog:', err);
      }
    })();

    // Dukung akses privat admin via URL (#admin atau /admin) serta shortcut rahasia Ctrl+Shift+A
    const handleUrlCheck = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.pathname === '/admin' ||
        window.location.pathname === '/admin/'
      ) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e) => {
      // Shortcut rahasia: Ctrl + Shift + A (atau Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Pantau scroll untuk tombol Back-to-Top (native listener, passive untuk performa optimal 60/120fps)
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kunci scroll background saat modal aktif
  useEffect(() => {
    if (selectedProduct || isRfqOpen || isAdminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, isRfqOpen, isAdminOpen]);

  // Smooth Scroll Helper (Native browser behavior)
  const smoothScrollTo = (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Pastikan jika ada state brand non-aktif (norgren, camozzi), otomatis di-fallback ke 'all'
  const activeSelectedBrand =
    selectedBrand && isDisallowedBrand(selectedBrand)
      ? 'all'
      : selectedBrand;

  // Filtering Produk
  const filteredProducts = products
    .filter((p) => !isDisallowedBrand(p.brand))
    .filter((product) => {
      const matchesCat =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesBrand =
        activeSelectedBrand === 'all' ||
        product.brand.toLowerCase().includes(activeSelectedBrand.toLowerCase());
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
    ...Array.from(
      new Set([
        ...categories.map((c) => c.name),
        ...products.map((p) => p.category),
      ])
    ).filter(Boolean),
  ];

  const brandsList = [
    'all',
    ...Array.from(
      new Set([
        ...brands.map((b) => b.name),
        ...products.map((p) => p.brand),
      ])
    )
      .filter(Boolean)
      .filter((b) => !isDisallowedBrand(b)),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#DC2626]/25 selection:text-slate-900 flex flex-col relative w-full max-w-full overflow-x-hidden">
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
        brands={brands}
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
        selectedBrand={activeSelectedBrand}
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
            <i className="fa-solid fa-arrow-up text-xs text-[#DC2626] group-hover:-translate-y-0.5 transition-transform"></i>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 10. Floating Interactive WhatsApp Chatbot Widget */}
      <ChatbotWidget
        defaultWhatsAppNumber={defaultWhatsAppNumber}
        displayWhatsApp={displayWhatsApp}
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 11. Sticky Bottom RFQ Notification Bar */}
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

      {/* 12. Modal Admin Dashboard (CRUD Produk, Kategori & Merek) */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.pushState(
              '',
              document.title,
              window.location.pathname + window.location.search.replace(/#.*$/, '')
            );
          } else if (
            window.location.pathname === '/admin' ||
            window.location.pathname === '/admin/'
          ) {
            window.history.pushState('', document.title, '/');
          }
        }}
        products={products.filter((p) => !isDisallowedBrand(p.brand))}
        categories={categories}
        brands={brands.filter((b) => !isDisallowedBrand(b.name))}
        onRefreshData={loadCatalogData}
      />
    </div>
  );
}
