// Component hiển thị mô tả chi tiết của sân
// Bao gồm mô tả và thông tin nhanh

import { Card, CardContent } from "@/components/ui/card"
import { Field } from "@/types"

interface FieldDescriptionProps {
    field: Field
}

export default function FieldDescription({ field }: FieldDescriptionProps) {
    // Format price
    const formattedPrice = ((field.defaultPrice || 0) as number).toLocaleString('vi-VN')

    // Determine status display
    const statusDisplay = field.activeStatus === 'available'
        ? { icon: '✓', text: 'Đang hoạt động', color: 'text-emerald-600' }
        : { icon: '✗', text: 'Tạm đóng', color: 'text-red-600' }

    return (
        <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Mô tả sân</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                    {field.description || 'Thông tin chi tiết sẽ được cập nhật sớm.'}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                            {field.openingHours && field.closingHours
                                ? `${field.openingHours} - ${field.closingHours}`
                                : 'Liên hệ'}
                        </div>
                        <div className="text-sm text-gray-600">Giờ hoạt động</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{formattedPrice}đ</div>
                        <div className="text-sm text-gray-600">Giá mặc định</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{field.sport_name || 'N/A'}</div>
                        <div className="text-sm text-gray-600">Môn thể thao</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${statusDisplay.color}`}>
                            {statusDisplay.icon}
                        </div>
                        <div className="text-sm text-gray-600">
                            {statusDisplay.text}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Capacity */}
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-3xl mr-3">👥</div>
                        <div>
                            <div className="text-sm text-gray-600">Sức chứa</div>
                            <div className="font-semibold text-gray-800">{field.capacity || 'Liên hệ'}</div>
                        </div>
                    </div>

                    {/* Surface Type */}
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="text-3xl mr-3">🏟️</div>
                        <div>
                            <div className="text-sm text-gray-600">Loại bề mặt</div>
                            <div className="font-semibold text-gray-800">{field.surfaceType || 'Liên hệ'}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
