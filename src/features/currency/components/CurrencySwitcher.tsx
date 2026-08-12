import { getRouteApi } from '@tanstack/react-router'

import { CURRENCY_LABELS, SUPPORTED_CURRENCIES } from '../constants'
import type { SupportedCurrency } from '../constants'

// getRouteApi('/') dipakai (bukan Route.useSearch langsung) karena komponen
// ini dipakai dari luar file route index.tsx — lihat skill "search-params"
// bagian "In Code-Split Components".
const routeApi = getRouteApi('/')

export function CurrencySwitcher() {
  const { currency } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return (
    <select
      value={currency}
      onChange={(event) => {
        // Aman di-cast: value <option> selalu berasal dari SUPPORTED_CURRENCIES.
        const next = event.target.value as SupportedCurrency
        navigate({ search: (prev) => ({ ...prev, currency: next, page: 1 }) })
      }}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {CURRENCY_LABELS[c]}
        </option>
      ))}
    </select>
  )
}
