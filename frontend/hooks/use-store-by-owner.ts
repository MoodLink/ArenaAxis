import { useQuery } from '@tanstack/react-query';
import { StoreAdminDetailResponse } from '@/types';

export function useStoresByOwner(ownerId: string) {
    return useQuery<StoreAdminDetailResponse[], Error, StoreAdminDetailResponse[]>({
        queryKey: ['storesByOwner', ownerId],
        queryFn: async (): Promise<StoreAdminDetailResponse[]> => {
            if (!ownerId) return [];

            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('[Query] Fetching stores for owner:', ownerId);
            const response = await fetch(`/api/store/owner/${ownerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to fetch owner stores');
            }
            const data = await response.json();
            console.log('[Query] Fetched stores:', data);
            return Array.isArray(data) ? data : [];
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        placeholderData: (previousData) => previousData,
        enabled: !!ownerId, // Only run when ownerId is provided
    });
}
