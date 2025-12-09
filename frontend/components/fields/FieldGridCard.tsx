// Component hiển thị thông tin sân dưới dạng grid card
// Layout cố định đảm bảo không bị lệch khi nội dung khác nhau

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Star, Heart } from "lucide-react"
import { Field } from "@/types"

interface FieldGridCardProps {
    field: Field // Dữ liệu sân
    onFavoriteClick?: (fieldId: string) => void // Callback khi click yêu thích
    onMenuClick?: (fieldId: string) => void // Callback khi click menu
}

export default function FieldGridCard({
    field,
    onFavoriteClick,
    onMenuClick
}: FieldGridCardProps) {
    // Derive additional properties from Field data
    const fieldColor = field.sport_name === "Bóng đá" ? "bg-green-500" :
        field.sport_name === "Tennis" ? "bg-purple-500" :
            field.sport_name === "Bóng rổ" ? "bg-orange-500" :
                field.sport_name === "Cầu lông" ? "bg-blue-500" :
                    field.sport_name === "Golf" ? "bg-emerald-600" :
                        field.sport_name === "Bóng chuyền" ? "bg-pink-500" :
                            field.sport_name === "Bơi lội" ? "bg-cyan-500" : "bg-gray-500"

    // Use dynamic data from Field interface instead of hard-coded values
    const fieldStatus = field.activeStatus || "available"
    const fieldTime = `${field.openingHours || '---'} - ${field.closingHours || '---'}`
    const formattedPrice = ((field.defaultPrice || 0) as number).toLocaleString('vi-VN') + "đ/h"
    const imageUrl = field.avatar || field.cover_image || "/placeholder-field.png"

    // Debug
    if (field.name === "Sân B Updated" || field.name === "Sân A") {
        console.log(`[FieldGridCard] ${field.name}:`, {
            activeStatus: field.activeStatus,
            fieldStatus: fieldStatus,
            status: (field as any).status
        })
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
            {/* Ảnh sân */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={field.name || 'Field'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Action buttons trên ảnh */}
                <div className="absolute top-3 right-3 flex gap-1">
                    <button
                        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        onClick={() => onFavoriteClick?.(field._id || field.id || '')}
                        title="Thêm vào yêu thích"
                    >
                        <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        onClick={() => onMenuClick?.(field._id || field.id || '')}
                        title="Tùy chọn khác"
                    >
                        <span className="text-sm font-bold text-gray-700">⋯</span>
                    </button>
                </div>

                {/* Status tags trên ảnh */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                        {fieldStatus === "available" ? "Đang mở" : "Đã đóng"}
                    </span>
                    <span className={`${fieldColor} px-2 py-1 rounded-full text-xs font-medium text-white`}>
                        {field.sport_name || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Header với màu theme - chiều cao cố định */}
            <div className={`${fieldColor} p-4 text-white relative flex-shrink-0`}>
                {/* Tên sân - chiều cao cố định */}
                <h3 className="text-xl font-bold leading-tight h-12 flex items-center">
                    <span className="line-clamp-2">{field.name || 'Unnamed Field'}</span>
                </h3>
            </div>

            {/* Nội dung thông tin chi tiết - flex-1 để chiếm không gian còn lại */}
            <CardContent className="p-4 flex-1 flex flex-col">
                {/* Thông tin sân - chiều cao cố định */}
                <div className="space-y-2 mb-4 flex-1">
                    {/* Địa chỉ */}
                    <div className="flex items-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm line-clamp-2">{field.address || 'N/A'}</span>
                    </div>

                    {/* Giờ mở cửa */}
                    <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{fieldTime}</span>
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="text-gray-600">
                        <p className="text-sm line-clamp-2">{field.description || 'No description'}</p>
                    </div>

                    {/* Tiện ích */}
                    {field.amenities && field.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {field.amenities.slice(0, 3).map((amenity, index) => (
                                <span
                                    key={index}
                                    className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full"
                                >
                                    {amenity}
                                </span>
                            ))}
                            {field.amenities.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    +{field.amenities.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer với giá và rating và nút đặt - cố định ở cuối */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
                    {/* Giá và rating */}
                    <div className="space-y-1">
                        <div className="font-bold text-lg text-gray-900">{formattedPrice}</div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1 text-gray-600">{field.rating || 4.5}</span>
                        </div>
                    </div>

                    {/* Nút đặt lịch */}
                    {fieldStatus === "available" ? (
                        <Link href={`/fields/${field._id || field.id}`}>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 text-sm">
                                ĐẶT LỊCH
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="bg-gray-400 text-white font-semibold px-4 py-2 text-sm">
                            KHÔNG KHẢ DỤNG
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
