// SupportedCurrency bersumber dari features/currency (Fase 4), supaya
// daftar currency cuma didefinisikan di satu tempat lalu dipakai ulang di sini.
import type { SupportedCurrency } from '../currency/constants'

export type { SupportedCurrency }

/**
 * Bentuk data satu coin dari endpoint CoinGecko GET /coins/markets.
 * Field opsional/nullable mengikuti dokumentasi resmi per Agustus 2026 —
 * beberapa field (mis. market_cap_rank) bisa null untuk token "rehypothecated".
 */
export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number | null
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number | null
  low_24h: number | null
  price_change_24h: number | null
  price_change_percentage_24h: number | null
  market_cap_change_24h: number | null
  market_cap_change_percentage_24h: number | null
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: CoinRoi | null
  last_updated: string
}

export interface CoinRoi {
  times: number
  currency: string
  percentage: number
}

export interface CoinsMarketsParams {
  vsCurrency: SupportedCurrency
  page?: number
  perPage?: number
}

/**
 * Bentuk data dari GET /coins/{id} (dipakai halaman detail, Fase 6).
 * PENTING: beda dari /coins/markets — endpoint ini tidak menerima parameter
 * vs_currency, jadi field moneter di market_data dikembalikan untuk SEMUA
 * currency sekaligus (object keyed by currency code, mis. "usd", "idr").
 * Cuma subset field yang benar-benar dipakai UI yang dituliskan di sini,
 * bukan seluruh response (yang jauh lebih besar — ada tickers, community
 * data, developer data, dsb yang sengaja kita minta false).
 */
export interface CoinDetail {
  id: string
  symbol: string
  name: string
  market_cap_rank: number | null
  image: {
    thumb: string
    small: string
    large: string
  }
  description: {
    en: string
  }
  links: {
    homepage: Array<string>
  }
  market_data: {
    current_price: Partial<Record<SupportedCurrency, number>>
    market_cap: Partial<Record<SupportedCurrency, number>>
    high_24h: Partial<Record<SupportedCurrency, number>>
    low_24h: Partial<Record<SupportedCurrency, number>>
    ath: Partial<Record<SupportedCurrency, number>>
    ath_date: Partial<Record<SupportedCurrency, string>>
    atl: Partial<Record<SupportedCurrency, number>>
    atl_date: Partial<Record<SupportedCurrency, string>>
    price_change_percentage_24h: number | null
    price_change_percentage_7d: number | null
    price_change_percentage_30d: number | null
    circulating_supply: number
    total_supply: number | null
    max_supply: number | null
  }
}

/** Bentuk data dari GET /coins/{id}/market_chart (grafik harga historis). */
export interface MarketChartData {
  prices: Array<[number, number]>
}
