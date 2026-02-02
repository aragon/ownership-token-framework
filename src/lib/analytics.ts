export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ""

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (!gtag) return

  gtag("event", eventName, eventParams)
}

/**
 * Track when a criterion accordion is opened
 */
export function trackCriterionOpen(criterionId: string, criterionName: string) {
  trackEvent("select_content", {
    content_type: "criterion",
    content_id: criterionId,
    content_name: criterionName,
  })
}

export function trackExpandAllCriteria(action: "expand" | "collapse") {
  trackEvent("select_content", {
    content_type: "expand_all_criteria",
    content_id: action,
  })
}
