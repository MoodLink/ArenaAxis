// Field Detail View Component
// Hiển thị chi tiết sân

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
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

    return (
        <div className="space-y-4">
            {/* Field Image and Basic Info */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={field.avatar || "/placeholder.svg"}
                                alt={field.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{field.name}</h3>
                                {getStatusBadge(field.status || 'unavailable')}
                            </div>
                            <p className="text-gray-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {field.sport_name || 'Chưa cập nhật'}
                            </p>
                            {field.rating && (
                                <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium">{field.rating} đánh giá</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Field Details */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Thông tin sân</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tên sân:</span>
                            <span className="font-medium">{field.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Môn thể thao:</span>
                            <span className="font-medium">{field.sport_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Giá thuê:</span>
                            <span className="font-medium">{formatCurrency(field.price || 0)}/giờ</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Chủ sân:</span>
                            <span className="font-medium">{field.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className="font-medium">
                                {field.status === 'available' ? 'Hoạt động' : 'Không khả dụng'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ngày tạo:</span>
                            <span className="font-medium">
                                {field.createdAt ? new Date(field.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}