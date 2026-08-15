import { useEffect, useRef, useState } from 'react'

type FlashDirection = 'up' | 'down' | null

/**
 * Deteksi perubahan value antar render (dipakai untuk harga yang di-polling
 * tiap 45 detik) dan kembalikan arah perubahannya sesaat, untuk memicu
 * animasi "flash" hijau/naik atau merah/turun — efek signature tracker ini,
 * meniru layar harga live di exchange sungguhan.
 */
export function usePriceFlash(value: number) {
  const previousRef = useRef(value)
  const [flash, setFlash] = useState<FlashDirection>(null)

  useEffect(() => {
    const previous = previousRef.current
    previousRef.current = value

    if (value === previous) return

    setFlash(value > previous ? 'up' : 'down')
    const timeout = setTimeout(() => setFlash(null), 1000)
    return () => clearTimeout(timeout)
  }, [value])

  return flash
}
