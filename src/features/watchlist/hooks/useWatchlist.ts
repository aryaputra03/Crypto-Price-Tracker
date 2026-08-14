import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'crypto-tracker:watchlist'

type Listener = () => void
const listeners = new Set<Listener>()

// Cache snapshot supaya getSnapshot() selalu return REFERENCE yang sama
// kalau datanya belum berubah — useSyncExternalStore mewajibkan ini, kalau
// tidak React bisa infinite-loop ("getSnapshot should be cached").
let cachedSnapshot: Array<string> | null = null
const emptySnapshot: Array<string> = []

function readFromStorage(): Array<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Array<string>) : []
  } catch {
    return []
  }
}

function getSnapshot(): Array<string> {
  cachedSnapshot ??= readFromStorage()
  return cachedSnapshot
}

// SSR tidak punya localStorage — snapshot server SELALU array kosong yang
// sama, supaya tidak ada hydration mismatch (server & client render pertama
// sama-sama "kosong"; watchlist asli baru muncul setelah hydration).
function getServerSnapshot(): Array<string> {
  return emptySnapshot
}

function writeWatchlist(ids: Array<string>) {
  cachedSnapshot = ids
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // localStorage bisa gagal (mis. private browsing penuh) — watchlist
    // tetap update untuk sesi ini, cuma tidak ikut persisten.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  // Sinkron antar tab/window: kalau localStorage diubah dari tab lain,
  // event "storage" ini yang kasih tahu tab ini untuk baca ulang.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedSnapshot = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Watchlist coin, persisten di localStorage, sinkron antar tab. */
export function useWatchlist() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isWatchlisted = useCallback(
    (coinId: string) => ids.includes(coinId),
    [ids],
  )

  const toggle = useCallback((coinId: string) => {
    const current = getSnapshot()
    const next = current.includes(coinId)
      ? current.filter((id) => id !== coinId)
      : [...current, coinId]
    writeWatchlist(next)
  }, [])

  return { ids, isWatchlisted, toggle }
}
