// Component hiển thị booking với thiết kế hiện đại
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    MoreVertical,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye
} from "lucide-react"
import { Booking } from "@/types"

interface EnhancedBookingCardProps {
    booking: Booking
    onAction?: (bookingId: string, action: string) => void
}

export default function EnhancedBookingCard({ booking, onAction }: EnhancedBookingCardProps) {
    // Hàm lấy icon theo trạng thái
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "confirmed": return <CheckCircle className="w-4 h-4 text-blue-600" />
            case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />
            case "cancelled": return <XCircle className="w-4 h-4 text-red-600" />
            case "pending": return <AlertCircle className="w-4 h-4 text-yellow-600" />
            default: return <AlertCircle className="w-4 h-4 text-gray-600" />
        }
    }

    // Hàm format thời gian
    const formatDateTime = (date: string, time: string) => {
        return new Date(`${date}T${time}`).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Header với tên sân và trạng thái */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {booking.fieldName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {booking.location || "Chưa có địa chỉ"}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {getStatusIcon(booking.status)}
                                <Badge
                                    className={`
                    ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                    ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                    px-3 py-1 font-medium border
                  `}
                                >
                                    {booking.status === 'confirmed' && 'Đã xác nhận'}
                                    {booking.status === 'completed' && 'Đã hoàn thành'}
                                    {booking.status === 'cancelled' && 'Đã hủy'}
                                    {booking.status === 'pending' && 'Chờ xác nhận'}
                                </Badge>
                            </div>
                        </div>

                        {/* Thông tin chi tiết trong grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3 border">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Ngày đặt
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatDateTime(booking.date, booking.time)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 border">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Thời gian
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {booking.time} ({booking.duration}p)
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 border">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        Tổng tiền
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-green-600">
                                    {booking.totalPrice.toLocaleString('vi-VN')}đ
                                </p>
                            </div>

                            {booking.court && (
                                <div className="bg-gray-50 rounded-xl p-3 border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                            Sân số
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {booking.court}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span className="text-sm text-gray-600">
                                    Đặt sân lúc {new Date(booking.date).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAction?.(booking.id, "Chi tiết")}
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Chi tiết
                                </Button>

                                {booking.status === 'confirmed' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        onClick={() => onAction?.(booking.id, "Hủy đặt")}
                                    >
                                        Hủy đặt
                                    </Button>
                                )}

                                {booking.status === 'completed' && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => onAction?.(booking.id, "Đặt lại")}
                                    >
                                        Đặt lại
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}