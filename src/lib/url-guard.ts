/**
 * Request URL safety guard.
 *
 * TanStack Router canonicalizes the incoming URL in `beforeLoad`: it rebuilds
 * the location from the *decoded* pathname and, if the rebuilt href doesn't
 * string-match the incoming href, throws a 307 redirect to the rebuilt href.
 *
 * For characters that don't round-trip through decode -> encode (e.g. `"`,
 * `<`, `>`), the redirect target is the decoded form. The browser re-encodes
 * it and re-requests, which canonicalizes again -> an infinite 307 loop
 * (ERR_TOO_MANY_REDIRECTS) that also reflects the raw payload into the URL.
 *
 * These characters never appear in the routes this app actually serves
 * (`/`, `/faq`, `/tokens/<id>`, `/api/...`, `/og-images/...`), so we reject
 * such requests at the server boundary with a terminal 404 before the router
 * runs. A 404 doesn't redirect, so the loop can't form.
 */

// C0 control chars (\x00-\x1f), DEL (\x7f), and the RFC 3986 characters that
// are unsafe in a path and break attribute context in reflected HTML:
// " < > \ ^ ` { | }. Ordinary characters (space, accented letters, etc.) are
// intentionally allowed — they round-trip and 404 normally without looping.
// biome-ignore lint/suspicious/noControlCharactersInRegex: rejecting control chars is the intent
const UNSAFE_PATHNAME_CHARS = /[\x00-\x1f\x7f"<>\\^`{|}]/

/**
 * Returns true when a request pathname should be rejected outright.
 *
 * @param pathname - a raw (possibly percent-encoded) URL pathname
 */
export function isBlockedPathname(pathname: string): boolean {
  // Reject before and after decoding: the raw form catches encoded payloads
  // and the decoded form catches the characters the router would loop on.
  if (UNSAFE_PATHNAME_CHARS.test(pathname)) {
    return true
  }

  try {
    return UNSAFE_PATHNAME_CHARS.test(decodeURIComponent(pathname))
  } catch {
    // Malformed percent-encoding (e.g. "/%", "/%zz") -> reject.
    return true
  }
}
