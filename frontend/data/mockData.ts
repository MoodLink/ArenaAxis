// Dữ liệu mẫu cho ứng dụng
// Trong tương lai, dữ liệu này sẽ được fetch từ API
import { Field, Sport, Tournament, CommunityPost, Booking, ChatRoom, ChatMessage, Review, FieldReviewData, User, ContactInfo, FAQ, OfficeLocation, UserSettings, ProfileActivity, UserAchievement } from '@/types'

// Dữ liệu user profile mẫu
export const currentUser: User = {
    id: "user1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    avatar: "/placeholder-user.jpg",
    bio: "Yêu thích các môn thể thao, đặc biệt là bóng đá và tennis. Thích chơi thể thao với bạn bè vào cuối tuần.",
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
    createdAt: "2024-01-15T00:00:00Z"
}

// Dữ liệu sân thể thao phổ biến
export const popularFields: Field[] = [
    // BÓNG ĐÁ
    {
        id: "1",
        name: "Journey Multi Sports Turf",
        location: "Phường Tân Bình",
        price: 300000,
        rating: 4.5,
        image: "/green-football-field.png",
        sport: "Bóng đá",
        amenities: ["Free WiFi", "Parking", "Ball Rental"],
        description: "Sân bóng đá hiện đại với cỏ nhân tạo chất lượng cao, phù hợp cho các trận đấu thi đấu và giải trí",
        status: "available" as const,
        openingHours: "05:00",
        closingHours: "23:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@journeyturf.com",
        reviewCount: 24,
        isVerified: true
    },
    {
        id: "2",
        name: "Turf Up Football Arena",
        location: "Khu vực Bình Thạnh",
        price: 400000,
        rating: 4.7,
        image: "/modern-football-turf-field.png",
        sport: "Bóng đá",
        amenities: ["Free WiFi", "Shower", "Locker", "Canteen"],
        description: "Sân bóng đá mini 7v7 với trang thiết bị đầy đủ, hệ thống tưới tự động",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 17,
        isVerified: true
    },
    {
        id: "3",
        name: "Just Dribble Indoor Field",
        location: "Khu vực Gò Vấp",
        price: 350000,
        rating: 4.3,
        image: "/indoor-football-court.png",
        sport: "Bóng đá",
        amenities: ["Indoor", "Air Conditioning", "Security", "Sound System"],
        description: "Sân bóng đá trong nhà với hệ thống điều hòa, an toàn tuyệt đối",
        status: "available" as const,
        openingHours: "07:00",
        closingHours: "23:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 40,
        isVerified: true
    },
    {
        id: "4",
        name: "Bangkors Professional Stadium",
        location: "Khu vực Bình Tân",
        price: 500000,
        rating: 4.9,
        image: "/professional-football-field.png",
        sport: "Bóng đá",
        amenities: ["Professional Turf", "LED Lighting", "VIP Changing Room", "Medical Room"],
        description: "Sân bóng đá chuyên nghiệp 11v11 với cỏ nhân tạo FIFA Quality Pro",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:30",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 31,
        isVerified: true
    },

    // BÓNG RỔ
    {
        id: "5",
        name: "Saigon Basketball Complex",
        location: "Quận 1",
        price: 200000,
        rating: 4.6,
        image: "/outdoor-basketball-court.png",
        sport: "Bóng rổ",
        amenities: ["Outdoor", "LED Court", "Free Parking", "Equipment Storage"],
        description: "Sân bóng rổ ngoài trời với hệ thống chiếu sáng LED, mặt sân chuyên nghiệp",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 25,
        isVerified: true
    },
    {
        id: "6",
        name: "Streetball Arena District 7",
        location: "Quận 7",
        price: 250000,
        rating: 4.4,
        image: "/outdoor-basketball-court.png",
        sport: "Bóng rổ",
        amenities: ["Multiple Courts", "Scoreboard", "Bleachers", "Water Station"],
        description: "Khu phức hợp bóng rổ với 4 sân thi đấu, phù hợp tổ chức giải đấu",
        status: "available" as const,
        openingHours: "07:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 10,
        isVerified: true
    },
    {
        id: "7",
        name: "Indoor Basketball Center",
        location: "Quận 3",
        price: 300000,
        rating: 4.8,
        image: "/outdoor-basketball-court.png",
        sport: "Bóng rổ",
        amenities: ["Indoor", "Air Conditioning", "Professional Court", "Locker Room"],
        description: "Sân bóng rổ trong nhà tiêu chuẩn FIBA với hệ thống điều hòa hiện đại",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "23:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 40,
        isVerified: true
    },

    // TENNIS
    {
        id: "8",
        name: "Royal Tennis Club",
        location: "Quận 2",
        price: 450000,
        rating: 4.9,
        image: "/outdoor-tennis-court.png",
        sport: "Tennis",
        amenities: ["Clay Court", "Ball Machine", "Coaching Available", "Pro Shop"],
        description: "Sân tennis đất nện chuyên nghiệp với dịch vụ huấn luyện cao cấp",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 21,
        isVerified: true
    },
    {
        id: "9",
        name: "Ace Tennis Academy",
        location: "Thủ Đức",
        price: 350000,
        rating: 4.5,
        image: "/outdoor-tennis-court.png",
        sport: "Tennis",
        amenities: ["Hard Court", "Coaching", "Equipment Rental", "Café"],
        description: "Học viện tennis với sân cứng tiêu chuẩn ITF, phù hợp mọi trình độ",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 55,
        isVerified: true
    },
    {
        id: "10",
        name: "Garden Tennis Resort",
        location: "Quận 9",
        price: 400000,
        rating: 4.7,
        image: "/outdoor-tennis-court.png",
        sport: "Tennis",
        amenities: ["Grass Court", "Luxury Lounge", "Personal Trainer", "Spa"],
        description: "Sân tennis cỏ tự nhiên trong khuôn viên resort sang trọng",
        status: "available" as const,
        openingHours: "07:00",
        closingHours: "21:00",
        surfaceType: "Sân cứng",
        capacity: "Đơn/Đôi",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 37,
        isVerified: true
    },

    // CẦU LÔNG
    {
        id: "11",
        name: "Victor Badminton Arena",
        location: "Quận 10",
        price: 150000,
        rating: 4.3,
        image: "/badminton-court.png",
        sport: "Cầu lông",
        amenities: ["Indoor", "Wooden Floor", "Shuttle Service", "Equipment Shop"],
        description: "Sân cầu lông trong nhà với sàn gỗ chuyên dụng, 8 sân thi đấu",
        status: "available" as const,
        openingHours: "05:30",
        closingHours: "22:30",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 33,
        isVerified: true
    },
    {
        id: "12",
        name: "Yonex Sports Complex",
        location: "Quận 5",
        price: 180000,
        rating: 4.6,
        image: "/badminton-court.png",
        sport: "Cầu lông",
        amenities: ["Air Conditioning", "Professional Court", "Coaching", "Locker"],
        description: "Trung tâm cầu lông hiện đại với 12 sân thi đấu tiêu chuẩn BWF",
        status: "available" as const,
        openingHours: "05:30",
        closingHours: "22:30",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 53,
        isVerified: true
    },
    {
        id: "13",
        name: "Sunrise Badminton Club",
        location: "Bình Thạnh",
        price: 120000,
        rating: 4.1,
        image: "/badminton-court.png",
        sport: "Cầu lông",
        amenities: ["Multiple Courts", "Flexible Booking", "Group Discount", "Parking"],
        description: "CLB cầu lông phổ thông với giá cả phải chăng, phù hợp tập luyện hàng ngày",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 12,
        isVerified: true
    },

    // GOLF
    {
        id: "14",
        name: "Saigon Golf & Country Club",
        location: "Long Thành",
        price: 1200000,
        rating: 4.9,
        image: "/lush-golf-course.png",
        sport: "Golf",
        amenities: ["18-hole Course", "Caddy Service", "Restaurant", "Golf Cart"],
        description: "Sân golf 18 hố tiêu chuẩn championship với thiết kế độc đáo",
        status: "available" as const,
        openingHours: "05:00",
        closingHours: "18:00",
        surfaceType: "Cỏ tự nhiên",
        capacity: "1-4 người",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 29,
        isVerified: true
    },
    {
        id: "15",
        name: "Driving Range Pro",
        location: "Quận 7",
        price: 300000,
        rating: 4.4,
        image: "/lush-golf-course.png",
        sport: "Golf",
        amenities: ["Driving Range", "Putting Green", "Golf Lessons", "Equipment Rental"],
        description: "Khu tập golf với driving range 300m, phù hợp luyện tập cơ bản",
        status: "available" as const,
        openingHours: "05:30",
        closingHours: "18:00",
        surfaceType: "Cỏ tự nhiên",
        capacity: "1-4 người",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 25,
        isVerified: true
    },
    {
        id: "16",
        name: "Mini Golf Paradise",
        location: "Quận 1",
        price: 150000,
        rating: 4.2,
        image: "/lush-golf-course.png",
        sport: "Golf",
        amenities: ["Mini Golf", "Family Friendly", "Snack Bar", "Party Room"],
        description: "Sân mini golf 18 hố với thiết kế vui nhộn, phù hợp gia đình",
        status: "available" as const,
        openingHours: "08:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 31,
        isVerified: true
    },

    // BÓNG CHUYỀN
    {
        id: "17",
        name: "Beach Volleyball Paradise",
        location: "Vũng Tàu",
        price: 200000,
        rating: 4.5,
        image: "/volleyball-court.png",
        sport: "Bóng chuyền",
        amenities: ["Beach Court", "Ocean View", "Beach Bar", "Equipment Included"],
        description: "Sân bóng chuyền bãi biển với view đại dương tuyệt đẹp",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "21:00",
        surfaceType: "Sân cứng",
        capacity: "Đơn/Đôi",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 52,
        isVerified: true
    },
    {
        id: "18",
        name: "Indoor Volleyball Center",
        location: "Quận 4",
        price: 180000,
        rating: 4.3,
        image: "/volleyball-court.png",
        sport: "Bóng chuyền",
        amenities: ["Indoor Court", "Professional Net", "Scorer Table", "Air Conditioning"],
        description: "Sân bóng chuyền trong nhà với thiết bị chuyên nghiệp",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 52,
        isVerified: true
    },

    // BƠI LỘI
    {
        id: "19",
        name: "Aqua Sports Complex",
        location: "Quận 8",
        price: 100000,
        rating: 4.4,
        image: "/swimming-pool.png",
        sport: "Bơi lội",
        amenities: ["Olympic Pool", "Kids Pool", "Sauna", "Swimming Lessons"],
        description: "Hồ bơi tiêu chuẩn Olympic với dịch vụ dạy bơi chuyên nghiệp",
        status: "available" as const,
        openingHours: "05:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 25,
        isVerified: true
    },
    {
        id: "20",
        name: "Luxury Pool & Spa",
        location: "Quận 3",
        price: 250000,
        rating: 4.8,
        image: "/swimming-pool.png",
        sport: "Bơi lội",
        amenities: ["Infinity Pool", "Spa Services", "Pool Bar", "Luxury Amenities"],
        description: "Hồ bơi vô cực sang trọng kèm dịch vụ spa thư giãn",
        status: "available" as const,
        openingHours: "06:00",
        closingHours: "22:00",
        surfaceType: "Cỏ nhân tạo",
        capacity: "11vs11",
        phone: "+84 123 456 789",
        email: "contact@arena.com",
        reviewCount: 16,
        isVerified: true
    }
]

// Dữ liệu các môn thể thao
export const sports: Sport[] = [
    {
        id: "1",
        name: "Bóng đá",
        icon: "⚽",
        image: "/football-soccer-ball.png",
        description: "Môn thể thao vua phổ biến nhất thế giới",
        fieldCount: 45
    },
    {
        id: "2",
        name: "Bóng rổ",
        icon: "🏀",
        image: "/outdoor-basketball-court.png",
        description: "Môn thể thao đồng đội năng động",
        fieldCount: 23
    },
    {
        id: "3",
        name: "Tennis",
        icon: "🎾",
        image: "/outdoor-tennis-court.png",
        description: "Môn thể thao cá nhân đẳng cấp",
        fieldCount: 18
    },
    {
        id: "4",
        name: "Cầu lông",
        icon: "🏸",
        image: "/badminton-court.png",
        description: "Môn thể thao trong nhà phổ biến",
        fieldCount: 32
    },
    {
        id: "5",
        name: "Golf",
        icon: "⛳",
        image: "/lush-golf-course.png",
        description: "Môn thể thao cao cấp và thư giãn",
        fieldCount: 8
    },
    {
        id: "6",
        name: "Bóng chuyền",
        icon: "🏐",
        image: "/volleyball-court.png",
        description: "Môn thể thao đồng đội sôi động",
        fieldCount: 15
    },
    {
        id: "7",
        name: "Bơi lội",
        icon: "🏊",
        image: "/swimming-pool.png",
        description: "Môn thể thao dưới nước tốt cho sức khỏe",
        fieldCount: 12
    },
]

// Dữ liệu giải đấu
export const tournaments: Tournament[] = [
    {
        id: "1",
        name: "Football Tournament",
        sport: "Bóng đá",
        startDate: "2025-10-15",
        endDate: "2025-10-20",
        location: "Quận 1, TP.HCM",
        prizePool: 20000000,
        maxTeams: 16,
        currentTeams: 12,
        image: "/football-tournament-poster.png",
        description: "Giải bóng đá lớn nhất năm với sự tham gia của các đội mạnh nhất thành phố"
    },
    {
        id: "2",
        name: "Basketball Championship",
        sport: "Bóng rổ",
        startDate: "2025-09-01",
        endDate: "2025-09-10",
        location: "Quận 7, TP.HCM",
        prizePool: 30000000,
        maxTeams: 12,
        currentTeams: 8,
        image: "/basketball-tournament-poster.png",
        description: "Giải bóng rổ chuyên nghiệp với format league hấp dẫn"
    },
    {
        id: "3",
        name: "Tennis Open",
        sport: "Tennis",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        location: "Quận 3, TP.HCM",
        prizePool: 20000000,
        maxTeams: 32,
        currentTeams: 24,
        image: "/tennis-tournament-poster.png",
        description: "Giải tennis mở rộng cho tất cả các tay vợt yêu thích môn thể thao này"
    },
    {
        id: "4",
        name: "Badminton Cup",
        sport: "Cầu lông",
        startDate: "2025-12-05",
        endDate: "2025-12-10",
        location: "Quận 5, TP.HCM",
        prizePool: 15000000,
        maxTeams: 24,
        currentTeams: 18,
        image: "/badminton-tournament-poster.png",
        description: "Giải cầu lông tranh cúp với nhiều hạng mục thi đấu"
    },
]

// Dữ liệu bài viết cộng đồng
export const communityPosts: CommunityPost[] = [
    {
        id: "1",
        title: "Tìm 2 người chơi tennis đôi chiều nay",
        content: "Mình và bạn cần tìm thêm 2 người chơi tennis đôi lúc 18h tại sân Lotte Mart Quận 7. Level trung bình, chơi vui vẻ. Chi phí 80k/người bao gồm sân và nước.",
        author: {
            id: "user1",
            name: "Nguyễn Văn An",
            avatar: "NA"
        },
        sport: "Tennis",
        location: "Sân tennis Lotte Mart Q7",
        date: new Date("2024-01-20T18:00:00Z"),
        time: "18:00 - 20:00",
        level: "Trung cấp",
        participants: 2,
        maxParticipants: 4,
        cost: "80k/người",
        likes: 13,
        comments: 5,
        tags: ["Tennis", "Doubles", "Quận 7", "Chiều nay"],
        createdAt: "2024-01-20T10:30:00Z",
        status: "active",
        urgency: "today"
    },
    {
        id: "2",
        title: "Nhóm chạy bộ công viên Tao Đàn 6h sáng",
        content: "Nhóm chạy bộ thường xuyên mời thêm bạn mới. Chúng mình chạy vào 6h sáng thứ 2, 4, 6 tại công viên Tao Đàn. Pace khoảng 5:30-6:00/km. Miễn phí, chỉ cần có tinh thần và giày chạy.",
        author: {
            id: "user2",
            name: "Trần Minh Đức",
            avatar: "TD"
        },
        sport: "Chạy bộ",
        location: "Công viên Tao Đàn",
        date: new Date("2024-01-22T06:00:00Z"),
        time: "06:00 - 07:00",
        level: "Trung cấp",
        participants: 8,
        maxParticipants: 15,
        cost: "Miễn phí",
        likes: 25,
        comments: 12,
        tags: ["Chạy bộ", "Sáng sớm", "Quận 1", "Thường xuyên"],
        createdAt: "2024-01-19T20:15:00Z",
        status: "active",
        urgency: "regular"
    },
    {
        id: "3",
        title: "Giải cầu lông cộng đồng - Đăng ký đến 25/01",
        content: "Giải cầu lông cộng đồng lần thứ 3 sắp diễn ra! Các cấp độ từ nghiệp dư đến nâng cao. Giải thưởng hấp dẫn và cơ hội giao lưu với các tay vợt khác trong cộng đồng.",
        author: {
            id: "user3",
            name: "Lê Thị Hương",
            avatar: "LH"
        },
        sport: "Cầu lông",
        location: "Cung thể thao Rạch Miễu",
        date: new Date("2024-01-28T08:00:00Z"),
        time: "08:00 - 17:00",
        level: "Tất cả",
        participants: 45,
        maxParticipants: 64,
        cost: "200k/người",
        likes: 89,
        comments: 34,
        tags: ["Cầu lông", "Giải đấu", "Cộng đồng", "Giải thưởng"],
        createdAt: "2024-01-18T14:20:00Z",
        status: "hot",
        urgency: "deadline"
    },
    {
        id: "4",
        title: "Bóng đá 7vs7 thiếu 3 người - Khẩn cấp!",
        content: "Trận đá 7vs7 lúc 19h30 tối nay tại sân Phú Thọ thiếu 3 người. Ai có thể đến ngay được không? Level cơ bản, chơi vui vẻ. Chi phí 50k/người.",
        author: {
            id: "user4",
            name: "Phạm Quốc Việt",
            avatar: "PV"
        },
        sport: "Bóng đá",
        location: "Sân bóng Phú Thọ",
        date: new Date("2024-01-20T19:30:00Z"),
        time: "19:30 - 21:00",
        level: "Nghiệp dư",
        participants: 11,
        maxParticipants: 14,
        cost: "50k/người",
        likes: 8,
        comments: 15,
        tags: ["Bóng đá", "7vs7", "Tối nay"],
        createdAt: "2024-01-20T16:45:00Z",
        status: "urgent",
        urgency: "urgent"
    },
    {
        id: "5",
        title: "Swimming group - Bể bơi Lam Sơn 20h",
        content: "Nhóm bơi thường xuyên tối thứ 3, 5, 7. Chúng mình tập luyện technique và endurance. Phù hợp với người biết bơi cơ bản muốn cải thiện kỹ thuật.",
        author: {
            id: "user5",
            name: "Ngô Thu Trang",
            avatar: "NT"
        },
        sport: "Bơi lội",
        location: "Bể bơi Lam Sơn",
        date: new Date("2024-01-23T20:00:00Z"),
        time: "20:00 - 21:30",
        level: "Trung cấp",
        participants: 6,
        maxParticipants: 10,
        cost: "120k/người",
        likes: 16,
        comments: 7,
        tags: ["Bơi lội", "Kỹ thuật", "Tối", "Thường xuyên"],
        createdAt: "2024-01-19T09:10:00Z",
        status: "active",
        urgency: "regular"
    },
    {
        id: "6",
        title: "Basketball 3x3 streetball tournament",
        content: "Giải đấu bóng rổ đường phố 3x3 sắp diễn ra tại sân Gia Định. Đây là cơ hội tốt để thể hiện kỹ năng và gặp gỡ các bạn cùng đam mê basketball.",
        author: {
            id: "user6",
            name: "Đinh Hoàng Nam",
            avatar: "DN"
        },
        sport: "Bóng rổ",
        location: "Sân bóng rổ Gia Định",
        date: new Date("2024-01-27T14:00:00Z"),
        time: "14:00 - 18:00",
        level: "Cao cấp",
        participants: 24,
        maxParticipants: 32,
        cost: "150k/team",
        likes: 42,
        comments: 18,
        tags: ["Bóng rổ", "3x3", "Tournament", "Streetball"],
        createdAt: "2024-01-17T11:30:00Z",
        status: "hot",
        urgency: "upcoming"
    },
    {
        id: "7",
        title: "Yoga buổi sáng tại công viên Lê Văn Tám",
        content: "Lớp yoga miễn phí mỗi sáng chủ nhật tại công viên Lê Văn Tám. Phù hợp cho mọi độ tuổi và trình độ. Mang theo thảm yoga riêng.",
        author: {
            id: "user7",
            name: "Mai Linh Chi",
            avatar: "MC"
        },
        sport: "Yoga",
        location: "Công viên Lê Văn Tám",
        date: new Date("2024-01-21T07:00:00Z"),
        time: "07:00 - 08:00",
        level: "Mới bắt đầu",
        participants: 12,
        maxParticipants: 20,
        cost: "Miễn phí",
        likes: 28,
        comments: 9,
        tags: ["Yoga", "Sáng", "Miễn phí", "Công viên"],
        createdAt: "2024-01-18T16:20:00Z",
        status: "active",
        urgency: "regular"
    },
    {
        id: "8",
        title: "Đạp xe khám phá Sài Gòn cuối tuần",
        content: "Tour đạp xe khám phá những góc phố cổ Sài Gòn. Route dễ đi, phù hợp người mới. Có xe cho thuê. Khởi hành 6h sáng từ công viên 23/9.",
        author: {
            id: "user8",
            name: "Hoàng Minh Tuấn",
            avatar: "HT"
        },
        sport: "Đạp xe",
        location: "Công viên 23/9 - TP.HCM",
        date: new Date("2024-01-21T06:00:00Z"),
        time: "06:00 - 09:00",
        level: "Mới bắt đầu",
        participants: 8,
        maxParticipants: 15,
        cost: "100k/người (bao gồm thuê xe)",
        likes: 35,
        comments: 14,
        tags: ["Đạp xe", "Tour", "Sài Gòn", "Cuối tuần"],
        createdAt: "2024-01-19T12:45:00Z",
        status: "active",
        urgency: "weekend"
    },
    {
        id: "9",
        title: "Volleyball bãi biển - Vũng Tàu",
        content: "Trận volleyball bãi biển tại Vũng Tàu cuối tuần. Chúng mình sẽ thuê sân và có tiệc nướng sau khi chơi. Phù hợp cho nhóm bạn đi chơi.",
        author: {
            id: "user9",
            name: "Lý Thanh Sơn",
            avatar: "LS"
        },
        sport: "Bóng chuyền",
        location: "Bãi biển Vũng Tàu",
        date: new Date("2024-01-20T15:00:00Z"),
        time: "15:00 - 17:00",
        level: "Nghiệp dư",
        participants: 6,
        maxParticipants: 12,
        cost: "200k/người (bao gồm sân + BBQ)",
        likes: 19,
        comments: 11,
        tags: ["Volleyball", "Bãi biển", "Vũng Tàu", "BBQ"],
        createdAt: "2024-01-18T08:30:00Z",
        status: "active",
        urgency: "weekend"
    },
    {
        id: "10",
        title: "Gym buddy tìm bạn tập sáng",
        content: "Tìm gym buddy tập buổi sáng tại California Fitness Crescent Mall. Tập 3 buổi/tuần, focus vào strength training. Có kinh nghiệm 2 năm.",
        author: {
            id: "user10",
            name: "Phạm Đức Thành",
            avatar: "PT"
        },
        sport: "Gym",
        location: "California Fitness Crescent",
        date: new Date("2024-01-22T06:30:00Z"),
        time: "06:30 - 08:00",
        level: "Trung cấp",
        participants: 1,
        maxParticipants: 2,
        cost: "Miễn phí (có thẻ gym riêng)",
        likes: 7,
        comments: 3,
        tags: ["Gym", "Strength", "Sáng", "Buddy"],
        createdAt: "2024-01-19T21:15:00Z",
        status: "active",
        urgency: "regular"
    }
]

// Dữ liệu cộng đồng nổi bật  
export const featuredCommunities = [
    { name: "Tennis Hà Nội", icon: "🎾", trending: true, description: "Giao lưu tennis khắp Hà Nội" },
    { name: "Bóng đá Sài Gòn", icon: "⚽", trending: false, description: "Giao lưu bóng đá khắp Sài Gòn" },
    { name: "Cầu lông Miền Bắc", icon: "🏸", trending: true, description: "Cầu lông từ nghiệp dù đến chuyên nghiệp" },
    { name: "Bóng rổ Streetball", icon: "🏀", trending: false, description: "Basketball cộng đồng" },
    { name: "Bơi lội TP.HCM", icon: "🏊‍♂️", trending: true, description: "Bơi lội và thể dục dưới nước" },
    { name: "Chạy Marathon VN", icon: "🏃‍♂️", trending: false, description: "Cộng đồng runner Việt Nam" }
]

// Trending topics
export const trendingTopics = [
    { tag: "Giải tennis cuối tuần", count: 45, trending: true },
    { tag: "Sân mới quận 1", count: 23, trending: false },
    { tag: "Bóng đá 7vs7", count: 67, trending: true },
    { tag: "Cầu lông đôi", count: 34, trending: false },
    { tag: "Workout buổi sáng", count: 78, trending: true },
    { tag: "Tennis Intermediate", count: 56, trending: false },
    { tag: "Bơi lội 6h sáng", count: 29, trending: true },
    { tag: "Streetball 3vs3", count: 41, trending: false }
]

// Danh sách levels cho form tạo post
export const skillLevels = ["Mới bắt đầu", "Nghiệp dư", "Trung cấp", "Cao cấp", "Chuyên nghiệp"]

// Lịch sử booking cho form
export const bookingHistoryLocations = ["Sân tennis Saigon, Quận 1", "Sân bóng Thể Công, Quận 5", "Sân cầu lông Sunrise, Quận 7"]

// Popular tags cho form
export const popularTags = ["Giao lưu", "Thi đấu", "Học kỹ thuật", "Team building", "Cuối tuần", "Buổi tối", "Indoor", "Outdoor"]

// Dữ liệu lịch sử đặt sân
export const bookingHistory: Booking[] = [
    {
        id: "1",
        fieldId: "1",
        fieldName: "Sân bóng Thế Công",
        userId: "user1",
        date: "2025-08-30",
        time: "08:00 - 10:00",
        duration: 120,
        status: "confirmed",
        totalPrice: 300000,
        location: "123 Đường Lê Lợi, Quận 1",
        court: "Sân số 1",
        image: "/green-football-field.png"
    },
    {
        id: "2",
        fieldId: "2",
        fieldName: "Sân tennis Saigon",
        userId: "user1",
        date: "2025-08-28",
        time: "14:00 - 16:00",
        duration: 120,
        status: "completed",
        totalPrice: 400000,
        location: "789 Trần Hưng Đạo, Quận 5",
        court: "Sân tennis số 2",
        image: "/outdoor-tennis-court.png"
    },
    {
        id: "3",
        fieldId: "3",
        fieldName: "Sân cầu lông Sunrise",
        userId: "user1",
        date: "2025-08-31",
        time: "19:00 - 21:00",
        duration: 120,
        status: "confirmed",
        totalPrice: 160000,
        location: "321 Võ Văn Tần, Quận 3",
        court: "Sân cầu lông số 1",
        image: "/badminton-court.png"
    },
    {
        id: "4",
        fieldId: "4",
        fieldName: "Sân bóng đá Mini FC",
        userId: "user1",
        date: "2025-08-25",
        time: "16:00 - 18:00",
        duration: 120,
        status: "cancelled",
        totalPrice: 360000,
        location: "654 Pasteur, Quận 1",
        court: "Sân mini số 3",
        image: "/professional-football-field.png"
    },
    {
        id: "5",
        fieldId: "2",
        fieldName: "Sân tennis Vinhomes",
        userId: "user1",
        date: "2025-08-27",
        time: "10:00 - 12:00",
        duration: 120,
        status: "completed",
        totalPrice: 500000,
        location: "987 Nguyễn Văn Linh, Quận 7",
        court: "Sân tennis VIP",
        image: "/outdoor-tennis-court.png"
    },
    {
        id: "6",
        fieldId: "1",
        fieldName: "Sân bóng rổ Landmark",
        userId: "user1",
        date: "2025-08-31",
        time: "07:00 - 09:00",
        duration: 120,
        status: "confirmed",
        totalPrice: 240000,
        location: "456 Nguyễn Huệ, Quận 1",
        court: "Sân bóng rổ số 1",
        image: "/outdoor-basketball-court.png"
    },
]

// Dữ liệu phòng chat
export const chatRooms: ChatRoom[] = [
    {
        id: "1",
        name: "Tennis 18:00 - Sân X",
        type: "group",
        participants: [
            { id: "user1", name: "Nguyễn Văn An", avatar: "NA", isOnline: true },
            { id: "user2", name: "Lê Minh Cường", avatar: "LC", isOnline: false }
        ],
        lastMessage: {
            id: "last1",
            text: "Mình đã book sân rồi nè",
            senderId: "user1",
            timestamp: new Date()
        },
        unreadCount: 2,
        hasUnread: true,
        memberCount: 2
    },
    {
        id: "2",
        name: "Phạm Thu Hà",
        type: "private",
        participants: [
            { id: "user1", name: "Current User", avatar: "CU", isOnline: true },
            { id: "user2", name: "Phạm Thu Hà", avatar: "PH", isOnline: false }
        ],
        lastMessage: {
            id: "last2",
            text: "Cần có sân thi?",
            senderId: "user2",
            timestamp: new Date()
        },
        unreadCount: 0,
        hasUnread: false,
        memberCount: 2
    },
    {
        id: "3",
        name: "Bóng đá sáng mai",
        type: "group",
        participants: [
            { id: "user1", name: "Current User", avatar: "CU", isOnline: true },
            { id: "user3", name: "Trần Thị Bình", avatar: "TB", isOnline: true }
        ],
        lastMessage: {
            id: "last3",
            text: "Ai có thể đến sớm setup không?",
            senderId: "user3",
            timestamp: new Date()
        },
        unreadCount: 0,
        hasUnread: false,
        memberCount: 2
    },
]

// Dữ liệu tin nhắn
export const chatMessages: ChatMessage[] = [
    {
        id: "1",
        text: "Chào mọi người! Mình đã book sân rồi nè",
        senderId: "user1",
        roomId: "1",
        timestamp: new Date("2025-08-29T14:25:00Z"),
        type: "text"
    },
    {
        id: "2",
        text: "Lê Minh Cường đã tham gia nhóm",
        senderId: "system",
        roomId: "1",
        timestamp: new Date("2025-08-29T14:26:00Z"),
        type: "text"
    },
    {
        id: "3",
        text: "Xin chào! Mình có thể đến đúng giờ",
        senderId: "user2",
        roomId: "1",
        timestamp: new Date("2025-08-29T14:27:00Z"),
        type: "text"
    },
    {
        id: "4",
        text: "Sân có cho thuê vợt không các bạn?",
        senderId: "user3",
        roomId: "1",
        timestamp: new Date("2025-08-29T14:28:00Z"),
        type: "text"
    },
]

// Dữ liệu đánh giá cho các sân
export const fieldReviewsData: { [fieldId: string]: FieldReviewData } = {
    "1": {
        name: "Journey Multi Sports Turf",
        rating: 4.5,
        totalReviews: 127,
        ratingDistribution: {
            5: 76,
            4: 32,
            3: 13,
            2: 4,
            1: 2,
        }
    },
    "2": {
        name: "Turf Up",
        rating: 4.7,
        totalReviews: 89,
        ratingDistribution: {
            5: 58,
            4: 22,
            3: 7,
            2: 2,
            1: 0,
        }
    },
    "3": {
        name: "Just Dribble",
        rating: 4.3,
        totalReviews: 56,
        ratingDistribution: {
            5: 28,
            4: 18,
            3: 8,
            2: 2,
            1: 0,
        }
    },
    "4": {
        name: "Bangkors Football Turf",
        rating: 4.9,
        totalReviews: 234,
        ratingDistribution: {
            5: 198,
            4: 28,
            3: 6,
            2: 2,
            1: 0,
        }
    }
}

// Dữ liệu reviews cho từng sân
export const reviewsByField: { [fieldId: string]: Review[] } = {
    "1": [
        {
            id: "r1",
            fieldId: "1",
            user: "Nguyễn Văn A",
            avatar: "NA",
            rating: 4,
            comment: "Sân đẹp, thoáng mát, dịch vụ tốt. Sẽ quay lại lần sau!",
            timeAgo: "2 giờ trước",
            images: []
        },
        {
            id: "r2",
            fieldId: "1",
            user: "Trần Thị B",
            avatar: "TB",
            rating: 5,
            comment: "Sân chất lượng cao, nhân viên nhiệt tình",
            timeAgo: "1 ngày trước",
            images: []
        },
        {
            id: "r3",
            fieldId: "1",
            user: "Lê Văn C",
            avatar: "LC",
            rating: 5,
            comment: "Chơi vui, fair play",
            timeAgo: "3 ngày trước",
            images: []
        }
    ],
    "2": [
        {
            id: "r4",
            fieldId: "2",
            user: "Phạm Đức D",
            avatar: "PD",
            rating: 5,
            comment: "Sân rất đẹp, cỏ nhân tạo chất lượng cao!",
            timeAgo: "1 giờ trước",
            images: []
        },
        {
            id: "r5",
            fieldId: "2",
            user: "Hoàng Thị E",
            avatar: "HE",
            rating: 4,
            comment: "Giá hợp lý, dịch vụ tốt",
            timeAgo: "5 giờ trước",
            images: []
        }
    ],
    "3": [
        {
            id: "r6",
            fieldId: "3",
            user: "Vũ Minh F",
            avatar: "VF",
            rating: 4,
            comment: "Sân trong nhà mát mẻ, phù hợp chơi mùa hè",
            timeAgo: "2 ngày trước",
            images: []
        }
    ],
    "4": [
        {
            id: "r7",
            fieldId: "4",
            user: "Đỗ Thành G",
            avatar: "DG",
            rating: 5,
            comment: "Sân chuyên nghiệp nhất từng chơi!",
            timeAgo: "1 ngày trước",
            images: []
        },
        {
            id: "r8",
            fieldId: "4",
            user: "Bùi Hạnh H",
            avatar: "BH",
            rating: 5,
            comment: "Cơ sở vật chất hiện đại, tuyệt vời!",
            timeAgo: "3 ngày trước",
            images: []
        }
    ]
}

// Dữ liệu booking slots cho từng sân
export const fieldBookingSlots: Record<string, Array<{
    time: string;
    price: number;
    available: boolean;
    date?: string;
}>> = {
    "1": [
        { time: "05:00", price: 300000, available: true },
        { time: "07:00", price: 350000, available: true },
        { time: "09:00", price: 400000, available: false },
        { time: "11:00", price: 400000, available: true },
        { time: "13:00", price: 450000, available: true },
        { time: "15:00", price: 450000, available: true },
        { time: "17:00", price: 500000, available: true },
        { time: "19:00", price: 500000, available: false },
        { time: "21:00", price: 450000, available: true },
    ],
    "2": [
        { time: "06:00", price: 400000, available: true },
        { time: "08:00", price: 450000, available: false },
        { time: "10:00", price: 500000, available: true },
        { time: "12:00", price: 500000, available: true },
        { time: "14:00", price: 550000, available: true },
        { time: "16:00", price: 550000, available: true },
        { time: "18:00", price: 600000, available: false },
        { time: "20:00", price: 600000, available: true },
        { time: "22:00", price: 550000, available: true },
    ],
    "3": [
        { time: "05:30", price: 350000, available: true },
        { time: "07:30", price: 400000, available: true },
        { time: "09:30", price: 450000, available: true },
        { time: "11:30", price: 450000, available: false },
        { time: "13:30", price: 500000, available: true },
        { time: "15:30", price: 500000, available: true },
        { time: "17:30", price: 550000, available: true },
        { time: "19:30", price: 550000, available: true },
        { time: "21:30", price: 500000, available: false },
    ],
    "4": [
        { time: "06:00", price: 500000, available: true },
        { time: "08:00", price: 600000, available: true },
        { time: "10:00", price: 700000, available: false },
        { time: "12:00", price: 700000, available: true },
        { time: "14:00", price: 800000, available: true },
        { time: "16:00", price: 800000, available: true },
        { time: "18:00", price: 900000, available: true },
        { time: "20:00", price: 900000, available: false },
        { time: "22:00", price: 800000, available: true },
    ]
}

// Community Post Detail Interfaces and Data
export interface CommunityPostDetail {
    date: string
    time: string
    participants: string
    location: string
    level: string
    price: string
    isExpired: boolean
    weather: {
        temp: string
        condition: string
        humidity: string
    }
    facilities: string[]
    requirements: string[]
    hostInfo: {
        joinedDate: string
        totalActivities: string
        rating: string
        responseRate: string
        isVerified: boolean
        badges: string[]
    }
}

export interface JoinedUser {
    id: string
    name: string
    avatar: string
    isHost: boolean
    timeJoined: string
    verified: boolean
    level: string
    rating: number
    activities: number
}

export interface CommentReply {
    id: number
    author: {
        id: string
        name: string
        avatar: string
    }
    content: string
    timeAgo: string
    likes: number
}

export interface Comment {
    id: number
    author: {
        id: string
        name: string
        avatar: string
    }
    content: string
    timeAgo: string
    likes: number
    replies: CommentReply[]
    isLiked: boolean
}

export interface RelatedPost {
    id: string
    title: string
    sport: string
    time: string
    location: string
    participants: string
    urgent: boolean
    author: string
    price: string
}

export interface SimilarActivity {
    id: string
    title: string
    location: string
    date: string
    time: string
    participants: string
    price: string
}

export const getPostDetailMockData = (postAuthorName: string, postCreatedAt: string): {
    postDetail: CommunityPostDetail
    joinedUsers: JoinedUser[]
    comments: Comment[]
    relatedPosts: RelatedPost[]
    similarActivities: SimilarActivity[]
} => {
    const getAuthorAvatar = (name: string) => name.charAt(0).toUpperCase()

    const formatTimeAgo = (createdAt: string) => {
        const now = new Date()
        const created = new Date(createdAt)
        const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Vừa xong"
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    return {
        postDetail: {
            date: "20/01/2024",
            time: "18:00 - 20:00",
            participants: "3/4 người",
            location: "Sân tennis Saigon, Quận 1",
            level: "Trung cấp",
            price: "80k/người",
            isExpired: false,
            weather: {
                temp: "28°C",
                condition: "☀️ Nắng đẹp",
                humidity: "65%"
            },
            facilities: [
                "Sân tennis chất lượng cao",
                "Đèn chiếu sáng LED",
                "Phòng thay đồ & tắm",
                "Chỗ để xe miễn phí",
                "Nước suối miễn phí",
                "Cho thuê vợt tennis"
            ],
            requirements: [
                "Giày tennis chuyên dụng",
                "Khăn tắm cá nhân",
                "Quần áo thể thao",
                "Tinh thần fair-play"
            ],
            hostInfo: {
                joinedDate: "Tham gia từ 2023",
                totalActivities: "45",
                rating: "4.8",
                responseRate: "95%",
                isVerified: true,
                badges: ["Host tin cậy", "Tổ chức >20 hoạt động", "Response nhanh"]
            }
        },
        joinedUsers: [
            {
                id: "1",
                name: postAuthorName,
                avatar: getAuthorAvatar(postAuthorName),
                isHost: true,
                timeJoined: `Tạo ${formatTimeAgo(postCreatedAt)}`,
                verified: true,
                level: "Cao cấp",
                rating: 4.8,
                activities: 45
            },
            {
                id: "2",
                name: "Trần Thị Bình",
                avatar: "TB",
                isHost: false,
                timeJoined: "Tham gia 1 giờ trước",
                verified: false,
                level: "Trung cấp",
                rating: 4.2,
                activities: 12
            },
            {
                id: "3",
                name: "Lê Minh Cường",
                avatar: "LC",
                isHost: false,
                timeJoined: "Tham gia 45 phút trước",
                verified: true,
                level: "Trung cấp",
                rating: 4.5,
                activities: 23
            }
        ],
        comments: [
            {
                id: 1,
                author: { id: "3", name: "Lê Minh Cường", avatar: "LC" },
                content: "Mình có thể tham gia được không? Đã chơi tennis được 3 năm, level khá ổn 😊 Có kinh nghiệm chơi đôi và hiểu tactics cơ bản.",
                timeAgo: "30 phút trước",
                likes: 3,
                replies: [
                    {
                        id: 11,
                        author: { id: "1", name: postAuthorName, avatar: getAuthorAvatar(postAuthorName) },
                        content: "Chào bạn! Còn 1 chỗ nha, welcome aboard! 🎾 Mình sẽ gửi thông tin chi tiết qua chat.",
                        timeAgo: "25 phút trước",
                        likes: 1
                    },
                    {
                        id: 12,
                        author: { id: "3", name: "Lê Minh Cường", avatar: "LC" },
                        content: "Cảm ơn bạn! Mình sẽ có mặt đúng giờ 😄",
                        timeAgo: "20 phút trước",
                        likes: 0
                    }
                ],
                isLiked: false
            },
            {
                id: 2,
                author: { id: "4", name: "Phạm Thu Hà", avatar: "PH" },
                content: "Sân này có chỗ đậu xe không bạn? Và có cho thuê vợt không? Mình mới chuyển đến HCM nên chưa có vợt riêng.",
                timeAgo: "15 phút trước",
                likes: 1,
                replies: [
                    {
                        id: 21,
                        author: { id: "2", name: "Trần Thị Bình", avatar: "TB" },
                        content: "Có chỗ đậu xe miễn phí bạn nhé! Còn vợt thì sân có cho thuê 30k/cây.",
                        timeAgo: "10 phút trước",
                        likes: 2
                    }
                ],
                isLiked: false
            },
            {
                id: 3,
                author: { id: "5", name: "Nguyễn Văn Đức", avatar: "ND" },
                content: "Sân này mình hay chơi, rất tốt! Ánh sáng đẹp và mặt sân chuẩn 👍 Highly recommended cho ai muốn chơi tennis chất lượng.",
                timeAgo: "10 phút trước",
                likes: 5,
                replies: [],
                isLiked: true
            },
            {
                id: 4,
                author: { id: "6", name: "Hoàng Minh Tuấn", avatar: "HT" },
                content: "Giờ này traffic có kẹt không bạn? Mình đi từ quận 3 🚗",
                timeAgo: "5 phút trước",
                likes: 0,
                replies: [],
                isLiked: false
            }
        ],
        relatedPosts: [
            {
                id: "related-1",
                title: "Thiếu 1 người đá bóng sáng mai 6h",
                sport: "Bóng đá",
                time: "06:00 - 08:00",
                location: "Sân bóng Thể Công Q5",
                participants: "10/11",
                urgent: true,
                author: "Minh Hoàng",
                price: "50k/người"
            },
            {
                id: "related-2",
                title: "Cầu lông doubles tìm cặp chiều nay",
                sport: "Cầu lông",
                time: "15:00 - 17:00",
                location: "Sân cầu lông Sunrise Q7",
                participants: "2/4",
                urgent: false,
                author: "Thu Hương",
                price: "60k/người"
            },
            {
                id: "related-3",
                title: "Nhóm chạy bộ Landmark 81 thứ 7",
                sport: "Chạy bộ",
                time: "06:30 - 08:00",
                location: "Landmark 81",
                participants: "8/15",
                urgent: false,
                author: "Quốc Việt",
                price: "Miễn phí"
            }
        ],
        similarActivities: [
            {
                id: "2",
                title: "Tennis doubles - Tìm 2 người chơi cùng",
                location: "Q.1",
                date: "T6",
                time: "20:00",
                participants: "2/4",
                price: "90k"
            },
            {
                id: "3",
                title: "Tennis singles - Match 1v1 cuối tuần",
                location: "Q.7",
                date: "CN",
                time: "15:00",
                participants: "1/2",
                price: "120k"
            },
            {
                id: "4",
                title: "Tennis buổi sáng cho người mới",
                location: "Q.3",
                date: "T2-6",
                time: "07:00",
                participants: "3/6",
                price: "60k"
            }
        ]
    }
}

// Import thêm types
import { OnlineUser, BookingTab } from '@/types'
import { History, CalendarDays, CheckCircle, XCircle } from 'lucide-react'

// Mock data cho Chat page
export const onlineUsers: OnlineUser[] = [
    { id: "1", name: "Nguyen Van A", avatar: "/placeholder-user.jpg", status: "online" },
    { id: "2", name: "Le Thi B", avatar: "/placeholder-user.jpg", status: "away" },
    { id: "3", name: "Tran Van C", avatar: "/placeholder-user.jpg", status: "busy" }
]

// Mock data cho Booking History page
export const bookingTabs: BookingTab[] = [
    { id: "Tất cả", label: "Tất cả", icon: History, count: 0 },
    { id: "Sắp tới", label: "Sắp tới", icon: CalendarDays, count: 0 },
    { id: "Đã xong", label: "Đã xong", icon: CheckCircle, count: 0 },
    { id: "Đã hủy", label: "Đã hủy", icon: XCircle, count: 0 }
]

export const bookingStatusMap: { [key: string]: string } = {
    "Sắp tới": "confirmed",
    "Đã xong": "completed",
    "Đã hủy": "cancelled"
}

export const sportOptions = [
    { value: "", label: "Tất cả môn thể thao" },
    { value: "football", label: "Bóng đá" },
    { value: "tennis", label: "Tennis" },
    { value: "basketball", label: "Bóng rổ" },
    { value: "badminton", label: "Cầu lông" }
]

// Contact Information Data
export const contactInfo: ContactInfo = {
    id: "contact1",
    title: "ArenaAxis - Hệ thống đặt sân thể thao hàng đầu",
    description: "Chúng tôi cung cấp dịch vụ đặt sân thể thao trực tuyến với hơn 1000+ sân thể thao chất lượng cao trên toàn quốc. Hỗ trợ 24/7 để mang đến trải nghiệm tốt nhất cho khách hàng.",
    address: "123 Đường Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
    phone: ["+84 123 456 789", "+84 987 654 321"],
    email: ["contact@arenaaxis.com", "support@arenaaxis.com"],
    workingHours: {
        weekdays: "Thứ 2 - Thứ 6: 8:00 - 22:00",
        weekends: "Thứ 7 - Chủ nhật: 6:00 - 23:00"
    },
    socialMedia: {
        facebook: "https://facebook.com/arenaaxis",
        instagram: "https://instagram.com/arenaaxis",
        twitter: "https://twitter.com/arenaaxis",
        youtube: "https://youtube.com/@arenaaxis"
    }
}

// FAQ Data
export const faqData: FAQ[] = [
    {
        id: "faq1",
        question: "Làm thế nào để đặt sân thể thao?",
        answer: "Bạn có thể đặt sân thông qua ứng dụng hoặc website của chúng tôi. Chọn loại sân, địa điểm, thời gian và thanh toán trực tuyến. Sau khi thanh toán thành công, bạn sẽ nhận được mã xác nhận qua email và SMS.",
        category: "booking",
        isPopular: true
    },
    {
        id: "faq2",
        question: "Có thể hủy hoặc thay đổi lịch đặt sân không?",
        answer: "Có, bạn có thể hủy hoặc thay đổi lịch đặt sân trước 24 giờ để được hoàn tiền 100%. Hủy trong vòng 12-24 giờ sẽ tính phí 50%. Hủy trong vòng 12 giờ sẽ không được hoàn tiền.",
        category: "booking",
        isPopular: true
    },
    {
        id: "faq3",
        question: "Ứng dụng hỗ trợ những phương thức thanh toán nào?",
        answer: "Chúng tôi hỗ trợ nhiều phương thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, MasterCard), Ví điện tử (MoMo, ZaloPay, VNPay), Chuyển khoản ngân hàng và thanh toán tại sân.",
        category: "payment",
        isPopular: true
    },
    {
        id: "faq4",
        question: "Làm sao để tham gia giải đấu thể thao?",
        answer: "Theo dõi trang giải đấu trong ứng dụng để cập nhật thông tin các giải đấu mới. Đăng ký tham gia và thanh toán lệ phí. Chúng tôi sẽ gửi thông tin chi tiết về lịch thi đấu, địa điểm qua email và SMS.",
        category: "tournament",
        isPopular: true
    },
    {
        id: "faq5",
        question: "Có được xem sân trước khi đặt không?",
        answer: "Có, tất cả các sân đều có hình ảnh và video thực tế. Bạn cũng có thể đọc đánh giá từ những khách hàng đã sử dụng dịch vụ. Ngoài ra, bạn có thể đến tham quan sân trước khi quyết định đặt.",
        category: "booking",
        isPopular: false
    },
    {
        id: "faq6",
        question: "Tôi quên mật khẩu, làm sao để khôi phục?",
        answer: "Bạn có thể khôi phục mật khẩu bằng cách click vào 'Quên mật khẩu' trên trang đăng nhập, nhập email đăng ký. Chúng tôi sẽ gửi link khôi phục mật khẩu đến email của bạn.",
        category: "account",
        isPopular: false
    }
]

// Office Locations Data
export const officeLocations: OfficeLocation[] = [
    {
        id: "office1",
        name: "Văn phòng chính - TP.HCM",
        address: "123 Đường Nguyễn Văn Cừ, Phường Nguyễn Cư Trinh, Quận 1, TP.HCM",
        coordinates: { lat: 10.7769, lng: 106.7009 },
        phone: "+84 123 456 789",
        email: "hcm@arenaaxis.com",
        type: "main"
    },
    {
        id: "office2",
        name: "Chi nhánh Hà Nội",
        address: "456 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội",
        coordinates: { lat: 21.0285, lng: 105.8542 },
        phone: "+84 987 654 321",
        email: "hanoi@arenaaxis.com",
        type: "branch"
    }
]

// User Settings Data
export const userSettings: UserSettings = {
    theme: "light",
    language: "vi",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    eventReminders: true,
    weeklyDigest: true
}

// Profile Activities Data
export const profileActivities: ProfileActivity[] = [
    {
        id: "activity1",
        type: "booking",
        title: "Đặt sân bóng đá",
        description: "Journey Multi Sports Turf - 14:00-16:00",
        date: "2024-12-20T14:00:00Z",
        icon: "calendar",
        status: "completed"
    },
    {
        id: "activity2",
        type: "tournament",
        title: "Tham gia giải đấu",
        description: "Giải bóng đá phong trào quận 1",
        date: "2024-12-18T09:00:00Z",
        icon: "trophy",
        status: "completed"
    },
    {
        id: "activity3",
        type: "review",
        title: "Đánh giá sân",
        description: "Đánh giá 5 sao cho Turf Up Football Arena",
        date: "2024-12-17T20:30:00Z",
        icon: "star"
    },
    {
        id: "activity4",
        type: "community",
        title: "Đăng bài tìm đồng đội",
        description: "Tìm 2 người chơi tennis cuối tuần",
        date: "2024-12-15T10:15:00Z",
        icon: "users"
    }
]

// User Achievements Data
export const userAchievements: UserAchievement[] = [
    {
        id: "achievement1",
        title: "Người chơi tích cực",
        description: "Đặt sân 20 lần trong tháng",
        icon: "calendar-check",
        unlockedAt: "2024-12-01T00:00:00Z",
        progress: 25,
        maxProgress: 25,
        category: "booking"
    },
    {
        id: "achievement2",
        title: "Thành viên đáng tin cậy",
        description: "Nhận 50 đánh giá 5 sao",
        icon: "star",
        unlockedAt: "2024-11-15T00:00:00Z",
        progress: 50,
        maxProgress: 50,
        category: "social"
    },
    {
        id: "achievement3",
        title: "Vô địch giải đấu",
        description: "Giành chiến thắng trong giải đấu",
        icon: "trophy",
        unlockedAt: "2024-10-20T00:00:00Z",
        progress: 1,
        maxProgress: 1,
        category: "tournament"
    },
    {
        id: "achievement4",
        title: "Người đồng hành",
        description: "Sử dụng ứng dụng liên tục 100 ngày",
        icon: "heart",
        unlockedAt: "",
        progress: 87,
        maxProgress: 100,
        category: "loyalty"
    }
]
