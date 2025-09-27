// Component hiển thị mô tả chi tiết của sân
// Bao gồm mô tả và thông tin nhanh

import { Card, CardContent } from "@/components/ui/card"
import { Field } from "@/types"

interface FieldDescriptionProps {
    field: Field
}

export default function FieldDescription({ field }: FieldDescriptionProps) {
    return (
        <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Mô tả sân bóng</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                    {field.description}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{field.openingHours} - {field.closingHours}</div>
                        <div className="text-sm text-gray-600">Giờ hoạt động</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{field.capacity}</div>
                        <div className="text-sm text-gray-600">Sức chứa</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{field.surfaceType}</div>
                        <div className="text-sm text-gray-600">Bề mặt</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                            {field.status === 'available' ? '✓' : field.status === 'unavailable' ? '✗' : '⚠️'}
                        </div>
                        <div className="text-sm text-gray-600">
                            {field.status === 'available' ? 'Có sẵn' : field.status === 'unavailable' ? 'Không có sẵn' : 'Bảo trì'}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
