'use client';

import { useQuery } from '@tanstack/react-query';
import { FieldService } from '@/services/field.service';

/**
 * Hook to fetch and cache booking fields for store
 * Uses React Query to prevent duplicate API calls
 */
export function useBookingFields(storeId: string, sportId: string, selectedDate: string) {
    return useQuery({
        queryKey: ['bookingFields', storeId, sportId, selectedDate],
        queryFn: async () => {
            return await FieldService.getFieldsWithAllData(storeId, sportId, selectedDate);
        },
        staleTime: 2 * 60 * 1000, // Cache 2 minutes - booking data changes frequently
        gcTime: 10 * 60 * 1000, // Keep in garbage collection for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
        refetchOnReconnect: false, // Don't refetch on network reconnect
        placeholderData: (previousData) => previousData, // Show stale data while fetching
        enabled: !!storeId && !!sportId && !!selectedDate, // Only fetch when all params are present
    });
}
