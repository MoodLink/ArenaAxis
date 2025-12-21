export interface RevenueResponse {
    message: string
    data: {
        storeCount: number
        totalRevenue: number
        totalRevenueInCurrentDay: number
        totalTransactions: number
    }
}

export interface FieldCard {
    id: string
    name: string
    defaultPrice: string
    revenue: number
    transactions: number
}

export interface StoreRevenueResponse {
    message: string
    data: {
        fieldCount: number
        totalRevenue: number
        totalOrder: number
        fieldCards: FieldCard[]
    }
}

export const RevenueService = {
    /**
     * Lấy tổng doanh thu của owner
     * GET /api/revenue/owner/{owner_id}
     */
    async getOwnerRevenue(ownerId: string): Promise<RevenueResponse> {
        const url = `/api/revenue/owner/${ownerId}`

        try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ?
                localStorage.getItem('token') || localStorage.getItem('authToken') : null

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`)
            }

            const data: RevenueResponse = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching owner revenue:', error)
            throw error
        }
    },

    /**
     * Lấy doanh thu của một store
     * GET /api/revenue/store/{store_id}
     */
    async getStoreRevenue(storeId: string): Promise<StoreRevenueResponse> {
        const url = `/api/revenue/store/${storeId}`

        try {
            // Get token from localStorage
            const token = typeof window !== 'undefined' ?
                localStorage.getItem('token') || localStorage.getItem('authToken') : null

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(url, {
                method: 'GET',
                headers,
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`)
            }

            const data: StoreRevenueResponse = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching store revenue:', error)
            throw error
        }
    },
}
