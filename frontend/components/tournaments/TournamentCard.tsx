// Component hiển thị thông tin chi tiết một giải đấu
// Layout card với poster, thông tin và nút đăng ký

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Trophy, MapPin } from "lucide-react"
import { Tournament } from "@/types"

interface TournamentCardProps {
    tournament: Tournament // Dữ liệu giải đấu
    onRegisterClick?: (tournamentId: string) => void // Callback khi click đăng ký
    onViewDetails?: (tournamentId: string) => void // Callback khi click xem chi tiết
}

// Helper function để lấy màu status dựa trên ngày và dữ liệu
const getStatusColor = (tournament: Tournament) => {
    const currentDate = new Date()
    const startDate = new Date(tournament.startDate)
    const endDate = new Date(tournament.endDate)

    if (currentDate > endDate) {
        return "bg-gray-100 text-gray-800" // Completed
    } else if (currentDate >= startDate && currentDate <= endDate) {
        return "bg-blue-100 text-blue-800" // Ongoing
    } else if (tournament.currentTeams >= tournament.maxTeams) {
        return "bg-red-100 text-red-800" // Registration Closed
    } else {
        return "bg-green-100 text-green-800" // Open Registration
    }
}

// Helper function để lấy text status
const getStatusText = (tournament: Tournament) => {
    const currentDate = new Date()
    const startDate = new Date(tournament.startDate)
    const endDate = new Date(tournament.endDate)

    if (currentDate > endDate) {
        return "Đã kết thúc"
    } else if (currentDate >= startDate && currentDate <= endDate) {
        return "Đang diễn ra"
    } else if (tournament.currentTeams >= tournament.maxTeams) {
        return "Hết chỗ"
    } else {
        return "Đang mở đăng ký"
    }
}

// Helper function để lấy text nút
const getButtonText = (tournament: Tournament) => {
    const currentDate = new Date()
    const startDate = new Date(tournament.startDate)
    const endDate = new Date(tournament.endDate)

    if (currentDate > endDate) {
        return "Đã kết thúc"
    } else if (currentDate >= startDate && currentDate <= endDate) {
        return "Đang diễn ra"
    } else if (tournament.currentTeams >= tournament.maxTeams) {
        return "Đã đóng đăng ký"
    } else {
        return "Đăng ký tham gia"
    }
}

export default function TournamentCard({
    tournament,
    onRegisterClick,
    onViewDetails
}: TournamentCardProps) {
    // Derive values from Tournament data
    const formattedDate = `${tournament.startDate} - ${tournament.endDate}`
    const participantsText = `${tournament.currentTeams}/${tournament.maxTeams} đội`
    const prizeText = "₫ " + tournament.prizePool.toLocaleString('vi-VN')
    const canRegister = tournament.currentTeams < tournament.maxTeams && new Date() < new Date(tournament.startDate)

    // Xử lý click nút chính
    const handleMainButtonClick = () => {
        if (canRegister && onRegisterClick) {
            onRegisterClick(tournament.id)
        } else if (onViewDetails) {
            onViewDetails(tournament.id)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Poster giải đấu */}
            <div className="aspect-[4/3] relative overflow-hidden">
                <img
                    src={tournament.image || "/placeholder.svg"}
                    alt={tournament.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament)}`}>
                        {getStatusText(tournament)}
                    </span>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Nội dung card */}
            <CardContent className="p-6">
                {/* Tên giải đấu */}
                <h3 className="text-xl font-bold mb-4 line-clamp-2">{tournament.name}</h3>

                {/* Thông tin chi tiết */}
                <div className="space-y-3 mb-6">
                    {/* Ngày tổ chức */}
                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="text-sm">{formattedDate}</span>
                    </div>

                    {/* Địa điểm */}
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="text-sm">{tournament.location}</span>
                    </div>

                    {/* Số lượng tham gia */}
                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="text-sm">{participantsText}</span>
                    </div>

                    {/* Giải thưởng */}
                    <div className="flex items-center text-gray-600">
                        <Trophy className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="text-sm font-semibold text-green-600">{prizeText}</span>
                    </div>
                </div>

                {/* Mô tả ngắn nếu có */}
                {tournament.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tournament.description}
                    </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                    {/* Nút chính - đăng ký hoặc xem chi tiết */}
                    <Button
                        className="flex-1"
                        disabled={!canRegister && new Date() < new Date(tournament.startDate)}
                        onClick={handleMainButtonClick}
                        variant={canRegister ? "default" : "outline"}
                    >
                        {getButtonText(tournament)}
                    </Button>

                    {/* Nút xem chi tiết */}
                    {canRegister && (
                        <Button
                            variant="outline"
                            onClick={() => onViewDetails?.(tournament.id)}
                            className="px-3"
                        >
                            Chi tiết
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
