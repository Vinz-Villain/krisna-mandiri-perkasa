import React, { useState } from 'react';
import { PRODUCTS_CATALOG } from './catalogData';
import ProductDetailModal from './ProductDetailModal';
import RfqModal from './RfqModal';

// Fresh & Interactive Components Inspired by Chevron
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

  // Kontak resmi WhatsApp KMP
  const defaultWhatsAppNumber = '6289659586363';
  const displayWhatsApp = '+62 896 5958 6363';

  // Format link WhatsApp untuk produk spesifik
  const getProductWhatsAppUrl = (product) => {
    const text = `Halo CV. Krisna Mandiri Perkasa (KMP), saya ingin bertanya mengenai ketersediaan stok & harga penawaran resmi untuk produk:
*${product.name}*
• Kode SKU: ${product.sku}
• Merek: ${product.brand}
• Kategori: ${product.category}

Apakah barang ini ready stock dan bisa dikirimkan penawaran resminya? Terima kasih.`;
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
    }

    const catElem = document.getElementById('katalog');
    if (catElem) {
      catElem.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#DF9235]/25 selection:text-slate-900 flex flex-col">
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

      {/* 7. Interactive FAQ Accordion */}
      <FaqSection
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 8. Modern Call-to-Action Banner */}
      <CtaBanner
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 9. Sleek Tech Footer */}
      <Footer
        onFilterCategory={(cat) => setSelectedCategory(cat)}
        onFilterBrand={(brand) => setSelectedBrand(brand)}
      />

      {/* 10. Floating Smart Industrial Assistant Widget (Gaya SkomdaAssistantWidget) */}
      <InteractiveAssistantWidget
        onFilterCategory={(cat) => setSelectedCategory(cat)}
        onFilterBrand={(b) => setSelectedBrand(b)}
        onOpenRfq={() => setIsRfqOpen(true)}
      />

      {/* 11. Sticky Bottom RFQ Notification Bar */}
      <FloatingRfqBar
        items={rfqCart}
        onOpenRfq={() => setIsRfqOpen(true)}
        onClearCart={handleClearRfqCart}
      />

      {/* 12. Modal Detail Produk & RFQ Penawaran */}
      {selectedProduct && (
        <ProductDetailModal
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
