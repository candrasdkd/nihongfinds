# 🌸 Nihong Finds

**Jastip Jepang Terpercaya & Autentik — Kurasi langsung dari pusat tren Tokyo!**

## 📖 Tentang Proyek
Nihong Finds adalah platform Jasa Titip (Jastip) barang-barang eksklusif dari Jepang. Dibangun dengan fokus pada kecepatan, keamanan, dan *user experience* yang modern (mengusung konsep *Indo x Japan fusion aesthetic*), platform ini mempermudah pengguna untuk memesan barang impian mereka langsung dari Tokyo dengan sistem pemesanan yang transparan.

## ✨ Fitur Utama
- **Autentikasi Aman:** Sistem Login dan Register (*Server-Side Rendering*) yang aman dan responsif, ditenagai oleh **Supabase Auth**. Termasuk fitur *route protection* yang solid.
- **Katalog Produk Premium:** Etalase produk Jepang yang dikurasi dengan tampilan visual interaktif (*glassmorphism aesthetic*).
- **Manajemen Pesanan:** Pengguna dapat melihat daftar pesanan mereka di *dashboard* pribadi.
- **Integrasi Checkout:** Proses pemesanan yang mulus dan terintegrasi untuk komunikasi yang mudah.

## 🛠 Teknologi yang Digunakan
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org) + React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (Modern UI dengan kustom CSS variables)
- **Database & Auth:** [Supabase](https://supabase.com) (PostgreSQL & SSR Auth Middleware)
- **Bahasa Utama:** TypeScript
- **Font:** Geist Sans

## 🚀 Cara Menjalankan Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/candrasdkd/nihongfinds.git
   cd nihongfinds
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Atur Environment Variables:**
   Buat file `.env.local` di *root* direktori dan tambahkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## 🎨 Desain dan Estetika
Aplikasi ini menggunakan perpaduan warna eksklusif **Navy Blue (`#012E6C`)** dan **Orange (`#F7931E`)** sebagai warna utama (*Primary* dan *Secondary tokens*) untuk memberikan kesan profesional dan modern. Tampilan antarmuka didukung oleh elemen *micro-animations*, bayangan dinamis (*neon-glow*), serta latar belakang minimalis khas Jepang untuk memaksimalkan pengalaman pengguna.

## 👨‍💻 Tim Pengembang
- **Candra Sidik Dermawan**
- **Diny Kumala Firdaus**

---
*Dibuat dengan ❤️ untuk para pecinta kultur dan produk Jepang di Indonesia.*
