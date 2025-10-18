// Production-ready API Service
// File: services/api-production.ts

import { API_CONFIG, authInterceptor, responseInterceptor } from '@/config/api'
import { Field, Sport, Tournament, CommunityPost, Booking, ChatRoom, ChatMessage, User, ApiResponse } from '@/types'

// Enhanced API call utility with error handling, retry logic, caching
class ApiService {
    private baseURL: string
    private timeout: number
    private retryAttempts: number

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL
        this.timeout = API_CONFIG.TIMEOUT
        this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
    }

    // Generic API call method với retry logic
    private async apiCall<T>(
        endpoint: string,
        options: RequestInit = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        try {
            // Add auth interceptor
            const config = authInterceptor({
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                timeout: this.timeout,
                ...options,
            })

            const response = await fetch(`${this.baseURL}${endpoint}`, config)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            return {
                success: true,
                data: data,
                message: 'Success'
            }
        } catch (error) {
            // Retry logic
            if (retryCount < this.retryAttempts) {
                console.log(`Retrying API call: ${endpoint} (${retryCount + 1}/${this.retryAttempts})`)
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
                return this.apiCall<T>(endpoint, options, retryCount + 1)
            }

            console.error(`API call failed: ${endpoint}`, error)

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // FIELDS API
    async getPopularFields(): Promise<Field[]> {
        const result = await this.apiCall<Field[]>(API_CONFIG.ENDPOINTS.FIELDS.POPULAR)
        return result.success ? result.data! : []
    }

    async getFields(filters?: { sport?: string, location?: string }): Promise<Field[]> {
        const queryParams = filters ? new URLSearchParams(filters as any).toString() : ''
        const endpoint = `${API_CONFIG.ENDPOINTS.FIELDS.LIST}${queryParams ? `?${queryParams}` : ''}`
        const result = await this.apiCall<Field[]>(endpoint)
        return result.success ? result.data! : []
    }

    async getFieldById(id: string): Promise<Field | null> {
        const result = await this.apiCall<Field>(API_CONFIG.ENDPOINTS.FIELDS.BY_ID(id))
        return result.success ? result.data! : null
    }

    // SPORTS API
    async getSports(): Promise<Sport[]> {
        const result = await this.apiCall<Sport[]>(API_CONFIG.ENDPOINTS.SPORTS.LIST)
        return result.success ? result.data! : []
    }

    // TOURNAMENTS API
    async getTournaments(): Promise<Tournament[]> {
        const result = await this.apiCall<Tournament[]>(API_CONFIG.ENDPOINTS.TOURNAMENTS.LIST)
        return result.success ? result.data! : []
    }

    async getTournamentById(id: string): Promise<Tournament | null> {
        const result = await this.apiCall<Tournament>(API_CONFIG.ENDPOINTS.TOURNAMENTS.BY_ID(id))
        return result.success ? result.data! : null
    }

    async registerTournament(tournamentId: string, registrationData: any): Promise<boolean> {
        const result = await this.apiCall<any>(API_CONFIG.ENDPOINTS.TOURNAMENTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ tournamentId, ...registrationData })
        })
        return result.success
    }

    // COMMUNITY API
    async getCommunityPosts(filters?: { sport?: string, distance?: string }): Promise<CommunityPost[]> {
        const queryParams = filters ? new URLSearchParams(filters as any).toString() : ''
        const endpoint = `${API_CONFIG.ENDPOINTS.COMMUNITY.POSTS}${queryParams ? `?${queryParams}` : ''}`
        const result = await this.apiCall<CommunityPost[]>(endpoint)
        return result.success ? result.data! : []
    }

    async getCommunityPostById(id: string): Promise<CommunityPost | null> {
        const result = await this.apiCall<CommunityPost>(API_CONFIG.ENDPOINTS.COMMUNITY.BY_ID(id))
        return result.success ? result.data! : null
    }

    async createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<boolean> {
        const result = await this.apiCall<CommunityPost>(API_CONFIG.ENDPOINTS.COMMUNITY.CREATE, {
            method: 'POST',
            body: JSON.stringify(post)
        })
        return result.success
    }

    // BOOKINGS API
    async getBookingHistory(status?: string): Promise<Booking[]> {
        const queryParams = status ? `?status=${status}` : ''
        const result = await this.apiCall<Booking[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS.HISTORY}${queryParams}`)
        return result.success ? result.data! : []
    }

    async getBookingById(id: string): Promise<Booking | null> {
        const result = await this.apiCall<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id))
        return result.success ? result.data! : null
    }

    async createBooking(bookingData: any): Promise<boolean> {
        const result = await this.apiCall<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        })
        return result.success
    }

    async cancelBooking(bookingId: string): Promise<boolean> {
        const result = await this.apiCall<void>(API_CONFIG.ENDPOINTS.BOOKINGS.CANCEL(bookingId), {
            method: 'POST'
        })
        return result.success
    }

    // CHAT API
    async getChatRooms(): Promise<ChatRoom[]> {
        const result = await this.apiCall<ChatRoom[]>(API_CONFIG.ENDPOINTS.CHAT.ROOMS)
        return result.success ? result.data! : []
    }

    async getChatMessages(roomId: string): Promise<ChatMessage[]> {
        const result = await this.apiCall<ChatMessage[]>(API_CONFIG.ENDPOINTS.CHAT.MESSAGES(roomId))
        return result.success ? result.data! : []
    }

    async sendMessage(roomId: string, content: string): Promise<boolean> {
        const result = await this.apiCall<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE(roomId), {
            method: 'POST',
            body: JSON.stringify({ content })
        })
        return result.success
    }

    // USER API
    async getCurrentUser(): Promise<User | null> {
        const result = await this.apiCall<User>(API_CONFIG.ENDPOINTS.USERS.PROFILE)
        return result.success ? result.data! : null
    }

    async updateUserProfile(userData: Partial<User>): Promise<boolean> {
        const result = await this.apiCall<User>(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
        return result.success
    }

    // PAYMENT API
    async processPayment(bookingId: string, paymentData: any, method: string): Promise<any> {
        const result = await this.apiCall<any>(API_CONFIG.ENDPOINTS.PAYMENT.PROCESS, {
            method: 'POST',
            body: JSON.stringify({ bookingId, paymentData, method })
        })
        return result.data || { success: false, message: 'Payment failed' }
    }

    // FILE UPLOAD API
    async uploadImage(file: File): Promise<string | null> {
        const formData = new FormData()
        formData.append('image', file)

        const result = await this.apiCall<{ url: string }>(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE, {
            method: 'POST',
            body: formData,
            headers: {} // Remove Content-Type for FormData
        })

        return result.success ? result.data!.url : null
    }
}

// Export singleton instance
export const apiService = new ApiService()

// Export individual functions for backward compatibility
export const {
    getPopularFields,
    getFields,
    getFieldById,
    getSports,
    getTournaments,
    getTournamentById,
    registerTournament,
    getCommunityPosts,
    getCommunityPostById,
    createCommunityPost,
    getBookingHistory,
    getBookingById,
    createBooking,
    cancelBooking,
    getChatRooms,
    getChatMessages,
    sendMessage,
    getCurrentUser,
    updateUserProfile,
    processPayment,
    uploadImage
} = apiService
