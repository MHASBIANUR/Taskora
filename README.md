# Taskora

Taskora adalah aplikasi to-do list modern yang membantu pengguna mengatur, menyelesaikan, dan melacak tugas sehari-hari dengan cepat dan efisien. Dirancang dengan konsep offline-first dan realtime sync, Taskora memastikan pengalaman pengguna tetap lancar meskipun tanpa koneksi internet.

✨ **Live Demo:** https://taskora-phi.vercel.app/

---

## 📸 Tampilan Aplikasi

![Landing Page Preview](public/taskora.png)

---

## 🚀 Fitur Utama

- **Realtime Sync** — perubahan tugas otomatis tersinkron antar perangkat.
- **Offline-First** — tetap dapat digunakan meski tanpa koneksi internet.
- **Modern UI/UX** — desain minimalis, rapi, dan responsif.
- **Autentikasi Aman** — login menggunakan sistem auth berbasis Supabase.
- **Performa Tinggi** — mampu menangani daftar tugas yang besar.

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Fungsi |
|----------|--------|
| **Next.js** | Frontend + rendering cepat |
| **Tailwind CSS** | Styling modern & efisien |
| **Node.js + Express** | Backend API utama |
| **Supabase** | Database + Realtime sync + Auth |
| **Vercel** | Deploy frontend |
| **Railway / Render** (opsional) | Hosting backend |

---

## 👤 Peran Saya

Sebagai **Fullstack Developer**, saya mengerjakan:

- Pembuatan UI/UX yang responsif dan modern  
- Implementasi autentikasi pengguna  
- Integrasi backend Node.js + database Supabase  
- Realtime data sync menggunakan Supabase Realtime  
- Sistem offline-first untuk memastikan aplikasi tetap berjalan meskipun tanpa internet

---

## 🔥 Tantangan

- Mensinkronkan data antar perangkat secara realtime  
- Memastikan performa tetap cepat meski jumlah tugas besar  
- Mencegah kehilangan data saat pengguna berada dalam kondisi offline  
- Menjaga keamanan dan privasi data pengguna

---

## ✅ Solusi

- Menggunakan **Supabase Realtime** untuk perubahan instan  
- Membangun sistem **offline-first** dengan caching & local storage  
- Optimasi query Supabase untuk jumlah data besar  
- Autentikasi aman melalui middleware custom  
- Membuat desain UI yang intuitif dan mudah dinavigasi

---

## 📁 Struktur Proyek 
```bash
app/
│
├── api/
│   └── generate/
│       └── route.ts          # API route for generation
├── boards/
│   └── [boardId]/
│       └── page.tsx          # Dynamic board detail page
├── dashboard/
│   └── page.tsx              # Dashboard page
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Register page
├── layout.tsx                # Root layout
├── page.tsx                  # Landing page
└── globals.css               # Global styles
components/
├── layout.tsx                # Shared layout component
└── navbar.tsx                # Navigation bar component
lib/
└── supabase.ts               # Supabase client configuration
public/
└── *                         # Static assets (images, icons, etc.)

next.config.js                # Next.js configuration  
tsconfig.json                 # TypeScript configuration  
package.json                  # Dependencies & scripts  
```
---


## 🧩 Cara Menjalankan Proyek

```bash
# Install dependencies
npm install

# Jalankan frontend
npm run dev

# Backend
cd backend
npm install
npm start
