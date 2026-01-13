"use client"

import { useEffect } from "react"
import { useRouterState } from "@tanstack/react-router"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"

export function GoogleAnalytics() {
  const location = useRouterState({ select: (state) => state.location })

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    if (typeof window === "undefined") return

    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
      .gtag

    if (!gtag) return

    const pagePath = `${location.pathname}${location.search}${location.hash}`
    gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath })
  }, [location.hash, location.pathname, location.search])

  return null
}
