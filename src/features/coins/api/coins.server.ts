import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { SUPPORTED_CURRENCIES } from '@/features/currency/constants'

import type { Coin, CoinDetail, MarketChartData } from '../types'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// TANPA prefix VITE_ — sengaja, supaya key ini cuma bisa dibaca lewat
// process.env di server (handler di bawah), tidak pernah ikut ter-bundle ke
// kode client. Beda dari VITE_COINGECKO_API_KEY di Fase 2 (client-exposed) —
// sekarang semua fetch coin (SSR maupun polling client) lewat server
// function ini, jadi key-nya bisa disembunyikan sepenuhnya.
const SERVER_API_KEY = process.env.COINGECKO_API_KEY

function coingeckoHeaders() {
  return SERVER_API_KEY ? { 'x-cg-demo-api-key': SERVER_API_KEY } : undefined
}

const coinsMarketsInput = z.object({
  vsCurrency: z.enum(SUPPORTED_CURRENCIES),
  page: z.number().int().min(1).default(1),
})

/**
 * Proxy server-side opsional ke CoinGecko (Blueprint 5.1, Fase 5).
 * Dipanggil dari coins.api.ts — baik saat SSR (loader) maupun saat polling
 * di browser (keduanya sama-sama cuma manggil RPC endpoint kita sendiri).
 */
export const fetchCoinsMarketsServerFn = createServerFn({ method: 'GET' })
  .validator(coinsMarketsInput)
  .handler(async ({ data }): Promise<Array<Coin>> => {
    const url = new URL(`${COINGECKO_BASE_URL}/coins/markets`)
    url.searchParams.set('vs_currency', data.vsCurrency)
    url.searchParams.set('order', 'market_cap_desc')
    url.searchParams.set('per_page', '50')
    url.searchParams.set('page', String(data.page))
    url.searchParams.set('sparkline', 'false')
    url.searchParams.set('price_change_percentage', '24h')

    const response = await fetch(url, { headers: coingeckoHeaders() })

    if (!response.ok) {
      const hint =
        response.status === 429
          ? ' (rate limit tercapai, coba lagi sebentar)'
          : ''
      throw new Error(
        `Gagal mengambil data coin — status ${response.status}${hint}`,
      )
    }

    return response.json()
  })

const coinDetailInput = z.object({
  coinId: z.string().min(1),
})

/**
 * GET /coins/{id} (Fase 6, halaman detail). Mengembalikan null kalau
 * coin id tidak ditemukan (404) — SENGAJA tidak throw untuk kasus ini,
 * karena custom Error class tidak bisa diandalkan tetap jadi instance yang
 * sama setelah melewati batas RPC client→server (lihat catatan di route
 * coin.$coinId.tsx). Loader cukup cek `if (!detail) throw notFound()`.
 */
export const fetchCoinDetailServerFn = createServerFn({ method: 'GET' })
  .validator(coinDetailInput)
  .handler(async ({ data }): Promise<CoinDetail | null> => {
    const url = new URL(
      `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(data.coinId)}`,
    )
    url.searchParams.set('localization', 'false')
    url.searchParams.set('tickers', 'false')
    url.searchParams.set('market_data', 'true')
    url.searchParams.set('community_data', 'false')
    url.searchParams.set('developer_data', 'false')
    url.searchParams.set('sparkline', 'false')

    const response = await fetch(url, { headers: coingeckoHeaders() })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const hint =
        response.status === 429
          ? ' (rate limit tercapai, coba lagi sebentar)'
          : ''
      throw new Error(
        `Gagal mengambil detail coin — status ${response.status}${hint}`,
      )
    }

    return response.json()
  })

const marketChartInput = z.object({
  coinId: z.string().min(1),
  vsCurrency: z.enum(SUPPORTED_CURRENCIES),
  days: z.number().int().min(1).default(7),
})

/**
 * GET /coins/{id}/market_chart (Fase 6, grafik harga historis — opsional).
 * Beda dari /coins/{id}: endpoint ini MENERIMA vs_currency, jadi hasilnya
 * cuma untuk satu currency (bukan semua sekaligus).
 */
export const fetchCoinMarketChartServerFn = createServerFn({ method: 'GET' })
  .validator(marketChartInput)
  .handler(async ({ data }): Promise<MarketChartData> => {
    const url = new URL(
      `${COINGECKO_BASE_URL}/coins/${encodeURIComponent(data.coinId)}/market_chart`,
    )
    url.searchParams.set('vs_currency', data.vsCurrency)
    url.searchParams.set('days', String(data.days))

    const response = await fetch(url, { headers: coingeckoHeaders() })

    if (!response.ok) {
      const hint =
        response.status === 429
          ? ' (rate limit tercapai, coba lagi sebentar)'
          : ''
      throw new Error(
        `Gagal mengambil grafik harga — status ${response.status}${hint}`,
      )
    }

    return response.json()
  })
