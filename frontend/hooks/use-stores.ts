import { useQuery } from '@tanstack/react-query'

interface StoreListParams {
    page?: number
    perPage?: number
}

export function useStores({ page = 1, perPage = 12 }: StoreListParams = {}) {
    return useQuery({
        queryKey: ['stores', page, perPage],
        queryFn: async () => {
            const response = await fetch(`/api/store?page=${page}&perPage=${perPage}`)
            if (!response.ok) throw new Error('Failed to fetch stores')
            return response.json()
        },
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần (reduce API load)
    })
}
