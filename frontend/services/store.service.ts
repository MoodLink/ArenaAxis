// File: services/store.service.ts
// Service layer for Store API - Using Next.js API Routes as Proxy

export interface StoreInfo {
    id: string;
    name: string;
    address?: string;
    introduction?: string;
    active?: boolean;
    approved?: boolean;
}

export interface StoreResponse {
    message: string;
    data: StoreInfo;
}

const API_BASE_URL = '/api/store';

export class StoreService {
    /**
     * Get current user's store
     */
    static async getMyStore(token?: string): Promise<StoreInfo | null> {
        try {
            const headers: any = {
                'Content-Type': 'application/json',
            };

            // Add auth token if provided
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                console.error('Failed to fetch store:', response.statusText);
                return null;
            }

            const responseData = await response.json();
            return responseData.data || responseData;
        } catch (error) {
            console.error('Error fetching store:', error);
            return null;
        }
    }

    /**
     * Get store ID from localStorage or session
     */
    static getStoreIdFromStorage(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            // Try to get from localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                return user.storeId || user.store_id || user.id;
            }

            // Try to get from sessionStorage
            const storeId = sessionStorage.getItem('storeId');
            if (storeId) return storeId;

            return null;
        } catch (error) {
            console.error('Error getting store ID from storage:', error);
            return null;
        }
    }

    /**
     * Get auth token from localStorage
     */
    static getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            const token = localStorage.getItem('token') ||
                localStorage.getItem('authToken') ||
                sessionStorage.getItem('token');
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }
}
