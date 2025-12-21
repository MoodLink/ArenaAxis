/**
 * Next.js caching strategies
 * DEPRECATED: Using React Query for client-side caching only
 */

import { NextResponse } from 'next/server'

/**
 * Fetch without automatic caching
 * - Using React Query for client-side caching instead
 */
export async function cachedFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        cache: 'no-cache', // No caching - rely on React Query
    })

    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
}
