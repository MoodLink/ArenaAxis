'use client';

import { useQuery } from '@tanstack/react-query';
import { getStoreById } from '@/services/api-new';
import type { StoreClientDetailResponse } from '@/types';

/**
 * Hook to fetch and cache store detail information
 * Uses React Query for automatic caching and background updates
 */
export function useStoreDetail(storeId: string) {
    return useQuery({
        queryKey: ['store', storeId],
        queryFn: async () => {
            const data = await getStoreById(storeId);
            return data;
        },
        staleTime: 5 * 60 * 1000, // Cache 5 minutes - store detail changes frequently
        gcTime: 30 * 60 * 1000, // Keep in garbage collection for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
        refetchOnReconnect: false, // Don't refetch on network reconnect
        placeholderData: (previousData) => previousData, // Show stale data while fetching
    });
}
