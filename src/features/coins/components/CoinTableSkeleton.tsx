/** Placeholder skeleton selagi data coin belum tersedia (isLoading). */
export function CoinTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat daftar coin"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white"
    >
      <div className="h-10 border-b border-slate-200 bg-slate-50" />
      <ul>
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
          >
            <div className="h-4 w-6 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-200" />
          </li>
        ))}
      </ul>
    </div>
  )
}
