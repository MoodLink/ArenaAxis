/**
 * Next.js caching strategies
 * Tự động cache API responses dựa trên data freshness requirements
 */

import { NextResponse } from 'next/server'

interface CacheConfig {
    maxAge: number // seconds
    staleWhileRevalidate?: number // seconds
    staleIfError?: number // seconds
}

// Định nghĩa cache times cho các loại data khác nhau
export const CACHE_TIMES = {
    // Static data - very rare changes
    PROVINCES: { maxAge: 86400, staleWhileRevalidate: 604800 }, // 1 day + 7 days
    SPORTS: { maxAge: 86400, staleWhileRevalidate: 604800 }, // 1 day + 7 days
    WARDS: { maxAge: 43200, staleWhileRevalidate: 86400 }, // 12 hours + 1 day

    // Semi-static data - can change
    STORES: { maxAge: 300, staleWhileRevalidate: 600 }, // 5 min + 10 min
    FIELDS: { maxAge: 300, staleWhileRevalidate: 600 }, // 5 min + 10 min
    STORE_SEARCH: { maxAge: 300, staleWhileRevalidate: 600 }, // 5 min + 10 min

    // Dynamic data - changes frequently
    BOOKINGS: { maxAge: 60, staleWhileRevalidate: 120 }, // 1 min + 2 min
    NEWS: { maxAge: 600, staleWhileRevalidate: 1200 }, // 10 min + 20 min

    // Real-time data - no cache
    CHAT: { maxAge: 0 }, // No cache
    LOCATION: { maxAge: 300 }, // 5 min
} as const

/**
 * Add cache headers to API response
 * Sử dụng trong API route handlers
 */
export function withCache<T>(
    data: T,
    cacheConfig: CacheConfig
): NextResponse<T> {
    const response = NextResponse.json(data)

    // Build Cache-Control header
    const cacheControl = [
        'public',
        `max-age=${cacheConfig.maxAge}`,
    ]

    if (cacheConfig.staleWhileRevalidate) {
        cacheControl.push(`stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`)
    }

    if (cacheConfig.staleIfError) {
        cacheControl.push(`stale-if-error=${cacheConfig.staleIfError}`)
    }

    response.headers.set('Cache-Control', cacheControl.join(', '))
    response.headers.set('CDN-Cache-Control', cacheControl.join(', '))

    return response
}

/**
 * Fetch with automatic Next.js caching
 * - Request Memoization (per request)
 * - Data Cache (across requests)
 */
export async function cachedFetch<T>(
    url: string,
    options: RequestInit & {
        cache?: 'force-cache' | 'no-cache' | 'no-store'
        revalidate?: number // ISR revalidation time
    } = {}
): Promise<T> {
    const { cache = 'force-cache', revalidate = 3600, ...fetchOptions } = options

    const response = await fetch(url, {
        ...fetchOptions,
        // Auto-caching: Request Memoization + Data Cache
        cache,
        next: {
            revalidate: revalidate, // ISR: revalidate every N seconds
            tags: ['api-cache'], // For manual revalidation if needed
        },
    })

    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
}
