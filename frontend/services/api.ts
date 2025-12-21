// =================
// AUTH SERVICES
// =================

// Đăng nhập user
export async function loginUser(email: string, password: string): Promise<{ token?: string; user?: any; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/auth/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.message || data.error || `Lỗi ${response.status}: ${response.statusText}` };
        }
        return { token: data.token, user: data.user };
    } catch (err: any) {
        return { error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}

// Đăng nhập admin
export async function loginAdmin(email: string, password: string): Promise<{ token?: string; user?: any; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/auth/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.message || data.error || `Lỗi ${response.status}: ${response.statusText}` };
        }
        return { token: data.token, user: data.user };
    } catch (err: any) {
        return { error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}


// Đăng nhập Client
export async function loginClient(email: string, password: string): Promise<{ token?: string; user?: any; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/auth/client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.message || data.error || `Lỗi ${response.status}: ${response.statusText}` };
        }
        return { token: data.token, user: data.user };
    } catch (err: any) {
        return { error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}


// Đăng ký user
export async function signupUser({ name, email, password, phone }: { name: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        if (!response.ok) {
            let errorMessage = 'Đăng ký thất bại';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
            }
            return { success: false, error: errorMessage };
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}

// Refresh token
export async function refreshToken(token: string): Promise<{ token?: string; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.message || data.error || `Lỗi ${response.status}: ${response.statusText}` };
        }
        return { token: data.token };
    } catch (err: any) {
        return { error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}

// Logout
export async function logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('http://www.executexan.store/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.message || 'Đăng xuất thất bại' };
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: 'Không thể kết nối đến server. Vui lòng thử lại.' };
    }
}

// =================
// USER SERVICES
// =================

// Lấy thông tin user theo ID
export async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`http://www.executexan.store/users/${id}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (err: any) {
        console.error('Error fetching user:', err);
        return null;
    }
}

// Lấy danh sách users với phân trang
export async function getUsers(page: number = 0, pageSize: number = 30): Promise<User[]> {
    try {
        const response = await fetch(`http://www.executexan.store/users?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    } catch (err: any) {
        console.error('Error fetching users:', err);
        return [];
    }
}

// Toggle active status của user (Admin only)
export async function toggleUserActive(id: string): Promise<User | null> {
    try {
        const response = await fetch(`http://www.executexan.store/users/${id}/toggle_active`, {
            method: 'PUT'
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (err: any) {
        console.error('Error toggling user active status:', err);
        return null;
    }
}

// Xóa user (Admin only)
export async function deleteUser(id: string): Promise<boolean> {
    try {
        const response = await fetch(`http://www.executexan.store/users/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (err: any) {
        console.error('Error deleting user:', err);
        return false;
    }
}

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
    try {
        // Gọi proxy route thay vì backend trực tiếp (avoid CORS)
        const response = await fetch('/api/fields', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        let allFields = Array.isArray(data) ? data : data.data || []

        console.log('Raw fields from API:', allFields) // Debug - check status field name

        // Fetch Store data để lấy introduction, start_time, end_time cho mỗi field
        const storeIds = [...new Set(allFields.map((f: any) => f.storeId).filter(Boolean))]
        const storeMap = new Map()

        for (const storeId of storeIds) {
            try {
                const storeResponse = await fetch(`http://www.executexan.store/stores/${storeId}`)
                if (storeResponse.ok) {
                    const storeData = await storeResponse.json()
                    const store = storeData.data || storeData
                    console.log(`Store ${storeId} data:`, store) // Debug
                    storeMap.set(storeId, store)
                }
            } catch (error) {
                console.warn(`Could not fetch store ${storeId}:`, error)
            }
        }

        // Map Store data to fields
        allFields = allFields.map((field: any) => {
            const mappedField = { ...field }

            // Backend trả về "activeStatus" (boolean) - cần convert sang string
            if (typeof field.activeStatus === 'boolean') {
                // Backend: activeStatus = true → 'available', false → 'unavailable'
                const statusString = field.activeStatus === true ? 'available' : 'unavailable'
                mappedField.activeStatus = statusString
                console.log(` Field "${field.name}": activeStatus=${field.activeStatus} (boolean) → "${statusString}" (string)`)
            }

            // Fetch và map Store data
            if (field.storeId && storeMap.has(field.storeId)) {
                const store = storeMap.get(field.storeId)

                // Map introduction
                if (store.introduction) {
                    mappedField.description = store.introduction
                }

                // Map startTime - backend trả về string "HH:mm:ss"
                if (store.startTime && typeof store.startTime === 'string') {
                    mappedField.openingHours = store.startTime.substring(0, 5) // "07:00:00" → "07:00"
                }

                // Map endTime - backend trả về string "HH:mm:ss"
                if (store.endTime && typeof store.endTime === 'string') {
                    mappedField.closingHours = store.endTime.substring(0, 5) // "21:00:00" → "21:00"
                }

                console.log(` Store data mapped for "${field.name}": times="${mappedField.openingHours} - ${mappedField.closingHours}"`)
            }
            return mappedField
        })

        if (!filters) return allFields

        return allFields.filter((field: any) => {
            // Lọc theo môn thể thao
            if (filters.sport && field.sport_name !== filters.sport) {
                return false
            }

            // Lọc theo khu vực
            if (filters.location && filters.location !== "all") {
                const matchesLocation = field.address?.toLowerCase().includes(filters.location.toLowerCase()) || false
                if (!matchesLocation) return false
            }

            // Lọc theo khoảng giá
            if (filters.priceRange && filters.priceRange !== "all") {
                const price = (field.defaultPrice || 0) as number
                const matchesPrice =
                    (filters.priceRange === "under-200k" && price < 200000) ||
                    (filters.priceRange === "200k-400k" && price >= 200000 && price <= 400000) ||
                    (filters.priceRange === "400k-600k" && price > 400000 && price <= 600000) ||
                    (filters.priceRange === "over-600k" && price > 600000)

                if (!matchesPrice) return false
            }

            return true
        })
    } catch (error) {
        console.error('Error fetching fields:', error)
        // Fallback để mock data nếu backend fail
        try {
            const { popularFields } = await import('@/data/mockData')
            return popularFields
        } catch {
            return []
        }
    }
}

// Lấy chi tiết một sân
export async function getFieldById(id: string): Promise<Field | null> {
    try {
        // Gọi proxy route thay vì backend trực tiếp
        // Trong Server Component, cần URL đầy đủ
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/fields/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // No caching - rely on React Query
            cache: 'no-cache'
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        let field = Array.isArray(data) ? data[0] : data.data || data

        console.log('Field detail from API:', field) // Debug

        // Backend trả về "activeStatus" (boolean) - convert sang string
        if (typeof field.activeStatus === 'boolean') {
            const statusString = field.activeStatus === true ? 'available' : 'unavailable'
            field.activeStatus = statusString
            console.log(` Field "${field.name}": activeStatus=${field.activeStatus} (boolean) → "${statusString}" (string)`)
        }

        // Fetch Store data để lấy introduction, startTime, endTime, owner info
        if (field.storeId) {
            try {
                const storeResponse = await fetch(`http://www.executexan.store/stores/${field.storeId}`)
                if (storeResponse.ok) {
                    const storeData = await storeResponse.json()
                    const store = storeData.data || storeData

                    // Map introduction
                    if (store.introduction) {
                        field.description = store.introduction
                    }

                    // Map startTime - backend trả về string "HH:mm:ss"
                    if (store.startTime && typeof store.startTime === 'string') {
                        field.openingHours = store.startTime.substring(0, 5) // "07:00:00" → "07:00"
                    }

                    // Map endTime - backend trả về string "HH:mm:ss"
                    if (store.endTime && typeof store.endTime === 'string') {
                        field.closingHours = store.endTime.substring(0, 5) // "21:00:00" → "21:00"
                    }

                    // Map owner contact info (if available)
                    if (store.owner) {
                        field.phone = store.owner.phone || field.phone
                        field.email = store.owner.email || field.email
                    }

                    // Map store location
                    if (store.address) {
                        field.address = store.address
                    }

                    console.log(` Store data mapped for "${field.name}": times="${field.openingHours} - ${field.closingHours}", contact="${field.phone}"`)
                }
            } catch (error) {
                console.warn(`Could not fetch store ${field.storeId}:`, error)
            }
        }

        // Add default values for missing fields
        if (!field.capacity) {
            field.capacity = "22 người" // Default capacity
        }
        if (!field.surfaceType) {
            // Random surface type based on sport
            const surfaceTypes = ["Cỏ nhân tạo", "Cỏ tự nhiên", "Sân xi măng", "Sàn gỗ", "Sân đất nện"]
            field.surfaceType = surfaceTypes[Math.floor(Math.random() * surfaceTypes.length)]
        }
        if (!field.reviewCount) {
            field.reviewCount = Math.floor(Math.random() * 100) + 10 // Random 10-110
        }

        return field
    } catch (error) {
        console.error('Error fetching field by ID:', error)
        // Fallback để mock data
        try {
            const { popularFields } = await import('@/data/mockData')
            return popularFields.find((field: Field) => field.id === id || field._id === id) || null
        } catch {
            return null
        }
    }
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

// Lấy danh sách môn thể thao từ API backend
export async function getSports(): Promise<Sport[]> {
    try {
        // Gọi trực tiếp API backend (bỏ qua apiCall để lấy dữ liệu thật)
        const response = await fetch('http://www.executexan.store/sports');
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
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
        timeSlots.forEach((slot) => {
            // TODO: All slots are available for now - waiting for real booking API
            bookingGrid[court.id][slot] = "available";
        });
    });

    return bookingGrid;

    // API call version (when real API is ready):
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
// MESSAGE SERVICES (sử dụng message.service.ts)
// =================

// Import từ message service
import { getConversations, getMessages } from '@/services/message.service'

// Re-export để backward compatibility
export { getConversations, getMessages }

// =================
// LEGACY CHAT SERVICES (cũ - được thay thế)
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
// export async function sendMessage(roomId: string, content: string): Promise<boolean> {
// Mock success response
// return true

// API call version:
// const result = await apiCall<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
//   method: 'POST',
//   body: JSON.stringify({ content })
// })
// return result.success
// }

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
