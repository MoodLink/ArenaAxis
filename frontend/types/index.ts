// Định nghĩa các interface cho dữ liệu ứng dụng
// Giúp TypeScript kiểm tra kiểu dữ liệu và IDE hỗ trợ autocomplete

// Interface cho thông tin sân thể thao
export interface Field {
    // Backend primary fields
    _id: string // MongoDB ID từ backend
    name: string // Tên sân
    sportId: string // ID môn thể thao
    sport_name?: string // Tên môn thể thao
    storeId: string // ID store quản lý sân
    address: string // Địa chỉ từ backend
    avatar?: string // Hình ảnh đại diện sân
    cover_image?: string // Hình ảnh bìa sân
    defaultPrice: string // Giá mặc định từ backend
    rating?: number // Đánh giá sân
    activeStatus?: string | boolean // Backend trả về boolean, frontend convert sang 'available' | 'unavailable'
    createdAt?: string // Từ entity
    updatedAt?: string // Từ entity

    // Frontend mapping/alias fields
    id?: string // Alias cho _id
    image?: string // Alias cho avatar
    active?: boolean // Alias cho activeStatus
    price?: number // Parsed từ defaultPrice
    location?: string // Alias cho address

    // Store information (lấy từ Store data)
    store?: Store // Thông tin store quản lý
    description?: string // Mô tả từ store
    openingHours?: string // Giờ mở cửa từ store
    closingHours?: string // Giờ đóng cửa từ store

    // User information (lấy từ Owner/User data)
    owner?: User // Chủ store - lấy phone/email từ đây
    phone?: string // Số điện thoại từ user.phone
    email?: string // Email từ user.email

    // Mock/Optional fields
    sport?: Sport // Thêm từ Field.java entity
    amenities?: string[] // Tiện ích
    status?: "available" | "unavailable" | "maintenance" // Trạng thái
    surfaceType?: string // Loại bề mặt
    capacity?: string // Sức chứa
    reviewCount?: number // Số lượng đánh giá
    isVerified?: boolean // Trạng thái xác minh
    fieldPrices?: FieldPrice[] // Bảng giá chi tiết
}

// Interface cho các môn thể thao (từ SportResponse DTO)
export interface Sport {
    id: string
    name: string
    nameEn: string // Từ SportResponse

    // Future fields (khi SportResponse DTO mở rộng):
    icon?: string
    // description?: string
    // fieldCount?: number
    image?: string // Thêm cho frontend UI
}

// Interface cho giải đấu (DEPRECATED - Thay bằng SportsNews)
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

// Interface cho tin tức thể thao (từ NewsAPI)
export interface SportsNews {
    id: string
    title: string
    description: string
    content: string
    url: string
    urlToImage: string
    publishedAt: string
    source: {
        id: string | null
        name: string
    }
    author: string | null
    category: string
    sport?: string
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
    storeId?: string // Thêm storeId
    storeName?: string // Thêm storeName
    date: string // Ngày thực tế đặt sân (từ orderDetails[0].startTime)
    paymentDate?: string // Ngày thanh toán (từ createdAt)
    time: string
    duration: number // Thay đổi sang number (minutes)
    status: "confirmed" | "pending" | "completed" | "cancelled" // Sửa values
    totalPrice: number // Thay đổi từ price sang totalPrice (number)
    location?: string // Thêm location (optional)
    court?: string // Thêm court (optional)
    image?: string // Thêm image (optional)
}

// Interface cho Order Response (từ backend API)
export interface OrderResponse {
    _id: string;
    userId: string;
    storeId: string;
    orderCode: string | number;
    statusPayment: string;
    cost: number;
    isRated: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    orderDetails: Array<{
        fieldId: string;
        fieldName?: string;
        startTime: string;
        endTime: string;
        price: number;
    }>;
}

// Interface cho user (từ UserResponse DTO)
export interface User {
    id: string
    name: string
    email: string
    phone: string
    avatarUrl?: string // Từ UserResponse
    avatar?: string // Alias cho avatarUrl (để tương thích với mockData)
    bankAccount?: BankAccountResponse // Từ UserResponse (nested DTO)

    // Future fields (khi UserResponse DTO mở rộng):
    bio?: string;
    location?: string;
    favoriteSports?: string[];
    notifications?: {
        booking: boolean
        tournament: boolean
        community: boolean
        email: boolean
        push: boolean
    }
    stats?: {
        totalBookings: number
        totalTournaments: number
        totalPosts: number
    }
    createdAt?: string
}

// Interface cho User Response (từ UserResponse DTO)
export interface UserResponse {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatarUrl?: string;
    active?: boolean;  //  Thêm field active từ backend
    bankAccount?: BankAccountResponse;
}

// Interface cho Bank Account (từ BankAccountResponse DTO)
export interface BankAccountResponse {
    id: string;
    name: string;
    number: string;
    bank?: BankResponse; // Nested BankResponse DTO
    user?: UserResponse; // Nested UserResponse DTO (có thể gây circular, dùng optional)
}

// Interface cho Bank (từ BankResponse DTO)
export interface BankResponse {
    id: string;
    name: string;
    logoUrl: string; // Từ BankResponse (String thay vì Media object)
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
    // notifications?: Partial<User['notifications']> // Comment out vì User không có notifications nữa
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

// Interface cho Store (từ StoreClientDetailResponse DTO)
export interface Store {
    id: string;
    name: string;
    introduction?: string;
    address?: string;
    linkGoogleMap?: string;
    owner?: UserResponse; // Từ DTO (UserResponse thay vì User)
    approved?: boolean;
    active?: boolean;
    startTime?: string; // LocalTime -> string
    endTime?: string; // LocalTime -> string
    orderCount?: number; // Long -> number
    viewCount?: number; // Long -> number
    avatarUrl?: string; // Từ DTO (String thay vì Media)
    coverImageUrl?: string; // Từ DTO (String thay vì Media)
    mediaUrls?: string[]; // Từ DTO (List<String> thay vì List<StoreMedia>)
    latitude?: number; // Float -> number
    longitude?: number; // Float -> number

    // Future fields (khi Store DTOs mở rộng):
    // province?: Province;
    // ward?: Ward;
    // businessLicenseImage?: Media;
    // plan?: MainPlan;
    // optionalPlans?: ApplyOptionalPlan[];
    // averageRating?: number;
    // createdAt?: string;
    // updatedAt?: string;
}

// Interface cho StoreFavourite (từ StoreFavourite.java)
export interface StoreFavourite {
    id: string;
    user?: User;
    store?: Store;
    createdAt?: string;
}

// Interface cho StoreMedia (từ StoreMedia.java)
export interface StoreMedia {
    id: string;
    media?: Media;
    createdAt?: string;
    updatedAt?: string;
    store?: Store;
}

// Interface cho StoreViewHistory (từ StoreViewHistory.java)
export interface StoreViewHistory {
    id: string;
    user?: User;
    store?: Store;
    createdAt?: string;
}

// Interface cho Media (từ MediaResponse DTO)
export interface Media {
    url: string; // Từ MediaResponse

    // Future fields (khi MediaResponse DTO mở rộng):
    // id?: string;
    // mediaType?: string;
}

// Interface cho MainPlan (từ MainPlan.java entity)
export interface MainPlan {
    id: string;
    name?: string;
    description?: string;
}

// Interface cho Message (từ Message.java entity)
export interface Message {
    id: string;
    content?: string;
    sender?: ConversationParticipant;
    conversation?: Conversation;
    createdAt?: string;
}

// Interface cho ConversationParticipant (từ ConversationParticipant.java entity)
export interface ConversationParticipant {
    id: string;
    user?: User;
    conversation?: Conversation;
    createdAt?: string; // LocalDateTime -> string
}

// Interface cho Conversation (từ Conversation.java entity)
export interface Conversation {
    id: string;
    name?: string;
    createdAt?: string; // LocalDateTime -> string
    type?: string; // ConversationType enum -> string
    participants?: ConversationParticipant[];
    messages?: Message[];
}

// Interface cho Rating (từ Rating.java entity)
export interface Rating {
    id: string;
    user?: User;
    store?: Store;
    createdAt?: string;
    updatedAt?: string;
    star?: number; // Float -> number
    comment?: string;
    ratingMedias?: RatingMedia[];
}

// Interface cho RatingMedia (từ RatingMedia.java entity)
export interface RatingMedia {
    id: string;
    media?: Media;
    rating?: Rating;
}

// Interface cho OptionalPlan (từ OptionalPlan.java entity)
export interface OptionalPlan {
    id: string;
    name: string;
    price: number; // Long -> number
    description: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    // Các trường sau không có trong entity hiện tại:
    // features?: string[]; // Tạm thời comment out
    // duration?: number; // Tạm thời comment out
    // isPopular?: boolean; // Tạm thời comment out
    // maxFields?: number; // Tạm thời comment out
    // commission?: number; // Tạm thời comment out
}

// Interface cho ApplyOptionalPlan (từ ApplyOptionalPlan.java entity)
export interface ApplyOptionalPlan {
    id: string;
    store?: Store;
    optionalPlan?: OptionalPlan;
    createdAt?: string;
    deletedAt?: string;
    price?: number; // Long -> number
    // Các trường sau không có trong entity hiện tại:
    // status?: "active" | "expired" | "cancelled"; // Tạm thời comment out
    // startDate?: string; // Tạm thời comment out
    // endDate?: string; // Tạm thời comment out
}

// Interface cho PlanSportRatio (từ PlanSportRatio.java entity)
export interface PlanSportRatio {
    id: string;
    sport?: Sport;
    plan?: MainPlan;
    ratio?: number; // Float -> number
    createdAt?: string;
    deletedAt?: string;
}

// Interface cho Ward (từ WardResponse DTO)
export interface Ward {
    id: string;
    name: string;
    nameEn?: string;
    latitude?: number;
    longitude?: number;

    // Future fields (khi WardResponse DTO mở rộng):
    // province?: Province;
}

// Interface cho Province (từ ProvinceResponse DTO)
export interface Province {
    id: string;
    name: string;
    nameEn?: string;
    latitude?: number; // Float -> number
    longitude?: number; // Float -> number

    // Future fields (khi ProvinceResponse DTO mở rộng):
    // wards?: Ward[];
}

// Interface cho InvalidatedToken (từ InvalidatedToken.java entity)
export interface InvalidatedToken {
    id: string;
    expiryTime?: string; // Date -> string
}

// Interface cho FieldPrice (từ FieldPrice.java entity)
export interface FieldPrice {
    id: string;
    deletedAt?: string;
    field?: Field;
    price?: number; // Long -> number
    dayOfWeeks?: string[]; // Set<DayOfWeek> -> string[]
    startAt?: string; // LocalTime -> string
    endAt?: string; // LocalTime -> string
}

// Interface cho Media Response (từ MediaResponse DTO)
export interface MediaResponse {
    url: string;
}


// Interface cho Store Client Detail Response (từ StoreClientDetailResponse DTO)
export interface StoreClientDetailResponse {
    id: string;
    name: string;
    introduction?: string;
    address?: string;
    linkGoogleMap?: string;
    owner?: UserResponse;
    approved?: boolean;
    active?: boolean;
    startTime?: string; // LocalTime -> string
    endTime?: string; // LocalTime -> string
    orderCount?: number; // Long -> number
    viewCount?: number; // Long -> number
    avatarUrl?: string;
    coverImageUrl?: string;
    mediaUrls?: string[]; // List<String>
    sports?: Sport[]; //  List<SportResponse> từ backend
    latitude?: number; // Float -> number
    longitude?: number; // Float -> number
}

// Interface cho Ward Response (từ WardResponse DTO)
export interface WardResponse {
    id: string;
    name: string;
    nameEn?: string;
    latitude?: number; // Float -> number
    longitude?: number; // Float -> number
}

// Interface cho Province Response (từ ProvinceResponse DTO)
export interface ProvinceResponse {
    id: string;
    name: string;
    nameEn?: string;
    latitude?: number; // Float -> number
    longitude?: number; // Float -> number
}

// Interface cho Authentication Response (từ AuthenticationResponse DTO)
export interface AuthenticationResponse {
    token: string;
    user: UserResponse;
}

// Interface cho Refresh Response (từ RefreshResponse DTO)
export interface RefreshResponse {
    token: string;
}

// Interface cho Introspect Response (từ IntrospectResponse DTO)
export interface IntrospectResponse {
    valid: boolean;
}

// Interface cho Error Response (từ ErrorResponse DTO)
export interface ErrorResponse {
    status: number; // int -> number
    code: number; // int -> number
    message: string;
    error: string;
    path: string;
    timestamp: string; // LocalDateTime -> string
}

// Interface cho Store Admin Detail Response (từ StoreAdminDetailResponse DTO)
export interface StoreAdminDetailResponse {
    id: string;
    name: string;
    introduction?: string;
    address?: string;
    linkGoogleMap?: string;
    owner?: UserResponse;
    active?: boolean;
    approved?: boolean;
    startTime?: string; // LocalTime -> string
    endTime?: string; // LocalTime -> string
    createdAt?: string; // LocalDateTime -> string
    updatedAt?: string; // LocalDateTime -> string
    deletedAt?: string; // LocalDateTime -> string
    averageRating?: number; // Float -> number ✨ ADDED
    orderCount?: number; // Long -> number
    viewCount?: number; // Long -> number
    avatarUrl?: string;
    coverImageUrl?: string;
    businessLicenceImageUrl?: string;
    newToken?: string;
    mediaUrls?: string[]; // List<String>
    plan?: MainPlan; // ✨ Main Plan subscription
}

// Interface cho Store Search Item Response (từ StoreSearchItemResponse DTO)
export interface StoreSearchItemResponse {
    id: string;
    name: string;
    avatarUrl?: string;
    coverUrl?: string;
    startTime?: string; // LocalTime -> string
    endTime?: string; // LocalTime -> string
    averageRating?: number; // Float -> number
    orderCount?: number; // Long -> number
    viewCount?: number; // Long -> number
    ward?: WardResponse;
    province?: ProvinceResponse;
    status?: "approved" | "pending"; // Approval status
}

// Interface cho Store Registration Request
export interface StoreRegistrationRequest {
    name: string;
    introduction?: string;
    address: string;
    linkGoogleMap?: string;
    latitude?: number;
    longitude?: number;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    provinceId: string;
    wardId: string;
    amenities?: string[]; // Array of selected amenities
    // planId: string
    businessLicense?: File; // File upload for business license
    coverImage?: File; // File upload for cover image
    avatar?: File; // File upload for avatar
}

// Interface cho Store Registration Response
export interface StoreRegistrationResponse {
    success: boolean;
    message: string;
    storeId?: string;
    status?: "pending" | "approved" | "rejected";
}

// Interface cho Optional Plan Purchase Request
export interface OptionalPlanPurchaseRequest {
    optionalPlanId: string;
    storeId: string;
    // duration?: number; // Bỏ vì entity không hỗ trợ
}

// Interface cho Subscription Request (từ SubscriptionRequest DTO)
export interface SubscriptionRequest {
    storeId: string;
    mainPlanId: string;
}

// Interface cho Optional Plan Purchase Response
export interface OptionalPlanPurchaseResponse {
    success: boolean;
    message: string;
    applyOptionalPlanId?: string;
    endDate?: string;
}


