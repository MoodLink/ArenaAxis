import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Gift } from "lucide-react"
import { type PromotionStats } from "@/data/mockDataAdmin"

interface PromotionStatsProps {
    stats: PromotionStats
}

export default function PromotionStats({ stats }: PromotionStatsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <Gift className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng khuyến mãi</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPromotions}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{stats.activePromotions}</p>
                            <p className="text-xs text-gray-500">+{stats.activePromotions} khuyến mãi</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Lượt sử dụng</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Giảm giá tổng</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDiscountGiven)}</p>
                            <p className="text-xs text-gray-500">{stats.revenueImpact}% doanh thu</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}