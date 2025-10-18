// Component hiển thị thống kê tổng quan về sân thể thao
// Bao gồm số lượng sân, sân đang hoạt động, đánh giá cao, xu hướng

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Zap, Star, TrendingUp } from "lucide-react"
import { Field } from "@/types"

interface FieldsStatsProps {
    fields: Field[] // Danh sách sân để tính toán thống kê
}

export default function FieldsStats({ fields }: FieldsStatsProps) {
    const totalFields = fields.length
    const activeFields = fields.filter(f => f.rating > 4).length
    const highRatedFields = fields.filter(f => f.rating >= 4.5).length
    const trendingPercentage = "+12%" // Có thể tính toán động

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Tổng số sân */}
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm">Tổng số sân</p>
                            <p className="text-3xl font-bold">{totalFields}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Đang hoạt động */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Đang hoạt động</p>
                            <p className="text-3xl font-bold">{activeFields}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Đánh giá cao */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Đánh giá cao</p>
                            <p className="text-3xl font-bold">{highRatedFields}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Xu hướng */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Xu hướng</p>
                            <p className="text-3xl font-bold">{trendingPercentage}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
