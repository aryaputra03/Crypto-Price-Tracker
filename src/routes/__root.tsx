import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'

import { Header } from '../shared/components/Header'
import { PageContainer } from '../shared/components/PageContainer'
import appCss from '../styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Crypto Price Tracker',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  // Fase 8 — jaring pengaman di level ROOT (beda dari errorComponent per-
  // route di "/" dan "/coin/$coinId" yang sudah ada sejak Fase 5/6): ini yang
  // nangkep kalau ada URL yang sama sekali tidak cocok route manapun (typo,
  // link basi, dst), atau error yang entah kenapa lolos dari errorComponent
  // route spesifik.
  notFoundComponent: () => (
    <PageContainer>
      <p className="text-slate-600">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="mt-3 inline-block text-brand-600 hover:underline">
        ← Kembali ke beranda
      </Link>
    </PageContainer>
  ),
  errorComponent: ({ error }) => {
    const router = useRouter()
    return (
      <PageContainer>
        <p className="text-red-600">
          Terjadi kesalahan:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Coba lagi
        </button>
      </PageContainer>
    )
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
