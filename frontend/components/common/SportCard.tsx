// Component hiển thị một môn thể thao
// Cho phép người dùng click để filter theo môn thể thao đó

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Sport } from "@/types"

interface SportCardProps {
    sport: Sport // Props nhận thông tin môn thể thao
    className?: string // CSS class tùy chỉnh (optional)
}

export default function SportCard({ sport, className = "" }: SportCardProps) {
    return (
        // Link đến trang danh sách sân với filter theo id chuẩn
        <Link href={`/fields?sport=${encodeURIComponent(sport.id)}`}>
            <Card className={`text-center hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
                <CardContent className="p-6">
                    {/* Hình ảnh môn thể thao */}
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                        <img
                            src={sport.image || "/placeholder.svg"} // Fallback image
                            alt={sport.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Icon và tên môn thể thao */}
                    <div className="space-y-2">
                        <div className="text-3xl">{sport.icon}</div>
                        <h3 className="font-semibold text-gray-900">{sport.name}</h3>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
