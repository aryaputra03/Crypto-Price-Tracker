import { createFileRoute } from '@tanstack/react-router'

import { CoinTable } from '../features/coins/components/CoinTable'
import { CoinTableSkeleton } from '../features/coins/components/CoinTableSkeleton'
import { useCoinsQuery } from '../features/coins/hooks/useCoinsQuery'
import { PageContainer } from '../shared/components/PageContainer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data, isLoading, isError, error } = useCoinsQuery({ currency: 'usd' })

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-slate-900">
        Crypto Price Tracker
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Data diambil dari CoinGecko lewat TanStack Query (auto-refresh tiap 45
        detik). Klik header kolom untuk sorting.
      </p>

      <div className="mt-6">
        {isLoading && <CoinTableSkeleton />}

        {isError && (
          <p className="text-red-600">
            Gagal memuat data:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        )}

        {data && <CoinTable data={data} />}
      </div>
    </PageContainer>
  )
}
