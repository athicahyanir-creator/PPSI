# Tanggamus WisataPay 🐬🌿

> **Prototipe Sistem Informasi Pemesanan E-Tiket Wisata & Monitoring Transaksi Terpadu**  
> *Kabupaten Tanggamus, Provinsi Lampung*

---

## 1. Tentang Aplikasi

**Tanggamus WisataPay** adalah prototipe sistem informasi berbasis web yang dirancang khusus untuk memodernisasi ekosistem pariwisata di Kabupaten Tanggamus, Lampung. Aplikasi ini mengintegrasikan pemesanan tiket digital bagi wisatawan, sistem validasi gerbang anti-dobel untuk petugas loket pekon, serta dasbor monitoring eksekutif bagi pengelola pariwisata dan dinas terkait.

### Nilai Utama & Kebijakan Prototipe:
- **Transparansi Retribusi**: Menampilkan pemisahan nilai pemesanan, pembayaran terverifikasi, serta simulasi klasifikasi bagi hasil antara Pokdarwis/Pekon Pengelola (60%), Retribusi Resmi Pemda (25%), dan Asuransi/Proteksi Pengunjung (15%).
- **E-Tiket Mandiri Anti-Ganda**: Setiap pemesanan menghasilkan tiket digital individual ber-QR Code dengan token unik yang hanya dapat divalidasi tepat 1 (satu) kali.
- **Snapshot Tarif Transaksi**: Perubahan tarif retribusi di masa mendatang tidak mengubah riwayat harga pada pesanan lama.
- **Data Demo Transparan**: Seluruh transaksi dan data statistik diberi label **Mode Demo** dan tidak memproses debit dana perbankan nyata.

---

## 2. Identitas Visual & Desain UI/UX

Mengusung tema **Premium Travel-Tech, Editorial & Natural**, terinspirasi dari pesisir Teluk Semangka dan perbukitan hijau Gunung Tanggamus:

| Token Warna | Nilai Hex | Penggunaan Utama |
| :--- | :--- | :--- |
| **Deep Emerald** | `#124C3A` | Warna primer identitas, hero banner, tombol utama |
| **Forest Green** | `#1D6A50` | Aksen gradasi dan hover state |
| **Warm Ivory** | `#FAF8F1` | Latar belakang halaman alami dan nyaman di mata |
| **Ocean Teal** | `#55A99B` | Aksen perairan bahari Kiluan, ikon, dan sorotan |
| **Soft Sand** | `#E9DFC9` | Garis batas (border), divider, dan kartu informasi |
| **Charcoal** | `#202B28` | Tipografi heading dan navigasi sidebar pengelola |
| **Muted Gray** | `#7C8781` | Teks sekunder, deskripsi, dan metadata |
| **Soft Coral** | `#E58A72` | Indikator lokasi, alert peringatan, dan aksen |

- **Tipografi**: *Plus Jakarta Sans* (Google Fonts) dengan hierarki skala 8-poin.
- **Radius Sudut**: 12–24 px (`rounded-xl` hingga `rounded-3xl`) dengan bayangan halus (`shadow-soft` dan `shadow-card`).
- **Bahasa UI**: 100% Bahasa Indonesia baku dan alami.

---

## 3. Teknologi yang Digunakan

- **Frontend Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4 + Custom Tokens
- **Icons**: Lucide React
- **Visualisasi & Grafik**: Recharts (Responsive AreaChart & Horizontal BarChart)
- **Routing**: React Router DOM (v7)
- **QR Code Engine**: `qrcode.react` (SVG Engine)
- **Efek Interaktif**: `canvas-confetti`
- **Data Layer & Persistence**: In-Memory & `localStorage` Repository Pattern dengan seed data relasional otomatis.

---

## 4. Panduan Menjalankan Proyek

### A. Lokasi Workspace
Rekomendasi folder aktif IDE:
```text
C:\Users\L3I7G14R32S1TRTX46TI\.gemini\antigravity-ide\scratch\tanggamus-wisatapay
```

### B. Menjalankan Server Pengembangan (Dev)
Buka terminal PowerShell pada folder proyek:
```powershell
npm.cmd run dev
```
Akses aplikasi melalui peramban: `http://localhost:5173/`

### C. Build Produksi
Untuk memvalidasi sintaks dan membuat bundel produksi:
```powershell
npm.cmd run build
```

---

## 5. Akun Pengguna Demo & Peran (Role RBAC)

Tersedia tombol **Ganti Peran (1-Klik)** di bar atas (*DemoBanner*) atau melalui menu `/login`:

| Peran | Nama Demo | Email | Akses Halaman |
| :--- | :--- | :--- | :--- |
| **Administrator** | Rahmat Pratama, S.Kom. | `admin@wisatapay.tanggamus.go.id` | Akses Penuh: CRUD Destinasi, Edit Tarif, Audit Log, Dashboard, Pos Gerbang |
| **Manajer** | Dra. Hj. Nur Indahsari, M.M. | `manager@wisatapay.tanggamus.go.id` | Dashboard KPI, Tren Grafik Kunjungan, Laporan Keuangan, Ekspor CSV |
| **Petugas Loket** | Budi Kurniawan (Loket) | `petugas.kiluan@wisatapay.tanggamus.go.id` | Pos Validasi QR (`/petugas/validasi`), Scanner Kamera Web, Check-in Log |
| **Wisatawan** | Andi Saputra | `wisatawan@gmail.com` | Beranda, Katalog Wisata, Pemesanan Tiket, E-Tiket Digital |

---

## 6. Uji Coba 4 Alur Utama (End-to-End)

### Alur 1: Wisatawan (Pemesanan & Tiket Digital)
1. Buka `http://localhost:5173/` → Klik tombol **"Pesan Tiket Wisata"**.
2. Pilih objek wisata (contoh: **Teluk Kiluan** atau **Air Terjun Way Lalaan**).
3. Pada halaman detail, tentukan tanggal kunjungan dan jumlah tiket dengan tombol `+` / `-`.
4. Klik **"Lanjutkan Pemesanan"** → Isi nama pemesan, email, WhatsApp, dan asal kota.
5. Klik **"Konfirmasi & Lanjut ke Simulasi Pembayaran"** → Pilih metode pembayaran demo (QRIS / VA).
6. Klik **"Konfirmasi Simulasi Pembayaran (Demo)"** → Tiket diterbitkan lengkap dengan efek animasi konfeti dan QR code unik.
7. Tersedia tombol **"Cetak / Simpan PDF"** dengan tata letak tiket cetak yang rapi.

### Alur 2: Petugas Loket (Validasi Gerbang & Anti-Dobel)
1. Buka menu **"Pos Validasi QR"** (`/petugas/validasi`).
2. Masukkan kode tiket atau gunakan tombol klik cepat:
   - **Uji Tiket Valid**: `TK-TGM-KIL-001-A` → Sistem menampilkan status **VALID** (akses diizinkan).
   - **Uji Tiket Dobel**: Uji kembali kode yang sama atau `TK-TGM-WL-002-A` → Sistem langsung **MENOLAK** dan menampilkan riwayat waktu serta nama petugas yang telah memvalidasi sebelumnya.
   - **Uji Kode Palsu**: `TK-PALSU-999-XYZ` → Sistem menampilkan status **TIDAK DITEMUKAN**.

### Alur 3: Manajer Pariwisata (Monitoring & Ekspor Laporan)
1. Buka **"Dashboard Pengelola"** (`/admin`).
2. Tinjau 4 KPI utama: Total Pengunjung, Tiket Terjual, Transaksi Tercatat, dan Nilai Terverifikasi.
3. Ubah filter periode (Hari Ini, 7 Hari, 30 Hari, Semua) atau filter destinasi spesifik.
4. Buka menu **"Laporan & Ekspor CSV"** (`/admin/laporan`).
5. Klik **"CSV Pemesanan"** atau **"CSV Transaksi"** untuk mengunduh berkas `.csv` asli ke komputer.

### Alur 4: Administrator (Manajemen Destinasi & Tarif)
1. Buka menu **"Destinasi Wisata"** (`/admin/destinasi`).
2. Klik tombol **"Tambah Destinasi Baru"** atau klik ikon edit pada destinasi yang ada.
3. Ubah nama, kecamatan, jam buka, atau deskripsi, lalu klik **Simpan Perubahan**.
4. Buka katalog publik (`/destinasi`) → Perubahan langsung tercermin seketika tanpa perlu restart server!
5. Buka menu **"Audit Log Sistem"** (`/admin/audit-log`) untuk melihat catatan waktu dan detail perubahan yang dilakukan admin.

---

## 7. Struktur Direktori Proyek

```text
tanggamus-wisatapay/
├── public/
│   └── favicon.svg             # Ikon logo bahari lumba-lumba Tanggamus
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx # Sidebar responsif & header pengelola
│   │   └── common/
│   │       ├── Badge.tsx       # Komponen badge status tiket & pesanan
│   │       ├── DemoBanner.tsx  # Floating banner mode demo & 1-klik role switcher
│   │       ├── Footer.tsx      # Footer resmi dengan disclaimer daerah
│   │       └── Navbar.tsx      # Navigasi publik dengan deteksi peran aktif
│   ├── context/
│   │   └── AuthContext.tsx     # State manajemen autentikasi & peran pengguna
│   ├── data/
│   │   └── seedData.ts         # Master data autentik destinasi Tanggamus
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── DestinationsAdminPage.tsx
│   │   │   ├── TicketTypesAdminPage.tsx
│   │   │   ├── BookingsAdminPage.tsx
│   │   │   ├── TransactionsAdminPage.tsx
│   │   │   ├── ReportsAdminPage.tsx
│   │   │   ├── UsersAdminPage.tsx
│   │   │   └── AuditLogAdminPage.tsx
│   │   ├── public/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── CatalogPage.tsx
│   │   │   ├── DestinationDetailPage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   ├── TicketConfirmationPage.tsx
│   │   │   ├── DigitalTicketPage.tsx
│   │   │   ├── TicketCheckPage.tsx
│   │   │   └── LoginPage.tsx
│   │   └── staff/
│   │       └── StaffValidationPage.tsx
│   ├── services/
│   │   └── storage.ts          # Layanan persistensi, snapshotting & validasi tiket
│   ├── types/
│   │   └── index.ts            # Definisi tipe TypeScript domain model
│   ├── App.tsx                 # Konfigurasi router utama
│   ├── index.css               # Styling dasar Tailwind & aturan cetak tiket
│   └── main.tsx
├── tailwind.config.js          # Konfigurasi token warna Tanggamus
├── package.json
└── README.md
```

---

## 8. Catatan Akademik & Hak Cipta
Aplikasi ini dikembangkan sebagai karya rancang bangun sistem informasi mahasiswa/akademisi untuk memajukan potensi pariwisata daerah di Kabupaten Tanggamus, Lampung.
- *Status*: Prototipe V1.0 (Mode Simulasi)
- *Lisensi*: MIT Open Source License.
