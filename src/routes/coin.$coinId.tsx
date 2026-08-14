import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { Suspense } from 'react'

import { CoinDetailSkeleton } from '@/features/coins/components/CoinDetailSkeleton'
import { CoinDetailView } from '@/features/coins/components/CoinDetailView'
import { coinDetailQueryOptions } from '@/features/coins/hooks/useCoinDetailQuery'
import { coinsListSearchSchema } from '@/features/coins/search-schema'
import { PageContainer } from '@/shared/components/PageContainer'

export const Route = createFileRoute('/coin/$coinId')({
  // Search schema-nya SAMA persis dengan route "/" (lihat search-schema.ts)
  // — supaya tombol "kembali ke daftar" bisa nge-Link ke "/" dengan
  // page/currency/search yang identik dan ter-tipe otomatis.
  validateSearch: coinsListSearchSchema,
  loader: async ({ context, params }) => {
    // fetchCoinDetailServerFn mengembalikan null (bukan throw) untuk coin id
    // yang tidak ditemukan — lihat catatan di coins.server.ts kenapa bukan
    // custom Error class. throw notFound() di sini yang menerjemahkannya
    // jadi notFoundComponent di bawah.
    const detail = await context.queryClient.ensureQueryData(
      coinDetailQueryOptions(params.coinId),
    )
    if (!detail) {
      throw notFound()
    }
  },
  pendingComponent: () => (
    <PageContainer>
      <CoinDetailSkeleton />
    </PageContainer>
  ),
  notFoundComponent: () => (
    <PageContainer>
      <p className="text-slate-600">Coin yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="mt-3 inline-block text-brand-600 hover:underline">
        ← Kembali ke daftar
      </Link>
    </PageContainer>
  ),
  errorComponent: ({ error }) => {
    const router = useRouter()
    return (
      <PageContainer>
        <p className="text-red-600">
          Gagal memuat detail coin:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Coba lagi
        </button>
      </PageContainer>
    )
  },
  component: CoinDetailPage,
})

function CoinDetailPage() {
  const { coinId } = Route.useParams()
  const { page, currency, search, watchlistOnly } = Route.useSearch()

  return (
    <PageContainer>
      <Suspense fallback={<CoinDetailSkeleton />}>
        <CoinDetailView
          coinId={coinId}
          currency={currency}
          backSearch={{ page, currency, search, watchlistOnly }}
        />
      </Suspense>
    </PageContainer>
  )
}
