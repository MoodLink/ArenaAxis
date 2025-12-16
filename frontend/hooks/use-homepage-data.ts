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
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

// Hook lấy sports với caching - 24 hours (match Next.js ISR)
export function useSports() {
    return useQuery({
        queryKey: ['sports'],
        queryFn: getSports,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        gcTime: 48 * 60 * 60 * 1000, // 48 hours
        refetchOnWindowFocus: false, // Sports là static data, không cần refetch
    })
}

// Hook lấy sports news - 30 minutes (keep longer for back navigation)
export function useSportsNews(category: string = 'all', language: string = 'vi', pageSize: number = 8, page: number = 1) {
    return useQuery({
        queryKey: ['sportsNews', category, language, pageSize, page],
        queryFn: () => getSportsNews(category, language, pageSize, page),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}
