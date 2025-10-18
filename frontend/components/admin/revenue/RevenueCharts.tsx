import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueChartsProps {
    // For now, we'll create placeholder charts since we don't have chart library
    dailyData?: any[]
    sourceData?: any[]
    methodData?: any[]
}

export default function RevenueCharts({ dailyData, sourceData, methodData }: RevenueChartsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    // Mock data for demonstration
    const dailyRevenueData = [
        { date: '22/01', revenue: 1200000, bookings: 15 },
        { date: '23/01', revenue: 1800000, bookings: 23 },
        { date: '24/01', revenue: 2200000, bookings: 28 },
        { date: '25/01', revenue: 1600000, bookings: 19 },
        { date: '26/01', revenue: 2050000, bookings: 25 },
    ]

    const revenueBySourceData = [
        { name: 'Đặt sân', value: 65, amount: 31525000 },
        { name: 'Giải đấu', value: 25, amount: 12125000 },
        { name: 'Thành viên', value: 8, amount: 3880000 },
        { name: 'Khác', value: 2, amount: 970000 }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh thu theo ngày</CardTitle>
                    <CardDescription>Biểu đồ doanh thu 5 ngày gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dailyRevenueData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{item.date}</p>
                                    <p className="text-sm text-gray-500">{item.bookings} bookings</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Revenue by Source */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh thu theo nguồn</CardTitle>
                    <CardDescription>Phân bổ doanh thu từ các nguồn khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {revenueBySourceData.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-sm font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 text-right">{item.value}%</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}