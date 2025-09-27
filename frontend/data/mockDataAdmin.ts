import { User, Booking, Field, Tournament } from "@/types"

// Extended interfaces for admin
export interface AdminUser extends User {
    joinDate: string
    lastActive: string
    status: 'active' | 'inactive' | 'banned'
}

export interface AdminBooking extends Booking {
    userName: string
    userPhone: string
    userAvatar: string
    fieldLocation: string
    paymentMethod: string
    paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
    createdAt: string
    notes?: string
}

export interface AdminField extends Field {
    bookingsThisMonth: number
    revenueThisMonth: number
    lastBooking: string
    ownerName: string
    ownerPhone: string
}

export interface AdminTournament extends Tournament {
    organizerName: string
    organizerEmail: string
    organizerPhone: string
    registrationFee: number
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    registrationDeadline: string
    createdAt: string
    participants: number
}

// Mock data cho users
export const mockUsers: AdminUser[] = [
    {
        id: "1",
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phone: "0123456789",
        avatar: "/placeholder-user.jpg",
        bio: "Yêu thích bóng đá và tennis",
        location: "Quận 1, TP.HCM",
        favoriteSports: ["Bóng đá", "Tennis", "Cầu lông"],
        notifications: {
            booking: true,
            tournament: false,
            community: true,
            email: true,
            push: false
        },
        stats: {
            totalBookings: 25,
            totalTournaments: 3,
            totalPosts: 8
        },
        createdAt: "2024-01-15T00:00:00Z",
        joinDate: "2024-01-15",
        lastActive: "2024-12-20",
        status: "active"
    },
    {
        id: "2",
        name: "Trần Thị Bình",
        email: "tranthibinh@email.com",
        phone: "0987654321",
        avatar: "/placeholder-user.jpg",
        bio: "Chuyên viên IT, thích chơi cầu lông",
        location: "Quận 3, TP.HCM",
        favoriteSports: ["Cầu lông", "Tennis"],
        notifications: {
            booking: true,
            tournament: true,
            community: false,
            email: true,
            push: true
        },
        stats: {
            totalBookings: 42,
            totalTournaments: 1,
            totalPosts: 5
        },
        createdAt: "2024-02-10T00:00:00Z",
        joinDate: "2024-02-10",
        lastActive: "2024-12-24",
        status: "active"
    },
    {
        id: "3",
        name: "Lê Văn Cường",
        email: "levancuong@email.com",
        phone: "0912345678",
        avatar: "/placeholder-user.jpg",
        bio: "Sinh viên năm cuối, đam mê bóng rổ",
        location: "Quận 7, TP.HCM",
        favoriteSports: ["Bóng rổ", "Bóng đá"],
        notifications: {
            booking: false,
            tournament: true,
            community: true,
            email: false,
            push: true
        },
        stats: {
            totalBookings: 18,
            totalTournaments: 5,
            totalPosts: 12
        },
        createdAt: "2024-03-05T00:00:00Z",
        joinDate: "2024-03-05",
        lastActive: "2024-12-15",
        status: "inactive"
    },
    {
        id: "4",
        name: "Phạm Thị Dung",
        email: "phamthidung@email.com",
        phone: "0898765432",
        avatar: "/placeholder-user.jpg",
        bio: "Giáo viên thể dục, yêu thích mọi môn thể thao",
        location: "Quận 5, TP.HCM",
        favoriteSports: ["Tennis", "Bóng chuyền", "Cầu lông"],
        notifications: {
            booking: true,
            tournament: true,
            community: true,
            email: true,
            push: true
        },
        stats: {
            totalBookings: 67,
            totalTournaments: 8,
            totalPosts: 23
        },
        createdAt: "2024-01-20T00:00:00Z",
        joinDate: "2024-01-20",
        lastActive: "2024-12-23",
        status: "active"
    },
    {
        id: "5",
        name: "Hoàng Minh Đức",
        email: "hoangminhduc@email.com",
        phone: "0876543210",
        avatar: "/placeholder-user.jpg",
        bio: "Kỹ sư phần mềm, thích chơi tennis cuối tuần",
        location: "Quần 2, TP.HCM",
        favoriteSports: ["Tennis", "Bóng đá"],
        notifications: {
            booking: true,
            tournament: false,
            community: false,
            email: true,
            push: false
        },
        stats: {
            totalBookings: 31,
            totalTournaments: 2,
            totalPosts: 4
        },
        createdAt: "2024-04-12T00:00:00Z",
        joinDate: "2024-04-12",
        lastActive: "2024-11-30",
        status: "banned"
    }
]

// Mock data for bookings
export const mockBookings: AdminBooking[] = [
    {
        id: "1",
        fieldId: "1",
        fieldName: "Journey Multi Sports Turf",
        fieldLocation: "Phường Tân Bình",
        userId: "user1",
        userName: "Nguyễn Văn An",
        userPhone: "0123456789",
        userAvatar: "/placeholder-user.jpg",
        date: "2024-12-25",
        time: "14:00 - 16:00",
        duration: 120,
        status: "confirmed",
        totalPrice: 600000,
        paymentMethod: "Thẻ tín dụng",
        paymentStatus: "paid",
        createdAt: "2024-12-20T10:30:00Z",
        notes: "Khách yêu cầu sân có đèn chiếu sáng tốt"
    },
    {
        id: "2",
        fieldId: "2",
        fieldName: "Elite Tennis Club",
        fieldLocation: "Quận 1, TP.HCM",
        userId: "user2",
        userName: "Trần Thị Bình",
        userPhone: "0987654321",
        userAvatar: "/placeholder-user.jpg",
        date: "2024-12-25",
        time: "18:00 - 19:00",
        duration: 60,
        status: "pending",
        totalPrice: 200000,
        paymentMethod: "Chuyển khoản",
        paymentStatus: "pending",
        createdAt: "2024-12-24T15:45:00Z"
    },
    {
        id: "3",
        fieldId: "3",
        fieldName: "ProCourt Badminton Center",
        fieldLocation: "Quận 7, TP.HCM",
        userId: "user3",
        userName: "Lê Văn Cường",
        userPhone: "0912345678",
        userAvatar: "/placeholder-user.jpg",
        date: "2024-12-24",
        time: "07:00 - 08:00",
        duration: 60,
        status: "completed",
        totalPrice: 150000,
        paymentMethod: "Tiền mặt",
        paymentStatus: "paid",
        createdAt: "2024-12-23T20:15:00Z"
    },
    {
        id: "4",
        fieldId: "4",
        fieldName: "Basketball Arena 24/7",
        fieldLocation: "Quận 3, TP.HCM",
        userId: "user4",
        userName: "Phạm Thị Dung",
        userPhone: "0898765432",
        userAvatar: "/placeholder-user.jpg",
        date: "2024-12-26",
        time: "16:00 - 17:00",
        duration: 60,
        status: "cancelled",
        totalPrice: 180000,
        paymentMethod: "Ví điện tử",
        paymentStatus: "refunded",
        createdAt: "2024-12-22T09:20:00Z",
        notes: "Khách hủy do thay đổi kế hoạch"
    },
    {
        id: "5",
        fieldId: "5",
        fieldName: "Swimming Paradise",
        fieldLocation: "Quận 2, TP.HCM",
        userId: "user5",
        userName: "Hoàng Minh Đức",
        userPhone: "0876543210",
        userAvatar: "/placeholder-user.jpg",
        date: "2024-12-27",
        time: "19:00 - 20:00",
        duration: 60,
        status: "confirmed",
        totalPrice: 120000,
        paymentMethod: "Thẻ ATM",
        paymentStatus: "paid",
        createdAt: "2024-12-24T14:30:00Z"
    }
]

// Mock data for fields
export const mockFields: AdminField[] = [
    {
        id: "1",
        name: "Journey Multi Sports Turf",
        location: "Phường Tân Bình",
        price: 300000,
        rating: 4.5,
        image: "/green-football-field.png",
        sport: "Bóng đá",
        amenities: ["Free WiFi", "Parking", "Ball Rental"],
        description: "Sân bóng đá hiện đại với cỏ nhân tạo chất lượng cao",
        status: "available",
        openingHours: "05:00",
        closingHours: "23:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@journeyturf.com",
        reviewCount: 24,
        isVerified: true,
        bookingsThisMonth: 45,
        revenueThisMonth: 13500000,
        lastBooking: "2024-12-24",
        ownerName: "Nguyễn Văn A",
        ownerPhone: "0123456789"
    },
    {
        id: "2",
        name: "Elite Tennis Club",
        location: "Quận 1, TP.HCM",
        price: 200000,
        rating: 4.7,
        image: "/outdoor-tennis-court.png",
        sport: "Tennis",
        amenities: ["Air Conditioning", "Locker Room", "Equipment Rental"],
        description: "Sân tennis cao cấp với hệ thống ánh sáng hiện đại",
        status: "available",
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Hard Court",
        capacity: "2vs2",
        phone: "+84 987 654 321",
        email: "info@elitetennis.com",
        reviewCount: 18,
        isVerified: true,
        bookingsThisMonth: 38,
        revenueThisMonth: 7600000,
        lastBooking: "2024-12-23",
        ownerName: "Trần Thị B",
        ownerPhone: "0987654321"
    },
    {
        id: "3",
        name: "ProCourt Badminton Center",
        location: "Quận 7, TP.HCM",
        price: 150000,
        rating: 4.3,
        image: "/placeholder.jpg",
        sport: "Cầu lông",
        amenities: ["Air Conditioning", "Parking", "Shower"],
        description: "Trung tâm cầu lông chuyên nghiệp với nhiều sân đơn",
        status: "maintenance",
        openingHours: "05:30",
        closingHours: "23:30",
        surfaceType: "PVC",
        capacity: "2vs2",
        phone: "+84 912 345 678",
        email: "contact@procourt.com",
        reviewCount: 32,
        isVerified: true,
        bookingsThisMonth: 28,
        revenueThisMonth: 4200000,
        lastBooking: "2024-12-20",
        ownerName: "Lê Văn C",
        ownerPhone: "0912345678"
    },
    {
        id: "4",
        name: "Basketball Arena 24/7",
        location: "Quận 3, TP.HCM",
        price: 180000,
        rating: 4.2,
        image: "/outdoor-basketball-court.png",
        sport: "Bóng rổ",
        amenities: ["24/7 Access", "LED Lighting", "Sound System"],
        description: "Sân bóng rổ hoạt động 24/7 với hệ thống chiếu sáng LED",
        status: "unavailable",
        openingHours: "00:00",
        closingHours: "23:59",
        surfaceType: "Synthetic",
        capacity: "5vs5",
        phone: "+84 898 765 432",
        email: "admin@basketball247.com",
        reviewCount: 15,
        isVerified: false,
        bookingsThisMonth: 22,
        revenueThisMonth: 3960000,
        lastBooking: "2024-12-15",
        ownerName: "Phạm Minh D",
        ownerPhone: "0898765432"
    },
    {
        id: "5",
        name: "Swimming Paradise",
        location: "Quận 2, TP.HCM",
        price: 120000,
        rating: 4.6,
        image: "/swimming-pool.png",
        sport: "Bơi lội",
        amenities: ["Heated Pool", "Locker Room", "Towel Service"],
        description: "Bể bơi cao cấp với nước ấm quanh năm",
        status: "available",
        openingHours: "05:00",
        closingHours: "22:00",
        surfaceType: "Tiled",
        capacity: "Open swim",
        phone: "+84 876 543 210",
        email: "info@swimmingparadise.com",
        reviewCount: 41,
        isVerified: true,
        bookingsThisMonth: 67,
        revenueThisMonth: 8040000,
        lastBooking: "2024-12-24",
        ownerName: "Võ Thị E",
        ownerPhone: "0876543210"
    }
]

// Mock tournament data
export const mockTournaments: AdminTournament[] = [
    {
        id: "1",
        name: "Giải Bóng Đá Mùa Hè 2024",
        sport: "Bóng đá",
        startDate: "2024-07-15",
        endDate: "2024-07-28",
        location: "Sân vận động Quận 1",
        prizePool: 50000000,
        maxTeams: 16,
        currentTeams: 12,
        image: "/football-tournament-poster.png",
        description: "Giải đấu bóng đá lớn nhất mùa hè với tổng giải thưởng lên đến 50 triệu VNĐ",
        organizerName: "Liên đoàn Bóng đá TP.HCM",
        organizerEmail: "contact@hcmfa.com",
        organizerPhone: "028-3829-1234",
        registrationFee: 2000000,
        status: "upcoming",
        registrationDeadline: "2024-07-01",
        createdAt: "2024-05-15",
        participants: 168
    },
    {
        id: "2",
        name: "Vietnam Open Tennis Championship",
        sport: "Tennis",
        startDate: "2024-08-10",
        endDate: "2024-08-20",
        location: "Tennis Club Elite",
        prizePool: 30000000,
        maxTeams: 32,
        currentTeams: 28,
        image: "/tennis-tournament-poster.png",
        description: "Giải tennis chuyên nghiệp với sự tham gia của nhiều tay vợt nổi tiếng",
        organizerName: "Vietnam Tennis Association",
        organizerEmail: "info@vntennis.org",
        organizerPhone: "028-3945-6789",
        registrationFee: 1500000,
        status: "ongoing",
        registrationDeadline: "2024-07-25",
        createdAt: "2024-04-20",
        participants: 84
    },
    {
        id: "3",
        name: "Cúp Cầu Lông Vô Địch",
        sport: "Cầu lông",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        location: "Trung tâm Thể thao Quận 7",
        prizePool: 20000000,
        maxTeams: 24,
        currentTeams: 24,
        image: "/badminton-tournament-poster.png",
        description: "Giải đấu cầu lông chuyên nghiệp cho các VĐV từ 18 tuổi trở lên",
        organizerName: "CLB Cầu lông Sài Gòn",
        organizerEmail: "saigonbadminton@gmail.com",
        organizerPhone: "0908-123-456",
        registrationFee: 500000,
        status: "completed",
        registrationDeadline: "2024-05-15",
        createdAt: "2024-03-10",
        participants: 96
    },
    {
        id: "4",
        name: "Street Basketball League",
        sport: "Bóng rổ",
        startDate: "2024-09-01",
        endDate: "2024-09-15",
        location: "Sân Basketball Arena 24/7",
        prizePool: 15000000,
        maxTeams: 12,
        currentTeams: 8,
        image: "/basketball-tournament-poster.png",
        description: "Giải đấu bóng rổ đường phố dành cho các team nghiệp dư",
        organizerName: "Street Ball Vietnam",
        organizerEmail: "streetball.vn@gmail.com",
        organizerPhone: "0987-654-321",
        registrationFee: 1000000,
        status: "upcoming",
        registrationDeadline: "2024-08-20",
        createdAt: "2024-06-01",
        participants: 40
    }
]

// Extended interfaces for additional admin modules

// Review interfaces
export interface AdminReview {
    id: string;
    rating: number;
    title: string;
    content: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
    field: {
        id: string;
        name: string;
        type: string;
    };
    booking?: {
        id: string;
        date: string;
    };
    createdAt: string;
    updatedAt?: string;
    status: 'published' | 'pending' | 'rejected' | 'reported';
    helpfulCount: number;
    reportCount: number;
    response?: {
        content: string;
        author: string;
        date: string;
    };
    verified: boolean;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    pendingReviews: number;
    reportedReviews: number;
    ratingDistribution: { rating: number; count: number; percentage: number }[];
}

// Revenue interfaces
export interface AdminRevenueRecord {
    id: string;
    date: string;
    source: 'booking' | 'tournament' | 'membership' | 'other';
    amount: number;
    currency: string;
    paymentMethod: 'card' | 'cash' | 'bank_transfer' | 'e_wallet';
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    description: string;
    fieldId?: string;
    fieldName?: string;
    userId: string;
    userName: string;
    transactionId: string;
    commission: number;
    netRevenue: number;
}

export interface RevenueStats {
    totalRevenue: number;
    todayRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    totalBookings: number;
    averageOrderValue: number;
    commissionEarned: number;
    pendingAmount: number;
}

// Report interfaces
export interface AdminReport {
    id: string;
    title: string;
    type: 'revenue' | 'booking' | 'user' | 'field' | 'performance' | 'audit';
    description: string;
    generatedBy: string;
    generatedAt: string;
    status: 'completed' | 'processing' | 'failed' | 'scheduled';
    format: 'pdf' | 'excel' | 'csv';
    size?: string;
    downloadCount: number;
    scheduleType?: 'manual' | 'daily' | 'weekly' | 'monthly';
    nextSchedule?: string;
    recipients?: string[];
}

export interface ReportTemplate {
    id: string;
    name: string;
    type: string;
    description: string;
    isActive: boolean;
}

export interface SystemStats {
    totalReports: number;
    todayReports: number;
    scheduledReports: number;
    failedReports: number;
    diskUsage: number;
    avgProcessingTime: string;
}

// Promotion interfaces
export interface AdminPromotion {
    id: string;
    name: string;
    description: string;
    type: 'percentage' | 'fixed_amount' | 'free_hours' | 'package_deal';
    value: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    code: string;
    usageLimit: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'expired' | 'scheduled';
    applicableFor: 'all' | 'specific_fields' | 'specific_sports' | 'new_users' | 'premium_users';
    createdBy: string;
    createdAt: string;
    targetFields?: string[];
    targetSports?: string[];
}

export interface PromotionStats {
    totalPromotions: number;
    activePromotions: number;
    expiredPromotions: number;
    totalUsage: number;
    totalDiscountGiven: number;
    mostUsedPromotion: string;
    revenueImpact: number;
}

// Settings interfaces
export interface SystemSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    businessHours: {
        open: string;
        close: string;
        timezone: string;
    };
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
}

export interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    adminIpWhitelist: string[];
    apiRateLimit: number;
    enableAuditLog: boolean;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingConfirmations: boolean;
    paymentAlerts: boolean;
    systemAlerts: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
}

export interface PaymentSettings {
    enableOnlinePayment: boolean;
    acceptedMethods: string[];
    currency: string;
    commissionRate: number;
    minimumBookingAmount: number;
    refundPolicy: string;
    stripePublicKey?: string;
    paypalClientId?: string;
}

export interface BookingSettings {
    advanceBookingDays: number;
    minimumBookingHours: number;
    cancellationHours: number;
    autoApproval: boolean;
    requireDeposit: boolean;
    depositPercentage: number;
    overbookingAllowed: boolean;
    defaultBookingDuration: number;
}

// Mock data for reviews
export const mockReviews: AdminReview[] = [
    {
        id: "1",
        rating: 5,
        title: "Sân bóng tuyệt vời!",
        content: "Sân rất sạch sẽ, cỏ đẹp, trang thiết bị đầy đủ. Nhân viên phục vụ rất nhiệt tình. Sẽ quay lại lần sau!",
        user: {
            id: "user1",
            name: "Nguyễn Văn An",
            avatar: "/placeholder-user.jpg"
        },
        field: {
            id: "field1",
            name: "Sân bóng đá A",
            type: "Bóng đá"
        },
        booking: {
            id: "booking1",
            date: "2024-01-25"
        },
        createdAt: "2 giờ trước",
        status: "published",
        helpfulCount: 15,
        reportCount: 0,
        verified: true
    },
    {
        id: "2",
        rating: 4,
        title: "Sân tennis khá ổn",
        content: "Sân tennis có chất lượng tốt, không gian rộng rãi. Tuy nhiên giá hơi cao so với mặt bằng chung.",
        user: {
            id: "user2",
            name: "Trần Thị Bình",
            avatar: "/placeholder-user.jpg"
        },
        field: {
            id: "field2",
            name: "Sân tennis B",
            type: "Tennis"
        },
        booking: {
            id: "booking2",
            date: "2024-01-24"
        },
        createdAt: "5 giờ trước",
        status: "published",
        helpfulCount: 8,
        reportCount: 0,
        response: {
            content: "Cảm ơn bạn đã đánh giá! Chúng tôi sẽ xem xét lại mức giá để phù hợp hơn.",
            author: "Quản lý sân",
            date: "3 giờ trước"
        },
        verified: true
    },
    {
        id: "3",
        rating: 2,
        title: "Dịch vụ kém",
        content: "Sân cũ kỹ, không sạch sẽ. Nhân viên không chuyên nghiệp, thái độ thiếu thiện ý.",
        user: {
            id: "user3",
            name: "Lê Văn Cường",
            avatar: "/placeholder-user.jpg"
        },
        field: {
            id: "field3",
            name: "Sân cầu lông C",
            type: "Cầu lông"
        },
        booking: {
            id: "booking3",
            date: "2024-01-23"
        },
        createdAt: "1 ngày trước",
        status: "reported",
        helpfulCount: 3,
        reportCount: 2,
        verified: true
    },
    {
        id: "4",
        rating: 3,
        title: "Review có nội dung không phù hợp",
        content: "Nội dung này chứa từ ngữ không phù hợp và cần được kiểm duyệt...",
        user: {
            id: "user4",
            name: "Người dùng vi phạm",
            avatar: "/placeholder-user.jpg"
        },
        field: {
            id: "field4",
            name: "Sân bóng rổ D",
            type: "Bóng rổ"
        },
        createdAt: "2 ngày trước",
        status: "pending",
        helpfulCount: 0,
        reportCount: 5,
        verified: false
    }
]

export const mockReviewStats: ReviewStats = {
    totalReviews: 1247,
    averageRating: 4.2,
    pendingReviews: 23,
    reportedReviews: 8,
    ratingDistribution: [
        { rating: 5, count: 542, percentage: 43.5 },
        { rating: 4, count: 374, percentage: 30.0 },
        { rating: 3, count: 187, percentage: 15.0 },
        { rating: 2, count: 93, percentage: 7.5 },
        { rating: 1, count: 51, percentage: 4.0 }
    ]
}

// Mock data for revenue
export const mockRevenueRecords: AdminRevenueRecord[] = [
    {
        id: "1",
        date: "2024-01-26T10:30:00Z",
        source: "booking",
        amount: 150000,
        currency: "VND",
        paymentMethod: "card",
        status: "completed",
        description: "Đặt sân bóng đá - Sân A",
        fieldId: "field1",
        fieldName: "Sân bóng đá A",
        userId: "user1",
        userName: "Nguyễn Văn An",
        transactionId: "TXN001",
        commission: 15000,
        netRevenue: 135000
    },
    {
        id: "2",
        date: "2024-01-26T14:15:00Z",
        source: "tournament",
        amount: 500000,
        currency: "VND",
        paymentMethod: "bank_transfer",
        status: "completed",
        description: "Lệ phí tham gia giải đấu Tennis",
        userId: "user2",
        userName: "Trần Thị Bình",
        transactionId: "TXN002",
        commission: 50000,
        netRevenue: 450000
    },
    {
        id: "3",
        date: "2024-01-26T09:45:00Z",
        source: "membership",
        amount: 1200000,
        currency: "VND",
        paymentMethod: "e_wallet",
        status: "completed",
        description: "Gói thành viên VIP 3 tháng",
        userId: "user3",
        userName: "Lê Văn Cường",
        transactionId: "TXN003",
        commission: 120000,
        netRevenue: 1080000
    },
    {
        id: "4",
        date: "2024-01-26T16:20:00Z",
        source: "booking",
        amount: 200000,
        currency: "VND",
        paymentMethod: "cash",
        status: "pending",
        description: "Đặt sân tennis - Sân B",
        fieldId: "field2",
        fieldName: "Sân tennis B",
        userId: "user4",
        userName: "Phạm Thị Dung",
        transactionId: "TXN004",
        commission: 20000,
        netRevenue: 180000
    },
    {
        id: "5",
        date: "2024-01-25T11:30:00Z",
        source: "booking",
        amount: 300000,
        currency: "VND",
        paymentMethod: "card",
        status: "refunded",
        description: "Đặt sân bóng rổ - Hoàn tiền",
        fieldId: "field3",
        fieldName: "Sân bóng rổ C",
        userId: "user5",
        userName: "Hoàng Văn Em",
        transactionId: "TXN005",
        commission: 0,
        netRevenue: 0
    }
]

export const mockRevenueStats: RevenueStats = {
    totalRevenue: 48500000,
    todayRevenue: 2050000,
    monthlyRevenue: 15600000,
    yearlyRevenue: 48500000,
    totalBookings: 1247,
    averageOrderValue: 389000,
    commissionEarned: 4850000,
    pendingAmount: 380000
}

// Mock data for reports
export const mockReports: AdminReport[] = [
    {
        id: "1",
        title: "Báo cáo doanh thu tháng 1/2024",
        type: "revenue",
        description: "Báo cáo chi tiết doanh thu và lợi nhuận tháng 1",
        generatedBy: "Hệ thống",
        generatedAt: "2024-01-26 09:00:00",
        status: "completed",
        format: "pdf",
        size: "2.3 MB",
        downloadCount: 15,
        scheduleType: "monthly",
        nextSchedule: "2024-02-01 09:00:00",
        recipients: ["admin@arenaaxis.com", "manager@arenaaxis.com"]
    },
    {
        id: "2",
        title: "Thống kê booking tuần 3",
        type: "booking",
        description: "Phân tích số liệu đặt sân tuần thứ 3 tháng 1",
        generatedBy: "Nguyễn Văn Admin",
        generatedAt: "2024-01-26 14:30:00",
        status: "completed",
        format: "excel",
        size: "1.8 MB",
        downloadCount: 8,
        scheduleType: "weekly",
        nextSchedule: "2024-01-29 09:00:00"
    },
    {
        id: "3",
        title: "Báo cáo người dùng mới",
        type: "user",
        description: "Thống kê người dùng đăng ký mới trong tháng",
        generatedBy: "Hệ thống",
        generatedAt: "2024-01-26 08:15:00",
        status: "processing",
        format: "csv",
        scheduleType: "daily",
        downloadCount: 0
    },
    {
        id: "4",
        title: "Hiệu suất sân thể thao",
        type: "field",
        description: "Phân tích hiệu suất và tỷ lệ sử dụng các sân",
        generatedBy: "Trần Thị Manager",
        generatedAt: "2024-01-25 16:45:00",
        status: "failed",
        format: "pdf",
        scheduleType: "manual",
        downloadCount: 0
    },
    {
        id: "5",
        title: "Audit log hệ thống",
        type: "audit",
        description: "Nhật ký kiểm toán hoạt động hệ thống",
        generatedBy: "Hệ thống",
        generatedAt: "2024-01-26 00:00:00",
        status: "completed",
        format: "csv",
        size: "5.2 MB",
        downloadCount: 3,
        scheduleType: "daily",
        nextSchedule: "2024-01-27 00:00:00"
    }
]

export const mockReportTemplates: ReportTemplate[] = [
    { id: "1", name: "Doanh thu hàng ngày", type: "revenue", description: "Báo cáo doanh thu theo ngày", isActive: true },
    { id: "2", name: "Thống kê booking", type: "booking", description: "Số liệu đặt sân và hủy sân", isActive: true },
    { id: "3", name: "Người dùng hoạt động", type: "user", description: "Phân tích hoạt động người dùng", isActive: true },
    { id: "4", name: "Hiệu suất sân", type: "field", description: "Tỷ lệ sử dụng và đánh giá sân", isActive: false },
    { id: "5", name: "Audit hệ thống", type: "audit", description: "Nhật ký bảo mật và kiểm toán", isActive: true }
]

export const mockSystemStats: SystemStats = {
    totalReports: 1247,
    todayReports: 8,
    scheduledReports: 23,
    failedReports: 3,
    diskUsage: 2.8,
    avgProcessingTime: "2.5 phút"
}

// Mock data for promotions
export const mockPromotions: AdminPromotion[] = [
    {
        id: "1",
        name: "Khuyến mãi đầu năm",
        description: "Giảm 20% cho tất cả các sân trong tháng 1",
        type: "percentage",
        value: 20,
        minOrderAmount: 100000,
        maxDiscountAmount: 500000,
        code: "NEWYEAR2024",
        usageLimit: 1000,
        usedCount: 347,
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        status: "expired",
        applicableFor: "all",
        createdBy: "Admin",
        createdAt: "2023-12-20",
    },
    {
        id: "2",
        name: "Ưu đãi sân tennis",
        description: "Giảm 150.000đ cho booking sân tennis trên 300.000đ",
        type: "fixed_amount",
        value: 150000,
        minOrderAmount: 300000,
        code: "TENNIS150K",
        usageLimit: 200,
        usedCount: 89,
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        status: "active",
        applicableFor: "specific_sports",
        targetSports: ["Tennis"],
        createdBy: "Admin",
        createdAt: "2024-01-10",
    },
    {
        id: "3",
        name: "Gói ưu đãi thành viên mới",
        description: "Tặng 2 giờ miễn phí cho thành viên mới",
        type: "free_hours",
        value: 2,
        code: "NEWMEMBER2H",
        usageLimit: 500,
        usedCount: 156,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "active",
        applicableFor: "new_users",
        createdBy: "Marketing Team",
        createdAt: "2023-12-15",
    },
    {
        id: "4",
        name: "Flash Sale cuối tuần",
        description: "Giảm 30% cho booking vào cuối tuần",
        type: "percentage",
        value: 30,
        minOrderAmount: 200000,
        maxDiscountAmount: 300000,
        code: "WEEKEND30",
        usageLimit: 100,
        usedCount: 73,
        startDate: "2024-01-26",
        endDate: "2024-01-28",
        status: "active",
        applicableFor: "all",
        createdBy: "Admin",
        createdAt: "2024-01-24",
    },
    {
        id: "5",
        name: "Gói combo bóng đá",
        description: "Đặt 3 giờ chỉ tính tiền 2 giờ cho sân bóng đá",
        type: "package_deal",
        value: 33,
        code: "FOOTBALL3FOR2",
        usageLimit: 50,
        usedCount: 12,
        startDate: "2024-02-01",
        endDate: "2024-02-29",
        status: "scheduled",
        applicableFor: "specific_sports",
        targetSports: ["Bóng đá"],
        createdBy: "Field Manager",
        createdAt: "2024-01-25",
    }
]

export const mockPromotionStats: PromotionStats = {
    totalPromotions: 28,
    activePromotions: 8,
    expiredPromotions: 15,
    totalUsage: 1245,
    totalDiscountGiven: 45600000,
    mostUsedPromotion: "NEWYEAR2024",
    revenueImpact: -8.5
}

// Mock settings data
export const mockSystemSettings: SystemSettings = {
    siteName: "ArenaAxis",
    siteDescription: "Nền tảng đặt sân thể thao hàng đầu Việt Nam",
    contactEmail: "contact@arenaaxis.com",
    phoneNumber: "+84 123 456 789",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    businessHours: {
        open: "06:00",
        close: "23:00",
        timezone: "Asia/Ho_Chi_Minh"
    },
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true
}

export const mockSecuritySettings: SecuritySettings = {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    adminIpWhitelist: ["192.168.1.100", "10.0.0.50"],
    apiRateLimit: 1000,
    enableAuditLog: true
}

export const mockNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmations: true,
    paymentAlerts: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true
}

export const mockPaymentSettings: PaymentSettings = {
    enableOnlinePayment: true,
    acceptedMethods: ["card", "bank_transfer", "e_wallet"],
    currency: "VND",
    commissionRate: 10,
    minimumBookingAmount: 50000,
    refundPolicy: "Hoàn tiền 100% nếu hủy trước 24h, 50% nếu hủy trước 12h",
    stripePublicKey: "pk_test_...",
    paypalClientId: "AX..."
}

export const mockBookingSettings: BookingSettings = {
    advanceBookingDays: 30,
    minimumBookingHours: 2,
    cancellationHours: 24,
    autoApproval: false,
    requireDeposit: true,
    depositPercentage: 30,
    overbookingAllowed: false,
    defaultBookingDuration: 90
}