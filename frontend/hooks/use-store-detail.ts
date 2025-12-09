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

            // Add mock images for testing if mediaUrls is empty
            if (data && (!data.mediaUrls || data.mediaUrls.length === 0)) {
                data.mediaUrls = [
                    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&h=600&fit=crop',
                ];
            }

            return data;
        },
        staleTime: 5 * 60 * 1000, // Cache 5 minutes - store detail changes frequently
        gcTime: 30 * 60 * 1000, // Keep in garbage collection for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
        refetchOnReconnect: false, // Don't refetch on network reconnect
        placeholderData: (previousData) => previousData, // Show stale data while fetching
    });
}
