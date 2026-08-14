import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { fetchCoinDetail } from '../api/coins.api'
import { coinKeys } from '../keys'

/**
 * queryOptions() dipakai bareng loader route (ensureQueryData) dan komponen
 * (useSuspenseQuery) — pola yang sama dengan coinsQueryOptions Fase 5.
 *
 * Tidak butuh currency di sini: GET /coins/{id} mengembalikan market_data
 * untuk SEMUA currency sekaligus (beda dari /coins/markets), jadi ganti
 * currency di halaman detail tidak perlu fetch ulang — cuma baca field
 * currency yang berbeda dari response yang sama.
 */
export function coinDetailQueryOptions(coinId: string) {
  return queryOptions({
    queryKey: coinKeys.detail(coinId),
    queryFn: ({ signal }) => fetchCoinDetail(coinId, signal),
  })
}

export function useCoinDetailQuery(coinId: string) {
  return useSuspenseQuery(coinDetailQueryOptions(coinId))
}
