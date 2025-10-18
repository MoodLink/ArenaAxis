// Component hiển thị một booking item trong danh sách
"use client"

import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Booking } from "@/types"

interface BookingItemProps {
    booking: Booking
    onBookingAction: (bookingId: string, action: string) => void
}

export default function BookingItem({ booking, onBookingAction }: BookingItemProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            confirmed: { className: 'bg-blue-100 text-blue-800', label: 'Đã xác nhận' },
            completed: { className: 'bg-green-100 text-green-800', label: 'Đã hoàn thành' },
            cancelled: { className: 'bg-red-100 text-red-800', label: 'Đã hủy' },
            pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Chờ xác nhận' }
        }
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    }

    const statusInfo = getStatusBadge(booking.status)

    return (
        <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Booking Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{booking.fieldName}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {booking.location || "Chưa có địa chỉ"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {booking.time} • {booking.duration}p
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Ngày đặt</p>
                                <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Thời gian</p>
                                <p className="text-sm font-semibold text-gray-900">{booking.time}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Thời lượng</p>
                                <p className="text-sm font-semibold text-gray-900">{booking.duration} phút</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tổng tiền</p>
                                <p className="text-sm font-semibold text-green-600">
                                    {booking.totalPrice.toLocaleString()}đ
                                </p>
                            </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between">
                            <Badge className={`${statusInfo.className} px-3 py-1 font-medium`}>
                                {statusInfo.label}
                            </Badge>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onBookingAction(booking.id, "Chi tiết")}
                                >
                                    Chi tiết
                                </Button>
                                {booking.status === 'confirmed' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => onBookingAction(booking.id, "Hủy đặt")}
                                    >
                                        Hủy đặt
                                    </Button>
                                )}
                                {booking.status === 'completed' && (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => onBookingAction(booking.id, "Đặt lại")}
                                    >
                                        Đặt lại
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}