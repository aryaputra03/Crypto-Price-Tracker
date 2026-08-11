import { cn } from '@/shared/lib/cn'

interface PriceChangeBadgeProps {
  value: number | null
}

/**
 * Indikator warna hijau/merah untuk perubahan harga 24 jam (FR-09).
 * Pakai token --color-price-up / --color-price-down dari tema Fase 1.
 */
export function PriceChangeBadge({ value }: PriceChangeBadgeProps) {
  if (value === null) {
    return <span className="text-slate-400">-</span>
  }

  const isPositive = value >= 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold',
        isPositive
          ? 'bg-price-up/10 text-price-up'
          : 'bg-price-down/10 text-price-down',
      )}
    >
      {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  )
}
