/** Placeholder skeleton untuk halaman detail coin selagi loader jalan. */
export function CoinDetailSkeleton() {
  return (
    <div role="status" aria-label="Memuat detail coin">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mt-4 h-9 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 h-56 w-full animate-pulse rounded-lg bg-slate-100" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    </div>
  )
}
