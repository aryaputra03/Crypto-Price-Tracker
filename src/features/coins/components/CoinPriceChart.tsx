import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCurrency } from '@/features/currency/format'
import type { SupportedCurrency } from '@/features/currency/constants'

import { useCoinMarketChartQuery } from '../hooks/useCoinMarketChartQuery'

interface CoinPriceChartProps {
  coinId: string
  currency: SupportedCurrency
}

/** Grafik harga 7 hari (opsional, Blueprint). Gagal/lambat tidak nge-block halaman detail. */
export function CoinPriceChart({ coinId, currency }: CoinPriceChartProps) {
  const { data, isLoading, isError } = useCoinMarketChartQuery({
    coinId,
    currency,
    days: 7,
  })

  if (isLoading) {
    return <div className="h-56 w-full animate-pulse rounded-lg bg-slate-100" />
  }

  if (isError || !data || data.prices.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">
          Grafik harga 7 hari tidak tersedia saat ini.
        </p>
      </div>
    )
  }

  const points = data.prices.map(([timestamp, price]) => ({ timestamp, price }))

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={points}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts: number) =>
              new Date(ts).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })
            }
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            width={64}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v.toLocaleString('en-US', { notation: 'compact' })
            }
          />
          <Tooltip
            labelFormatter={(label) => {
              const ts = typeof label === 'number' ? label : Number(label)
              return Number.isFinite(ts)
                ? new Date(ts).toLocaleString('id-ID')
                : ''
            }}
            formatter={(value) => {
              const num = typeof value === 'number' ? value : Number(value)
              return [
                Number.isFinite(num) ? formatCurrency(num, currency) : '-',
                'Harga',
              ]
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-brand-600)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
