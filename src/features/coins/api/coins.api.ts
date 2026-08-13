import { fetchCoinsMarketsServerFn } from './coins.server'
import type { Coin, CoinsMarketsParams } from '../types'

/**
 * "Fetch murni" (Fase 2) — sejak Fase 5 isinya delegasi ke server function
 * (coins.server.ts) alih-alih fetch langsung dari browser ke CoinGecko.
 * Dipanggil TanStack Query lewat useCoinsQuery/coinsQueryOptions, baik saat
 * loader jalan di server maupun saat polling di browser — di kedua tempat
 * ini cuma memanggil RPC endpoint kita sendiri, bukan CoinGecko langsung.
 */
export async function fetchCoinsMarkets(
  { vsCurrency, page = 1 }: CoinsMarketsParams,
  signal?: AbortSignal,
): Promise<Array<Coin>> {
  return fetchCoinsMarketsServerFn({ data: { vsCurrency, page }, signal })
}
