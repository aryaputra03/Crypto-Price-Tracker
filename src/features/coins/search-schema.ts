import { z } from 'zod'

import { SUPPORTED_CURRENCIES } from '@/features/currency/constants'

// Dipakai route "/" (Fase 4) DAN route "/coin/$coinId" (Fase 6) — supaya
// tombol "kembali ke daftar" di halaman detail bisa balik dengan page,
// currency, dan search yang sama persis lewat Link search={...} yang
// ter-tipe otomatis (kedua route pakai schema yang identik).
export const coinsListSearchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),
  currency: z.enum(SUPPORTED_CURRENCIES).default('usd').catch('usd'),
  search: z.string().default('').catch(''),
  // Fase 7 — filter "Tampilkan hanya watchlist". Ikut dibawa balik ke daftar
  // dari halaman detail juga, sama seperti page/currency/search.
  watchlistOnly: z.boolean().default(false).catch(false),
})

export type CoinsListSearch = z.infer<typeof coinsListSearchSchema>
