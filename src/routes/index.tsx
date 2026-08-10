import { createFileRoute } from '@tanstack/react-router'

import { useCoinsQuery } from '../features/coins/hooks/useCoinsQuery'
import { PageContainer } from '../shared/components/PageContainer'
import { Spinner } from '../shared/components/ui/Spinner'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  // Uji coba data layer Fase 2 — tampilan masih polos, tabel interaktif
  // (sorting, pagination) baru masuk di Fase 3.
  const { data, isLoading, isError, error } = useCoinsQuery({ currency: 'usd' })

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-slate-900">
        Crypto Price Tracker
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Data di bawah ini diambil langsung dari CoinGecko lewat TanStack Query
        (auto-refresh tiap 45 detik).
      </p>

      <div className="mt-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500">
            <Spinner size="sm" />
            <span>Memuat data coin...</span>
          </div>
        )}

        {isError && (
          <p className="text-red-600">
            Gagal memuat data:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        )}

        {data && (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {data.map((coin) => (
              <li
                key={coin.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="font-medium text-slate-900">
                  {coin.name}{' '}
                  <span className="text-slate-400">
                    ({coin.symbol.toUpperCase()})
                  </span>
                </span>
                <span className="font-mono text-slate-700">
                  ${coin.current_price.toLocaleString('en-US')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  )
}
