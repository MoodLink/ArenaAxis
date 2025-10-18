// Component hiển thị một booking trong lịch sử
// Cho phép người dùng xem thông tin và thực hiện các hành động

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react"
import { Booking } from "@/types"

interface BookingCardProps {
    booking: Booking // Thông tin booking
    onAction?: (bookingId: string, action: string) => void // Callback khi thực hiện hành động
}

export default function BookingCard({ booking, onAction }: BookingCardProps) {
    // Hàm lấy icon theo môn thể thao
    const getSportIcon = (sport: string) => {
        const sportLower = sport.toLowerCase()
        if (sportLower.includes("bóng đá") || sportLower.includes("mini fc")) return "⚽"
        if (sportLower.includes("tennis") || sportLower.includes("vinhomes")) return "🎾"
        if (sportLower.includes("cầu lông")) return "🏸"
        if (sportLower.includes("bóng rổ")) return "🏀"
        return "⚽"
    }

    // Derive additional properties from Booking data
    const getSportColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-500"
            case "pending": return "bg-yellow-500"
            case "completed": return "bg-blue-500"
            case "cancelled": return "bg-red-500"
            default: return "bg-gray-500"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "completed": return "bg-blue-100 text-blue-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "confirmed": return "Đã xác nhận"
            case "pending": return "Chờ xác nhận"
            case "completed": return "Đã hoàn thành"
            case "cancelled": return "Đã hủy"
            default: return status
        }
    }

    const getAvailableActions = (status: string) => {
        switch (status) {
            case "confirmed": return ["Chi tiết", "Hủy đặt"]
            case "pending": return ["Chi tiết", "Hủy đặt"]
            case "completed": return ["Chi tiết", "Đặt lại"]
            case "cancelled": return ["Chi tiết", "Đặt lại"]
            default: return ["Chi tiết"]
        }
    }

    const getSportFromFieldName = (fieldName: string) => {
        if (fieldName.toLowerCase().includes("bóng đá")) return "Bóng đá"
        if (fieldName.toLowerCase().includes("tennis")) return "Tennis"
        if (fieldName.toLowerCase().includes("cầu lông")) return "Cầu lông"
        if (fieldName.toLowerCase().includes("bóng rổ")) return "Bóng rổ"
        return "Thể thao"
    }

    // Xử lý click hành động
    const handleActionClick = (action: string) => {
        onAction?.(booking.id, action)
    }

    return (
        <Card className="hover:shadow-md transition-shadow bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        {/* Icon môn thể thao */}
                        <div
                            className={`${getSportColor(booking.status)} text-white rounded-lg p-3 flex items-center justify-center min-w-[60px] h-[60px]`}
                        >
                            <span className="text-2xl">{getSportIcon(getSportFromFieldName(booking.fieldName))}</span>
                        </div>                        {/* Thông tin chi tiết booking */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Tên sân */}
                                <h3 className="text-lg font-bold text-gray-900">{booking.fieldName}</h3>

                                {/* Badge trạng thái */}
                                <Badge className={`${getStatusColor(booking.status)} border-0 text-xs font-medium`}>
                                    {getStatusText(booking.status)}
                                </Badge>
                            </div>

                            {/* Các thông tin chi tiết */}
                            <div className="space-y-2 text-sm text-gray-600">
                                {/* Địa điểm */}
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{booking.location}</span>
                                </div>

                                {/* Ngày */}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>{booking.date}</span>
                                </div>

                                {/* Giờ */}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span>{booking.time}</span>
                                </div>

                                {/* Giá tiền */}
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-semibold text-green-600">{booking.totalPrice.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Các nút hành động */}
                    <div className="flex flex-col gap-2 ml-4">
                        {getAvailableActions(booking.status).map((action, index) => (
                            <Button
                                key={index}
                                onClick={() => handleActionClick(action)}
                                variant={action === "Hủy đặt" ? "destructive" : "outline"}
                                size="sm"
                                className={`min-w-[80px] text-xs ${action === "Chi tiết"
                                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : action === "Đặt lại"
                                        ? "border-green-600 text-green-600 hover:bg-green-50"
                                        : ""
                                    }`}
                            >
                                {action}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
