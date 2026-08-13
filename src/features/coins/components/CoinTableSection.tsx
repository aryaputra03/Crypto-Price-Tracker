import { useMemo } from 'react'

import type { SupportedCurrency } from '@/features/currency/constants'

import { useCoinsQuery } from '../hooks/useCoinsQuery'
import { CoinTable } from './CoinTable'

interface CoinTableSectionProps {
  currency: SupportedCurrency
  page: number
  search: string
  onPageChange: (page: number) => void
}

/**
 * Dipisah dari Home supaya cuma bagian ini yang "suspend" nunggu data
 * (useSuspenseQuery) — header, SearchBar, dan CurrencySwitcher di Home tetap
 * tampil normal, tidak ikut ke-fallback Suspense.
 */
export function CoinTableSection({
  currency,
  page,
  search,
  onPageChange,
}: CoinTableSectionProps) {
  const { data, isError, error } = useCoinsQuery({ currency })

  // Filter client-side atas data yang sudah ter-fetch (Fase 4) — tetap sama,
  // cuma sumber data-nya sekarang dari useSuspenseQuery.
  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return data
    return data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query),
    )
  }, [data, search])

  return (
    <>
      {isError && (
        <p className="mb-3 text-sm text-red-600">
          Gagal refresh data terbaru:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}{' '}
          (menampilkan data terakhir yang berhasil)
        </p>
      )}

      {filteredData.length > 0 ? (
        <CoinTable
          data={filteredData}
          currency={currency}
          page={page}
          onPageChange={onPageChange}
        />
      ) : (
        <p className="text-slate-500">
          Tidak ada coin yang cocok dengan pencarian &quot;{search}&quot;.
        </p>
      )}
    </>
  )
}
