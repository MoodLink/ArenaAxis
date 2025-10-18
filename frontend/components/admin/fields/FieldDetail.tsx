// Field Detail View Component
// Hiển thị chi tiết sân

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Star, Users, CheckCircle, AlertCircle } from "lucide-react"
import { AdminField } from "@/data/mockDataAdmin"

interface FieldDetailProps {
    field: AdminField
}

export default function FieldDetail({ field }: FieldDetailProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
            case 'unavailable':
                return <Badge className="bg-red-100 text-red-800">Không khả dụng</Badge>
            case 'maintenance':
                return <Badge className="bg-yellow-100 text-yellow-800">Bảo trì</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getVerificationBadge = (isVerified: boolean) => {
        return isVerified ? (
            <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Đã xác minh
            </Badge>
        ) : (
            <Badge className="bg-gray-100 text-gray-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Chưa xác minh
            </Badge>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    return (
        <div className="space-y-4">
            {/* Field Image and Basic Info */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={field.image}
                                alt={field.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{field.name}</h3>
                                {getStatusBadge(field.status)}
                            </div>
                            <p className="text-gray-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {field.location}
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    {field.rating} ({field.reviewCount} đánh giá)
                                </span>
                                {getVerificationBadge(field.isVerified)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Field Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact & Business Info */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Thông tin liên hệ</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">{field.ownerName}</p>
                                    <p className="text-sm text-gray-600">Chủ sân</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">{field.ownerPhone}</p>
                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">{field.email}</p>
                                    <p className="text-sm text-gray-600">Email</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Field Specs */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Thông tin sân</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Môn thể thao:</span>
                                <span className="font-medium">{field.sport}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giá thuê:</span>
                                <span className="font-medium">{formatCurrency(field.price)}/giờ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sức chứa:</span>
                                <span className="font-medium">{field.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loại sân:</span>
                                <span className="font-medium">{field.surfaceType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giờ hoạt động:</span>
                                <span className="font-medium">{field.openingHours} - {field.closingHours}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Business Performance */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Hiệu suất kinh doanh</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{field.bookingsThisMonth}</p>
                            <p className="text-sm text-gray-600">Booking tháng này</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(field.revenueThisMonth)}</p>
                            <p className="text-sm text-gray-600">Doanh thu tháng này</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-600">{field.lastBooking}</p>
                            <p className="text-sm text-gray-600">Booking gần nhất</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Tiện ích</h4>
                    <div className="flex flex-wrap gap-2">
                        {field.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">
                                {amenity}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            {field.description && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Mô tả</h4>
                        <p className="text-gray-600">{field.description}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}