import { QueryClient } from '@tanstack/react-query'

/**
 * Factory terpusat untuk QueryClient, dipanggil sekali per request oleh
 * getRouter() (lihat src/router.tsx). Default options di sini akan dipakai
 * semua query di fitur coins/watchlist/currency mulai Fase 2.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // CoinGecko free tier ±10-30 req/menit, jadi data dianggap "fresh"
        // selama 30 detik sebelum TanStack Query mau refetch ulang.
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })
}
