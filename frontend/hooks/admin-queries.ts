/**
 * Admin-specific React Query hooks with optimized caching
 * Centralized API calls for admin pages to avoid redundant requests
 */

import { useQuery, useQueries, useMutation } from "@tanstack/react-query"
import { getUsers, getUserStores, getStoreById, getStores, searchStores, adminSearchStores, approveStore } from "@/services/api-new"
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
        adminSearch: (filters: any, page: number, pageSize: number) => [...adminQueryKeys.stores.all, "adminSearch", filters, page, pageSize] as const,
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
 * Cache time: 30 giây
 */
export const useAdminUsers = (page: number = 0, pageSize: number = 10) => {
    return useQuery({
        queryKey: adminQueryKeys.users.list(page, pageSize),
        queryFn: () => getUsers(page, pageSize),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

/**
 * Fetch all users (large batch) for stats
 * Cache time: 30 giây
 */
export const useAllAdminUsers = () => {
    return useQuery({
        queryKey: adminQueryKeys.users.all,
        queryFn: () => getUsers(0, 1000),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

// ============= STORES QUERIES =============

/**
 * Fetch all stores
 * Cache time: 30 giây
 */
export const useAllStores = () => {
    return useQuery({
        queryKey: adminQueryKeys.stores.all,
        queryFn: () => getUserStores(1, 1000),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

/**
 * Fetch single store details
 * Cache time: 30 giây
 */
export const useStoreDetail = (storeId: string) => {
    return useQuery({
        queryKey: adminQueryKeys.stores.detail(storeId),
        queryFn: () => getStoreById(storeId),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        enabled: !!storeId, // Only run if storeId exists
    })
}

/**
 * Fetch multiple store details in parallel
 * Useful for mapping store names to IDs
 * Cache time: 30 giây per store
 */
export const useStoreDetails = (storeIds: string[]) => {
    return useQueries({
        queries: storeIds.map((storeId) => ({
            queryKey: adminQueryKeys.stores.detail(storeId),
            queryFn: () => getStoreById(storeId),
            staleTime: 3 * 1000, // Cache 3 giây
            gcTime: 2 * 1000, // 2 seconds
            retry: 1,
            retryDelay: 1000,
            refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
            refetchOnReconnect: true, // ✅ Refetch khi reconnect
            refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        })),
    })
}

/**
 * Search stores with filters and pagination
 * Cache time: 30 giây
 */
export const useStoreSearch = (filters: SearchFilters, page: number = 0, pageSize: number = 12) => {
    return useQuery({
        queryKey: adminQueryKeys.stores.search(filters, page, pageSize),
        queryFn: () => searchStores(filters, page, pageSize),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

/**
 * Admin search stores
 * Cache time: 30 giây
 */
export const useAdminStoreSearch = (filters: { name?: string; wardId?: string; provinceId?: string; sportId?: string }, page: number = 0, pageSize: number = 12) => {
    return useQuery({
        queryKey: adminQueryKeys.stores.adminSearch(filters, page, pageSize),
        queryFn: () => adminSearchStores(filters, page, pageSize),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

// ============= FIELDS QUERIES =============

/**
 * Fetch all fields with optional date filter
 * Cache time: 30 giây - changes frequently
 */
export const useAdminFields = (date?: string) => {
    return useQuery({
        queryKey: adminQueryKeys.fields.list(date),
        queryFn: () => FieldService.getFields(date ? { date_time: date } : {}),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
    })
}

/**
 * Fetch fields for a specific store
 * Cache time: 30 giây
 */
export const useStoreFields = (storeId: string, date?: string) => {
    return useQuery({
        queryKey: adminQueryKeys.fields.byStore(storeId),
        queryFn: () => FieldService.getFieldsByStore(storeId, date),
        staleTime: 3 * 1000, // Cache 3 giây
        gcTime: 2 * 1000, // 2 seconds
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: true, // ✅ Refetch khi quay lại tab
        refetchOnReconnect: true, // ✅ Refetch khi reconnect
        refetchInterval: 60 * 1000, // ✅ Polling: 60 giây check 1 lần
        enabled: !!storeId,
    })
}

// ============= MUTATIONS =============

/**
 * Approve a store (Admin only)
 * Uses optimistic updates for faster UX
 * Invalidates stores cache after success (both admin and owner queries)
 */
export const useApproveStore = (queryClient: any) => {
    return useMutation({
        mutationFn: (storeId: string) => approveStore(storeId),
        onMutate: async (storeId: string) => {
            console.log('[Approve] onMutate - Starting approval for store:', storeId);

            // Cancel any outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: ["admin", "stores"] });
            await queryClient.cancelQueries({ queryKey: ["storesByOwner"] });

            // Snapshot the previous value
            const previousStores = queryClient.getQueryData(["admin", "stores"]);
            const previousOwnerStores = queryClient.getQueriesData({ queryKey: ["storesByOwner"] });

            console.log('[Approve] Previous owner stores:', previousOwnerStores);

            // Optimistically update all store queries
            queryClient.setQueriesData(
                { queryKey: ["admin", "stores"] },
                (oldData: any) => {
                    if (!oldData) return oldData;

                    // Handle both array and paginated responses
                    if (Array.isArray(oldData)) {
                        console.log('[Approve] Updating admin stores array');
                        return oldData.map((store: any) =>
                            store.id === storeId ? { ...store, approved: true } : store
                        );
                    }

                    // If it's a paginated response with items array
                    if (oldData.items && Array.isArray(oldData.items)) {
                        console.log('[Approve] Updating admin stores with items array');
                        return {
                            ...oldData,
                            items: oldData.items.map((store: any) =>
                                store.id === storeId ? { ...store, approved: true } : store
                            )
                        };
                    }

                    return oldData;
                }
            );

            // Also update owner stores queries
            queryClient.setQueriesData(
                { queryKey: ["storesByOwner"] },
                (oldData: any) => {
                    if (!oldData) return oldData;

                    if (Array.isArray(oldData)) {
                        console.log('[Approve] Updating owner stores array');
                        return oldData.map((store: any) =>
                            store.id === storeId ? { ...store, approved: true } : store
                        );
                    }

                    return oldData;
                }
            );

            return { previousStores, previousOwnerStores };
        },
        onSuccess: (data) => {
            console.log('[Approve] onSuccess - Approval response:', data);
            if (data.success) {
                // Invalidate both admin and owner store queries
                console.log('[Approve] Invalidating admin stores cache');
                queryClient.invalidateQueries({
                    queryKey: ["admin", "stores"]
                });

                console.log('[Approve] Invalidating owner stores cache');
                queryClient.invalidateQueries({
                    queryKey: ["storesByOwner"]
                });
            }
        },
        onError: (error: any, storeId: string, context: any) => {
            console.error('[Approve] onError - Failed to approve store:', storeId, error);

            // Rollback optimistic updates on error
            if (context?.previousStores) {
                queryClient.setQueryData(["admin", "stores"], context.previousStores);
            }
            if (context?.previousOwnerStores) {
                context.previousOwnerStores.forEach((query: any) => {
                    queryClient.setQueryData(query[0], query[1]);
                });
            }
        }
    })
}
