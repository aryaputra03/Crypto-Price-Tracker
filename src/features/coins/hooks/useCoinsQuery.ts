import { useQuery } from '@tanstack/react-query'

import { fetchCoinsMarkets } from '../api/coins.api'
import { coinKeys } from '../keys'
import type { SupportedCurrency } from '../types'

interface UseCoinsQueryOptions {
  currency: SupportedCurrency
  page?: number
}

export function useCoinsQuery({ currency, page = 1 }: UseCoinsQueryOptions) {
  return useQuery({
    queryKey: coinKeys.list(currency, page),
    queryFn: ({ signal }) =>
      fetchCoinsMarkets({ vsCurrency: currency, page }, signal),
    // Polling tiap 45 detik — di tengah rentang 30-60 detik yang
    // direkomendasikan Blueprint 8 supaya tidak melebihi rate limit CoinGecko.
    refetchInterval: 45 * 1000,
  })
}
