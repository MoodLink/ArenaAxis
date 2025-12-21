import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

interface StoreListParams {
    page?: number
    perPage?: number
}

// Helper function to get token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken')
    }
    return null
}

export function useStores({ page = 1, perPage = 12 }: StoreListParams = {}) {
    const query = useQuery({
        queryKey: ['stores', page, perPage],
        queryFn: async () => {
            const token = getToken()
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            }

            // ✅ Add Authorization header if token exists
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`/api/store?page=${page}&perPage=${perPage}`, {
                headers
            })
            if (!response.ok) throw new Error('Failed to fetch stores')
            return response.json()
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần (reduce API load)
    })

    // ✅ Refetch when token changes (e.g., after store registration USER → CLIENT)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && e.newValue !== e.oldValue) {
                console.log('🔄 Token changed, refetching stores...')
                query.refetch()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [query])

    return query
}
