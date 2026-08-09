import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
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
