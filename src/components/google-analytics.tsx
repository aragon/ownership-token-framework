import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"

export function GoogleAnalytics() {
  const router = useRouter()
  const hasTrackedInitialPageView = useRef(false)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return
    if (typeof window === "undefined") return

    const getGtag = () =>
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag

    const trackPageView = () => {
      const gtag = getGtag()
      if (!gtag) return

      gtag("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      })
    }

    // Track initial page view once gtag is available
    if (!hasTrackedInitialPageView.current) {
      const checkGtag = setInterval(() => {
        if (getGtag()) {
          clearInterval(checkGtag)
          hasTrackedInitialPageView.current = true
          trackPageView()
        }
      }, 200)

      // Cleanup interval after 5 seconds if gtag never loads
      setTimeout(() => clearInterval(checkGtag), 8000)
    }

    // Track subsequent navigation
    const unsubscribe = router.subscribe("onResolved", (evt) => {
      if (!evt.pathChanged) return
      trackPageView()
    })

    return unsubscribe
  }, [router])

  return null
}
