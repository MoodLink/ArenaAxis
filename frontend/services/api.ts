// API Service layer - nơi tập trung tất cả các API calls
// Giúp dễ dàng quản lý và thay đổi API endpoints

import { Field, Sport, Tournament, CommunityPost, Booking, ChatRoom, ChatMessage, ApiResponse, Review, FieldReviewData, User, UpdateUserData } from '@/types'
import {
    popularFields,
    sports,
    tournaments,
    communityPosts,
    bookingHistory,
    chatRooms,
    chatMessages,
    fieldReviewsData,
    reviewsByField,
    currentUser,
    fieldBookingSlots
} from '@/data/mockData'

// Interface cho Payment API
interface PaymentData {
    accountNumber: string
    ifscCode: string
    name: string
    expiryDate?: string
    cvv?: string
}

interface PaymentResponse {
    success: boolean
    transactionId?: string
    message: string
}

// Base URL cho API - có thể thay đổi tùy environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Utility function để xử lý API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        })

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data.message || 'Có lỗi xảy ra'
            }
        }

        return {
            success: true,
            data: data
        }
    } catch (error) {
        return {
            success: false,
            error: 'Không thể kết nối tới server'
        }
    }
}

// =================
// FIELD SERVICES
// =================

// Lấy danh sách sân phổ biến
export async function getPopularFields(): Promise<Field[]> {
    // Tạm thời import dữ liệu mock, sau này sẽ thay bằng API call
    const { popularFields } = await import('@/data/mockData')
    return popularFields

    // Khi có API, uncomment đoạn code dưới:
    // const result = await apiCall<Field[]>('/fields/popular')
    // return result.success ? result.data! : []
}

// Lấy tất cả sân theo filter
export async function getFields(filters?: {
    sport?: string,
    location?: string,
    priceRange?: string,
    amenities?: string[]
}): Promise<Field[]> {
    const { popularFields } = await import('@/data/mockData')

    if (!filters) return popularFields

    return popularFields.filter(field => {
        // Lọc theo môn thể thao
        if (filters.sport && field.sport !== filters.sport) {
            return false
        }

        // Lọc theo khu vực
        if (filters.location && filters.location !== "all") {
            const matchesLocation = field.location.toLowerCase().includes(filters.location.toLowerCase())
            if (!matchesLocation) return false
        }

        // Lọc theo khoảng giá  
        if (filters.priceRange && filters.priceRange !== "all") {
            const price = field.price
            const matchesPrice =
                (filters.priceRange === "under-200k" && price < 200000) ||
                (filters.priceRange === "200k-400k" && price >= 200000 && price <= 400000) ||
                (filters.priceRange === "400k-600k" && price > 400000 && price <= 600000) ||
                (filters.priceRange === "over-600k" && price > 600000)

            if (!matchesPrice) return false
        }

        // Lọc theo tiện ích
        if (filters.amenities && filters.amenities.length > 0) {
            const hasAmenities = filters.amenities.every(amenity =>
                field.amenities.some(fieldAmenity =>
                    fieldAmenity.toLowerCase().includes(amenity.toLowerCase())
                )
            )
            if (!hasAmenities) return false
        }

        return true
    })

    // API call version:
    // const queryParams = new URLSearchParams(filters as any).toString()
    // const result = await apiCall<Field[]>(`/fields?${queryParams}`)
    // return result.success ? result.data! : []
}

// Lấy chi tiết một sân
export async function getFieldById(id: string): Promise<Field | null> {
    const { popularFields } = await import('@/data/mockData')
    return popularFields.find((field: Field) => field.id === id) || null

    // API call version:
    // const result = await apiCall<Field>(`/fields/${id}`)
    // return result.success ? result.data! : null
}

// Lấy các slot booking cho một sân cụ thể
export async function getFieldBookingSlots(fieldId: string, date?: string): Promise<Array<{
    time: string;
    price: number;
    available: boolean;
    date?: string;
}>> {
    const { fieldBookingSlots } = await import('@/data/mockData')
    return fieldBookingSlots[fieldId] || []

    // API call version:
    // const queryParams = date ? `?date=${date}` : ''
    // const result = await apiCall<Array<any>>(`/fields/${fieldId}/slots${queryParams}`)
    // return result.success ? result.data! : []
}

// =================
// SPORT SERVICES
// =================

// Lấy danh sách môn thể thao
export async function getSports(): Promise<Sport[]> {
    const { sports } = await import('@/data/mockData')
    return sports

    // API call version:
    // const result = await apiCall<Sport[]>('/sports')
    // return result.success ? result.data! : []
}

// =================
// TOURNAMENT SERVICES
// =================

// Lấy danh sách giải đấu
export async function getTournaments(): Promise<Tournament[]> {
    const { tournaments } = await import('@/data/mockData')
    return tournaments

    // API call version:
    // const result = await apiCall<Tournament[]>('/tournaments')
    // return result.success ? result.data! : []
}

// =================
// COMMUNITY SERVICES
// =================

// Lấy bài viết cộng đồng với filtering
export async function getCommunityPosts(filters?: { sport?: string, distance?: string }): Promise<CommunityPost[]> {
    const { communityPosts } = await import('@/data/mockData')

    let filteredPosts = [...communityPosts]

    // Apply sport filter
    if (filters?.sport && filters.sport !== "Tất cả") {
        filteredPosts = filteredPosts.filter(post =>
            post.sport.toLowerCase().includes(filters.sport!.toLowerCase())
        )
    }

    // Apply distance filter (based on location)
    if (filters?.distance && filters.distance !== "Tất cả") {
        // Simple location-based filtering
        if (filters.distance === "< 5km") {
            filteredPosts = filteredPosts.filter(post =>
                post.location?.toLowerCase().includes("q7") ||
                post.location?.toLowerCase().includes("quận 7")
            )
        } else if (filters.distance === "< 10km") {
            filteredPosts = filteredPosts.filter(post =>
                post.location?.toLowerCase().includes("quận") ||
                post.location?.toLowerCase().includes("q")
            )
        }
        // "Tất cả" returns all posts without distance filtering
    }

    return filteredPosts

    // API call version:
    // const queryParams = new URLSearchParams(filters as any).toString()
    // const result = await apiCall<CommunityPost[]>(`/community/posts?${queryParams}`)
    // return result.success ? result.data! : []
}

// Lấy bài viết cộng đồng theo ID
export async function getCommunityPostById(id: string): Promise<CommunityPost | null> {
    try {
        const { communityPosts } = await import('@/data/mockData')
        const post = communityPosts.find(p => p.id === id) || null
        return post
    } catch (error) {
        console.error('Error fetching community post:', error)
        return null
    }
}

// Lấy featured communities
export async function getFeaturedCommunities() {
    const { featuredCommunities } = await import('@/data/mockData')
    return featuredCommunities

    // API call version:
    // const result = await apiCall<any[]>('/community/featured')
    // return result.success ? result.data! : []
}

// Lấy trending topics  
export async function getTrendingTopics() {
    const { trendingTopics } = await import('@/data/mockData')
    return trendingTopics

    // API call version:
    // const result = await apiCall<any[]>('/community/trending')
    // return result.success ? result.data! : []
}

// Lấy chi tiết bài viết cộng đồng (participants, comments, related posts)
export async function getCommunityPostDetail(postId: string, authorName?: string, createdAt?: string) {
    const { getPostDetailMockData } = await import('@/data/mockData')
    return getPostDetailMockData(authorName || "Unknown", createdAt || "")

    // API call version:
    // const result = await apiCall<any>(`/community/posts/${postId}/detail`)
    // return result.success ? result.data! : null
}

// Lấy comments cho bài viết
export async function getCommunityPostComments(postId: string) {
    const detailData = await getCommunityPostDetail(postId)
    return detailData.comments

    // API call version:
    // const result = await apiCall<any[]>(`/community/posts/${postId}/comments`)
    // return result.success ? result.data! : []
}

// Lấy participants cho bài viết  
export async function getCommunityPostParticipants(postId: string) {
    const detailData = await getCommunityPostDetail(postId)
    return {
        participants: detailData.postDetail.participants,
        joinedUsers: detailData.joinedUsers
    }

    // API call version:
    // const result = await apiCall<any>(`/community/posts/${postId}/participants`)
    // return result.success ? result.data! : { participants: [], joinedUsers: [] }
}

// Lấy bài viết liên quan
export async function getRelatedCommunityPosts(postId: string) {
    const detailData = await getCommunityPostDetail(postId)
    return detailData.relatedPosts

    // API call version:
    // const result = await apiCall<any[]>(`/community/posts/${postId}/related`)
    // return result.success ? result.data! : []
}

// Tạo bài viết mới
export async function createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<boolean> {
    // Mock success response
    return true

    // API call version:
    // const result = await apiCall<CommunityPost>('/community/posts', {
    //   method: 'POST',
    //   body: JSON.stringify(post)
    // })
    // return result.success
}

// =================
// BOOKING SERVICES
// =================

// Get sub-courts for a field
export async function getFieldSubCourts(fieldId: string): Promise<Array<{
    id: string;
    name: string;
    type: string;
    color: string;
    rating: number;
    price: number;
}>> {
    // Generate consistent sub-courts based on fieldId
    const courtCount = parseInt(fieldId) <= 3 ? 4 : 6; // Smaller fields have 4 courts, larger have 6
    const colors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-rose-500", "bg-indigo-500"];
    const basePrice = 300000 + (parseInt(fieldId) * 20000); // Price varies by field

    const subCourts = [];
    for (let i = 0; i < courtCount; i++) {
        subCourts.push({
            id: `court-${i + 1}`,
            name: `Sân ${String.fromCharCode(65 + i)}`, // A, B, C, D, E, F
            type: String.fromCharCode(65 + i),
            color: colors[i % colors.length],
            rating: 4.5 + (Math.sin(parseInt(fieldId) + i) * 0.4), // Consistent ratings
            price: basePrice + (i * 40000) // Each court priced differently
        });
    }

    return subCourts;

    // API call version:
    // const result = await apiCall<Array<any>>(`/fields/${fieldId}/sub-courts`)
    // return result.success ? result.data! : []
}

// Get booking grid data for a field on specific date
export async function getFieldBookingGrid(fieldId: string, date: string): Promise<{
    [courtId: string]: { [timeSlot: string]: "available" | "booked" | "locked" | "selected" }
}> {
    const subCourts = await getFieldSubCourts(fieldId);
    const bookingGrid: any = {};

    // Generate time slots from 5:00 to 22:00
    const timeSlots: string[] = [];
    for (let hour = 5; hour <= 22; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
        if (hour < 22) {
            timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
    }

    subCourts.forEach((court) => {
        bookingGrid[court.id] = {};
        timeSlots.forEach((slot, index) => {
            // Create deterministic patterns based on fieldId, courtId, date, and time
            const dateNum = new Date(date).getDate();
            const courtNum = parseInt(court.id.split('-')[1]);
            const seed = parseInt(fieldId) + courtNum + dateNum + index;

            const isBooked = (seed % 3) === 0;
            const isLocked = (seed % 11) === 0;

            if (isLocked) {
                bookingGrid[court.id][slot] = "locked";
            } else if (isBooked) {
                bookingGrid[court.id][slot] = "booked";
            } else {
                bookingGrid[court.id][slot] = "available";
            }
        });
    });

    return bookingGrid;

    // API call version:
    // const result = await apiCall<any>(`/fields/${fieldId}/booking-grid?date=${date}`)
    // return result.success ? result.data! : {}
}

// Lấy lịch sử đặt sân
export async function getBookingHistory(status?: string): Promise<Booking[]> {
    const { bookingHistory } = await import('@/data/mockData')

    if (status && status !== 'Tất cả') {
        return bookingHistory.filter(booking => booking.status === status)
    }

    return bookingHistory

    // API call version:
    // const queryParams = status ? `?status=${status}` : ''
    // const result = await apiCall<Booking[]>(`/bookings${queryParams}`)
    // return result.success ? result.data! : []
}

// Đặt sân mới
export async function createBooking(bookingData: any): Promise<boolean> {
    // Mock success response
    return true

    // API call version:
    // const result = await apiCall<Booking>('/bookings', {
    //   method: 'POST',
    //   body: JSON.stringify(bookingData)
    // })
    // return result.success
}

// Lấy thông tin đặt sân theo ID
export async function getBookingById(id: string): Promise<Booking | null> {
    try {
        const booking = bookingHistory.find(b => b.id === id) || null
        return booking
    } catch (error) {
        console.error('Error fetching booking:', error)
        return null
    }
}

// Hủy đặt sân
export async function cancelBooking(bookingId: string): Promise<boolean> {
    // Mock success response
    return true

    // API call version:
    // const result = await apiCall<void>(`/bookings/${bookingId}/cancel`, {
    //   method: 'POST'
    // })
    // return result.success
}

// =================
// CHAT SERVICES
// =================

// Lấy danh sách phòng chat
export async function getChatRooms(): Promise<ChatRoom[]> {
    const { chatRooms } = await import('@/data/mockData')
    return chatRooms

    // API call version:
    // const result = await apiCall<ChatRoom[]>('/chat/rooms')
    // return result.success ? result.data! : []
}

// Lấy tin nhắn trong phòng
export async function getChatMessages(roomId: string): Promise<ChatMessage[]> {
    const { chatMessages } = await import('@/data/mockData')
    return chatMessages

    // API call version:
    // const result = await apiCall<ChatMessage[]>(`/chat/rooms/${roomId}/messages`)
    // return result.success ? result.data! : []
}

// Lấy danh sách người dùng online
export async function getOnlineUsers(): Promise<Array<{ id: string; name: string; avatar: string; status: string }>> {
    const { onlineUsers } = await import('@/data/mockData')
    return onlineUsers

    // API call version:
    // const result = await apiCall<Array<any>>('/chat/online-users')
    // return result.success ? result.data! : []
}

// Lấy thông tin user hiện tại cho chat
export async function getCurrentChatUser(): Promise<{ id: string; name: string; avatar: string }> {
    // Mock current user - in real app this would come from auth context
    return {
        id: "current-user",
        name: "Bạn",
        avatar: "YU"
    }

    // API call version:
    // const result = await apiCall<any>('/auth/me')
    // return result.success ? result.data! : { id: "anonymous", name: "Anonymous", avatar: "?" }
}

// Gửi tin nhắn
export async function sendMessage(roomId: string, content: string): Promise<boolean> {
    // Mock success response
    return true

    // API call version:
    // const result = await apiCall<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
    //   method: 'POST',
    //   body: JSON.stringify({ content })
    // })
    // return result.success
}

// === PAYMENT SERVICES ===
// API liên quan đến thanh toán

// Xử lý thanh toán
export async function processPayment(
    bookingId: string,
    paymentData: PaymentData,
    method: string
): Promise<PaymentResponse> {
    // Mock processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Giả lập xử lý thanh toán với 90% success rate
    const success = Math.random() > 0.1

    if (success) {
        return {
            success: true,
            transactionId: `TXN_${Date.now()}`,
            message: "Thanh toán thành công!"
        }
    } else {
        return {
            success: false,
            message: "Thanh toán thất bại. Vui lòng thử lại."
        }
    }

    // API call version:
    // const result = await apiCall<PaymentResponse>('/payment/process', {
    //   method: 'POST',
    //   body: JSON.stringify({ bookingId, paymentData, method })
    // })
    // return result.data!
}

// Lấy lịch sử thanh toán
export async function getPaymentHistory(userId: string): Promise<any[]> {
    const mockPaymentHistory = [
        {
            id: "PAY_001",
            bookingId: "1",
            amount: 650000,
            method: "card",
            status: "completed",
            transactionId: "TXN_1699123456789",
            createdAt: "2024-11-05T10:30:00Z"
        },
        {
            id: "PAY_002",
            bookingId: "2",
            amount: 1200000,
            method: "bank",
            status: "pending",
            transactionId: "TXN_1699234567890",
            createdAt: "2024-11-08T15:45:00Z"
        }
    ]

    return mockPaymentHistory

    // API call version:
    // const result = await apiCall<any[]>(`/payment/history/${userId}`)
    // return result.success ? result.data! : []
}

// === TOURNAMENTS SERVICES ===
// API liên quan đến giải đấu

// Lấy chi tiết giải đấu
export async function getTournamentById(id: string): Promise<Tournament | null> {
    const { tournaments } = await import('@/data/mockData')
    return tournaments.find((tournament: Tournament) => tournament.id?.toString() === id) || null

    // API call version:
    // const result = await apiCall<Tournament>(`/tournaments/${id}`)
    // return result.success ? result.data! : null
}

// Đăng ký tham gia giải đấu
export async function registerTournament(tournamentId: string, userId: string): Promise<boolean> {
    // Mock success response
    return true

    // API call version:
    // const result = await apiCall<any>('/tournaments/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ tournamentId, userId })
    // })
    // return result.success
}

// === REVIEWS SERVICES ===
// API liên quan đến đánh giá

// Lấy đánh giá theo field ID
export async function getFieldReviews(fieldId: string): Promise<{ fieldData: FieldReviewData | null, reviews: Review[] }> {
    try {
        const fieldData = fieldReviewsData[fieldId] || null
        const reviews = reviewsByField[fieldId] || []

        return { fieldData, reviews }
    } catch (error) {
        console.error('Error fetching field reviews:', error)
        return { fieldData: null, reviews: [] }
    }
}

// Thêm đánh giá mới
export async function addReview(fieldId: string, reviewData: Omit<Review, 'id' | 'fieldId'>): Promise<boolean> {
    try {
        // Trong production, sẽ gọi API để lưu đánh giá
        // const result = await apiCall(`/fields/${fieldId}/reviews`, {
        //     method: 'POST',
        //     body: JSON.stringify(reviewData)
        // })
        // return result.success

        // Mock implementation
        return true
    } catch (error) {
        console.error('Error adding review:', error)
        return false
    }
}

// === USER/PROFILE SERVICES ===
// API liên quan đến user profile

// Lấy thông tin user hiện tại
export async function getCurrentUser(): Promise<User | null> {
    try {
        const { currentUser } = await import('@/data/mockData')
        return currentUser
    } catch (error) {
        console.error('Error fetching current user:', error)
        return null
    }

    // API call version:
    // const result = await apiCall<User>('/user/profile')
    // return result.success ? result.data! : null
}

// Cập nhật thông tin user
export async function updateUserProfile(userData: UpdateUserData): Promise<boolean> {
    try {
        // Mock implementation - trong production sẽ gọi API
        // const result = await apiCall<User>('/user/profile', {
        //     method: 'PUT',
        //     body: JSON.stringify(userData)
        // })
        // return result.success

        return true
    } catch (error) {
        console.error('Error updating user profile:', error)
        return false
    }
}

// Thay đổi mật khẩu
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
        // Mock implementation
        // const result = await apiCall<void>('/user/change-password', {
        //     method: 'POST',
        //     body: JSON.stringify({ currentPassword, newPassword })
        // })
        // return result.success

        return true
    } catch (error) {
        console.error('Error changing password:', error)
        return false
    }
}

// Upload avatar
export async function uploadAvatar(file: File): Promise<string | null> {
    try {
        // Mock implementation - trả về URL ảnh
        // const formData = new FormData()
        // formData.append('avatar', file)
        // const result = await apiCall<{url: string}>('/user/avatar', {
        //     method: 'POST',
        //     body: formData
        // })
        // return result.success ? result.data!.url : null

        return "/placeholder-user.jpg"
    } catch (error) {
        console.error('Error uploading avatar:', error)
        return null
    }
}

// ===== STATIC DATA SERVICES =====
// Services cung cấp các data tĩnh để tránh import trực tiếp mockData

// Lấy danh sách tabs booking
export const getBookingTabs = async (): Promise<{ id: string; label: string; icon: any; count: number }[]> => {
    const { bookingTabs } = await import("@/data/mockData")
    return bookingTabs
}

// Lấy danh sách sport options
export const getSportOptions = async (): Promise<{ value: string; label: string }[]> => {
    const { sportOptions } = await import("@/data/mockData")
    return sportOptions
}

// Lấy booking status mapping
export const getBookingStatusMap = async (): Promise<Record<string, string>> => {
    const { bookingStatusMap } = await import("@/data/mockData")
    return bookingStatusMap
}
