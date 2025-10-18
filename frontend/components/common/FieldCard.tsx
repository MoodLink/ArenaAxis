// Component hiển thị một sân thể thao
// Tái sử dụng được ở nhiều nơi khác nhau trong app

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Field } from "@/types"

interface FieldCardProps {
    field: Field // Props nhận vào thông tin sân
    className?: string // CSS class tùy chỉnh (optional)
}

export default function FieldCard({ field, className = "" }: FieldCardProps) {
    return (
        // Link để điều hướng đến trang chi tiết sân
        <Link href={`/fields/${field.id}`}>
            <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
                {/* Hình ảnh sân với tỷ lệ 4:3 */}
                <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                        src={field.image || "/placeholder.svg"} // Fallback image nếu không có ảnh
                        alt={field.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Thông tin sân */}
                <CardContent className="p-4">
                    {/* Tên sân - cắt bớt nếu quá dài */}
                    <h3 className="font-semibold mb-2 line-clamp-1">{field.name}</h3>

                    {/* Địa điểm với icon */}
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{field.location}</span>
                    </p>

                    {/* Giá tiền với màu xanh nổi bật */}
                    <p className="font-bold text-green-600">{field.price}</p>
                </CardContent>
            </Card>
        </Link>
    )
}
