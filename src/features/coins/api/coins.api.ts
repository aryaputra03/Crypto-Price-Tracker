import type { Coin, CoinsMarketsParams } from '../types'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Opsional. Tanpa key, endpoint publik CoinGecko tetap bisa dipakai tapi
// rate limit-nya sempit & tidak stabil (~5-15 req/menit). Daftar gratis di
// https://www.coingecko.com/en/api/pricing untuk dapat Demo API key
// (30 req/menit stabil, 10.000 call/bulan) lalu isi VITE_COINGECKO_API_KEY
// di file .env — lihat .env.example.
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

/**
 * Fungsi fetch murni (tanpa React) untuk GET /coins/markets.
 * Dipakai oleh useCoinsQuery lewat TanStack Query.
 */
export async function fetchCoinsMarkets(
  { vsCurrency, page = 1, perPage = 50 }: CoinsMarketsParams,
  signal?: AbortSignal,
): Promise<Array<Coin>> {
  const url = new URL(`${COINGECKO_BASE_URL}/coins/markets`)
  url.searchParams.set('vs_currency', vsCurrency)
  url.searchParams.set('order', 'market_cap_desc')
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('page', String(page))
  url.searchParams.set('sparkline', 'false')
  url.searchParams.set('price_change_percentage', '24h')

  const response = await fetch(url, {
    signal,
    headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : undefined,
  })

  if (!response.ok) {
    const hint =
      response.status === 429
        ? ' (rate limit tercapai, coba lagi sebentar)'
        : ''
    throw new Error(
      `Gagal mengambil data coin — status ${response.status}${hint}`,
    )
  }

  return response.json() as Promise<Array<Coin>>
}
