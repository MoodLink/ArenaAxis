'use client';

import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch and cache store fields
 * Uses React Query for automatic caching and deduplication
 * Prevents multiple simultaneous requests for the same store + date
 */
export function useStoreFields(storeId: string, dateTime?: string) {
    return useQuery({
        queryKey: ['storeFields', storeId, dateTime],
        queryFn: async () => {
            if (!storeId) return [];

            const params = new URLSearchParams({
                store_id: storeId,
                ...(dateTime && { date_time: dateTime }),
            });

            const response = await fetch(`/api/fields?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch fields: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || [];
        },
        staleTime: 3 * 60 * 1000, // 3 minutes - fields data can change
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!storeId, // Only fetch when storeId exists
    });
}
