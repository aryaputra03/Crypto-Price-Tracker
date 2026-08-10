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

/** Currency yang didukung currency switcher (FR-08). */
export type SupportedCurrency = 'usd' | 'idr' | 'eur'

export interface CoinsMarketsParams {
  vsCurrency: SupportedCurrency
  page?: number
  perPage?: number
}
