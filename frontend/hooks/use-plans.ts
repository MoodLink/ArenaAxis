import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch plans (subscription types) with automatic deduplication
 * Static data that rarely changes - caches for 24 hours
 */
export function usePlans(type?: string) {
    return useQuery({
        queryKey: ['plans', type || 'main'],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (type) {
                params.append('type', type);
            } else {
                params.append('type', 'main');
            }

            const response = await fetch(`/api/plans?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch plans');
            }
            return response.json();
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 hours - static data
        gcTime: 48 * 60 * 60 * 1000, // 48 hours garbage collection
        refetchOnWindowFocus: false, // Plans là static, không cần refetch
        refetchOnReconnect: false,
    });
}
