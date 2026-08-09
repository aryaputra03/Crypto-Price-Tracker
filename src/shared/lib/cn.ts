import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gabungkan className secara kondisional dan aman dari konflik utility
 * Tailwind (mis. "px-2" vs "px-4" — yang terakhir menang, bukan dobel).
 */
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}
