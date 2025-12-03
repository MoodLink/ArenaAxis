'use client';

import { useQuery } from '@tanstack/react-query';
import { getStoreRatings } from '@/services/api-new';

/**
 * Hook to fetch and cache store ratings
 * Uses React Query for automatic caching and background updates
 */
export function useStoreRatings(storeId: string, page: number = 0, perPage: number = 100) {
    return useQuery({
        queryKey: ['ratings', storeId, page, perPage],
        queryFn: async () => {
            try {
                return await getStoreRatings(storeId, page, perPage);
            } catch (error) {
                // Return empty array on error (e.g., 401 Unauthenticated)
                console.warn(`Failed to fetch ratings for store ${storeId}:`, error);
                return [];
            }
        },
        staleTime: 10 * 60 * 1000, // Cache 10 minutes
        gcTime: 30 * 60 * 1000, // Keep in garbage collection for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        placeholderData: (previousData) => previousData,
    });
}
