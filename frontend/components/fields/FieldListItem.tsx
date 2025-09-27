// Component hiển thị thông tin sân dưới dạng list item
// Layout horizontal compact với chiều cao cố định cho view danh sách

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Star, Heart } from "lucide-react"
import { Field } from "@/types"

interface FieldListItemProps {
    field: Field // Dữ liệu sân
    onFavoriteClick?: (fieldId: string) => void // Callback khi click yêu thích
}

export default function FieldListItem({
    field,
    onFavoriteClick
}: FieldListItemProps) {
    // Derive additional properties from Field data
    const fieldColor = field.sport === "Bóng đá" ? "bg-green-500" :
        field.sport === "Tennis" ? "bg-purple-500" :
            field.sport === "Bóng rổ" ? "bg-orange-500" :
                field.sport === "Cầu lông" ? "bg-blue-500" :
                    field.sport === "Golf" ? "bg-emerald-600" :
                        field.sport === "Bóng chuyền" ? "bg-pink-500" :
                            field.sport === "Bơi lội" ? "bg-cyan-500" : "bg-gray-500"

    // Use dynamic data from Field interface instead of hard-coded values
    const fieldStatus = field.status || "available"
    const fieldTime = `${field.openingHours} - ${field.closingHours}`
    const formattedPrice = field.price.toLocaleString('vi-VN') + "đ/h"

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-0">
                <div className="flex min-h-[140px]">
                    {/* Colored border trái */}
                    <div className={`${fieldColor} w-1 flex-shrink-0`}></div>

                    {/* Ảnh sân */}
                    <div className="relative w-40 flex-shrink-0">
                        <Image
                            src={field.image}
                            alt={field.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="160px"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>

                    {/* Nội dung chính */}
                    <div className="flex-1 p-4 flex items-center">
                        <div className="flex items-center justify-between w-full">
                            {/* Thông tin sân */}
                            <div className="flex-1 min-w-0">
                                {/* Header với tên và status */}
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold truncate">{field.name}</h3>

                                    {/* Status tags */}
                                    <div className="flex gap-1 flex-shrink-0">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs text-white font-medium whitespace-nowrap ${fieldStatus === "available" ? "bg-green-500" : "bg-gray-500"
                                                }`}
                                        >
                                            {fieldStatus === "available" ? "Đang mở" : "Đã đóng"}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs text-white font-medium whitespace-nowrap ${fieldColor}`}>
                                            {field.sport}
                                        </span>
                                    </div>
                                </div>

                                {/* Grid thông tin chi tiết - responsive với chiều cao cố định */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                                    {/* Địa chỉ */}
                                    <div className="flex items-center min-w-0">
                                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{field.location}</span>
                                    </div>

                                    {/* Giờ mở cửa */}
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="whitespace-nowrap">{fieldTime}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                        <span className="whitespace-nowrap">{field.rating} điểm</span>
                                    </div>

                                    {/* Tiện ích */}
                                    <div className="flex items-center min-w-0">
                                        <span className="text-xs text-emerald-600 truncate">
                                            {field.amenities.slice(0, 2).join(", ")}
                                            {field.amenities.length > 2 && ` +${field.amenities.length - 2}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Mô tả ngắn */}
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 line-clamp-1">{field.description}</p>
                                </div>
                            </div>

                            {/* Action section - cố định bên phải */}
                            <div className="ml-4 flex flex-col items-end justify-center gap-3 flex-shrink-0">
                                {/* Giá */}
                                <div className="text-right">
                                    <span className="font-bold text-xl text-gray-900">{formattedPrice}</span>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-2">
                                    {/* Nút yêu thích */}
                                    <button
                                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        onClick={() => onFavoriteClick?.(field.id)}
                                        title="Thêm vào yêu thích"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </button>

                                    {/* Nút đặt lịch */}
                                    {fieldStatus === "available" ? (
                                        <Link href={`/fields/${field.id}`}>
                                            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 text-sm whitespace-nowrap">
                                                ĐẶT LỊCH
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="bg-gray-400 text-white font-semibold px-4 py-2 text-sm whitespace-nowrap">
                                            KHÔNG KHẢ DỤNG
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
