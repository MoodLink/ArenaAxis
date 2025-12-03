import { useQuery } from '@tanstack/react-query'
import { getProvinces, getWardsByProvinceId, getSports } from '@/services/api-new'

// Hook lấy provinces - cache 24 hours (Next.js ISR)
export function useProvinces() {
    return useQuery({
        queryKey: ['provinces'],
        queryFn: getProvinces,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours (match Next.js ISR)
        gcTime: 48 * 60 * 60 * 1000, // 48 hours (keep longer)
        // Don't refetch automatically - data is stable
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

// Hook lấy wards theo province ID - cache 12 hours
export function useWards(provinceId?: string) {
    return useQuery({
        queryKey: ['wards', provinceId],
        queryFn: () => getWardsByProvinceId(provinceId!),
        enabled: !!provinceId, // Chỉ fetch khi có provinceId
        staleTime: 12 * 60 * 60 * 1000, // 12 hours
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchOnWindowFocus: false,
    })
}

// Hook lấy sports - cache 24 hours (Next.js ISR)
export function useSportsOptions() {
    return useQuery({
        queryKey: ['sports-options'],
        queryFn: getSports,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours (match Next.js ISR)
        gcTime: 48 * 60 * 60 * 1000, // 48 hours
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
