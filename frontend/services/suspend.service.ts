// Suspend Store Service - Calls Next.js API routes which proxy to backend

export interface SuspendStoreRequest {
    storeId: string;
    startAt: string; // yyyy/MM/dd
    endAt?: string | null; // yyyy/MM/dd (optional)
    reason: string;
    force: boolean;
}

export interface SuspendOperator {
    id: string;
    email: string;
    name: string;
    active: boolean;
    role: string;
}

export interface SuspendStoreInfo {
    id: string;
    name: string;
}

export interface SuspendStoreRecord {
    id: string;
    store: SuspendStoreInfo;
    operator: SuspendOperator;
    startAt: string;
    endAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SuspendErrorResponse {
    status: number;
    code: number;
    message: string;
    data: SuspendStoreRecord[];
}

/**
 * Suspend a store for a specified time period
 * Calls: POST /api/store/suspend
 * @param payload - The suspend request payload
 * @returns Promise<SuspendStoreRecord> on success
 * @throws Error with overlapping records if there's a conflict
 */
export async function suspendStore(payload: SuspendStoreRequest): Promise<SuspendStoreRecord> {
    try {
        const response = await fetch('/api/store/suspend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            // If there's a conflict with existing suspends, the error will contain the conflicting records
            if (data.data && Array.isArray(data.data)) {
                const error = new Error(data.message || 'Failed to suspend store');
                (error as any).conflicts = data.data;
                (error as any).statusCode = response.status;
                throw error;
            }
            throw new Error(data.message || 'Failed to suspend store');
        }

        return data.data || data;
    } catch (error) {
        console.error('Error suspending store:', error);
        throw error;
    }
}

/**
 * Get all suspend records for a specific store
 * Calls: GET /api/store/suspend/[storeId]
 * @param storeId - The store ID
 * @returns Promise<SuspendStoreRecord[]> - Array of suspend records
 */
export async function getSuspendRecords(storeId: string): Promise<SuspendStoreRecord[]> {
    try {
        const response = await fetch(`/api/store/suspend/${storeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch suspend records');
        }

        const data = await response.json();
        // Handle both direct array response and wrapped response
        const records = data.data || (Array.isArray(data) ? data : []);
        return Array.isArray(records) ? records : [];
    } catch (error) {
        console.error('Error fetching suspend records:', error);
        throw error;
    }
}

export interface CheckSuspendResponse {
    suspended: boolean;
    reason?: string;
    suspendRecord?: SuspendStoreRecord;
}

/**
 * Check if a store is suspended on a specific date
 * Calls: GET /stores/{storeId}/check-suspend?date={date}
 * @param storeId - The store ID
 * @param date - The date to check in format yyyy/MM/dd (e.g., 2025/12/01)
 * @returns Promise<CheckSuspendResponse> - Indicates if store is suspended on that date
 */
export async function checkStoreSuspendStatus(storeId: string, date: string): Promise<CheckSuspendResponse> {
    try {
        // Format date to yyyy/MM/dd if it's in yyyy-MM-dd format
        const formattedDate = date.includes('-') ? date.split('-').join('/') : date;

        const response = await fetch(`/api/stores/${storeId}/check-suspend?date=${formattedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to check store suspend status');
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error('Error checking store suspend status:', error);
        // Return not suspended on error to avoid breaking the UI
        return { suspended: false };
    }
}
