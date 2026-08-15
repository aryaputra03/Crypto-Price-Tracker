import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Suspense } from 'react'
import type { ReactNode } from 'react'

import { CoinTableSection } from '../features/coins/components/CoinTableSection'
import { CoinTableSkeleton } from '../features/coins/components/CoinTableSkeleton'
import { SearchBar } from '../features/coins/components/SearchBar'
import { coinsQueryOptions } from '../features/coins/hooks/useCoinsQuery'
import { coinsListSearchSchema } from '../features/coins/search-schema'
import { CurrencySwitcher } from '../features/currency/components/CurrencySwitcher'
import { WatchlistFilterToggle } from '../features/watchlist/components/WatchlistFilterToggle'
import { PageContainer } from '../shared/components/PageContainer'

export const Route = createFileRoute('/')({
  validateSearch: coinsListSearchSchema,
  // Loader cuma perlu tahu currency — search (filter) & page (pagination
  // tabel client-side) tidak memicu fetch API baru, jadi tidak dimasukkan
  // sebagai loader deps (lihat catatan "Common Mistakes" TanStack Router:
  // deps yang tidak perlu bikin loader reload sia-sia).
  loaderDeps: ({ search }) => ({ currency: search.currency }),
  loader: async ({ context, deps }) => {
    // ensureQueryData (bukan prefetchQuery) sengaja dipilih: prefetchQuery
    // TIDAK melempar error kalau fetch gagal (cuma nyimpen error state diam-
    // diam ke cache), sehingga kegagalan baru kelihatan di client setelah
    // hydration — errorComponent tidak akan muncul di HTML awal.
    await context.queryClient.ensureQueryData(
      coinsQueryOptions({ currency: deps.currency }),
    )
  },
  // pendingComponent & errorComponent SENGAJA pakai <HomeShell> yang sama
  // dengan component biasa — supaya SearchBar & CurrencySwitcher tetap
  // tampil & bisa dipakai walau loader lagi jalan atau gagal. Sebelumnya
  // keduanya cuma render skeleton/pesan error polos yang mengganti SELURUH
  // halaman (CurrencySwitcher ikut hilang) — itu penyebab halaman kerasa
  // "stuck" saat ganti currency lambat/gagal: kontrolnya sendiri ikut hilang,
  // jadi tidak ada jalan buat ganti currency lagi lewat UI.
  pendingComponent: () => (
    <HomeShell>
      <CoinTableSkeleton />
    </HomeShell>
  ),
  errorComponent: ({ error }) => {
    const router = useRouter()
    return (
      <HomeShell>
        <p className="text-red-600">
          Gagal memuat data coin:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Coba lagi
        </button>
      </HomeShell>
    )
  },
  component: Home,
})

/**
 * Shell yang sama dipakai component, pendingComponent, dan errorComponent —
 * cuma bagian dalamnya (children) yang beda. Ini yang memastikan
 * SearchBar/CurrencySwitcher selalu ada di layar apa pun state datanya.
 */
function HomeShell({ children }: { children: ReactNode }) {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-slate-900">
        Crypto Price Tracker
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Data awal dirender langsung dari server (SSR + prefetch) — coba matikan
        JavaScript di browser, tabel tetap tampil. Auto-refresh tiap 45 detik
        jalan lagi begitu halaman selesai ter-hidrasi.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <div className="flex flex-wrap items-center gap-3">
          <WatchlistFilterToggle />
          <CurrencySwitcher />
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </PageContainer>
  )
}

function Home() {
  const { page, currency, search, watchlistOnly } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <HomeShell>
      <Suspense fallback={<CoinTableSkeleton />}>
        <CoinTableSection
          currency={currency}
          page={page}
          search={search}
          watchlistOnly={watchlistOnly}
          onPageChange={(nextPage) =>
            navigate({ search: (prev) => ({ ...prev, page: nextPage }) })
          }
        />
      </Suspense>
    </HomeShell>
  )
}
