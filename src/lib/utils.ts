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

const defaultDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatUnixTimestamp(
  timestamp: number,
  formatter: Intl.DateTimeFormat = defaultDateFormatter
): string {
  if (!Number.isFinite(timestamp)) {
    return "Unknown"
  }

  const date = new Date(timestamp * 1000)
  const parts = formatter.formatToParts(date)
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value
  const year = parts.find((part) => part.type === "year")?.value

  if (month && day && year) {
    return `${day} ${month} ${year}`
  }

  return formatter.format(date)
}
