import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { z } from 'zod'

import { CoinTable } from '../features/coins/components/CoinTable'
import { CoinTableSkeleton } from '../features/coins/components/CoinTableSkeleton'
import { SearchBar } from '../features/coins/components/SearchBar'
import { useCoinsQuery } from '../features/coins/hooks/useCoinsQuery'
import { CurrencySwitcher } from '../features/currency/components/CurrencySwitcher'
import { SUPPORTED_CURRENCIES } from '../features/currency/constants'
import { PageContainer } from '../shared/components/PageContainer'

// Divalidasi pakai Zod v4 langsung (bukan @tanstack/zod-adapter — adapter
// itu cuma perlu untuk Zod v3). .catch() menangkap value URL yang rusak/tidak
// valid (mis. ?page=abc) dan .default() menangani key yang tidak ada sama
// sekali di URL.
const homeSearchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),
  currency: z.enum(SUPPORTED_CURRENCIES).default('usd').catch('usd'),
  search: z.string().default('').catch(''),
})

export const Route = createFileRoute('/')({
  validateSearch: homeSearchSchema,
  component: Home,
})

function Home() {
  const { page, currency, search } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isLoading, isError, error } = useCoinsQuery({ currency })

  // Filter dilakukan client-side atas data yang sudah ter-fetch (bukan
  // request API baru) — sesuai scope Fase 4, tanpa nambah endpoint baru.
  const filteredData = useMemo(() => {
    if (!data) return undefined
    const query = search.trim().toLowerCase()
    if (!query) return data
    return data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query),
    )
  }, [data, search])

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-slate-900">
        Crypto Price Tracker
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Data diambil dari CoinGecko lewat TanStack Query (auto-refresh tiap 45
        detik). Klik header kolom untuk sorting. Filter, currency, dan halaman
        tersimpan di URL — coba refresh setelah ganti salah satunya.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <CurrencySwitcher />
      </div>

      <div className="mt-6">
        {isLoading && <CoinTableSkeleton />}

        {isError && (
          <p className="text-red-600">
            Gagal memuat data:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        )}

        {filteredData &&
          (filteredData.length > 0 ? (
            <CoinTable
              data={filteredData}
              currency={currency}
              page={page}
              onPageChange={(nextPage) =>
                navigate({ search: (prev) => ({ ...prev, page: nextPage }) })
              }
            />
          ) : (
            <p className="text-slate-500">
              Tidak ada coin yang cocok dengan pencarian &quot;{search}&quot;.
            </p>
          ))}
      </div>
    </PageContainer>
  )
}
