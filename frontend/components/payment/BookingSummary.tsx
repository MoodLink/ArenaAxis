// Component hiển thị thông tin đặt sân trước khi thanh toán
// Hiển thị tóm tắt booking với hình ảnh, thông tin chi tiết và giá

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

interface BookingInfo {
    id: string // ID booking
    fieldName: string // Tên sân
    location: string // Địa điểm
    date: string // Ngày đặt
    time: string // Giờ đặt
    duration: string // Thời lượng
    court: string // Tên sân cụ thể
    price: number // Giá tiền
    image?: string // Hình ảnh sân (optional)
}

interface BookingSummaryProps {
    booking: BookingInfo // Thông tin booking
    currency?: string // Ký hiệu tiền tệ (default: ₫)
}

export default function BookingSummary({
    booking,
    currency = "₫"
}: BookingSummaryProps) {
    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    {/* Hình ảnh sân */}
                    <img
                        src={booking.image || "/green-football-field-with-trees-and-goal-posts.png"}
                        alt={`Sân ${booking.fieldName}`}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1">
                        {/* Tên sân và địa điểm */}
                        <h2 className="text-xl font-bold mb-2">{booking.fieldName}</h2>
                        <p className="text-gray-600 mb-3">{booking.location}</p>

                        {/* Grid thông tin chi tiết */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {/* Ngày đặt */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>{booking.date}</span>
                            </div>

                            {/* Thời lượng */}
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{booking.duration}</span>
                            </div>

                            {/* Giờ đặt */}
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{booking.time}</span>
                            </div>

                            {/* Tên sân cụ thể */}
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{booking.court}</span>
                            </div>
                        </div>

                        {/* Hiển thị giá */}
                        <div className="mt-4 text-right">
                            <span className="text-2xl font-bold text-green-600">
                                {currency} {booking.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
