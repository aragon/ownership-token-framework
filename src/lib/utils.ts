import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value)
}

export function truncateAddress(address: string, start = 6, end = 4) {
  if (address.includes("...")) {
    return address
  }

  if (address.length <= start + end) {
    return address
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`
}
