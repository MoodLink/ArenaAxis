import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Star,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

interface FieldPerformance {
    name: string
    bookings: number
    revenue: number
    rating: number
    utilization: number
}

interface FieldAnalyticsProps {
    fieldPerformance: FieldPerformance[]
}

export default function FieldAnalytics({ fieldPerformance }: FieldAnalyticsProps) {
    const sortedByRevenue = [...fieldPerformance].sort((a, b) => b.revenue - a.revenue)
    const sortedByBookings = [...fieldPerformance].sort((a, b) => b.bookings - a.bookings)
    const sortedByRating = [...fieldPerformance].sort((a, b) => b.rating - a.rating)
    const sortedByUtilization = [...fieldPerformance].sort((a, b) => b.utilization - a.utilization)

    const getUtilizationColor = (utilization: number) => {
        if (utilization >= 80) return 'bg-green-500'
        if (utilization >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getPerformanceBadge = (value: number, type: 'rating' | 'utilization') => {
        if (type === 'rating') {
            if (value >= 4.5) return <Badge className="bg-green-100 text-green-800">Xuất sắc</Badge>
            if (value >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Tốt</Badge>
            if (value >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">Khá</Badge>
            return <Badge className="bg-red-100 text-red-800">Cần cải thiện</Badge>
        } else {
            if (value >= 80) return <Badge className="bg-green-100 text-green-800">Cao</Badge>
            if (value >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
            return <Badge className="bg-red-100 text-red-800">Thấp</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Revenue Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh thu theo sân</CardTitle>
                    <CardDescription>So sánh doanh thu giữa các sân trong tháng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fieldPerformance} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Doanh thu']} />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Utilization Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Tỷ lệ sử dụng sân</CardTitle>
                    <CardDescription>Mức độ bận rộn của từng sân</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fieldPerformance.map(field => ({
                                        ...field,
                                        utilizationDisplay: `${field.name} (${field.utilization}%)`
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, utilization }) => `${name}: ${utilization}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="utilization"
                                >
                                    {fieldPerformance.map((field, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={[
                                                '#3b82f6', '#10b981', '#f59e0b',
                                                '#8b5cf6', '#f97316', '#06b6d4'
                                            ][index % 6]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value}%`, 'Tỷ lệ sử dụng']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết hiệu suất sân</CardTitle>
                    <CardDescription>Thông tin chi tiết về từng sân</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-gray-900">Tên sân</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Số đặt sân</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Doanh thu</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Đánh giá</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Tỷ lệ sử dụng</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fieldPerformance.map((field, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{field.name}</td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>{field.bookings}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                <span>{(field.revenue / 1000000).toFixed(1)}M</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-gray-600">{field.rating}</span>
                                                {getPerformanceBadge(field.rating, 'rating')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Progress
                                                    value={field.utilization}
                                                    className="flex-1"
                                                />
                                                <span className="text-sm font-medium text-gray-600 w-12">
                                                    {field.utilization}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getPerformanceBadge(field.utilization, 'utilization')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Top Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                            Doanh thu cao nhất
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {sortedByRevenue[0]?.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                            {(sortedByRevenue[0]?.revenue / 1000000).toFixed(1)}M VNĐ
                            <TrendingUp className="h-4 w-4 ml-1 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                            Được đặt nhiều nhất
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {sortedByBookings[0]?.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                            {sortedByBookings[0]?.bookings} lượt đặt
                            <TrendingUp className="h-4 w-4 ml-1 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <Star className="h-5 w-5 mr-2 text-yellow-500" />
                            Đánh giá cao nhất
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {sortedByRating[0]?.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                            {sortedByRating[0]?.rating}/5 ⭐
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                            Sử dụng hiệu quả nhất
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {sortedByUtilization[0]?.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                            {sortedByUtilization[0]?.utilization}% sử dụng
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}