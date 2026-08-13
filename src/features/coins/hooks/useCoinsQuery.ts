import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { fetchCoinsMarkets } from '../api/coins.api'
import { coinKeys } from '../keys'
import type { SupportedCurrency } from '../types'

interface CoinsQueryParams {
  currency: SupportedCurrency
  page?: number
}

/**
 * queryOptions() dipakai bareng oleh loader route (lewat
 * queryClient.prefetchQuery) dan komponen (lewat useSuspenseQuery di bawah)
 * — supaya query key & queryFn cuma didefinisikan sekali (Fase 5).
 */
export function coinsQueryOptions({ currency, page = 1 }: CoinsQueryParams) {
  return queryOptions({
    queryKey: coinKeys.list(currency, page),
    queryFn: ({ signal }) =>
      fetchCoinsMarkets({ vsCurrency: currency, page }, signal),
    // Polling tiap 45 detik — tetap jalan setelah hydration walau sekarang
    // pakai useSuspenseQuery, karena refetchInterval bekerja di level cache
    // TanStack Query, bukan di level hook.
    refetchInterval: 45 * 1000,
  })
}

export function useCoinsQuery(params: CoinsQueryParams) {
  return useSuspenseQuery(coinsQueryOptions(params))
}
