/** Placeholder skeleton selagi data coin belum tersedia (isLoading). */
export function CoinTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat daftar coin"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="h-10 border-b border-slate-200 bg-slate-50" />
      <ul>
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
          >
            <div className="skeleton h-4 w-6 rounded" />
            <div className="skeleton h-6 w-6 rounded-full" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton ml-auto h-4 w-16 rounded" />
          </li>
        ))}
      </ul>
    </div>
  )
}
