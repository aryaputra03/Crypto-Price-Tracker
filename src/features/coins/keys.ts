/**
 * Query key factory terpusat (Blueprint 6.2) — supaya invalidation/refetch
 * (mis. saat currency berubah) konsisten di semua hook fitur coins.
 */
export const coinKeys = {
  all: ['coins'] as const,
  lists: () => [...coinKeys.all, 'list'] as const,
  list: (currency: string, page: number) =>
    [...coinKeys.lists(), currency, page] as const,
  detail: (id: string) => [...coinKeys.all, 'detail', id] as const,
  marketChart: (id: string, currency: string, days: number) =>
    [...coinKeys.all, 'market-chart', id, currency, days] as const,
}
