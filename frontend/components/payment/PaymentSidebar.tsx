// Component sidebar hiển thị ưu đãi và giải đấu
// Bao gồm banner khuyến mãi và danh sách giải đấu sắp tới

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy } from "lucide-react"

interface Offer {
    id: string // ID ưu đãi
    title: string // Tiêu đề
    description: string // Mô tả
    image: string // Hình ảnh
    validUntil?: string // Hạn sử dụng
    discount?: string // Phần trăm giảm giá
}

interface Tournament {
    id: string // ID giải đấu
    name: string // Tên giải đấu
    sport: string // Môn thể thao
    date: string // Ngày tổ chức
    location: string // Địa điểm
    image: string // Poster giải đấu
    status: "upcoming" | "registration" | "ongoing" // Trạng thái
    prizePool?: string // Giải thưởng
}

interface PaymentSidebarProps {
    offers?: Offer[] // Danh sách ưu đãi
    tournaments?: Tournament[] // Danh sách giải đấu
}

// Dữ liệu mặc định
const defaultOffers: Offer[] = [
    {
        id: "1",
        title: "ƯU ĐÃI ĐẶC BIỆT",
        description: "Giảm giá lên đến 30% cho lần đặt sân tiếp theo",
        image: "/mega-offer-turf-promotion-banner.png",
        validUntil: "31/12/2024",
        discount: "30%"
    }
]

const defaultTournaments: Tournament[] = [
    {
        id: "1",
        name: "Giải bóng đá mùa đông",
        sport: "Bóng đá",
        date: "15/12/2024",
        location: "Sân Thống Nhất",
        image: "/football-tournament-poster.png",
        status: "registration",
        prizePool: "50 triệu VNĐ"
    },
    {
        id: "2",
        name: "Champions League Mini",
        sport: "Bóng đá",
        date: "22/12/2024",
        location: "Sân Rạch Miễu",
        image: "/football-tournament-dark-poster.png",
        status: "upcoming",
        prizePool: "100 triệu VNĐ"
    },
    {
        id: "3",
        name: "Giải bóng rổ học sinh",
        sport: "Bóng rổ",
        date: "5/1/2025",
        location: "Sân Phan Đình Phùng",
        image: "/basketball-tournament-poster.png",
        status: "upcoming",
        prizePool: "30 triệu VNĐ"
    }
]

// Helper function để lấy màu status
const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
        case "registration":
            return "bg-green-100 text-green-800"
        case "ongoing":
            return "bg-blue-100 text-blue-800"
        case "upcoming":
            return "bg-gray-100 text-gray-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

// Helper function để lấy text status
const getStatusText = (status: Tournament["status"]) => {
    switch (status) {
        case "registration":
            return "Đang đăng ký"
        case "ongoing":
            return "Đang diễn ra"
        case "upcoming":
            return "Sắp diễn ra"
        default:
            return "Chưa xác định"
    }
}

export default function PaymentSidebar({
    offers = defaultOffers,
    tournaments = defaultTournaments
}: PaymentSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Ưu đãi đặc biệt */}
            {offers.length > 0 && (
                <Card>
                    <CardContent className="p-0">
                        {offers.map((offer) => (
                            <div key={offer.id}>
                                {/* Header với gradient */}
                                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
                                    <h3 className="text-lg font-bold mb-2">{offer.title}</h3>
                                    <p className="text-sm opacity-90">{offer.description}</p>

                                    {/* Hiển thị giảm giá nếu có */}
                                    {offer.discount && (
                                        <div className="mt-3">
                                            <Badge variant="secondary" className="bg-white text-green-700">
                                                Giảm {offer.discount}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Hình ảnh ưu đãi */}
                                <div className="p-4">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full rounded-lg"
                                    />

                                    {/* Hạn sử dụng */}
                                    {offer.validUntil && (
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Có hiệu lực đến: {offer.validUntil}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Giải đấu */}
            {tournaments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            GIẢI ĐẤU
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tournaments.map((tournament) => (
                            <div key={tournament.id} className="relative group cursor-pointer">
                                {/* Hình ảnh giải đấu */}
                                <div className="relative overflow-hidden rounded-lg">
                                    <img
                                        src={tournament.image}
                                        alt={tournament.name}
                                        className="w-full transition-transform group-hover:scale-105"
                                    />

                                    {/* Overlay với thông tin */}
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-center p-4">
                                            <h4 className="font-bold mb-2">{tournament.name}</h4>

                                            {/* Thông tin chi tiết */}
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{tournament.date}</span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{tournament.location}</span>
                                                </div>

                                                {tournament.prizePool && (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Trophy className="w-3 h-3" />
                                                        <span>{tournament.prizePool}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Badge trạng thái */}
                                    <div className="absolute top-2 right-2">
                                        <Badge className={getStatusColor(tournament.status)}>
                                            {getStatusText(tournament.status)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
