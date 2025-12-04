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
        staleTime: 5 * 60 * 1000, // Cache 5 minutes
        gcTime: 30 * 60 * 1000, // Keep in garbage collection for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
        refetchOnReconnect: false, // Don't refetch on network reconnect
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
