# 📊 Panduan Lengkap: Google Sheets sebagai Database Cloud KMP

Panduan ini menjelaskan cara menghubungkan **Google Spreadsheet** sebagai database cloud live untuk katalog produk **CV. Krisna Mandiri Perkasa**.

---

## 🎯 Mengapa Menggunakan Google Sheets?
1. **100% Gratis & Permanen:** Tidak membutuhkan sewa server database PostgreSQL/MySQL bulanan.
2. **Sinkronisasi Otomatis Seluruh Dunia:** Produk yang Anda tambahkan langsung tampil ke seluruh pengunjung website di HP, laptop, dan komputer lain.
3. **Mudah Dikelola Guru & Siswa:** Data dapat dipantau dan diedit langsung melalui antarmuka tabel Google Sheets atau melalui Dashboard Admin website.
4. **Hosting Gambar Gratis ke Google Drive:** Foto produk yang diunggah otomatis tersimpan di folder Google Drive Anda dan disajikan melalui link CDN Google (`lh3.googleusercontent.com`).

---

## 🚀 Langkah Praktik (Setup Dalam 3 Menit)

### Langkah 1: Buat Spreadsheet Baru
1. Buka browser dan kunjungi [sheets.new](https://sheets.new).
2. Beri nama spreadsheet di pojok kiri atas: **`KMP_Database_Katalog`**.

---

### Langkah 2: Buka Editor Google Apps Script
1. Pada menu atas spreadsheet, klik **Ekstensi** > **Apps Script** (*Extensions > Apps Script*).
2. Anda akan diarahkan ke editor kode Google Apps Script dengan file default `Code.gs`.

---

### Langkah 3: Tempel Skrip Database
1. Hapus semua teks bawaan di editor `Code.gs`.
2. Buka file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) di proyek ini, atau salin langsung dari Dashboard Admin website (Tab **Google Sheets** > tombol **"Salin Kode Apps Script"**).
3. Tempel seluruh kode ke editor Google Apps Script.
4. Tekan tombol **Simpan** (ikon disket atau `Ctrl+S`).

---

### Langkah 4: Terapkan Sebagai Aplikasi Web (Deploy as Web App)
1. Klik tombol biru **Terapkan** (*Deploy*) di pojok kanan atas > pilih **Deployment baru** (*New deployment*).
2. Pada ikon Gerigi (Pilih jenis), pilih **Aplikasi Web** (*Web App*).
3. Isi parameter konfigurasi berikut:
   - **Deskripsi:** `KMP Catalog API v1`
   - **Jalankan sebagai:** **Saya (email Anda)**
   - **Siapa yang memiliki akses:** **Siapa saja (Anyone)** ⚠️ *Wajib dipilih 'Anyone' agar pengunjung web publik dapat membaca katalog tanpa login Google.*
4. Klik tombol **Terapkan** (*Deploy*).

---

### Langkah 5: Otorisasi Izin Google
1. Klik tombol **Otorisasi akses** (*Authorize access*).
2. Pilih akun Google Anda.
3. Jika muncul peringatan *"Google hasn't verified this app"*, klik **Advanced** (Lanjutan) di kiri bawah > klik **Go to KMP Catalog API (unsafe)**.
4. Klik **Allow** (Izinkan).

---

### Langkah 6: Hubungkan ke Website KMP
1. Google akan menampilkan **URL Aplikasi Web** (berakhiran `/exec`), contoh:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
2. Salin URL tersebut.
3. Buka website KMP Anda > buka Admin Dashboard (tekan `Ctrl+Shift+A` atau buka `#admin`).
4. Buka tab **Google Sheets**.
5. Tempel URL ke kolom yang tersedia, lalu klik tombol **Tes & Aktifkan**.
6. Klik tombol hijau **"Unggah Data Awal"** untuk mengisi Google Sheet Anda dengan seluruh 20+ produk, kategori, dan merek bawaan secara otomatis!

---

## ⚙️ Opsi Konfigurasi di Vercel (Produksi)
Jika web sudah di-deploy ke Vercel dan Anda ingin semua pengunjung otomatis membaca Google Sheet tersebut tanpa perlu menyetel URL di browser masing-masing:
1. Buka dashboard Vercel proyek KMP Anda.
2. Masuk ke **Settings** > **Environment Variables**.
3. Tambahkan variabel baru:
   - **Key:** `VITE_GOOGLE_SHEETS_URL`
   - **Value:** `https://script.google.com/macros/s/.../exec`
4. Lakukan **Redeploy**. Selesai! Seluruh pengunjung di dunia otomatis terkoneksi ke Google Sheet Anda!
