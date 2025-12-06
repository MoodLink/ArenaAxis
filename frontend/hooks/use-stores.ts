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
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    })
}
