import { Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'
import { usePriceFlash } from '@/shared/hooks/usePriceFlash'
import { formatCurrency } from '@/features/currency/format'
import type { SupportedCurrency } from '@/features/currency/constants'
import { WatchlistToggle } from '@/features/watchlist/components/WatchlistToggle'

import type { Coin } from '../types'
import { PriceChangeBadge } from './PriceChangeBadge'

// Fitur tabel didaftarkan eksplisit di TanStack Table v9 (beda dari v8 yang
// otomatis semua fitur aktif). Ini satu-satunya kombinasi yang Fase 3 perlu:
// sorting + pagination client-side.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

// Helper tetap di module scope (stabil antar render), tapi `columns` sekarang
// pindah ke dalam komponen (di-memo) karena format harga butuh tahu currency
// yang aktif — beda dari Fase 3 yang kolomnya statis.
const helper = createColumnHelper<typeof features, Coin>()

// Fase 8 — kolom sekunder yang disembunyikan di layar sempit (< sm) supaya
// tabel tidak mepet/overflow di HP. Tetap bisa diakses lewat scroll
// horizontal (overflow-x-auto di wrapper) kalau ada kolom lain yang masih
// kepotong juga.
const HIDE_BELOW_SM = new Set(['market_cap', 'total_volume'])

interface CoinTableProps {
  data: Array<Coin>
  currency: SupportedCurrency
  /** Halaman tabel saat ini, 1-based, disinkronkan ke search param `page`. */
  page: number
  onPageChange: (page: number) => void
  /** Teks filter aktif — dibawa juga ke halaman detail (Fase 6) supaya tombol "kembali" bisa restore state persis. */
  search: string
  watchlistOnly: boolean
}

const PAGE_SIZE = 10

export function CoinTable({
  data,
  currency,
  page,
  onPageChange,
  search,
  watchlistOnly,
}: CoinTableProps) {
  const columns = useMemo(
    () =>
      helper.columns([
        helper.display({
          id: 'watchlist',
          header: '',
          cell: (info) => <WatchlistToggle coinId={info.row.original.id} />,
        }),
        helper.accessor('market_cap_rank', {
          id: 'market_cap_rank',
          header: '#',
          sortFn: 'basic',
          cell: (info) => (
            <span className="text-slate-500">{info.getValue() ?? '-'}</span>
          ),
        }),
        helper.accessor('name', {
          id: 'name',
          header: 'Nama',
          sortFn: 'alphanumeric',
          cell: (info) => {
            const coin = info.row.original
            return (
              <Link
                to="/coin/$coinId"
                params={{ coinId: coin.id }}
                search={{ page, currency, search, watchlistOnly }}
                className="flex items-center gap-2 rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <img
                  src={coin.image}
                  alt=""
                  className="h-6 w-6 shrink-0"
                  loading="lazy"
                />
                <div>
                  <div className="font-medium text-slate-900">{coin.name}</div>
                  <div className="text-xs uppercase text-slate-500">
                    {coin.symbol}
                  </div>
                </div>
              </Link>
            )
          },
        }),
        helper.accessor('current_price', {
          id: 'current_price',
          header: 'Harga',
          sortFn: 'basic',
          cell: (info) => {
            const value = info.getValue()
            // Efek signature: kedip hijau/merah tiap harga berubah dari
            // polling — meniru layar harga live exchange sungguhan.
            const flash = usePriceFlash(value)
            return (
              <span
                className={cn(
                  'inline-block rounded px-1.5 py-0.5 font-mono',
                  flash === 'up' && 'animate-flash-up',
                  flash === 'down' && 'animate-flash-down',
                )}
              >
                {formatCurrency(value, currency)}
              </span>
            )
          },
        }),
        helper.accessor('price_change_percentage_24h', {
          id: 'price_change_percentage_24h',
          header: '24 Jam',
          sortFn: 'basic',
          cell: (info) => <PriceChangeBadge value={info.getValue()} />,
        }),
        helper.accessor('market_cap', {
          id: 'market_cap',
          header: 'Market Cap',
          sortFn: 'basic',
          cell: (info) => (
            <span className="font-mono">
              {formatCurrency(info.getValue(), currency, true)}
            </span>
          ),
        }),
        // FR-01 (Blueprint): daftar coin wajib menampilkan volume juga —
        // sebelumnya sempat kelewat sampai baru ketahuan saat re-test FR-01
        // s.d. FR-10 di Fase 8 ini.
        helper.accessor('total_volume', {
          id: 'total_volume',
          header: 'Volume (24j)',
          sortFn: 'basic',
          cell: (info) => (
            <span className="font-mono">
              {formatCurrency(info.getValue(), currency, true)}
            </span>
          ),
        }),
      ]),
    [currency, page, search, watchlistOnly],
  )

  const table = useTable({
    features,
    columns,
    data,
    enableSortingRemoval: false,
    // Pagination "controlled" dari luar (search param `page`), bukan state
    // internal tabel lagi — beda dari Fase 3. Sorting tetap dibiarkan jadi
    // state internal tabel (tidak disinkron ke URL di fase ini).
    state: {
      pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: page - 1, pageSize: PAGE_SIZE }
      const next = typeof updater === 'function' ? updater(current) : updater
      onPageChange(next.pageIndex + 1)
    },
    initialState: {
      sorting: [{ id: 'market_cap_rank', desc: false }],
    },
  })

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* overflow-x-auto: jaring pengaman kalau di layar sangat sempit
          masih ada kolom yang kepotong walau market_cap/total_volume sudah
          disembunyikan lewat HIDE_BELOW_SM. */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sortDir = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3',
                        HIDE_BELOW_SM.has(header.column.id) &&
                          'hidden sm:table-cell',
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                            header.column.getCanSort() &&
                              'cursor-pointer select-none hover:text-slate-700',
                          )}
                        >
                          <table.FlexRender header={header} />
                          <span
                            className={cn(
                              'inline-block transition-transform duration-200',
                              sortDir === 'desc' && 'rotate-180',
                            )}
                          >
                            {(sortDir === 'asc' || sortDir === 'desc') && '▲'}
                          </span>
                        </button>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                // Muncul bertahap (cascade) — cuma jalan sekali saat baris
                // ini pertama kali masuk DOM (ganti halaman/currency/filter),
                // TIDAK terpicu ulang tiap kali harga di baris yang sama
                // update lewat polling (row-nya tidak remount).
                className={cn(
                  'animate-fade-in-up transition-colors hover:bg-slate-50',
                  i % 2 === 1 && 'bg-slate-50/60',
                )}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-3',
                      HIDE_BELOW_SM.has(cell.column.id) &&
                        'hidden sm:table-cell',
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <span>
          Halaman {table.state.pagination.pageIndex + 1} dari{' '}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
