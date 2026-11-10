import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  saveBrand,
  deleteBrand,
  compressImage,
  exportAllData,
  importAllData,
  resetToDefaults,
  refreshCatalogFromCloud,
  syncCurrentCatalogToGoogleSheet,
} from '../../services/storageService';
import {
  getGoogleSheetUrl,
  setGoogleSheetUrl,
  isGoogleSheetActive,
  testConnection,
} from '../../services/googleSheetService';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../services/googleAppsScriptCode';

const COMMON_ICONS = [
  { class: 'fa-compress', label: 'Silinder' },
  { class: 'fa-toggle-on', label: 'Katup' },
  { class: 'fa-filter', label: 'Filter / FRL' },
  { class: 'fa-link', label: 'Fitting / Selang' },
  { class: 'fa-gauge-high', label: 'Pressure Gauge' },
  { class: 'fa-bolt', label: 'Vibrator' },
  { class: 'fa-box', label: 'Box / Komponen' },
  { class: 'fa-gears', label: 'Mesin' },
  { class: 'fa-microchip', label: 'Sensor' },
  { class: 'fa-wrench', label: 'Alat' },
];

const DEFAULT_ADMIN_PW = 'kmpadmin2026';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  products,
  categories,
  brands,
  onRefreshData,
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('kmp_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pwChangeForm, setPwChangeForm] = useState({ currentPw: '', newPw: '' });

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories' | 'brands' | 'backup'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  // States Form Produk
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    sku: '',
    summary: '',
    image: '',
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // States Form Kategori
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'fa-box',
    description: '',
  });

  // States Form Brand
  const [isBrandFormOpen, setIsBrandFormOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandForm, setBrandForm] = useState({
    name: '',
    origin: '',
    description: '',
  });

  // States Google Sheets Integration
  const [gsheetUrlInput, setGsheetUrlInput] = useState(() => getGoogleSheetUrl());
  const [isTestingGSheet, setIsTestingGSheet] = useState(false);
  const [isSyncingGSheet, setIsSyncingGSheet] = useState(false);
  const [isPushingGSheet, setIsPushingGSheet] = useState(false);
  const [gsheetStatus, setGsheetStatus] = useState(() => isGoogleSheetActive());
  const [codeCopied, setCodeCopied] = useState(false);
  const [showAdvancedGSheet, setShowAdvancedGSheet] = useState(false);
  const [showAdvancedBackup, setShowAdvancedBackup] = useState(false);

  if (!isOpen) return null;

  // Helper password getter
  const getStoredPassword = () => {
    try {
      return localStorage.getItem('kmp_admin_pw') || DEFAULT_ADMIN_PW;
    } catch {
      return DEFAULT_ADMIN_PW;
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correctPw = getStoredPassword();
    if (passwordInput === correctPw) {
      try {
        sessionStorage.setItem('kmp_admin_auth', 'true');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Kata sandi salah. Silakan periksa kembali!');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('kmp_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const currentCorrect = getStoredPassword();
    if (pwChangeForm.currentPw !== currentCorrect) {
      showToast('Kata sandi saat ini tidak sesuai!', 'error');
      return;
    }
    if (pwChangeForm.newPw.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter!', 'error');
      return;
    }

    try {
      localStorage.setItem('kmp_admin_pw', pwChangeForm.newPw);
      showToast('Kata sandi admin berhasil diperbarui!');
      setPwChangeForm({ currentPw: '', newPw: '' });
    } catch {
      showToast('Gagal menyimpan kata sandi baru', 'error');
    }
  };

  if (!isOpen) return null;

  // Notifikasi pop-up singkat
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || '',
      brand: brands[0]?.name || '',
      description: '',
      sku: '',
      summary: '',
      image: '',
    });
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name || '',
      category: prod.category || categories[0]?.name || '',
      brand: prod.brand || brands[0]?.name || '',
      description: prod.description || '',
      sku: prod.sku || '',
      summary: prod.summary || '',
      image: prod.image || '',
    });
    setIsProductFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const compressedBase64 = await compressImage(file, 1200, 1200, 0.85);
      setProductForm((prev) => ({
        ...prev,
        image: compressedBase64,
      }));
      showToast('Foto produk berhasil di-upload!');
    } catch (err) {
      showToast(err.message || 'Gagal memproses gambar', 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('Nama produk wajib diisi!', 'error');
      return;
    }
    if (!productForm.category) {
      showToast('Pilih kategori produk!', 'error');
      return;
    }
    if (!productForm.brand) {
      showToast('Pilih merek produk!', 'error');
      return;
    }
    if (!productForm.description.trim()) {
      showToast('Deskripsi produk wajib diisi!', 'error');
      return;
    }

    const payload = {
      ...(editingProductId ? { id: editingProductId } : {}),
      name: productForm.name.trim(),
      category: productForm.category,
      brand: productForm.brand,
      description: productForm.description.trim(),
      sku: productForm.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      summary:
        productForm.summary.trim() ||
        productForm.description.slice(0, 140) + '...',
      image: productForm.image || '/logo-kmp.png',
      images: [productForm.image || '/logo-kmp.png'],
    };

    try {
      await saveProduct(payload);
      showToast(
        editingProductId
          ? (gsheetStatus ? 'Produk diperbarui di Google Sheets & Perangkat!' : 'Produk berhasil diperbarui!')
          : (gsheetStatus ? 'Produk baru tersimpan ke Google Sheets & Perangkat!' : 'Produk baru berhasil ditambahkan!')
      );
      setIsProductFormOpen(false);
      onRefreshData();
    } catch (err) {
      showToast('Gagal menyimpan produk: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        await deleteProduct(id);
        showToast(gsheetStatus ? 'Produk berhasil dihapus dari Google Sheets & Perangkat!' : 'Produk berhasil dihapus!');
        onRefreshData();
      } catch (err) {
        showToast('Gagal menghapus produk: ' + err.message, 'error');
      }
    }
  };

  // ==================== CATEGORY HANDLERS ====================
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({ name: '', icon: 'fa-box', description: '' });
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name,
      icon: cat.icon || 'fa-box',
      description: cat.description || '',
    });
    setIsCategoryFormOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Nama kategori wajib diisi!', 'error');
      return;
    }

    const payload = {
      ...(editingCategoryId ? { id: editingCategoryId } : {}),
      name: categoryForm.name.trim(),
      icon: categoryForm.icon,
      description: categoryForm.description.trim(),
    };

    try {
      await saveCategory(payload);
      showToast(
        editingCategoryId
          ? (gsheetStatus ? 'Kategori diperbarui di Google Sheets & Perangkat!' : 'Kategori berhasil diperbarui!')
          : (gsheetStatus ? 'Kategori baru tersimpan ke Google Sheets & Perangkat!' : 'Kategori baru berhasil ditambahkan!')
      );
      setIsCategoryFormOpen(false);
      onRefreshData();
    } catch (err) {
      showToast('Gagal menyimpan kategori: ' + err.message, 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    const productsUsingThis = products.filter((p) => p.category === cat.name);
    if (productsUsingThis.length > 0) {
      showToast(
        `Tidak dapat menghapus! Ada ${productsUsingThis.length} produk yang menggunakan kategori ini.`,
        'error'
      );
      return;
    }

    if (window.confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
      try {
        await deleteCategory(cat.id);
        showToast(gsheetStatus ? 'Kategori dihapus dari Google Sheets & Perangkat!' : 'Kategori berhasil dihapus!');
        onRefreshData();
      } catch (err) {
        showToast('Gagal menghapus kategori: ' + err.message, 'error');
      }
    }
  };

  // ==================== BRAND HANDLERS ====================
  const handleOpenAddBrand = () => {
    setEditingBrandId(null);
    setBrandForm({ name: '', origin: '', description: '' });
    setIsBrandFormOpen(true);
  };

  const handleOpenEditBrand = (brand) => {
    setEditingBrandId(brand.id);
    setBrandForm({
      name: brand.name,
      origin: brand.origin || '',
      description: brand.description || '',
    });
    setIsBrandFormOpen(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      showToast('Nama merek wajib diisi!', 'error');
      return;
    }

    const payload = {
      ...(editingBrandId ? { id: editingBrandId } : {}),
      name: brandForm.name.trim(),
      origin: brandForm.origin.trim() || 'Global',
      description: brandForm.description.trim(),
    };

    try {
      await saveBrand(payload);
      showToast(
        editingBrandId
          ? (gsheetStatus ? 'Merek diperbarui di Google Sheets & Perangkat!' : 'Merek berhasil diperbarui!')
          : (gsheetStatus ? 'Merek baru tersimpan ke Google Sheets & Perangkat!' : 'Merek baru berhasil ditambahkan!')
      );
      setIsBrandFormOpen(false);
      onRefreshData();
    } catch (err) {
      showToast('Gagal menyimpan merek: ' + err.message, 'error');
    }
  };

  const handleDeleteBrand = async (brand) => {
    const productsUsingThis = products.filter(
      (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
    );
    if (productsUsingThis.length > 0) {
      showToast(
        `Peringatan: Ada ${productsUsingThis.length} produk dengan merek ini.`,
        'error'
      );
    }

    if (window.confirm(`Yakin ingin menghapus merek "${brand.name}"?`)) {
      try {
        await deleteBrand(brand.id);
        showToast(gsheetStatus ? 'Merek dihapus dari Google Sheets & Perangkat!' : 'Merek berhasil dihapus!');
        onRefreshData();
      } catch (err) {
        showToast('Gagal menghapus merek: ' + err.message, 'error');
      }
    }
  };

  // ==================== BACKUP & RESTORE ====================
  const handleExportBackup = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kmp-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('File backup berhasil diunduh!');
    } catch (err) {
      showToast('Gagal membuat backup: ' + err.message, 'error');
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !window.confirm(
        'Impor backup akan menimpa data yang ada saat ini. Lanjutkan?'
      )
    ) {
      e.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await importAllData(parsed);
      showToast('Data berhasil dipulihkan dari file backup!');
      onRefreshData();
    } catch (err) {
      showToast('Gagal memulihkan data: ' + err.message, 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleResetDefaults = async () => {
    if (
      window.confirm(
        'PERINGATAN: Seluruh produk, kategori, dan merek kustom akan dikembalikan ke data katalog bawaan pabrik. Lanjutkan?'
      )
    ) {
      try {
        await resetToDefaults();
        showToast('Katalog berhasil di-reset ke data bawaan!');
        onRefreshData();
      } catch (err) {
        showToast('Gagal me-reset katalog: ' + err.message, 'error');
      }
    }
  };

  // ==================== GOOGLE SHEETS HANDLERS ====================
  const handleTestAndSaveGSheet = async () => {
    if (!gsheetUrlInput.trim()) {
      showToast('Masukkan URL Web App Google Apps Script terlebih dahulu!', 'error');
      return;
    }
    try {
      setIsTestingGSheet(true);
      const res = await testConnection(gsheetUrlInput.trim());
      setGoogleSheetUrl(gsheetUrlInput.trim());
      setGsheetStatus(true);
      showToast(res.message || 'Koneksi ke Google Sheets API Berhasil & Disimpan!');
    } catch (err) {
      showToast(err.message || 'Koneksi gagal. Periksa izin Web App (Anyone)!', 'error');
    } finally {
      setIsTestingGSheet(false);
    }
  };

  const handleDisconnectGSheet = () => {
    if (window.confirm('Putus koneksi Google Sheets dan kembali ke mode database lokal?')) {
      setGoogleSheetUrl('');
      setGsheetUrlInput('');
      setGsheetStatus(false);
      showToast('Koneksi Google Sheets diputus. Website kini dalam mode lokal.');
    }
  };

  const handlePullFromGSheet = async () => {
    try {
      setIsSyncingGSheet(true);
      const data = await refreshCatalogFromCloud();
      if (data && data.products) {
        showToast(`Berhasil menarik ${data.products.length} produk dari Google Sheets!`);
        onRefreshData();
      } else {
        showToast('Google Sheet belum memiliki data produk.', 'error');
      }
    } catch (err) {
      showToast('Gagal menarik data: ' + err.message, 'error');
    } finally {
      setIsSyncingGSheet(false);
    }
  };

  const handlePushToGSheet = async () => {
    if (
      !window.confirm(
        `Unggah seluruh katalog saat ini (${products.length} produk, ${categories.length} kategori, ${brands.length} merek) ke Google Sheet? Ini akan mengisi lembar Google Sheets Anda secara instan.`
      )
    ) {
      return;
    }

    try {
      setIsPushingGSheet(true);
      const res = await syncCurrentCatalogToGoogleSheet();
      showToast(res.message || 'Seluruh data katalog berhasil diunggah ke Google Sheet!');
      onRefreshData();
    } catch (err) {
      showToast('Gagal mengunggah ke Google Sheet: ' + err.message, 'error');
    } finally {
      setIsPushingGSheet(false);
    }
  };

  const handleCopyScriptCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCodeCopied(true);
      showToast('Kode Google Apps Script berhasil disalin ke clipboard!');
      setTimeout(() => setCodeCopied(false), 3000);
    } catch {
      showToast('Gagal menyalin kode ke clipboard', 'error');
    }
  };

  // Filter Produk untuk list di admin
  const filteredAdminProducts = products.filter((p) => {
    const matchCat =
      selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchBrand =
      selectedBrandFilter === 'all' ||
      p.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
    const matchQuery =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchBrand && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
      />

      {/* JIKA BELUM LOGIN: TAMPILKAN FORM PASSWORD */}
      {!isAuthenticated ? (
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full p-5 sm:p-8 flex flex-col overflow-hidden border border-slate-200 z-10 text-left">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center text-lg sm:text-xl shadow-inner border border-red-100">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm cursor-pointer transition-colors"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Autentikasi Administrator
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5 sm:mb-6 leading-relaxed">
            Masukkan kata sandi admin untuk mengakses dan mengelola katalog produk, kategori, dan merek CV. Krisna Mandiri Perkasa.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Masukkan kata sandi..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError('');
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    }`}
                  ></i>
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5 pt-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <i className="fa-solid fa-lock-open text-xs"></i>
                <span>Buka Panel Admin</span>
              </button>
            </div>
          </form>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-key text-[10px]"></i>
            </span>
            <span className="text-slate-400">CV. KMP Security</span>
          </div>
        </div>
      ) : (
        /* JIKA SUDAH LOGIN: TAMPILKAN MAIN ADMIN DIALOG */
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden border border-slate-200 z-10 text-left">
          {/* Header Bar */}
          <div className="px-3.5 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DC2626] flex items-center justify-center text-white shadow-md shrink-0 text-xs sm:text-sm">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <div className="min-w-0">
                <h2 className="font-black text-xs sm:text-base tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="truncate">Panel Kelola Katalog</span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 shrink-0">
                    Administrator
                  </span>
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block truncate">
                  Kelola produk, kategori, merek, dan database Google Sheets CV. KMP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800 text-slate-300 text-[11px] sm:text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                title="Kunci Panel / Keluar Sesi Admin"
              >
                <i className="fa-solid fa-lock text-[10px]"></i>
                <span className="hidden sm:inline">Kunci Panel</span>
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs sm:text-sm cursor-pointer"
                title="Tutup Panel Admin"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-100/90 px-2.5 sm:px-6 pt-2 sm:pt-3 border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('products');
                setIsProductFormOpen(false);
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-slate-900 border-t-2 border-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <i className="fa-solid fa-box text-[#DC2626]"></i>
              <span>Produk</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setIsCategoryFormOpen(false);
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white text-slate-900 border-t-2 border-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <i className="fa-solid fa-layer-group text-[#DC2626]"></i>
              <span>Kategori</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('brands');
                setIsBrandFormOpen(false);
              }}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'brands'
                  ? 'bg-white text-slate-900 border-t-2 border-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <i className="fa-solid fa-tag text-[#DC2626]"></i>
              <span>Merek</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {brands.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'sheets'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <i className="fa-solid fa-table text-emerald-600"></i>
              <span>Google Sheets</span>
              <span
                className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  gsheetStatus
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    gsheetStatus ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {gsheetStatus ? 'Online' : 'Lokal'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-slate-900 border-t-2 border-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <i className="fa-solid fa-gear text-slate-500"></i>
              <span>Pengaturan</span>
            </button>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mx-3 sm:mx-6 mt-3 p-2.5 sm:p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  notification.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <i
                  className={`fa-solid ${
                    notification.type === 'error'
                      ? 'fa-circle-exclamation'
                      : 'fa-circle-check'
                  }`}
                ></i>
                <span>{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* ========================================================= */}
            {/* TAB 1: PRODUK                                             */}
            {/* ========================================================= */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                {/* Form Tambah/Edit Produk */}
                {isProductFormOpen ? (
                  <div className="bg-slate-50 p-3.5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i className="fa-solid fa-pen-to-square text-[#DC2626]"></i>
                        <span>
                          {editingProductId ? 'Edit Data Produk' : 'Upload Produk Baru'}
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Batal ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-3.5 sm:space-y-4">
                      {/* Upload Foto Produk */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-800">
                          Foto Produk <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-white border-2 border-dashed border-slate-300 relative group overflow-hidden min-h-[120px] sm:min-h-[140px]">
                            {productForm.image ? (
                              <div className="relative w-full h-28 sm:h-32 flex items-center justify-center">
                                <img
                                  src={productForm.image}
                                  alt="Preview"
                                  className="max-h-full max-w-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setProductForm((prev) => ({ ...prev, image: '' }))
                                  }
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer"
                                  title="Hapus foto"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="text-center p-2 text-slate-400">
                                <i className="fa-solid fa-cloud-arrow-up text-2xl mb-1 text-slate-400"></i>
                                <p className="text-[11px] font-bold text-slate-600">
                                  {isProcessingImage
                                    ? 'Memproses gambar...'
                                    : 'Pilih Foto Produk'}
                                </p>
                                <p className="text-[9px] text-slate-400">
                                  JPG, PNG, atau WebP
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-8 space-y-2">
                            <label className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all shadow-sm">
                              <i className="fa-solid fa-folder-open"></i>
                              <span>Pilih File dari Komputer</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                            <div className="text-[10px] sm:text-[11px] text-slate-500">
                              Atau masukkan URL gambar jika file sudah online:
                            </div>
                            <input
                              type="text"
                              placeholder="https://contoh.com/foto-produk.jpg"
                              value={productForm.image}
                              onChange={(e) =>
                                setProductForm((prev) => ({
                                  ...prev,
                                  image: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 1. Nama Produk */}
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-800">
                          1. Nama Produk <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Aventics - Pneumatic Cylinder ISO 15552"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>

                      {/* 2 & 3: Kategori dan Merek */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* 2. Kategori */}
                        <div className="space-y-1">
                          <label className="block text-xs font-black text-slate-800">
                            2. Kategori <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={productForm.category}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] cursor-pointer"
                          >
                            {categories.map((c) => (
                              <option key={c.id || c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 3. Merek */}
                        <div className="space-y-1">
                          <label className="block text-xs font-black text-slate-800">
                            3. Merek (Brand) <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={productForm.brand}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                brand: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] cursor-pointer"
                          >
                            {brands.map((b) => (
                              <option key={b.id || b.name} value={b.name}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 4. Deskripsi Produk */}
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-800">
                          4. Deskripsi Produk <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Jelaskan spesifikasi teknis, fungsi komponen, rentang tekanan, tegangan koil, dan keunggulan suku cadang ini..."
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] leading-relaxed"
                        />
                      </div>

                      {/* Opsional: Kode Part / SKU */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            Kode Part / SKU (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Otomatis jika kosong (contoh: L12BA452BG00061)"
                            value={productForm.sku}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                sku: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            Ringkasan Singkat (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Ringkasan 1 kalimat untuk kartu..."
                            value={productForm.summary}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                summary: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                          />
                        </div>
                      </div>

                      {/* Tombol Simpan Form */}
                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsProductFormOpen(false)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 text-center"
                        >
                          <i className="fa-solid fa-floppy-disk"></i>
                          <span>
                            {editingProductId ? 'Simpan Perubahan' : 'Upload Produk'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Header Pencarian & Tombol Tambah Produk */
                  <div className="space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                      {/* Search Bar */}
                      <div className="relative flex-1">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input
                          type="text"
                          placeholder="Cari nama, SKU, spesifikasi..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 sm:pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>

                      {/* Filter Dropdowns Grid di Mobile */}
                      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                        <select
                          value={selectedCatFilter}
                          onChange={(e) => setSelectedCatFilter(e.target.value)}
                          className="w-full sm:w-auto px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer truncate"
                        >
                          <option value="all">Semua Kategori</option>
                          {categories.map((c) => (
                            <option key={c.id || c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={selectedBrandFilter}
                          onChange={(e) => setSelectedBrandFilter(e.target.value)}
                          className="w-full sm:w-auto px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer truncate"
                        >
                          <option value="all">Semua Merek</option>
                          {brands.map((b) => (
                            <option key={b.id || b.name} value={b.name}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer transition-all active:scale-95"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Tambah Produk Baru</span>
                    </button>
                  </div>
                )}

                {/* Tabel / Grid List Produk */}
                {!isProductFormOpen && (
                  <div className="space-y-2">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">
                      Menampilkan {filteredAdminProducts.length} dari {products.length}{' '}
                      produk:
                    </div>

                    {filteredAdminProducts.length === 0 ? (
                      <div className="text-center py-10 sm:py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <i className="fa-solid fa-box-open text-3xl text-slate-300 mb-2"></i>
                        <p className="text-xs font-bold text-slate-600">
                          Tidak ada produk yang cocok dengan pencarian / filter.
                        </p>
                        <button
                          onClick={handleOpenAddProduct}
                          className="mt-3 text-xs font-bold text-[#DC2626] hover:underline cursor-pointer"
                        >
                          + Tambah produk sekarang
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                        {filteredAdminProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm flex items-start gap-3 transition-all"
                          >
                            {/* Thumbnail */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                              <img
                                src={p.image || '/logo-kmp.png'}
                                alt={p.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  e.target.src = '/logo-kmp.png';
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                                  {p.brand}
                                </span>
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[120px]">
                                  {p.category}
                                </span>
                              </div>

                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                {p.name}
                              </h4>

                              <p className="text-[10px] text-slate-400 font-mono">
                                SKU: {p.sku}
                              </p>

                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                                {p.description}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit Produk"
                              >
                                <i className="fa-solid fa-pen text-[10px]"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs flex items-center justify-center transition-colors cursor-pointer"
                                title="Hapus Produk"
                              >
                                <i className="fa-solid fa-trash text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: KATEGORI                                           */}
            {/* ========================================================= */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                {/* Form Tambah/Edit Kategori */}
                {isCategoryFormOpen ? (
                  <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i className="fa-solid fa-layer-group text-[#DC2626]"></i>
                        <span>
                          {editingCategoryId
                            ? 'Edit Kategori'
                            : 'Tambah Kategori Baru'}
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsCategoryFormOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Batal ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveCategory} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-800">
                          Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Selang & Tube Pneumatik"
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>

                      {/* Pilihan Icon */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-800">
                          Pilih Icon Kategori
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {COMMON_ICONS.map((icon) => (
                            <button
                              type="button"
                              key={icon.class}
                              onClick={() =>
                                setCategoryForm((prev) => ({
                                  ...prev,
                                  icon: icon.class,
                                }))
                              }
                              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                categoryForm.icon === icon.class
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <i
                                className={`fa-solid ${icon.class} ${
                                  categoryForm.icon === icon.class
                                    ? 'text-[#DC2626]'
                                    : 'text-slate-500'
                                }`}
                              ></i>
                              <span>{icon.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-800">
                          Deskripsi Singkat (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Deskripsi singkat jenis komponen..."
                          value={categoryForm.description}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCategoryFormOpen(false)}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <i className="fa-solid fa-floppy-disk"></i>
                          <span>Simpan Kategori</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">
                        Daftar Kategori Komponen
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        Kategori digunakan untuk filter di landing page.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddCategory}
                      className="w-full xs:w-auto px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Tambah Kategori</span>
                    </button>
                  </div>
                )}

                {/* List Kategori */}
                {!isCategoryFormOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {categories.map((c) => {
                      const count = products.filter((p) => p.category === c.name).length;
                      return (
                        <div
                          key={c.id || c.name}
                          className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center shrink-0 text-sm">
                              <i className={`fa-solid ${c.icon || 'fa-box'}`}></i>
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                                <span className="truncate">{c.name}</span>
                                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold shrink-0">
                                  {count}
                                </span>
                              </div>
                              {c.description && (
                                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                                  {c.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditCategory(c)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="Edit Kategori"
                            >
                              <i className="fa-solid fa-pen text-[10px]"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(c)}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="Hapus Kategori"
                            >
                              <i className="fa-solid fa-trash text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: MEREK (BRAND)                                      */}
            {/* ========================================================= */}
            {activeTab === 'brands' && (
              <div className="space-y-4">
                {/* Form Tambah/Edit Merek */}
                {isBrandFormOpen ? (
                  <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <i className="fa-solid fa-tag text-[#DC2626]"></i>
                        <span>
                          {editingBrandId ? 'Edit Merek' : 'Tambah Merek Baru'}
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsBrandFormOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Batal ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveBrand} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-black text-slate-800">
                            Nama Merek <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: FESTO"
                            value={brandForm.name}
                            onChange={(e) =>
                              setBrandForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-black text-slate-800">
                            Negara / Asal Manufaktur
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Germany, Japan, USA"
                            value={brandForm.origin}
                            onChange={(e) =>
                              setBrandForm((prev) => ({
                                ...prev,
                                origin: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-800">
                          Deskripsi / Slogan Merek (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Standar otomasi presisi industri global..."
                          value={brandForm.description}
                          onChange={(e) =>
                            setBrandForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsBrandFormOpen(false)}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-center"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <i className="fa-solid fa-floppy-disk"></i>
                          <span>Simpan Merek</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900">
                        Daftar Merek / Manufaktur
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        Merek tampil otomatis di filter dan carousel kerja sama.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddBrand}
                      className="w-full xs:w-auto px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Tambah Merek</span>
                    </button>
                  </div>
                )}

                {/* List Merek */}
                {!isBrandFormOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    {brands.map((b) => {
                      const count = products.filter(
                        (p) => p.brand.toLowerCase() === b.name.toLowerCase()
                      ).length;
                      return (
                        <div
                          key={b.id || b.name}
                          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                                {b.name}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold shrink-0">
                                {count} Produk
                              </span>
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-semibold text-[#DC2626] flex items-center gap-1 mb-1">
                              <i className="fa-solid fa-location-dot text-[9px]"></i>
                              <span>{b.origin || 'Global'}</span>
                            </div>
                            {b.description && (
                              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">
                                {b.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => handleOpenEditBrand(b)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <i className="fa-solid fa-pen text-[9px]"></i>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(b)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <i className="fa-solid fa-trash text-[9px]"></i>
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: GOOGLE SHEETS CLOUD DATABASE                       */}
            {/* ========================================================= */}
            {activeTab === 'sheets' && (
              <div className="space-y-4 sm:space-y-6 max-w-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">
                      Database Google Sheets
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                        gsheetStatus
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          gsheetStatus ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      />
                      {gsheetStatus ? 'Online (Tersinkronisasi)' : 'Mode Offline / Lokal'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Data produk tersimpan di Google Spreadsheet Anda dan langsung tampil live ke seluruh pengunjung website.
                  </p>
                </div>

                {/* Kartu Status Utama & Aksi Langsung */}
                <div
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                    gsheetStatus
                      ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border-emerald-200 shadow-sm'
                      : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md shrink-0 ${
                          gsheetStatus
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            gsheetStatus
                              ? 'fa-cloud-arrow-up'
                              : 'fa-triangle-exclamation'
                          }`}
                        ></i>
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900">
                          {gsheetStatus
                            ? 'Sinkronisasi Live Otomatis Aktif'
                            : 'Google Sheets Belum Terhubung'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {gsheetStatus
                            ? 'Setiap produk yang Anda tambah, edit, atau hapus otomatis tersimpan ke Google Sheet dan langsung tampil ke semua orang.'
                            : 'Saat ini produk hanya tersimpan di browser komputer ini saja. Hubungkan URL Google Sheets di bawah.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Utama Operasional User */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80">
                    <button
                      type="button"
                      disabled={isSyncingGSheet || !gsheetStatus}
                      onClick={handlePullFromGSheet}
                      className="px-4 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSyncingGSheet ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Menyinkronkan Data...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-arrows-rotate text-sm"></i>
                          <span>Sinkronkan / Tarik Data Terbaru</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://sheets.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-sm transition-all active:scale-95 text-center"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-emerald-400 text-xs"></i>
                      <span>Buka Google Spreadsheet</span>
                    </a>
                  </div>
                </div>

                {/* Pengaturan Lanjutan / Opsi Teknis (Dapat Dilipat / Accordion) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedGSheet(!showAdvancedGSheet)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-sliders text-slate-400"></i>
                      <span>Pengaturan Teknis &amp; Ganti URL Spreadsheet</span>
                    </span>
                    <i
                      className={`fa-solid fa-chevron-down text-xs transition-transform ${
                        showAdvancedGSheet ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </button>

                  {showAdvancedGSheet && (
                    <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                      {/* Form URL */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700">
                          URL Endpoint Web App Google Apps Script
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="url"
                            placeholder="https://script.google.com/macros/s/.../exec"
                            value={gsheetUrlInput}
                            onChange={(e) => setGsheetUrlInput(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                          />
                          <button
                            type="button"
                            disabled={isTestingGSheet}
                            onClick={handleTestAndSaveGSheet}
                            className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 disabled:opacity-60 shrink-0"
                          >
                            {isTestingGSheet ? (
                              <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Menguji...</span>
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-plug"></i>
                                <span>Tes &amp; Simpan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Tombol Ekstra */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          disabled={isPushingGSheet || !gsheetStatus}
                          onClick={handlePushToGSheet}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <i className="fa-solid fa-file-export text-slate-500"></i>
                          <span>Unggah Ulang Seluruh Data ke Sheet</span>
                        </button>

                        {gsheetStatus && (
                          <button
                            type="button"
                            onClick={handleDisconnectGSheet}
                            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <i className="fa-solid fa-link-slash"></i>
                            <span>Putus Koneksi</span>
                          </button>
                        )}
                      </div>

                      {/* Salin Kode Script jika diperlukan developer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Kode Skrip Google Apps Script (Code.gs v2):</span>
                        <button
                          type="button"
                          onClick={handleCopyScriptCode}
                          className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <i
                            className={`fa-solid ${
                              codeCopied ? 'fa-check text-emerald-500' : 'fa-copy'
                            }`}
                          ></i>
                          <span>{codeCopied ? 'Tersalin!' : 'Salin Kode Skrip'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: PENGATURAN & KATA SANDI                            */}
            {/* ========================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-4 sm:space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    Pengaturan Administrator
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Kelola kata sandi akun administrator dan keamanan akses katalog.
                  </p>
                </div>

                {/* Ubah Kata Sandi Admin */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-key text-amber-600"></i>
                      <span>Ubah Kata Sandi Admin</span>
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                      Ganti kata sandi bawaan dengan kata sandi pribadi Anda untuk keamanan panel.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">
                          Kata Sandi Saat Ini
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Kata sandi lama..."
                          value={pwChangeForm.currentPw}
                          onChange={(e) =>
                            setPwChangeForm((prev) => ({
                              ...prev,
                              currentPw: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">
                          Kata Sandi Baru
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Minimal 6 karakter..."
                          value={pwChangeForm.newPw}
                          onChange={(e) =>
                            setPwChangeForm((prev) => ({
                              ...prev,
                              newPw: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>Simpan Kata Sandi Baru</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Cadangan & Pemulihan Darurat (Accordion Lipat) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedBackup(!showAdvancedBackup)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-box-archive text-slate-400"></i>
                      <span>Opsi Cadangan File &amp; Pemulihan Darurat</span>
                    </span>
                    <i
                      className={`fa-solid fa-chevron-down text-xs transition-transform ${
                        showAdvancedBackup ? 'rotate-180' : ''
                      }`}
                    ></i>
                  </button>

                  {showAdvancedBackup && (
                    <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                      {/* Ekspor & Impor JSON */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <i className="fa-solid fa-download text-emerald-600"></i>
                              <span>Download Cadangan</span>
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Unduh file cadangan offline ({products.length} produk).
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleExportBackup}
                            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-black text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <i className="fa-solid fa-file-arrow-down"></i>
                            <span>Download File</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <i className="fa-solid fa-upload text-blue-600"></i>
                              <span>Pulihkan File</span>
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Unggah file cadangan yang pernah diunduh.
                            </p>
                          </div>
                          <label className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center">
                            <i className="fa-solid fa-file-arrow-up"></i>
                            <span>Pilih File</span>
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportBackup}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Reset Data Awal */}
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <div>
                          <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                            <i className="fa-solid fa-triangle-exclamation text-rose-600"></i>
                            <span>Reset ke Katalog Bawaan Pabrik</span>
                          </h5>
                          <p className="text-[10px] text-rose-700 mt-0.5">
                            Kembalikan data produk ke kondisi awal perusahaan.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetDefaults}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <i className="fa-solid fa-rotate-left"></i>
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
