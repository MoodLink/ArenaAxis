/**
 * Admin-specific React Query hooks with optimized caching
 * Centralized API calls for admin pages to avoid redundant requests
 */

import { useQuery, useQueries } from "@tanstack/react-query"
import { getUsers, getUserStores, getStoreById, getStores, searchStores } from "@/services/api-new"
import type { SearchFilters } from "@/components/store/SearchStoreForm"
import { FieldService } from "@/services/field.service"

// Query key factories for admin data
export const adminQueryKeys = {
    users: {
        all: ["admin", "users"] as const,
        list: (page: number, pageSize: number) => [...adminQueryKeys.users.all, "list", page, pageSize] as const,
        detail: (id: string) => [...adminQueryKeys.users.all, "detail", id] as const,
    },
    stores: {
        all: ["admin", "stores"] as const,
        list: (page?: number, pageSize?: number) => [...adminQueryKeys.stores.all, "list", page, pageSize] as const,
        detail: (id: string) => [...adminQueryKeys.stores.all, "detail", id] as const,
        search: (filters: SearchFilters, page: number, pageSize: number) => [...adminQueryKeys.stores.all, "search", filters, page, pageSize] as const,
    },
    fields: {
        all: ["admin", "fields"] as const,
        list: (date?: string) => [...adminQueryKeys.fields.all, "list", date] as const,
        byStore: (storeId: string) => [...adminQueryKeys.fields.all, "byStore", storeId] as const,
    },
}

// ============= USERS QUERIES =============

/**
 * Fetch all users with pagination
 * Cache time: 5 minutes
 */
export const useAdminUsers = (page: number = 0, pageSize: number = 10) => {
    return useQuery({
        queryKey: adminQueryKeys.users.list(page, pageSize),
        queryFn: () => getUsers(page, pageSize),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        retryDelay: 1000,
    })
}

/**
 * Fetch all users (large batch) for stats
 * Cache time: 10 minutes - changes less frequently
 */
export const useAllAdminUsers = () => {
    return useQuery({
        queryKey: adminQueryKeys.users.all,
        queryFn: () => getUsers(0, 1000),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 20 * 60 * 1000, // 20 minutes
        retry: 2,
        retryDelay: 1000,
    })
}

// ============= STORES QUERIES =============

/**
 * Fetch all stores
 * Cache time: 10 minutes
 */
export const useAllStores = () => {
    return useQuery({
        queryKey: adminQueryKeys.stores.all,
        queryFn: () => getUserStores(1, 1000),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 20 * 60 * 1000, // 20 minutes
        retry: 2,
        retryDelay: 1000,
    })
}

/**
 * Fetch single store details
 * Cache time: 5 minutes
 */
export const useStoreDetail = (storeId: string) => {
    return useQuery({
        queryKey: adminQueryKeys.stores.detail(storeId),
        queryFn: () => getStoreById(storeId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: 1000,
        enabled: !!storeId, // Only run if storeId exists
    })
}

/**
 * Fetch multiple store details in parallel
 * Useful for mapping store names to IDs
 * Cache time: 5 minutes per store
 */
export const useStoreDetails = (storeIds: string[]) => {
    return useQueries({
        queries: storeIds.map((storeId) => ({
            queryKey: adminQueryKeys.stores.detail(storeId),
            queryFn: () => getStoreById(storeId),
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            retryDelay: 1000,
        })),
    })
}

/**
 * Search stores with filters and pagination
 * Cache time: 5 minutes
 */
export const useStoreSearch = (filters: SearchFilters, page: number = 0, pageSize: number = 12) => {
    return useQuery({
        queryKey: adminQueryKeys.stores.search(filters, page, pageSize),
        queryFn: () => searchStores(filters, page, pageSize),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: 1000,
    })
}

// ============= FIELDS QUERIES =============

/**
 * Fetch all fields with optional date filter
 * Cache time: 3 minutes - changes frequently
 */
export const useAdminFields = (date?: string) => {
    return useQuery({
        queryKey: adminQueryKeys.fields.list(date),
        queryFn: () => FieldService.getFields(date ? { date_time: date } : {}),
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 6 * 60 * 1000, // 6 minutes
        retry: 2,
        retryDelay: 1000,
    })
}

/**
 * Fetch fields for a specific store
 * Cache time: 3 minutes
 */
export const useStoreFields = (storeId: string, date?: string) => {
    return useQuery({
        queryKey: adminQueryKeys.fields.byStore(storeId),
        queryFn: () => FieldService.getFieldsByStore(storeId, date),
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 6 * 60 * 1000, // 6 minutes
        retry: 2,
        retryDelay: 1000,
        enabled: !!storeId,
    })
}
