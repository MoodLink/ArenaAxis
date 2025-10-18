import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingBag, Percent } from "lucide-react"
import { type RevenueStats } from "@/data/mockDataAdmin"

interface RevenueStatsProps {
    stats: RevenueStats
}

export default function RevenueStats({ stats }: RevenueStatsProps) {
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
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.todayRevenue)}</p>
                            <p className="text-xs text-gray-500">+{stats.totalBookings} đơn hàng</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="h-5 w-5 text-purple-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Giá trị trung bình</p>
                            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageOrderValue)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <Percent className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hoa hồng</p>
                            <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.commissionEarned)}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(stats.pendingAmount)} chờ xử lý</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}