/**
 * Service untuk integrasi live dengan Google Sheets Database API
 * Berbasis Google Apps Script (Web App REST API)
 */

const STORAGE_KEY = 'kmp_gsheet_url';

/**
 * Mengambil URL Google Sheets Web App yang aktif
 */
export function getGoogleSheetUrl() {
  if (typeof window === 'undefined') return '';
  const local = localStorage.getItem(STORAGE_KEY);
  if (local && local.trim()) return local.trim();
  return (import.meta.env.VITE_GOOGLE_SHEETS_URL || '').trim();
}

/**
 * Menyimpan URL Google Sheets Web App
 */
export function setGoogleSheetUrl(url) {
  if (typeof window === 'undefined') return;
  const cleanUrl = (url || '').trim();
  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEY, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Cek apakah Google Sheets API sudah aktif dan disetel
 */
export function isGoogleSheetActive() {
  const url = getGoogleSheetUrl();
  return Boolean(
    url &&
      (url.startsWith('https://script.google.com/') ||
        url.startsWith('http://localhost') ||
        url.startsWith('https://'))
  );
}

/**
 * Helper: Melakukan request GET ke Google Apps Script Web App
 */
async function fetchGSheet(action = 'getAll', params = {}) {
  const baseUrl = getGoogleSheetUrl();
  if (!baseUrl) {
    throw new Error('URL Google Sheets belum diatur.');
  }

  const query = new URLSearchParams({
    action,
    _t: Date.now().toString(),
    ...params,
  });

  const sep = baseUrl.includes('?') ? '&' : '?';
  const fullUrl = `${baseUrl}${sep}${query.toString()}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Gagal menghubungi Google Sheet: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.status === 'error') {
    throw new Error(json.message || 'Error pada Google Apps Script');
  }

  return json;
}

/**
 * Helper: Melakukan request POST ke Google Apps Script Web App
 * MENGGUNAKAN Content-Type: text/plain;charset=utf-8 untuk menghindari CORS preflight OPTIONS!
 */
async function postGSheet(action, payload = {}) {
  const baseUrl = getGoogleSheetUrl();
  if (!baseUrl) {
    throw new Error('URL Google Sheets belum diatur.');
  }

  const bodyData = {
    action,
    ...payload,
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    throw new Error(`Gagal mengirim data ke Google Sheet: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.status === 'error') {
    throw new Error(json.message || 'Error saat menyimpan ke Google Sheet');
  }

  return json;
}

/**
 * Tes koneksi ke URL Google Apps Script
 */
export async function testConnection(testUrl) {
  const targetUrl = (testUrl || getGoogleSheetUrl()).trim();
  if (!targetUrl) {
    throw new Error('Masukkan URL Web App terlebih dahulu');
  }

  const sep = targetUrl.includes('?') ? '&' : '?';
  const urlWithParams = `${targetUrl}${sep}action=test&_t=${Date.now()}`;

  const response = await fetch(urlWithParams, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal terhubung (Status ${response.status}). Pastikan Akses disetel ke 'Anyone'.`);
  }

  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Respon dari Google Sheet tidak valid.');
  }

  return json;
}

/**
 * Mengambil seluruh data (Products, Categories, Brands) dari Google Sheet
 */
export async function fetchAllFromGoogleSheet() {
  const result = await fetchGSheet('getAll');
  return {
    products: Array.isArray(result.products) ? result.products : [],
    categories: Array.isArray(result.categories) ? result.categories : [],
    brands: Array.isArray(result.brands) ? result.brands : [],
  };
}

/**
 * Simpan / Update produk ke Google Sheet
 */
export async function saveProductToGSheet(product) {
  return await postGSheet('saveProduct', { product });
}

/**
 * Hapus produk dari Google Sheet
 */
export async function deleteProductFromGSheet(id) {
  return await postGSheet('deleteProduct', { id });
}

/**
 * Simpan / Update kategori ke Google Sheet
 */
export async function saveCategoryToGSheet(category) {
  return await postGSheet('saveCategory', { category });
}

/**
 * Hapus kategori dari Google Sheet
 */
export async function deleteCategoryFromGSheet(id) {
  return await postGSheet('deleteCategory', { id });
}

/**
 * Simpan / Update merek ke Google Sheet
 */
export async function saveBrandToGSheet(brand) {
  return await postGSheet('saveBrand', { brand });
}

/**
 * Hapus merek dari Google Sheet
 */
export async function deleteBrandFromGSheet(id) {
  return await postGSheet('deleteBrand', { id });
}

/**
 * Sinkronisasi Massal (Upload Initial Data / Full Sync ke Google Sheet)
 */
export async function syncAllToGoogleSheet(catalogData) {
  return await postGSheet('syncAll', {
    products: catalogData.products || [],
    categories: catalogData.categories || [],
    brands: catalogData.brands || [],
  });
}
