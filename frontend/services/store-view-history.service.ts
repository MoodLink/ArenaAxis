// File: services/store-view-history.service.ts
// Service để quản lý store view histories

export interface ViewHistory {
    id: string
    name: string
    address: string
    avatar?: string
    introduction?: string
    viewedAt: string
    rating?: number
    reviewCount?: number
}

/**
 * Lấy token từ localStorage
 */
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken')
    }
    return null
}

/**
 * Lấy danh sách trung tâm thể thao đã từng xem
 * GET /api/store-view-histories
 * 
 * @returns Mảng ViewHistory
 */
export async function getStoreViewHistories(): Promise<ViewHistory[]> {
    try {
        const token = getToken()
        if (!token) {
            throw new Error('Không có token xác thực')
        }

        const response = await fetch(
            '/api/store-view-histories',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại')
            }
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        console.log(`✓ Lấy ${Array.isArray(data) ? data.length : 0} lịch sử xem`)

        return Array.isArray(data) ? data : data.data || []
    } catch (error: any) {
        console.error('✗ Lỗi lấy lịch sử xem:', error.message)
        throw error
    }
}

/**
 * Xóa một item từ lịch sử xem
 * DELETE /api/store-view-histories/{storeId}
 * 
 * @param storeId - ID của trung tâm thể thao
 */
export async function deleteStoreViewHistory(storeId: string): Promise<void> {
    try {
        const token = getToken()
        if (!token) {
            throw new Error('Không có token xác thực')
        }

        const response = await fetch(
            `/api/store-view-histories/${storeId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        // 204 No Content hoặc 200 OK đều là thành công
        if (response.status === 204 || response.ok) {
            console.log(`✓ Đã xóa lịch sử xem của store ${storeId}`)
            return
        }

        if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn')
        }

        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
    } catch (error: any) {
        console.error('✗ Lỗi xóa lịch sử xem:', error.message)
        throw error
    }
}

/**
 * Xóa toàn bộ lịch sử xem
 * DELETE /api/store-view-histories
 */
export async function clearAllViewHistories(): Promise<void> {
    try {
        const token = getToken()
        if (!token) {
            throw new Error('Không có token xác thực')
        }

        const response = await fetch(
            '/api/store-view-histories/all',
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        if (response.status === 204 || response.ok) {
            console.log('✓ Đã xóa toàn bộ lịch sử xem')
            return
        }

        if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn')
        }

        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
    } catch (error: any) {
        console.error('✗ Lỗi xóa lịch sử xem:', error.message)
        throw error
    }
}

/**
 * Lấy danh sách lịch sử xem với tìm kiếm
 * 
 * @param query - Từ khóa tìm kiếm (tên hoặc địa chỉ)
 * @param page - Số trang
 * @param limit - Số item mỗi trang
 * @returns Mảng ViewHistory
 */
export async function searchViewHistories(
    query: string,
    page: number = 0,
    limit: number = 20
): Promise<ViewHistory[]> {
    try {
        const histories = await getStoreViewHistories()

        if (!query.trim()) {
            return histories
        }

        const lowerQuery = query.toLowerCase()
        return histories.filter(
            history =>
                history.name.toLowerCase().includes(lowerQuery) ||
                history.address.toLowerCase().includes(lowerQuery)
        )
    } catch (error) {
        console.error('✗ Lỗi tìm kiếm lịch sử xem:', error)
        throw error
    }
}
