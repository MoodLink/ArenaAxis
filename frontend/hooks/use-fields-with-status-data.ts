import { useQuery } from '@tanstack/react-query';
import { FieldService } from '@/services/field.service';

/**
 * Hook to fetch all field data including statusField with automatic deduplication
 * Prevents duplicate API calls when component re-renders
 */
export function useFieldsWithStatusData(
    storeId: string,
    sportId: string,
    selectedDate: string,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ['fieldsWithStatus', storeId, sportId, selectedDate], // Includes date - unique per date
        queryFn: async () => {
            if (!storeId || !sportId) return null;

            const response = await FieldService.getFieldsWithAllData(
                storeId,
                sportId,
                selectedDate
            );
            return response;
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        placeholderData: (previousData) => previousData,
        enabled: !!storeId && !!sportId && !!selectedDate && (options?.enabled !== false),
    });
}
