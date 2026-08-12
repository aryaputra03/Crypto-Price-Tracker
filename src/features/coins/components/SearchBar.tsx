import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useDebounce } from '@/shared/hooks/useDebounce'

const routeApi = getRouteApi('/')

export function SearchBar() {
  const { search } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  // State lokal supaya input tetap responsif tiap ketukan, baru ditulis ke
  // URL setelah user berhenti mengetik 400ms (debounce) — biar filter tidak
  // jalan tiap huruf yang diketik.
  const [value, setValue] = useState(search)
  const debouncedValue = useDebounce(value, 400)

  useEffect(() => {
    // Hindari navigate yang tidak perlu kalau nilainya memang belum berubah
    // dari URL saat ini (termasuk saat pertama kali mount).
    if (debouncedValue === search) return

    navigate({
      search: (prev) => ({ ...prev, search: debouncedValue, page: 1 }),
      replace: true,
    })
  }, [debouncedValue, navigate, search])

  return (
    <input
      type="text"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Cari nama atau simbol coin..."
      className="h-10 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
    />
  )
}
