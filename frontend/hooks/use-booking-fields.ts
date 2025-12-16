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
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect network
        refetchInterval: 60 * 1000, // ✅ Polling: check 60 giây 1 lần
        placeholderData: (previousData) => previousData, // Show stale data while fetching
        enabled: !!storeId && !!sportId && !!selectedDate, // Only fetch when all params are present
    });
}
