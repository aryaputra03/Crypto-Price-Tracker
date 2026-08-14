import { useMemo } from 'react'

import type { SupportedCurrency } from '@/features/currency/constants'
import { useWatchlist } from '@/features/watchlist/hooks/useWatchlist'

import { useCoinsQuery } from '../hooks/useCoinsQuery'
import { CoinTable } from './CoinTable'

interface CoinTableSectionProps {
  currency: SupportedCurrency
  page: number
  search: string
  watchlistOnly: boolean
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
  watchlistOnly,
  onPageChange,
}: CoinTableSectionProps) {
  const { data, isError, error } = useCoinsQuery({ currency })
  const { isWatchlisted } = useWatchlist()

  // Filter client-side atas data yang sudah ter-fetch (Fase 4), sekarang
  // ditambah filter watchlist (Fase 7) — dua-duanya independen, bisa aktif
  // bareng (search "bit" + watchlist saja, misalnya).
  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = data

    if (query) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query),
      )
    }

    if (watchlistOnly) {
      result = result.filter((coin) => isWatchlisted(coin.id))
    }

    return result
  }, [data, search, watchlistOnly, isWatchlisted])

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
          search={search}
        />
      ) : (
        <p className="text-slate-500">
          {watchlistOnly
            ? 'Belum ada coin di watchlist yang cocok dengan filter saat ini.'
            : `Tidak ada coin yang cocok dengan pencarian "${search}".`}
        </p>
      )}
    </>
  )
}
