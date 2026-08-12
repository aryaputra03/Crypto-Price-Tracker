/** Daftar currency yang didukung currency switcher (FR-08). */
export const SUPPORTED_CURRENCIES = ['usd', 'idr', 'eur'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  usd: 'USD ($)',
  idr: 'IDR (Rp)',
  eur: 'EUR (€)',
}
