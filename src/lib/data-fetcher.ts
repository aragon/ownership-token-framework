/**
 * GitHub Data Fetcher
 *
 * Fetches data files from GitHub repository for dynamic data updates
 * without requiring app redeployment.
 */

// Data source configuration
export const DATA_SOURCES = {
  tokens: {
    owner: "aragon",
    repo: "ownership-token-index-framework",
    branch: "develop",
    path: "data/tokens.json",
  },
  metrics: {
    owner: "aragon",
    repo: "ownership-token-index-framework",
    branch: "develop",
    path: "data/metrics.json",
  },
  framework: {
    owner: "aragon",
    repo: "ownership-token-index-framework",
    branch: "develop",
    path: "data/framework.json",
  },
  faq: {
    owner: "aragon",
    repo: "ownership-token-index-framework",
    branch: "develop",
    path: "data/faq.json",
  },
} as const

export type DataSourceKey = keyof typeof DATA_SOURCES

// In-memory cache
const dataCache = new Map<string, { data: unknown; timestamp: number }>()

// Cache duration (5 minutes)
const CACHE_DURATION_MS = 5 * 60 * 1000

/**
 * Build GitHub raw content URL from data source config
 */
function buildGitHubRawUrl(
  source: (typeof DATA_SOURCES)[DataSourceKey]
): string {
  return `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.branch}/${source.path}`
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(cacheEntry: { timestamp: number } | undefined): boolean {
  if (!cacheEntry) return false
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION_MS
}

/**
 * Fetch data from GitHub with caching
 *
 * @param sourceKey - The data source key from DATA_SOURCES
 * @param options - Fetch options
 * @returns Parsed JSON data
 *
 * @example
 * const tokens = await fetchGitHubData('tokens')
 * const metrics = await fetchGitHubData('metrics', { cache: 'no-store' })
 */
export async function fetchGitHubData<T = unknown>(
  sourceKey: DataSourceKey,
  options?: {
    /** Bypass cache and force fresh fetch */
    bypassCache?: boolean
    /** Additional fetch options */
    fetchOptions?: RequestInit
  }
): Promise<T> {
  const source = DATA_SOURCES[sourceKey]
  const url = buildGitHubRawUrl(source)
  const cacheKey = url

  // Check cache first (unless bypassed)
  if (!options?.bypassCache) {
    const cached = dataCache.get(cacheKey)
    if (cached && isCacheValid(cached)) {
      return cached.data as T
    }
  }

  try {
    // Fetch from GitHub
    const response = await fetch(url, {
      ...options?.fetchOptions,
      headers: {
        Accept: "application/json",
        ...options?.fetchOptions?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${sourceKey} from GitHub: ${response.status} ${response.statusText}`
      )
    }

    const data = (await response.json()) as T

    // Update cache
    dataCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    // If fetch fails and we have stale cache, return it
    const staleCache = dataCache.get(cacheKey)
    if (staleCache) {
      console.warn(
        `Failed to fetch fresh data for ${sourceKey}, using stale cache`,
        error
      )
      return staleCache.data as T
    }

    throw error
  }
}

/**
 * Clear cache for a specific data source or all sources
 */
export function clearDataCache(sourceKey?: DataSourceKey): void {
  if (sourceKey) {
    const source = DATA_SOURCES[sourceKey]
    const url = buildGitHubRawUrl(source)
    dataCache.delete(url)
  } else {
    dataCache.clear()
  }
}

/**
 * Prefetch all data sources (useful for build time or app initialization)
 */
export async function prefetchAllData(): Promise<void> {
  const keys = Object.keys(DATA_SOURCES) as DataSourceKey[]
  await Promise.all(keys.map((key) => fetchGitHubData(key)))
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: dataCache.size,
    entries: Array.from(dataCache.entries()).map(([url, entry]) => ({
      url,
      age: Date.now() - entry.timestamp,
      valid: isCacheValid(entry),
    })),
  }
}
