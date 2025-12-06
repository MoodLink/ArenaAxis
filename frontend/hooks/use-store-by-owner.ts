import { useQuery } from '@tanstack/react-query';
import { StoreAdminDetailResponse } from '@/types';

export function useStoresByOwner(ownerId: string) {
    return useQuery<StoreAdminDetailResponse[]>({
        queryKey: ['storesByOwner', ownerId],
        queryFn: async (): Promise<StoreAdminDetailResponse[]> => {
            if (!ownerId) return [];

            // Get token from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                throw new Error('No authentication token found');
            }

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
            return Array.isArray(data) ? data : [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        placeholderData: (previousData) => previousData,
        enabled: !!ownerId, // Only run when ownerId is provided
    });
}
