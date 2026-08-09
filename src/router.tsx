import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

import { createQueryClient } from './shared/lib/query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    // queryClient masuk ke router context, bisa diakses lewat `context.queryClient`
    // di dalam route loader mulai Fase 5 (SSR prefetching).
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  // Membungkus router dengan QueryClientProvider + hydration/dehydration
  // otomatis untuk SSR (lihat @tanstack/react-router-with-query).
  return routerWithQueryClient(router, queryClient)
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
