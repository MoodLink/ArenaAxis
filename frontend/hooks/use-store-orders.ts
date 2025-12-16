'use client';

import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch and cache store orders
 * Uses React Query for automatic caching and deduplication
 * Prevents multiple simultaneous requests for the same store + date range
 */
export function useStoreOrders(
    storeId: string,
    startTime?: string,
    endTime?: string
) {
    return useQuery({
        queryKey: ['storeOrders', storeId, startTime, endTime],
        queryFn: async () => {
            if (!storeId) return [];
            if (!startTime || !endTime) return [];

            const params = new URLSearchParams({
                start_time: startTime,
                end_time: endTime,
            });

            const response = await fetch(
                `/api/orders/store/${storeId}?${params.toString()}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || [];
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        enabled: !!(storeId && startTime && endTime), // Only fetch when all required params exist
    });
}
