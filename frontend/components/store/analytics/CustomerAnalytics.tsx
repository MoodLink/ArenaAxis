import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from './StatCard'
import {
    Users,
    UserCheck,
    Repeat,
    DollarSign
} from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'

interface CustomerData {
    month: string
    newCustomers: number
    returningCustomers: number
    totalRevenue: number
}

interface CustomerSegment {
    segment: string
    count: number
    revenue: number
    avgSpend: number
    color: string
}

interface CustomerAnalyticsProps {
    customerData: CustomerData[]
    customerSegments: CustomerSegment[]
}

export default function CustomerAnalytics({ customerData, customerSegments }: CustomerAnalyticsProps) {
    const totalCustomers = customerData.reduce((sum, month) =>
        sum + month.newCustomers + month.returningCustomers, 0) / customerData.length

    const currentMonth = customerData[customerData.length - 1]
    const previousMonth = customerData[customerData.length - 2]

    const newCustomersChange = currentMonth && previousMonth
        ? ((currentMonth.newCustomers - previousMonth.newCustomers) / previousMonth.newCustomers * 100).toFixed(1)
        : '0'

    const returningRate = currentMonth
        ? (currentMonth.returningCustomers / (currentMonth.newCustomers + currentMonth.returningCustomers) * 100).toFixed(1)
        : '0'

    const avgRevenue = customerData.reduce((sum, month) => sum + month.totalRevenue, 0) / customerData.length

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng khách hàng"
                    value="1,256"
                    change="+8.2%"
                    changeType="increase"
                    icon={Users}
                    subtext="Khách hàng hoạt động"
                    color="blue"
                />
                <StatCard
                    title="Khách hàng mới"
                    value={currentMonth?.newCustomers.toString() || '0'}
                    change={`${parseFloat(newCustomersChange) >= 0 ? '+' : ''}${newCustomersChange}%`}
                    changeType={parseFloat(newCustomersChange) >= 0 ? 'increase' : 'decrease'}
                    icon={UserCheck}
                    subtext="Tháng này"
                    color="green"
                />
                <StatCard
                    title="Tỷ lệ quay lại"
                    value={`${returningRate}%`}
                    change="+2.8%"
                    changeType="increase"
                    icon={Repeat}
                    subtext="Khách hàng quay lại"
                    color="purple"
                />
                <StatCard
                    title="Doanh thu TB/KH"
                    value={`${(avgRevenue / 1000000).toFixed(1)}M`}
                    change="+12.5%"
                    changeType="increase"
                    icon={DollarSign}
                    subtext="VNĐ/khách hàng"
                    color="orange"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Growth Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Xu hướng tăng trưởng khách hàng</CardTitle>
                        <CardDescription>Khách hàng mới và quay lại theo tháng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={customerData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => [value, '']} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="newCustomers"
                                        stroke="#06b6d4"
                                        strokeWidth={2}
                                        name="Khách hàng mới"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="returningCustomers"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        name="Khách quay lại"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Segments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân khúc khách hàng</CardTitle>
                        <CardDescription>Phân bố khách hàng theo loại</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={customerSegments}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ segment, count, percent }) =>
                                            `${segment}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {customerSegments.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [value, 'Khách hàng']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customer Segments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết phân khúc khách hàng</CardTitle>
                    <CardDescription>Doanh thu và chi tiêu trung bình theo từng phân khúc</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium text-gray-900">Phân khúc</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Số lượng</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Doanh thu</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Chi tiêu TB</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Tỷ lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerSegments.map((segment, index) => {
                                    const totalCustomers = customerSegments.reduce((sum, s) => sum + s.count, 0)
                                    const percentage = (segment.count / totalCustomers * 100).toFixed(1)

                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: segment.color }}
                                                    />
                                                    <span className="font-medium">{segment.segment}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{segment.count}</td>
                                            <td className="p-4 text-gray-600">
                                                {(segment.revenue / 1000000).toFixed(1)}M VNĐ
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {(segment.avgSpend / 1000).toFixed(0)}k VNĐ
                                            </td>
                                            <td className="p-4 text-gray-600">{percentage}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}