import { PRODUCTS_CATALOG } from '../catalogData';
import {
  isGoogleSheetActive,
  fetchAllFromGoogleSheet,
  saveProductToGSheet,
  deleteProductFromGSheet,
  saveCategoryToGSheet,
  deleteCategoryFromGSheet,
  saveBrandToGSheet,
  deleteBrandFromGSheet,
  syncAllToGoogleSheet,
} from './googleSheetService';

const DB_NAME = 'kmp_catalog_db';
const DB_VERSION = 1;
const STORE_PRODUCTS = 'products';
const STORE_CATEGORIES = 'categories';
const STORE_BRANDS = 'brands';

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-silinder',
    name: 'Silinder Pneumatik',
    icon: 'fa-compress',
    description: 'Silinder pneumatik standar ISO, compact cylinder, dan aktuator industri.',
  },
  {
    id: 'cat-katup',
    name: 'Katup Solenoid',
    icon: 'fa-toggle-on',
    description: 'Solenoid valve 2/2, 3/2, 5/2, dan 5/3-way untuk kontrol aliran udara & fluida.',
  },
  {
    id: 'cat-frl',
    name: 'Filter & Regulator (FRL)',
    icon: 'fa-filter',
    description: 'Unit persiapan udara, filter presisi, regulator tekanan, dan lubricator modular.',
  },
  {
    id: 'cat-fitting',
    name: 'Fitting & Selang Udara',
    icon: 'fa-link',
    description: 'Fitting one-touch, konektor kuningan/stainless, serta selang polyurethane/nylon.',
  },
  {
    id: 'cat-sensor',
    name: 'Sensor & Pressure Gauge',
    icon: 'fa-gauge-high',
    description: 'Manometer tekanan presisi (bar/psi), sensor tekanan digital, dan saklar magnetik.',
  },
  {
    id: 'cat-vibrator',
    name: 'Vibrator & Aksesoris Pneumatik',
    icon: 'fa-bolt',
    description: 'Pneumatic vibrator, muffler peredam suara, dan perlengkapan otomasi tambahan.',
  },
];

export const DEFAULT_BRANDS = [
  {
    id: 'brand-asco',
    name: 'ASCO',
    origin: 'USA',
    description: 'Solenoid valve dan solusi fluida otomasi global terdepan.',
  },
  {
    id: 'brand-numatics',
    name: 'Numatics',
    origin: 'USA',
    description: 'Katup pneumatik multi-port dan silinder otomasi presisi.',
  },
  {
    id: 'brand-aventics',
    name: 'Aventics',
    origin: 'Germany',
    description: 'Komponen pneumatik standar Jerman untuk industri berat dan perakitan.',
  },
  {
    id: 'brand-norgren',
    name: 'Norgren',
    origin: 'UK',
    description: 'Sistem persiapan udara Excelon/Olympian dan aktuator ISO.',
  },
  {
    id: 'brand-airtac',
    name: 'Airtac',
    origin: 'Taiwan',
    description: 'Pneumatik industri andal dengan ketersediaan suku cadang cepat.',
  },
  {
    id: 'brand-barksdale',
    name: 'Barksdale',
    origin: 'Germany',
    description: 'Sensor dan saklar tekanan mekanikal maupun elektronik kelas berat.',
  },
  {
    id: 'brand-findeva',
    name: 'Findeva',
    origin: 'Switzerland',
    description: 'Pneumatic turbine vibrator standar presisi Swiss.',
  },
  {
    id: 'brand-winters',
    name: 'Winters',
    origin: 'Canada',
    description: 'Pressure gauge dan instrumen kalibrasi industri terpercaya.',
  },
  {
    id: 'brand-hydac',
    name: 'HYDAC',
    origin: 'Germany',
    description: 'Teknologi filtrasi, hidrolik, dan instrumen fluida presisi.',
  },
  {
    id: 'brand-camozzi',
    name: 'Camozzi',
    origin: 'Italy',
    description: 'Solusi otomasi pneumatik presisi standar industri Eropa.',
  },
];

// Inisialisasi IndexedDB dengan promise wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
        db.createObjectStore(STORE_PRODUCTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
        db.createObjectStore(STORE_CATEGORIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BRANDS)) {
        db.createObjectStore(STORE_BRANDS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback Helper ke LocalStorage jika IndexedDB bermasalah
function getFallback(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setFallback(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Helper Generic Transaksi IndexedDB
async function getAllFromStore(storeName, fallbackKey, defaultData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = req.result;
        if (!result || result.length === 0) {
          resolve(defaultData);
        } else {
          resolve(result);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getFallback(fallbackKey, defaultData);
  }
}

async function putToStore(storeName, item, fallbackKey) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getFallback(fallbackKey, []);
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    setFallback(fallbackKey, list);
    return item;
  }
}

async function deleteFromStore(storeName, id, fallbackKey) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getFallback(fallbackKey, []);
    const updated = list.filter((i) => i.id !== id);
    setFallback(fallbackKey, updated);
  }
}

async function clearStore(storeName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}

// Inisialisasi Data Default Pertama Kali
export async function initStorage() {
  try {
    const db = await openDB();
    
    // Cek produk
    const pCount = await new Promise((resolve) => {
      const tx = db.transaction(STORE_PRODUCTS, 'readonly');
      const store = tx.objectStore(STORE_PRODUCTS);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });

    if (pCount === 0) {
      const tx = db.transaction([STORE_PRODUCTS, STORE_CATEGORIES, STORE_BRANDS], 'readwrite');
      const pStore = tx.objectStore(STORE_PRODUCTS);
      PRODUCTS_CATALOG.forEach((p) => pStore.put(p));

      const cStore = tx.objectStore(STORE_CATEGORIES);
      DEFAULT_CATEGORIES.forEach((c) => cStore.put(c));

      const bStore = tx.objectStore(STORE_BRANDS);
      DEFAULT_BRANDS.forEach((b) => bStore.put(b));
    }
  } catch (err) {
    console.warn('Init IndexedDB failed, fallback to defaults:', err);
    if (!localStorage.getItem('kmp_products_init')) {
      setFallback('kmp_products', PRODUCTS_CATALOG);
      setFallback('kmp_categories', DEFAULT_CATEGORIES);
      setFallback('kmp_brands', DEFAULT_BRANDS);
      localStorage.setItem('kmp_products_init', 'true');
    }
  }
}

/**
 * Sinkronisasi data live dari Google Sheet Database ke penyimpanan lokal (IndexedDB)
 */
export async function refreshCatalogFromCloud() {
  if (!isGoogleSheetActive()) return null;
  try {
    const cloud = await fetchAllFromGoogleSheet();
    if (cloud.products && cloud.products.length > 0) {
      await clearStore(STORE_PRODUCTS);
      for (const p of cloud.products) {
        await putToStore(STORE_PRODUCTS, p, 'kmp_products');
      }
    }
    if (cloud.categories && cloud.categories.length > 0) {
      await clearStore(STORE_CATEGORIES);
      for (const c of cloud.categories) {
        await putToStore(STORE_CATEGORIES, c, 'kmp_categories');
      }
    }
    if (cloud.brands && cloud.brands.length > 0) {
      await clearStore(STORE_BRANDS);
      for (const b of cloud.brands) {
        await putToStore(STORE_BRANDS, b, 'kmp_brands');
      }
    }
    return cloud;
  } catch (err) {
    console.warn('Gagal sinkronisasi data dari Google Sheet:', err);
    return null;
  }
}

// ==================== PRODUCTS CRUD ====================
export async function getProducts() {
  return await getAllFromStore(STORE_PRODUCTS, 'kmp_products', PRODUCTS_CATALOG);
}

export async function saveProduct(product) {
  let finalProduct = {
    ...product,
    id: product.id || `PROD-${Date.now()}`,
    sku: product.sku?.trim() || `SKU-${Date.now().toString().slice(-6)}`,
    updatedAt: new Date().toISOString(),
  };

  // Simpan ke IndexedDB lokal terlebih dahulu untuk kecepatan UI
  await putToStore(STORE_PRODUCTS, finalProduct, 'kmp_products');

  // Jika Google Sheet aktif, kirim perubahan ke cloud database
  if (isGoogleSheetActive()) {
    try {
      let productForCloud = { ...finalProduct };
      if (productForCloud.image && productForCloud.image.startsWith('/products/')) {
        productForCloud.image = `https://raw.githubusercontent.com/Vinz-Villain/krisna-mandiri-perkasa/main/public${productForCloud.image}`;
      }
      const gRes = await saveProductToGSheet(productForCloud);
      if (gRes && gRes.product) {
        finalProduct = gRes.product;
        await putToStore(STORE_PRODUCTS, finalProduct, 'kmp_products');
      }
    } catch (err) {
      console.warn('Tersimpan di lokal, namun gagal sinkron ke Google Sheet:', err);
      throw new Error(`Data tersimpan di perangkat, namun gagal dikirim ke Google Sheet: ${err.message}`);
    }
  }

  return finalProduct;
}

export async function deleteProduct(id) {
  await deleteFromStore(STORE_PRODUCTS, id, 'kmp_products');
  if (isGoogleSheetActive()) {
    try {
      await deleteProductFromGSheet(id);
    } catch (err) {
      console.warn('Gagal menghapus dari Google Sheet:', err);
      throw new Error(`Dihapus dari lokal, namun gagal dihapus dari Google Sheet: ${err.message}`);
    }
  }
}

// ==================== CATEGORIES CRUD ====================
export async function getCategories() {
  return await getAllFromStore(STORE_CATEGORIES, 'kmp_categories', DEFAULT_CATEGORIES);
}

export async function saveCategory(category) {
  let finalCategory = {
    ...category,
    id: category.id || `cat-${Date.now()}`,
    icon: category.icon || 'fa-box',
    updatedAt: new Date().toISOString(),
  };

  await putToStore(STORE_CATEGORIES, finalCategory, 'kmp_categories');

  if (isGoogleSheetActive()) {
    try {
      const gRes = await saveCategoryToGSheet(finalCategory);
      if (gRes && gRes.category) {
        finalCategory = gRes.category;
        await putToStore(STORE_CATEGORIES, finalCategory, 'kmp_categories');
      }
    } catch (err) {
      console.warn('Gagal sinkron kategori ke Google Sheet:', err);
      throw new Error(`Kategori tersimpan lokal, gagal sinkron Google Sheet: ${err.message}`);
    }
  }

  return finalCategory;
}

export async function deleteCategory(id) {
  await deleteFromStore(STORE_CATEGORIES, id, 'kmp_categories');
  if (isGoogleSheetActive()) {
    try {
      await deleteCategoryFromGSheet(id);
    } catch (err) {
      console.warn('Gagal menghapus kategori dari Google Sheet:', err);
      throw new Error(`Kategori dihapus lokal, gagal hapus di Google Sheet: ${err.message}`);
    }
  }
}

// ==================== BRANDS CRUD ====================
export async function getBrands() {
  return await getAllFromStore(STORE_BRANDS, 'kmp_brands', DEFAULT_BRANDS);
}

export async function saveBrand(brand) {
  let finalBrand = {
    ...brand,
    id: brand.id || `brand-${Date.now()}`,
    origin: brand.origin || 'Industrial',
    updatedAt: new Date().toISOString(),
  };

  await putToStore(STORE_BRANDS, finalBrand, 'kmp_brands');

  if (isGoogleSheetActive()) {
    try {
      const gRes = await saveBrandToGSheet(finalBrand);
      if (gRes && gRes.brand) {
        finalBrand = gRes.brand;
        await putToStore(STORE_BRANDS, finalBrand, 'kmp_brands');
      }
    } catch (err) {
      console.warn('Gagal sinkron merek ke Google Sheet:', err);
      throw new Error(`Merek tersimpan lokal, gagal sinkron Google Sheet: ${err.message}`);
    }
  }

  return finalBrand;
}

export async function deleteBrand(id) {
  await deleteFromStore(STORE_BRANDS, id, 'kmp_brands');
  if (isGoogleSheetActive()) {
    try {
      await deleteBrandFromGSheet(id);
    } catch (err) {
      console.warn('Gagal menghapus merek dari Google Sheet:', err);
      throw new Error(`Merek dihapus lokal, gagal hapus di Google Sheet: ${err.message}`);
    }
  }
}

/**
 * Ekspor seluruh katalog lokal saat ini ke Google Sheet (1-Click Upload)
 * Otomatis mengonversi relative path foto lokal ke CDN GitHub publik agar
 * thumbnail foto dapat muncul langsung di dalam sel Google Sheets!
 */
export async function syncCurrentCatalogToGoogleSheet() {
  const products = await getProducts();
  const categories = await getCategories();
  const brands = await getBrands();

  const GITHUB_RAW_BASE =
    'https://raw.githubusercontent.com/Vinz-Villain/krisna-mandiri-perkasa/main/public';

  const normalizedProducts = products.map((p) => {
    let finalImage = p.image || '';
    if (finalImage.startsWith('/products/')) {
      finalImage = `${GITHUB_RAW_BASE}${finalImage}`;
    }
    return {
      ...p,
      image: finalImage,
    };
  });

  return await syncAllToGoogleSheet({
    products: normalizedProducts,
    categories,
    brands,
  });
}

// ==================== IMAGE COMPRESSION UTILITY ====================
/**
 * Mengompresi file gambar dari input pengguna menjadi format WebP/JPEG data URL yang ringkas
 * sehingga muat banyak di browser tanpa memperlambat performa render.
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File tidak valid'));
      return;
    }

    // Jika bukan gambar, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Format file harus berupa gambar (JPG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Render dengan background putih (agar PNG transparan tetap rapi saat diubah ke JPG/WebP)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
  });
}

// ==================== BACKUP & RESTORE ====================
export async function exportAllData() {
  const products = await getProducts();
  const categories = await getCategories();
  const brands = await getBrands();
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    products,
    categories,
    brands,
  };
}

export async function importAllData(data) {
  if (!data || !data.products || !data.categories || !data.brands) {
    throw new Error('Format file JSON tidak sesuai standar backup KMP');
  }

  await clearStore(STORE_PRODUCTS);
  await clearStore(STORE_CATEGORIES);
  await clearStore(STORE_BRANDS);

  for (const p of data.products) {
    await saveProduct(p);
  }
  for (const c of data.categories) {
    await saveCategory(c);
  }
  for (const b of data.brands) {
    await saveBrand(b);
  }

  return true;
}

export async function resetToDefaults() {
  await clearStore(STORE_PRODUCTS);
  await clearStore(STORE_CATEGORIES);
  await clearStore(STORE_BRANDS);

  localStorage.removeItem('kmp_products');
  localStorage.removeItem('kmp_categories');
  localStorage.removeItem('kmp_brands');
  localStorage.removeItem('kmp_products_init');

  for (const p of PRODUCTS_CATALOG) {
    await putToStore(STORE_PRODUCTS, p, 'kmp_products');
  }
  for (const c of DEFAULT_CATEGORIES) {
    await putToStore(STORE_CATEGORIES, c, 'kmp_categories');
  }
  for (const b of DEFAULT_BRANDS) {
    await putToStore(STORE_BRANDS, b, 'kmp_brands');
  }

  return true;
}
