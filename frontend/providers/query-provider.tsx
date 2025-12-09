"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // Cache 5 phút
            gcTime: 10 * 60 * 1000, // Giữ cache 10 phút khi unmount
            retry: 2,
            refetchOnWindowFocus: false, // Không fetch khi quay lại tab
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
