/** Placeholder skeleton untuk halaman detail coin selagi loader jalan. */
export function CoinDetailSkeleton() {
  return (
    <div role="status" aria-label="Memuat detail coin">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="mt-4 flex items-center gap-3">
        <div className="skeleton h-12 w-12 rounded-full" />
        <div className="skeleton h-6 w-40 rounded" />
      </div>
      <div className="skeleton mt-4 h-9 w-48 rounded" />
      <div className="skeleton mt-6 h-56 w-full rounded-lg" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
