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
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!fieldId, // Only fetch when fieldId exists
    });
}
