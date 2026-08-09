import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Bungkus konten tiap halaman supaya lebar & padding-nya konsisten
 * (dipakai di HomePage, CoinDetailPage, dst).
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </main>
  )
}
