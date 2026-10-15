# Dokumen Reka Bentuk Sistem & Laman Web (Design System & Architecture)
**Rujukan Penanda Aras (Benchmark):** [sentralpneumatic.com](https://www.sentralpneumatic.com/) & [norgantara.net / norgantara.co.id](https://norgantara.co.id/)  
**Fokus Industri:** Pembekal & Pengedar Komponen Pneumatik, Automasi Industri, dan Kejuruteraan Elektrik/Mekanikal  
**Versi:** 1.0.0  
**Tarikh:** Oktober 2026  

---

## 1. Pengenalan & Objektif Projek

Dokumen ini merangkumkan spesifikasi reka bentuk antara muka (UI), pengalaman pengguna (UX), struktur maklumat, seni bina sistem, dan garis panduan visual bagi pembinaan laman web korporat & katalog produk pneumatik industri. 

Reka bentuk ini menggabungkan dua kekuatan teras:
1. **Model Katalog & Penspesifikasian Teknikal Terperinci** (diilhamkan oleh Sentral Pneumatic / CV. Mitra Sejati Engineering): Fokus pada spesifikasi terperinci (bore size, stroke, pressure range, panduan pemasangan, dan penomboran bahagian/part numbers).
2. **Kredibiliti Korporat & Rangkaian Pengedaran Pelbagai Jenama** (diilhamkan oleh Kumpulan Norgantara - PT Norgantara Prima Perkasa / Surya Gemilang): Fokus pada reputasi jenama berkuasa (Norgren, Airtac, SMC, Festo, Schneider Electric), pensijilan keaslian komponen, pengurusan cawangan/bengkel serantau, dan penukaran pertanyaan sebut harga terus (Request for Quote / WhatsApp direct line).

---

## 2. Pengguna Sasaran (Target Audience & Personas)

1. **Jurutera Penyelenggaraan & Operasi (Maintenance / Factory Engineer):**
   - Memerlukan pencarian pantas mengikut kod siri (contoh: *ISO 15552 Cylinder*, *GFR Series Filter*, *4V210 Solenoid Valve*).
   - Memerlukan lembaran data teknikal (datasheet PDF), dimensi saiz, toleransi suhu/tekanan, dan panduan pemasangan.
2. **Pegawai Perolehan & Pembelian (Procurement / Purchasing Officer):**
   - Mementingkan ketersediaan stok (*ready stock*), keaslian barangan, kelajuan penghantaran, dan kemudahan meminta sebut harga rasmi (*formal quotation*).
3. **Penyepadu Sistem & Pembuat Mesin (System Integrators & Machine Builders / OEM):**
   - Memerlukan penyelesaian sistem modular lengkap (FRL + Valve manifold + Actuator + Sensor).

---

## 3. Identiti Visual & Garis Panduan Jenama (Design System)

Konsep visual yang diguna pakai ialah **"Industrial Precision & Reliability"** — moden, kemas, berorientasikan kejuruteraan, dan memberikan keyakinan tinggi.

### 3.1 Palet Warna (Color Palette)

| Elemen | Kod Hex | Peranan / Penggunaan |
| :--- | :--- | :--- |
| **Primary Navy** | `#0B2545` | Warna korporat utama; pengepala (header), kad utama, teks penegasan (*brand trust*). |
| **Industrial Blue** | `#134074` | Elemen navigasi, butang sekunder, sempadan penonjolan. |
| **Pneumatic Cyan** | `#00A8E8` | Warna aksen dinamik; aliran udara, status aktif, penunjuk hover. |
| **Safety / Action Amber** | `#F39C12` | Butang tindakan utama (CTA) seperti "Minta Sebut Harga", "WhatsApp Sekarang". |
| **Engineered Neutral Dark**| `#1D2D44` | Tipografi tajuk, teks bacaan utama. |
| **Cool Gray Light** | `#F4F6F9` | Latar belakang seksyen berselang-seli (*alternating background*), kad produk. |
| **Pure White** | `#FFFFFF` | Latar belakang asas dan ruang putih (*whitespace*). |
| **Border Gray** | `#DCE3EB` | Garisan pemisah jadual spesifikasi dan kad. |

### 3.2 Tipografi (Typography)

* **Fon Utama (Headings & Body):** `Inter`, `Roboto`, atau `-apple-system, BlinkMacSystemFont, "Segoe UI"`
  * *H1 (Hero Heading):* 32px – 44px, Bold (700)
  * *H2 (Kategori & Seksyen):* 24px – 28px, Semi-Bold (600)
  * *H3 (Tajuk Produk & Modul):* 18px – 20px, Medium (500)
  * *Body Text:* 14px – 16px, Regular (400), Line-height 1.6
  * *Technical Specs & Code:* `SFMono-Regular`, `Consolas`, atau `monospace` (13px, tabular data)

### 3.3 Sistem Ikonografi & Komponen UI

* **Ikon:** Ikon berasaskan garisan industri (Stroke 1.5px/2.0px) mewakili silinder, injap solenoid, tolok tekanan, meter aliran, penapis udara, dan lori penghantaran.
* **Gaya Kad Produk (Product Cards):**
  * Kemasan *flat* dengan garisan sempadan halus (`border: 1px solid #DCE3EB`).
  * Bayang halus (*subtle shadow* `0 2px 8px rgba(0,0,0,0.06)`) pada interaksi hover.
  * Lencana status (*stock badge*): `Ready Stock` (Hijau), `Indent/Order` (Kuning kelabu).
  * Lencana jenama pengeluar (*Brand Badge*): Norgren, Airtac, SMC, dsb.

---

## 4. Seni Bina Maklumat & Peta Laman (Sitemap)

```
├── 1.0 Laman Utama (Home)
│   ├── Hero Carousel (Komponen Utama, Jaminan Kualiti, Tawaran Servis)
│   ├── Kategori Produk Pantas (Quick Category Grid)
│   ├── Rakan Jenama Rasmi (Brand Partners Carousel: Norgren, Airtac, SMC, Schneider, Festo)
│   ├── Produk Pilihan & Stok Sedia Ada (Featured & Ready Stock)
│   ├── Kelebihan Kami (Ready Stock, Sokongan Teknikal, Jaminan Ketulenan)
│   ├── Rangkaian Pengedaran & Bengkel (Sales & Workshop Network)
│   └── Borang Pertanyaan Pantas / CTA Sebut Harga
│
├── 2.0 Katalog Produk (Product Catalog)
│   ├── 2.1 Penggerak Pneumatik (Pneumatic Actuators / Cylinders)
│   │   ├── Standard Cylinders (ISO 15552, ISO 6432)
│   │   ├── Compact Cylinders
│   │   ├── Guided & Rodless Cylinders
│   │   └── Rotary Actuators & Grippers
│   ├── 2.2 Penyediaan Udara (Air Preparation - FRL)
│   │   ├── Air Filters & Water Separators
│   │   ├── Pressure Regulators
│   │   ├── Lubricators
│   │   └── Modular Air Distribution Blocks (GA Series)
│   ├── 2.3 Injap Kawalan Arah (Directional & Solenoid Valves)
│   │   ├── Solenoid Valves 3V Series (3/2-way)
│   │   ├── Solenoid Valves 4V Series (5/2-way, 5/3-way)
│   │   ├── Mechanical & Manual Valves
│   │   └── Valve Manifolds & Terminal Blocks
│   ├── 2.4 Penderia & Tolok Tekanan (Sensors, Switches & Pressure Gauges)
│   │   ├── Diaphragm & Capsule Pressure Gauges (WIKA Series)
│   │   ├── Digital Pressure Switches
│   │   └── Magnetic Cylinder Reed Switches
│   └── 2.5 Penyambung & Aksesori (Fittings, Tubing & Accessories)
│       ├── One-touch Push-in Fittings
│       ├── PU / PA Polyurethane Tubes
│       └── Silencers & Flow Controls
│
├── 3.0 Jenama (Brands Directory)
│   ├── Norgren
│   ├── AirTAC
│   ├── SMC Corporation
│   ├── Festo
│   └── Schneider Electric
│
├── 4.0 Kejuruteraan & Perkhidmatan (Engineering & Workshop Services)
│   ├── Pemasangan Silinder Tersuai (Custom Cylinder Fabrication)
│   ├── Reka Bentuk Panel Automasi Pneumatik
│   └── Ujian & Servis Pembaikan Komponen
│
├── 5.0 Rangkaian Cawangan & Hubungi Kami (Sales Network & Contact)
│   ├── Senarai Pejabat (Jakarta, Semarang, Surabaya, Solo)
│   ├── Lokasi Bengkel Kejuruteraan (Sentul Workshop, Semarang Candi)
│   ├── Borang Permohonan Sebut Harga (RFQ Form)
│   └── Integrasi Sembang Pantas WhatsApp
```

---

## 5. Reka Letak Halaman Utama & Elemen Utama (Wireframe Structure)

### 5.1 Bahagian Header (Pengepala)
* **Bar Atas (Utility Topbar):**
  * Maklumat Hubungan Pantas: Hotline Telefon, WhatsApp Sales, Emel Pertanyaan Rasmi.
  * Pemilihan Bahasa (Bahasa Malaysia / Bahasa Indonesia / English).
* **Navigasi Utama (Main Navbar):**
  * Logo Syarikat (Kombinasi elemen industri & kejelasan jenama).
  * Pautan Menu: *Utama*, *Katalog Produk* (Mega-menu dropdown kategori), *Jenama*, *Perkhidmatan Bengkel*, *Rangkaian Cawangan*, *Tentang Kami*.
  * Butang Tindakan Khas: `Minta Sebut Harga (RFQ)` & `Hubungi Jurutera`.

### 5.2 Halaman Terperinci Produk (Product Detail Page - PDP)
Menggabungkan pendekatan **Sentral Pneumatic** yang padat dengan spesifikasi teknikal:
1. **Atas (Above the fold):**
   * Galeri Gambar Produk (Pelbagai sudut resolusi tinggi + Lukisan Dimensi).
   * Nama Produk Lengkap & Siri (cth: *Solenoid Valve 4V210-08 Airtac*).
   * Kod Model / SKU / Kod Pesanan.
   * Lencana Jenama & Status Ketersediaan Stok (*Ready Stock di Cawangan Surabaya / Jakarta*).
   * Butang Tindakan Pantas: `Minta Sebut Harga Segera` & `Tanya Melalui WhatsApp`.
2. **Jadual Spesifikasi Teknikal (Technical Data Grid):**
   * Saiz Port (*Port Size*): G1/8", G1/4", G1/2", dll.
   * Tekanan Operasi (*Working Pressure*): 0.15 ~ 0.8 MPa.
   * Suhu Kendalian (*Operating Temperature*): -20°C ~ 70°C.
   * Medium Kendalian: Udara Termampat (Ditapis 40µm).
   * Pilihan Voltan Gelung (*Coil Voltage*): 12VDC, 24VDC, 110VAC, 220VAC.
3. **Panduan Pemasangan & Penyelenggaraan (Installation & Application Notes):**
   * Pemeriksaan kerosakan transit sebelum pemasangan.
   * Panduan arah aliran udara (petunjuk anak panah `—»`).
   * Panduan elak pelarut kimia berbahaya (asid/alkali) pada mangkuk penapis polikarbonat (*filter bowl*).
   * Prosedur pembersihan berkala teras penapis (*filter core replacement*).
4. **Muat Turun Lembaran Data (Datasheet & CAD):**
   * Pautan terus ke fail PDF Datasheet dan fail CAD/3D Step untuk jurutera reka bentuk mesin.
5. **Produk Berkaitan & Aksesori Pasangan:**
   * Contoh: Memaparkan pendakap (*mounting bracket*), penyenyap bunyi (*silencer*), dan tiub pneumatik yang sepadan.

### 5.3 Rangkaian Cawangan & Sokongan Logistik (Sales Network Component)
Mengambil inspirasi susun atur korporat **Norgantara**:
* Pemaparan peta interaktif atau kad modular mengikut hab bandar (Jakarta, Semarang, Surabaya, Solo).
* Maklumat lengkap bagi setiap cawangan: Alamat pejabat urusan, telefon talian tetap, faks, nombor telefon bimbit jualan, dan alamat bengkel baik pulih (*workshop*).
* Membina keyakinan pelanggan bahawa sokongan stok dan jurutera tersedia secara tempatan.

---

## 6. Integrasi Ciri & Keperluan Fungsian

1. **Enjin Carian Komponen Berkuasa (Faceted Search & Filter):**
   * Carian pantas mengikut kod part, saiz sambungan (contoh: *1/4 inch*), diameter silinder (*bore size*), dan jenama.
2. **Sistem Sebut Harga Dalam Talian (RFQ Cart - No Instant Payment Needed):**
   * Industri pneumatik B2B kebiasaannya tidak memerlukan pembayaran kad kredit terus, sebaliknya memerlukan sistem bakul sebut harga:
   * Pelanggan memilih senarai barangan + kuantiti $ightarrow$ Menekan butang "Hantar Permintaan Sebut Harga" $ightarrow$ Borang syarikat (Nama, Syarikat, No. Tel, Lokasi Projek) $ightarrow$ Sistem menghantar PDF sebut harga rasmi dan pemberitahuan automatik ke WhatsApp Sales Team.
3. **Penyatuan Saluran WhatsApp (Direct Click-to-Chat with Pre-filled Payload):**
   * Butang terapung WhatsApp dengan teks pramuat:  
     `"Halo, saya berminat dengan produk: [Nama Produk] (Kod: [SKU]). Adakah stok sedia ada dan berapa harga sebut harga bagi [Kuantiti] unit?"`
4. **Pengurusan Kandungan Mudah Alih (Responsive Mobile First):**
   * Dioptimumkan untuk jurutera yang melayari spesifikasi terus dari tapak kilang menggunakan telefon pintar.

---

## 7. Seni Bina Teknikal & Cadangan Tindanan Teknologi (Tech Stack)

* **Antara Muka Depan (Frontend):** Next.js (React), Tailwind CSS, Lucide Icons, Shadcn UI untuk jadual data dan borang interaktif.
* **Pengurusan Kandungan & Katalog (Headless CMS / Backend):** Strapi / PostgreSQL atau Supabase untuk menguruskan ribuan kombinasi SKU pneumatik dan varian saiz.
* **Prestasi & SEO (Search Engine Optimization):**
  * *Server-side Rendering (SSR)* untuk memastikan setiap kod siri komponen terindeks dengan cekap di Google Search.
  * Metadata berstruktur Schema.org (`Product`, `Organization`, `LocalBusiness`).
* **Kelajuan Capaian (Edge Caching):** Cloudflare CDN bagi mempercepatkan capaian muat turun dokumen PDF datasheet di seluruh rantau.

---

## 8. Ringkasan Pelaksanaan (Action Items)

| Fasa | Aktiviti Utama | Hasil Kerja (Deliverables) |
| :---: | :--- | :--- |
| **Fasa 1** | Penstrukturan Kategori & Taksonomi Produk | Pangkalan data skema SKU, kategori, dan senarai jenama rasmi. |
| **Fasa 2** | Reka Bentuk UI/UX dalam Figma | Prototaip interaktif (Pengepala, Halaman PDP, Jadual Spesifikasi, Direktori Cawangan). |
| **Fasa 3** | Pembangunan Frontend & Enjin Carian | Integrasi UI responsif, penapis carian mengikut parameter teknikal. |
| **Fasa 4** | Integrasi Modul RFQ & WhatsApp Generator | Sistem penjanaan pertanyaan sebut harga terus kepada pasukan jualan. |
| **Fasa 5** | Semakan Data & Pelancaran | Pengujian kelajuan muat turun datasheet dan ketepatan data teknikal. |
