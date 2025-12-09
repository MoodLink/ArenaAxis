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
        staleTime: 2 * 60 * 1000, // 2 minutes - orders can change frequently
        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!(storeId && startTime && endTime), // Only fetch when all required params exist
    });
}
