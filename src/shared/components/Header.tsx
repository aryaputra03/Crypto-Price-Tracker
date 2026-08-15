import { Link } from '@tanstack/react-router'

import { cn } from '@/shared/lib/cn'
import { useScrolled } from '@/shared/hooks/useScrolled'

export function Header() {
  // Sticky + efek blur/shadow tipis pas discroll — kesan lebih "hidup" dan
  // header tetap gampang diakses (search, currency, watchlist) tanpa perlu
  // scroll ke atas dulu.
  const scrolled = useScrolled()

  return (
    <header
      className={cn(
        'sticky top-0 z-20 border-b transition-all duration-300',
        scrolled
          ? 'border-slate-200 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-white',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-slate-900"
        >
          Crypto<span className="text-brand-600">Tracker</span>
        </Link>
      </div>
    </header>
  )
}
