import { getRouteApi } from '@tanstack/react-router'

// getRouteApi('/') karena komponen ini dipakai dari luar file route
// index.tsx — sama seperti pola SearchBar & CurrencySwitcher di Fase 4.
const routeApi = getRouteApi('/')

export function WatchlistFilterToggle() {
  const { watchlistOnly } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 select-none">
      <input
        type="checkbox"
        checked={watchlistOnly}
        onChange={(event) => {
          const checked = event.target.checked
          navigate({
            search: (prev) => ({ ...prev, watchlistOnly: checked, page: 1 }),
          })
        }}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-1 focus:ring-brand-500"
      />
      Tampilkan hanya watchlist
    </label>
  )
}
