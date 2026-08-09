import { createFileRoute } from '@tanstack/react-router'

import { PageContainer } from '../shared/components/PageContainer'
import { Button } from '../shared/components/ui/Button'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-slate-900">
        Selamat datang di Crypto Price Tracker
      </h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Fondasi routing, layout, dan styling sudah siap (Fase 1). Tabel harga
        coin dari CoinGecko akan masuk mulai Fase 2-3.
      </p>
      <Button className="mt-6">Contoh Button</Button>
    </PageContainer>
  )
}
