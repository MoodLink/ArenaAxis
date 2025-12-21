"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3 * 1000, // Cache 3 giây
            gcTime: 2 * 1000, // Giữ cache 2 giây khi unmount - rất ngắn để tiết kiệm bộ nhớ
            retry: 2,
            refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
            refetchInterval: 60 * 1000, // ✅ Polling: check 60 giây 1 lần (giảm từ 30s để giảm API load)
            refetchOnReconnect: true, // ✅ Refetch khi reconnect network
        },
    },
})

export function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
