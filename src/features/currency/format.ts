import type { SupportedCurrency } from './constants'

/**
 * Format angka jadi string currency sesuai currency aktif. Dipakai CoinTable
 * (Fase 3/4) dan halaman detail coin (Fase 6) — dipusatkan di sini supaya
 * format harga konsisten di seluruh aplikasi.
 */
export function formatCurrency(
  value: number,
  currency: SupportedCurrency,
  compact = false,
) {
  return value.toLocaleString(currency === 'idr' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits: compact ? 0 : value < 1 ? 4 : 2,
    maximumFractionDigits: compact ? 1 : value < 1 ? 6 : 2,
  })
}
