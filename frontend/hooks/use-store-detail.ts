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
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        placeholderData: (previousData) => previousData, // Show stale data while fetching
    });
}
