'use client';

import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch and cache field detail
 * Uses React Query for automatic caching and deduplication
 */
export function useFieldDetail(fieldId: string) {
    return useQuery({
        queryKey: ['fieldDetail', fieldId],
        queryFn: async () => {
            if (!fieldId) return null;

            const response = await fetch(`/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch field: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || data;
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        enabled: !!fieldId, // Only fetch when fieldId exists
    });
}
