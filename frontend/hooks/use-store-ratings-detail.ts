import { useQuery } from '@tanstack/react-query';

export interface RatingsParams {
    storeId: string;
    sportId?: string;
    star?: number;
    page?: number;
    perPage?: number;
}

export interface RatingsStats {
    totalRatings: number;
    averageRating: number;
    ratingsByScore: { [key: number]: number };
    ratingsBySport: { [key: string]: number };
    sports: Array<{ id: string; name: string }>;
}

function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
}

export const useStoreRatingsDetail = (params: RatingsParams) => {
    return useQuery({
        queryKey: ['storeRatingsDetail', params.storeId, params.sportId, params.star, params.page, params.perPage],
        queryFn: async () => {
            // Build query params in correct order: ?sportId=...&star=...&page=...&perPage=...
            const queryParams = new URLSearchParams();

            if (params.sportId) queryParams.append('sportId', params.sportId);
            if (params.star) queryParams.append('star', params.star.toString());
            queryParams.append('page', (params.page || 1).toString());
            queryParams.append('perPage', (params.perPage || 12).toString());

            const token = getToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // API endpoint: [GET] /stores/{storeId}/ratings?sportId=football&star=4&page=1&perPage=12
            const url = `/api/stores/${params.storeId}/ratings?${queryParams.toString()}`;
            console.log('[useStoreRatingsDetail] Fetching:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                console.error('[useStoreRatingsDetail] Error:', response.status, response.statusText);
                throw new Error(`Failed to fetch ratings: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[useStoreRatingsDetail] Success:', Array.isArray(data) ? `${data.length} ratings` : 'object response');

            // Ensure we always return array-like response
            if (Array.isArray(data)) {
                return { data, total: data.length };
            }
            return data || { data: [], total: 0 };
        },
        enabled: !!params.storeId,
    });
};

export const useStoreRatingsStats = (storeId: string) => {
    return useQuery({
        queryKey: ['storeRatingsStats', storeId],
        queryFn: async () => {
            try {
                const token = getToken();
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }


                // Fetch all ratings without filter to calculate stats
                // API endpoint: [GET] /stores/{storeId}/ratings?page=1&perPage=1000
                const url = `/api/stores/${storeId}/ratings?page=1&perPage=1000`;
                console.log('[useStoreRatingsStats] Fetching:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers,
                });

                if (!response.ok) {
                    console.warn(`Failed to fetch ratings for stats: ${response.statusText}`);
                    return null;
                }

                const responseText = await response.text();

                // Handle empty response
                if (!responseText || responseText.trim() === '') {
                    console.warn('[useStoreRatingsStats] Backend returned empty response');
                    return null;
                }

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('[useStoreRatingsStats] JSON parse error:', e);
                    return null;
                }

                const ratings = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

                if (!Array.isArray(ratings)) return null;

                const stats: RatingsStats = {
                    totalRatings: ratings.length,
                    averageRating: 0,
                    ratingsByScore: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    ratingsBySport: {},
                    sports: [],
                };

                // Calculate stats
                let totalScore = 0;
                const sportsSet = new Map<string, string>();

                ratings.forEach((rating: any) => {
                    const score = Math.round(rating.star || 0);
                    if (score >= 1 && score <= 5) {
                        stats.ratingsByScore[score]++;
                        totalScore += score;
                    }

                    if (rating.sport) {
                        const sportId = rating.sport.id;
                        const sportName = rating.sport.name;

                        stats.ratingsBySport[sportId] = (stats.ratingsBySport[sportId] || 0) + 1;
                        sportsSet.set(sportId, sportName);
                    }
                });

                stats.averageRating = stats.totalRatings > 0 ? totalScore / stats.totalRatings : 0;
                stats.sports = Array.from(sportsSet.entries()).map(([id, name]) => ({ id, name }));

                return stats;
            } catch (error) {
                console.error('Error fetching ratings stats:', error);
                return null;
            }
        },
        enabled: !!storeId,
    });
};
