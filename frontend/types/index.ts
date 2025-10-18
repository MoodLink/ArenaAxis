// Định nghĩa các interface cho dữ liệu ứng dụng
// Giúp TypeScript kiểm tra kiểu dữ liệu và IDE hỗ trợ autocomplete

// Interface cho thông tin sân thể thao
export interface Field {
    id: string // Thay đổi từ number sang string để đồng bộ
    name: string
    location: string
    price: number // Thay đổi từ string sang number
    rating: number
    image: string
    sport: string // Bắt buộc
    amenities: string[] // Bắt buộc
    description: string // Thêm description
    status: "available" | "unavailable" | "maintenance" // Trạng thái hoạt động
    openingHours: string // Giờ mở cửa
    closingHours: string // Giờ đóng cửa
    surfaceType: string // Loại bề mặt (cỏ nhân tạo, cỏ tự nhiên, etc.)
    capacity: string // Sức chứa (11vs11, 7vs7, etc.)
    phone: string // Số điện thoại liên hệ
    email: string // Email liên hệ
    reviewCount: number // Số lượng đánh giá
    isVerified: boolean // Trạng thái xác minh
}

// Interface cho các môn thể thao
export interface Sport {
    id: string // Thêm id
    name: string
    icon: string
    description: string // Thêm description
    fieldCount: number // Thêm fieldCount
    image: string
}

// Interface cho giải đấu
export interface Tournament {
    id: string // Thay đổi từ number sang string
    name: string
    sport: string // Thêm sport
    startDate: string // Bắt buộc
    endDate: string // Bắt buộc
    location: string // Bắt buộc
    prizePool: number // Thêm prizePool
    maxTeams: number // Thêm maxTeams
    currentTeams: number // Thêm currentTeams
    image: string
    description: string // Bắt buộc
}

// Interface cho participant trong chat
export interface ChatParticipant {
    id: string
    name: string
    avatar: string
    isOnline: boolean
}

// Interface cho tin nhắn trong chat
export interface ChatMessage {
    id: string // Thay đổi từ number sang string
    text: string // Thay đổi từ content sang text
    senderId: string // Thay đổi từ sender sang senderId
    roomId: string // Thêm roomId
    timestamp: Date // Thay đổi từ time sang timestamp
    type: "text" | "image" | "file" // Thêm type
}

// Interface cho phòng chat
export interface ChatRoom {
    id: string // Thay đổi từ number sang string
    name: string
    type: "group" | "private" // Thêm type
    participants: ChatParticipant[] // Thay đổi structure
    lastMessage: {
        id: string
        text: string
        senderId: string
        timestamp: Date
    } // Thay đổi structure
    unreadCount: number // Thay đổi từ unread sang unreadCount
    hasUnread: boolean // Thêm hasUnread
    memberCount: number // Thêm memberCount
}

// Interface cho author trong community
export interface CommunityAuthor {
    id: string
    name: string
    avatar: string
}

// Interface cho bài viết cộng đồng
export interface CommunityPost {
    id: string // Thay đổi từ number sang string
    title: string
    content: string // Thêm content
    author: CommunityAuthor // Sửa structure
    sport: string
    location?: string // Thêm location
    date?: Date // Thêm date
    time?: string // Thêm time
    level?: string // Thêm level
    participants?: number // Thêm participants
    maxParticipants?: number // Thêm maxParticipants
    cost?: string // Thêm cost
    likes: number
    comments: number
    tags: string[] // Thêm tags
    createdAt: string // Thay đổi từ timeAgo
    status?: string // Thêm status (active, hot, urgent)
    urgency?: string // Thêm urgency (today, regular, deadline, urgent, weekend, upcoming)
}

// Interface cho lịch sử đặt sân
export interface Booking {
    id: string // Thay đổi từ number sang string
    fieldId: string // Thêm fieldId
    fieldName: string // Thay đổi từ name sang fieldName
    userId: string // Thêm userId
    date: string
    time: string
    duration: number // Thay đổi sang number (minutes)
    status: "confirmed" | "pending" | "completed" | "cancelled" // Sửa values
    totalPrice: number // Thay đổi từ price sang totalPrice (number)
    location?: string // Thêm location (optional)
    court?: string // Thêm court (optional)
    image?: string // Thêm image (optional)
}

// Interface cho user
export interface User {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    bio?: string
    location?: string
    favoriteSports: string[]
    notifications: {
        booking: boolean
        tournament: boolean
        community: boolean
        email: boolean
        push: boolean
    }
    stats: {
        totalBookings: number
        totalTournaments: number
        totalPosts: number
    }
    createdAt: string
}

// Interface cho API response chung
export interface ApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

// Interface cho review/đánh giá
export interface Review {
    id: string
    fieldId: string
    user: string
    avatar: string
    rating: number
    comment: string
    timeAgo: string
    images: string[]
}

// Interface cho dữ liệu review của sân
export interface FieldReviewData {
    name: string
    rating: number
    totalReviews: number
    ratingDistribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

// Interface cho Update User Profile
export interface UpdateUserData {
    name?: string
    email?: string
    phone?: string
    bio?: string
    location?: string
    favoriteSports?: string[]
    notifications?: Partial<User['notifications']>
}

// Interface cho online user trong chat
export interface OnlineUser {
    id: string
    name: string
    avatar: string
    status: "online" | "away" | "busy"
}

// Interface cho booking tab
export interface BookingTab {
    id: string
    label: string
    icon: any
    count: number
}

// Interface cho booking stats
export interface BookingStats {
    totalBookings: number
    completedBookings: number
}

// Interface cho Contact Information
export interface ContactInfo {
    id: string
    title: string
    description: string
    address: string
    phone: string[]
    email: string[]
    workingHours: {
        weekdays: string
        weekends: string
    }
    socialMedia: {
        facebook: string
        instagram: string
        twitter: string
        youtube: string
    }
}

// Interface cho Contact Form Data
export interface ContactFormData {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    category: "general" | "booking" | "support" | "partnership" | "complaint"
}

// Interface cho FAQ
export interface FAQ {
    id: string
    question: string
    answer: string
    category: "booking" | "payment" | "general" | "tournament" | "account"
    isPopular: boolean
}

// Interface cho Office Location
export interface OfficeLocation {
    id: string
    name: string
    address: string
    coordinates: {
        lat: number
        lng: number
    }
    phone: string
    email: string
    type: "main" | "branch" | "partner"
    workingHours?: string[]
    isMain?: boolean
}

// Interface cho User Settings
export interface UserSettings {
    theme: "light" | "dark" | "auto"
    language: "vi" | "en"
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    eventReminders: boolean
    weeklyDigest: boolean
}

// Interface cho Profile Activity
export interface ProfileActivity {
    id: string
    type: "booking" | "tournament" | "community" | "review" | "achievement"
    title: string
    description: string
    date: string
    icon: string
    status?: "completed" | "pending" | "cancelled"
}

// Interface cho User Achievement
export interface UserAchievement {
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
    progress: number
    maxProgress: number
    category: "booking" | "social" | "tournament" | "loyalty"
}
