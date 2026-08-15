import {
  fetchCoinDetailServerFn,
  fetchCoinMarketChartServerFn,
  fetchCoinsMarketsServerFn,
} from './coins.functions'
import type {
  Coin,
  CoinDetail,
  CoinsMarketsParams,
  MarketChartData,
  SupportedCurrency,
} from '../types'

/**
 * "Fetch murni" (Fase 2) — sejak Fase 5 isinya delegasi ke server function
 * (coins.server.ts) alih-alih fetch langsung dari browser ke CoinGecko.
 */
export async function fetchCoinsMarkets(
  { vsCurrency, page = 1 }: CoinsMarketsParams,
  signal?: AbortSignal,
): Promise<Array<Coin>> {
  return fetchCoinsMarketsServerFn({ data: { vsCurrency, page }, signal })
}

/** Fase 6 — detail satu coin. null kalau coin id tidak ditemukan. */
export async function fetchCoinDetail(
  coinId: string,
  signal?: AbortSignal,
): Promise<CoinDetail | null> {
  return fetchCoinDetailServerFn({ data: { coinId }, signal })
}

interface FetchCoinMarketChartParams {
  coinId: string
  vsCurrency: SupportedCurrency
  days?: number
}

/** Fase 6 — grafik harga historis (opsional). */
export async function fetchCoinMarketChart(
  { coinId, vsCurrency, days = 7 }: FetchCoinMarketChartParams,
  signal?: AbortSignal,
): Promise<MarketChartData> {
  return fetchCoinMarketChartServerFn({
    data: { coinId, vsCurrency, days },
    signal,
  })
}
