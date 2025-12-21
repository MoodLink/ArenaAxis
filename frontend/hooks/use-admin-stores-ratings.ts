import { useQuery } from '@tanstack/react-query';

export interface StoreRating {
    id: string;
    name: string;
    address: string;
    avatarUrl?: string;
    averageRating: number;
    ratingCount: number;
    viewCount: number;
    orderCount: number;
    approved: boolean;
    approvable: boolean;
}

function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
}

export const useAdminStoresRatings = (page: number = 1, perPage: number = 1000) => {
    return useQuery({
        queryKey: ['adminStoresRatings', page, perPage],
        queryFn: async () => {
            const token = getToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // API endpoint to get all stores with ratings using admin search
            const url = `/api/store/admin-search?page=${page}&perPage=${perPage}`;
            console.log('[useAdminStoresRatings] Fetching:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                console.error('[useAdminStoresRatings] Error:', response.status, response.statusText);
                throw new Error(`Failed to fetch stores: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[useAdminStoresRatings] Success:', Array.isArray(data) ? `${data.length} stores` : 'response');

            // Map API response to StoreRating interface
            if (Array.isArray(data)) {
                const stores: StoreRating[] = data.map((store: any) => ({
                    id: store.id,
                    name: store.name,
                    address: store.address,
                    avatarUrl: store.avatarUrl,
                    averageRating: store.averageRating || 0,
                    ratingCount: store.ratingCount || 0,
                    viewCount: store.viewCount || 0,
                    orderCount: store.orderCount || 0,
                    approved: store.approved || false,
                    approvable: store.approvable || false,
                }));

                return stores;
            }

            return [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
