'use client';

import { useQuery } from '@tanstack/react-query';
import { getFavourites } from '@/services/api-new';
import type { StoreSearchItemResponse } from '@/types';

/**
 * Hook to fetch and cache user's favourite stores
 * Uses React Query for automatic deduplication across all components
 * 
 * Instead of each StoreCard calling isFavourite(storeId) separately,
 * call this hook ONCE in a parent component and pass data down
 */
export function useFavourites() {
    return useQuery({
        queryKey: ['favourites'],
        queryFn: async () => {
            try {
                const data = await getFavourites();
                return data as StoreSearchItemResponse[];
            } catch (error) {
                console.warn('Failed to fetch favourites:', error);
                return [];
            }
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: false, // ❌ Không cần refetch khi quay lại tab (dữ liệu hầu như không thay đổi)
        refetchOnReconnect: true, // ✅ Chỉ refetch khi reconnect
        refetchInterval: false, // ❌ Không polling (không cần - ít thay đổi)
        placeholderData: (previousData) => previousData, // Show stale data while fetching
        // Silent failure - return empty array if not logged in
        retry: false,
    });
}

/**
 * Utility function to check if a store is in the favourites list
 */
export function isFavouriteStore(storeId: string, favourites: StoreSearchItemResponse[]): boolean {
    return favourites.some(store => store.id === storeId);
}
