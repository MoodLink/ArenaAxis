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
        staleTime: 1000 * 60, // 1 minute - booking data changes frequently
        gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        placeholderData: (previousData) => previousData,
        enabled: !!storeId && !!sportId && !!selectedDate && (options?.enabled !== false),
    });
}
