import { queryOptions, useQuery } from '@tanstack/react-query'

import { fetchCoinMarketChart } from '../api/coins.api'
import { coinKeys } from '../keys'
import type { SupportedCurrency } from '../types'

interface CoinMarketChartParams {
  coinId: string
  currency: SupportedCurrency
  days?: number
}

export function coinMarketChartQueryOptions({
  coinId,
  currency,
  days = 7,
}: CoinMarketChartParams) {
  return queryOptions({
    queryKey: coinKeys.marketChart(coinId, currency, days),
    queryFn: ({ signal }) =>
      fetchCoinMarketChart({ coinId, vsCurrency: currency, days }, signal),
  })
}

/**
 * SENGAJA pakai useQuery biasa (bukan useSuspenseQuery seperti data coin
 * utama) — grafik ini fitur opsional (Blueprint), jadi kalau gagal/lambat
 * tidak boleh nge-block atau bikin seluruh halaman detail error. Komponen
 * pemanggil (CoinPriceChart) yang urus isLoading/isError sendiri.
 */
export function useCoinMarketChartQuery(params: CoinMarketChartParams) {
  return useQuery(coinMarketChartQueryOptions(params))
}
