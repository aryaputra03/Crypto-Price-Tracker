import { Link } from '@tanstack/react-router'

import { formatCurrency } from '@/features/currency/format'
import type { SupportedCurrency } from '@/features/currency/constants'

import { useCoinDetailQuery } from '../hooks/useCoinDetailQuery'
import type { CoinsListSearch } from '../search-schema'
import { CoinPriceChart } from './CoinPriceChart'
import { WatchlistToggle } from '@/features/watchlist/components/WatchlistToggle'

interface CoinDetailViewProps {
  coinId: string
  currency: SupportedCurrency
  backSearch: CoinsListSearch
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

/** Ambil paragraf pertama saja dari deskripsi CoinGecko (bisa sangat panjang). */
function firstParagraph(description: string) {
  const cleaned = stripHtml(description).trim()
  const [first] = cleaned.split(/\r?\n\r?\n/)
  return first && first.length > 0 ? first : 'Deskripsi tidak tersedia.'
}

export function CoinDetailView({
  coinId,
  currency,
  backSearch,
}: CoinDetailViewProps) {
  // useSuspenseQuery cuma menjamin query-nya SUKSES, bukan bahwa value-nya
  // tidak null — fetchCoinDetail memang bisa resolve dengan null (404).
  // Loader route sudah throw notFound() untuk kasus itu (lihat
  // coin.$coinId.tsx), jadi baris ini seharusnya tidak pernah kena, tapi
  // TypeScript tidak tahu itu — guard ini murni supaya tipenya benar.
  const { data: coin } = useCoinDetailQuery(coinId)
  if (!coin) return null

  const price = coin.market_data.current_price[currency]
  const marketCap = coin.market_data.market_cap[currency]
  const ath = coin.market_data.ath[currency]
  const atl = coin.market_data.atl[currency]
  const athDate = coin.market_data.ath_date[currency]
  const atlDate = coin.market_data.atl_date[currency]
  const homepage = coin.links.homepage.find((url) => url.length > 0)

  return (
    <div>
      <Link
        to="/"
        search={backSearch}
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
      >
        ← Kembali ke daftar
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <img src={coin.image.large} alt="" className="h-12 w-12" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {coin.name}{' '}
            <span className="text-slate-400 uppercase">{coin.symbol}</span>
          </h1>
          {coin.market_cap_rank !== null && (
            <p className="text-sm text-slate-500">
              Rank #{coin.market_cap_rank}
            </p>
          )}
        </div>
        <WatchlistToggle coinId={coinId} className="ml-auto text-2xl" />
      </div>

      {price !== undefined && (
        <p className="mt-4 font-mono text-3xl font-bold text-slate-900">
          {formatCurrency(price, currency)}
        </p>
      )}

      <div className="mt-6">
        <CoinPriceChart coinId={coinId} currency={currency} />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem
          label="Market Cap"
          value={
            marketCap !== undefined
              ? formatCurrency(marketCap, currency, true)
              : '-'
          }
        />
        <StatItem
          label="Circulating Supply"
          value={`${coin.market_data.circulating_supply.toLocaleString('en-US')} ${coin.symbol.toUpperCase()}`}
        />
        <StatItem
          label="All-Time High"
          value={
            ath !== undefined && athDate !== undefined
              ? `${formatCurrency(ath, currency)} · ${new Date(athDate).toLocaleDateString('id-ID')}`
              : '-'
          }
        />
        <StatItem
          label="All-Time Low"
          value={
            atl !== undefined && atlDate !== undefined
              ? `${formatCurrency(atl, currency)} · ${new Date(atlDate).toLocaleDateString('id-ID')}`
              : '-'
          }
        />
      </dl>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Tentang {coin.name}
        </h2>
        <p className="mt-2 text-slate-600">
          {firstParagraph(coin.description.en)}
        </p>
      </div>

      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 inline-block text-sm text-brand-600 hover:underline"
        >
          Website resmi ↗
        </a>
      )}
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
        {value}
      </dd>
    </div>
  )
}
