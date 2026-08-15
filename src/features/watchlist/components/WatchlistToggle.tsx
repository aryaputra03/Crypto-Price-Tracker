import { useState } from 'react'

import { cn } from '@/shared/lib/cn'

import { useWatchlist } from '../hooks/useWatchlist'

interface WatchlistToggleProps {
  coinId: string
  className?: string
}

/** Tombol bintang untuk tambah/hapus coin dari watchlist. Dipakai di baris tabel & halaman detail. */
export function WatchlistToggle({ coinId, className }: WatchlistToggleProps) {
  const { isWatchlisted, toggle } = useWatchlist()
  const active = isWatchlisted(coinId)

  // State lokal terpisah dari `active` — supaya animasi "pop" cuma jalan
  // pas user BENERAN klik, bukan tiap kali komponen ini render/mount (mis.
  // saat halaman pertama dimuat dan sebagian coin memang sudah watchlisted).
  const [justToggled, setJustToggled] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `Hapus ${coinId} dari watchlist`
          : `Tambah ${coinId} ke watchlist`
      }
      onClick={() => {
        toggle(coinId)
        setJustToggled(true)
        setTimeout(() => setJustToggled(false), 400)
      }}
      className={cn(
        'text-lg leading-none transition-colors',
        active
          ? 'text-amber-400 hover:text-amber-500'
          : 'text-slate-300 hover:text-slate-400',
        justToggled && 'animate-pop',
        className,
      )}
    >
      {active ? '★' : '☆'}
    </button>
  )
}
