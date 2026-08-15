# Crypto Price Tracker

Aplikasi web pelacak harga cryptocurrency real-time, dibangun sebagai proyek belajar sekaligus portofolio untuk menguasai ekosistem TanStack (Start, Router, Query, Table) dipadukan dengan React 19, TypeScript, dan Tailwind CSS v4.

Data diambil langsung dari [CoinGecko API](https://www.coingecko.com/en/api) — tidak ada backend/database sendiri. Watchlist disimpan lokal di browser (localStorage).

## Fitur

- 📋 Daftar coin (nama, harga, 24h change, market cap, volume) dengan auto-refresh 45 detik
- 🔀 Sorting & pagination tabel (client-side)
- 🔍 Pencarian coin berdasarkan nama/simbol (debounced)
- 💱 Currency switcher (USD, IDR, EUR)
- ⭐ Watchlist coin, persisten di localStorage, sinkron antar tab browser
- 🔗 Semua state halaman (page, currency, search, watchlist filter) tersinkron ke URL — bisa di-share & tahan refresh
- 📄 Halaman detail per coin: deskripsi, all-time high/low, circulating supply, grafik harga 7 hari
- ⚡ Server-side rendering (SSR) penuh — data awal sudah ada di HTML, jalan bahkan tanpa JavaScript
- 🔐 API key CoinGecko (opsional) disimpan aman di server, tidak pernah ke-bundle ke client

## Tech Stack

| Kategori      | Tools                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| Framework     | [TanStack Start](https://tanstack.com/start) (React 19, SSR, file-based routing) |
| Bahasa        | TypeScript (strict mode)                                                         |
| Routing       | [TanStack Router](https://tanstack.com/router)                                   |
| Data Fetching | [TanStack Query](https://tanstack.com/query) v5                                  |
| Tabel         | [TanStack Table](https://tanstack.com/table) v9                                  |
| Styling       | Tailwind CSS v4                                                                  |
| Validasi      | Zod v4                                                                           |
| Chart         | Recharts                                                                         |
| Data Source   | [CoinGecko API](https://www.coingecko.com/en/api)                                |

## Prasyarat

- Node.js versi LTS terbaru
- npm (atau pnpm/yarn, sesuaikan perintah di bawah)

## Getting Started

```bash
# 1. Install dependency
npm install

# 2. (Opsional) Setup API key CoinGecko — lihat bagian "Environment Variables"
cp .env.example .env

# 3. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command                   | Kegunaan                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run dev`             | Jalankan dev server (port 3000)                                                            |
| `npm run build`           | Build untuk production ke `dist/`                                                          |
| `npm run preview`         | Preview hasil build secara lokal                                                           |
| `npm run lint`            | Jalankan ESLint                                                                            |
| `npm run format`          | Format kode (Prettier) + auto-fix lint                                                     |
| `npm run generate-routes` | Regenerate `src/routeTree.gen.ts` (otomatis jalan tiap `dev`/`build`, jarang perlu manual) |

## Environment Variables

| Variable            | Wajib?   | Keterangan                                                                                                                                                                                                                                                                                              |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COINGECKO_API_KEY` | Opsional | Demo API key CoinGecko (gratis, tanpa kartu kredit, daftar di [coingecko.com/en/api/pricing](https://www.coingecko.com/en/api/pricing)). Tanpa ini aplikasi tetap jalan, tapi rate limit publik CoinGecko jauh lebih sempit & tidak stabil (~5-15 request/menit vs 30 request/menit stabil dengan key). |

**Penting:** variable ini SENGAJA tanpa prefix `VITE_` — dia cuma dibaca di server (lewat server function di `coins.functions.ts`), tidak pernah ikut ter-bundle ke kode client. Lihat `.env.example` untuk detail.

## Arsitektur

Struktur folder berbasis fitur (feature-based / colocation) — tiap fitur (`coins`, `currency`, `watchlist`) punya api, hooks, komponen, dan types sendiri:

```
src/
├── routes/                    # File-based routing (TanStack Router)
│   ├── __root.tsx              # Root layout, error/not-found boundary global
│   ├── index.tsx                # Halaman "/" - daftar coin
│   └── coin.$coinId.tsx         # Halaman "/coin/:id" - detail coin
│
├── features/
│   ├── coins/
│   │   ├── api/                 # coins.api.ts (fetch murni) + coins.functions.ts (server function/proxy)
│   │   ├── hooks/                # useCoinsQuery, useCoinDetailQuery, useCoinMarketChartQuery
│   │   ├── components/           # CoinTable, CoinDetailView, SearchBar, dst
│   │   ├── keys.ts                # Query key factory
│   │   ├── types.ts               # Tipe data Coin, CoinDetail, dst
│   │   └── search-schema.ts       # Skema Zod search params (dipakai 2 route)
│   ├── currency/                # Currency switcher, format harga, daftar currency
│   └── watchlist/                # useWatchlist (localStorage), toggle, filter
│
└── shared/
    ├── components/               # Button, Spinner, PageContainer, Header (generik)
    ├── hooks/                    # useDebounce
    └── lib/                      # cn() (classname utility), query-client factory
```

### Alur data

1. **Loader route** (`ensureQueryData`) prefetch data di server sebelum HTML dikirim → tidak ada flash of loading state, dan tetap tampil walau JavaScript mati.
2. **Server function** (`coins.functions.ts`) jadi satu-satunya titik yang benar-benar fetch ke CoinGecko — baik dipanggil dari loader (SSR) maupun dari polling di browser, keduanya sama-sama cuma manggil RPC endpoint sendiri.
3. **TanStack Query** ambil alih di client setelah hydration — cache, polling 45 detik, dan retry otomatis.

## Deployment

Aplikasi ini pakai SSR penuh (server function, loader), jadi butuh hosting yang mendukung server-side rendering — bukan static hosting biasa.

### Opsi 1: Netlify (paling simpel, official TanStack Start partner)

```bash
npm install --save-dev @netlify/vite-plugin-tanstack-start
```

Tambahkan plugin ke `vite.config.ts`:

```ts
import netlify from '@netlify/vite-plugin-tanstack-start'

export default defineConfig({
  plugins: [devtools(), tailwindcss(), tanstackStart(), netlify(), viteReact()],
})
```

Lalu deploy:

```bash
npx netlify deploy
```

Set `COINGECKO_API_KEY` di Netlify dashboard (Site settings → Environment variables) kalau mau pakai.

### Opsi 2: Vercel

Vercel mendukung TanStack Start lewat [Nitro](https://nitro.build/) secara otomatis — tinggal hubungkan repo lewat [vercel.com](https://vercel.com) atau `vercel deploy`, tidak perlu konfigurasi tambahan untuk kebutuhan project ini.

### Opsi 3: Node.js / Docker (self-host)

```bash
npm run build
node .output/server/index.mjs
```

Cocok kalau mau self-host di VPS sendiri atau containerize dengan Docker.

> Dukungan hosting TanStack Start terus berkembang — cek [tanstack.com/start/latest/docs/framework/react/guide/hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) untuk daftar platform terbaru (termasuk Cloudflare Workers, Railway) sebelum deploy.

## Batasan yang Diketahui

- Watchlist per-browser (localStorage), bukan lintas perangkat — sesuai Blueprint (tidak ada autentikasi/akun user).
- Grafik harga chart 7 hari bersifat progressive enhancement — kalau gagal dimuat, tidak mengganggu bagian lain halaman detail.
- Tidak ada eksekusi transaksi jual/beli — aplikasi murni untuk monitoring harga.
