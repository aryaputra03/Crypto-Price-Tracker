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

import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'

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

// Helper & kolom didefinisikan di module scope (bukan di dalam komponen)
// supaya referensinya stabil antar render — lihat catatan "Keep static
// inputs outside render" di skill resmi TanStack Table.
const helper = createColumnHelper<typeof features, Coin>()

function formatUsd(value: number, compact = false) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits: compact ? 0 : value < 1 ? 4 : 2,
    maximumFractionDigits: compact ? 1 : value < 1 ? 6 : 2,
  })
}

const columns = helper.columns([
  helper.accessor('market_cap_rank', {
    id: 'market_cap_rank',
    header: '#',
    sortFn: 'basic',
    cell: (info) => (
      <span className="text-slate-400">{info.getValue() ?? '-'}</span>
    ),
  }),
  helper.accessor('name', {
    id: 'name',
    header: 'Nama',
    sortFn: 'alphanumeric',
    cell: (info) => {
      const coin = info.row.original
      return (
        <div className="flex items-center gap-2">
          <img
            src={coin.image}
            alt=""
            className="h-6 w-6 shrink-0"
            loading="lazy"
          />
          <div>
            <div className="font-medium text-slate-900">{coin.name}</div>
            <div className="text-xs uppercase text-slate-400">
              {coin.symbol}
            </div>
          </div>
        </div>
      )
    },
  }),
  helper.accessor('current_price', {
    id: 'current_price',
    header: 'Harga',
    sortFn: 'basic',
    cell: (info) => (
      <span className="font-mono">{formatUsd(info.getValue())}</span>
    ),
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
      <span className="font-mono">{formatUsd(info.getValue(), true)}</span>
    ),
  }),
])

interface CoinTableProps {
  data: Array<Coin>
}

export function CoinTable({ data }: CoinTableProps) {
  const table = useTable({
    features,
    columns,
    data,
    enableSortingRemoval: false,
    initialState: {
      sorting: [{ id: 'market_cap_rank', desc: false }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => {
                const sortDir = header.column.getIsSorted()
                return (
                  <th key={header.id} className="px-4 py-3">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          'inline-flex items-center gap-1',
                          header.column.getCanSort() &&
                            'cursor-pointer select-none hover:text-slate-700',
                        )}
                      >
                        <table.FlexRender header={header} />
                        {sortDir === 'asc' && '▲'}
                        {sortDir === 'desc' && '▼'}
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
              className={cn(
                'hover:bg-slate-50',
                i % 2 === 1 && 'bg-slate-50/60',
              )}
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

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
