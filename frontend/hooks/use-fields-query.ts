import { useQuery } from '@tanstack/react-query';

interface FieldsQueryParams {
    store_id?: string;
    sport_id?: string;
    date_time?: string;
    active_status?: boolean;
}

/**
 * Hook to fetch fields with query parameters and automatic deduplication
 * Automatically deduplicates multiple calls with identical parameters
 */
export function useFieldsQuery(params: FieldsQueryParams, options?: { enabled?: boolean }) {
    const queryString = new URLSearchParams();

    if (params.store_id) queryString.append('store_id', params.store_id);
    if (params.sport_id) queryString.append('sport_id', params.sport_id);
    if (params.date_time) queryString.append('date_time', params.date_time);
    if (params.active_status !== undefined) queryString.append('active_status', String(params.active_status));

    return useQuery({
        queryKey: ['fields', params], // queryKey includes all params for deduplication
        queryFn: async () => {
            const url = `/api/fields?${queryString.toString()}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch fields');
            }
            const data = await response.json();
            return data.data || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        placeholderData: (previousData) => previousData,
        enabled: !!params.store_id && (options?.enabled !== false), // Only fetch when store_id exists
    });
}
