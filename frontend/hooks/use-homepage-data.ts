import { useQuery } from '@tanstack/react-query'
import { getNearbyStoresFromGeolocation } from '@/services/nearby-store.service'
import { getSports } from '@/services/api-new'
import { getSportsNews } from '@/services/sports-news'

// Hook lấy nearby stores với caching - 30 minutes (keep longer to avoid refetch when navigating back)
export function useNearbyStores(enabled: boolean = true) {
    return useQuery({
        queryKey: ['nearbyStores'],
        queryFn: () => getNearbyStoresFromGeolocation(10000),
        enabled,
        staleTime: 30 * 60 * 1000, // 30 phút (avoid refetch on back navigation)
        gcTime: 60 * 60 * 1000, // 60 phút (keep in cache for 1 hour)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

// Hook lấy sports với caching - 24 hours (match Next.js ISR)
export function useSports() {
    return useQuery({
        queryKey: ['sports'],
        queryFn: getSports,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        gcTime: 48 * 60 * 60 * 1000, // 48 hours
        refetchOnWindowFocus: false,
    })
}

// Hook lấy sports news - 30 minutes (keep longer for back navigation)
export function useSportsNews(category: string = 'all', language: string = 'vi', pageSize: number = 8, page: number = 1) {
    return useQuery({
        queryKey: ['sportsNews', category, language, pageSize, page],
        queryFn: () => getSportsNews(category, language, pageSize, page),
        staleTime: 30 * 60 * 1000, // 30 phút (avoid refetch on back navigation)
        gcTime: 60 * 60 * 1000, // 60 phút (keep in cache for 1 hour)
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
