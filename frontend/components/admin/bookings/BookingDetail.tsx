// Booking Detail View Component
// Hiển thị chi tiết booking

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Calendar, Clock, CreditCard, FileText, User } from "lucide-react"
import { AdminBooking } from "@/data/mockDataAdmin"

interface BookingDetailProps {
    booking: AdminBooking
}

export default function BookingDetail({ booking }: BookingDetailProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-blue-100 text-blue-800">Đã xác nhận</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>
            case 'failed':
                return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>
            case 'refunded':
                return <Badge className="bg-purple-100 text-purple-800">Đã hoàn tiền</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Booking Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Booking #{booking.id}</h3>
                    <p className="text-gray-600">Tạo lúc {formatDate(booking.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
            </div>

            {/* Customer Info */}
            <Card>
                <CardContent className="p-6">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin khách hàng
                    </h4>
                    <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg">
                                {booking.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <h5 className="font-medium">{booking.userName}</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {booking.userPhone}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field Info */}
                <Card>
                    <CardContent className="p-6">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Thông tin sân
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">{booking.fieldName}</p>
                                <p className="text-sm text-gray-600">{booking.fieldLocation}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule Info */}
                <Card>
                    <CardContent className="p-6">
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Thông tin lịch đặt
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>Thời lượng: {booking.duration} phút</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Info */}
            <Card>
                <CardContent className="p-6">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Thông tin thanh toán
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Phương thức</p>
                            <p className="font-medium">{booking.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng tiền</p>
                            <p className="font-medium text-lg">{formatCurrency(booking.totalPrice)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Trạng thái</p>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            {booking.notes && (
                <Card>
                    <CardContent className="p-6">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Ghi chú
                        </h4>
                        <p className="text-gray-700">{booking.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}