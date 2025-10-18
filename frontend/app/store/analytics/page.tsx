"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    Clock,
    MapPin,
    Star,
    DollarSign,
    Activity,
    Target,
    BarChart3,
    PieChart,
    UserCheck,
    Repeat,
    Award,
    Zap
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    ComposedChart,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts'

// Mock data
const customerAnalytics = [
    { month: 'T7', newCustomers: 45, returningCustomers: 128, totalRevenue: 15200000 },
    { month: 'T8', newCustomers: 52, returningCustomers: 145, totalRevenue: 18500000 },
    { month: 'T9', newCustomers: 38, returningCustomers: 156, totalRevenue: 16800000 },
    { month: 'T10', newCustomers: 64, returningCustomers: 172, totalRevenue: 21200000 },
    { month: 'T11', newCustomers: 58, returningCustomers: 188, totalRevenue: 19800000 },
    { month: 'T12', newCustomers: 67, returningCustomers: 201, totalRevenue: 22400000 }
]

const bookingPatterns = [
    { hour: '06:00', bookings: 12, revenue: 850000 },
    { hour: '07:00', bookings: 18, revenue: 1200000 },
    { hour: '08:00', bookings: 25, revenue: 1650000 },
    { hour: '09:00', bookings: 22, revenue: 1480000 },
    { hour: '10:00', bookings: 15, revenue: 980000 },
    { hour: '11:00', bookings: 20, revenue: 1320000 },
    { hour: '12:00', bookings: 8, revenue: 520000 },
    { hour: '13:00', bookings: 6, revenue: 380000 },
    { hour: '14:00', bookings: 28, revenue: 1850000 },
    { hour: '15:00', bookings: 35, revenue: 2300000 },
    { hour: '16:00', bookings: 42, revenue: 2750000 },
    { hour: '17:00', bookings: 48, revenue: 3200000 },
    { hour: '18:00', bookings: 52, revenue: 3450000 },
    { hour: '19:00', bookings: 45, revenue: 2980000 },
    { hour: '20:00', bookings: 38, revenue: 2520000 },
    { hour: '21:00', bookings: 25, revenue: 1650000 },
    { hour: '22:00', bookings: 15, revenue: 980000 }
]

const fieldPerformance = [
    { name: 'Sân bóng đá mini 1', bookings: 156, revenue: 8200000, rating: 4.8, utilization: 85 },
    { name: 'Sân tennis 1', bookings: 124, revenue: 6500000, rating: 4.6, utilization: 78 },
    { name: 'Sân bóng rổ 1', bookings: 98, revenue: 4200000, rating: 4.2, utilization: 65 },
    { name: 'Sân cầu lông 1', bookings: 145, revenue: 5800000, rating: 4.7, utilization: 82 },
    { name: 'Sân bóng đá mini 2', bookings: 134, revenue: 7100000, rating: 4.5, utilization: 75 },
    { name: 'Sân tennis 2', bookings: 112, revenue: 5900000, rating: 4.4, utilization: 70 }
]

const customerSegments = [
    { segment: 'Khách VIP', count: 45, revenue: 12500000, avgSpend: 277777, color: '#8b5cf6' },
    { segment: 'Khách quen', count: 128, revenue: 8200000, avgSpend: 64063, color: '#06b6d4' },
    { segment: 'Khách mới', count: 89, revenue: 4800000, avgSpend: 53933, color: '#84cc16' },
    { segment: 'Khách lẻ', count: 67, revenue: 2100000, avgSpend: 31343, color: '#f97316' }
]

const peakTimes = [
    { day: 'Thứ 2', morning: 25, afternoon: 45, evening: 68 },
    { day: 'Thứ 3', morning: 28, afternoon: 52, evening: 72 },
    { day: 'Thứ 4', morning: 32, afternoon: 48, evening: 65 },
    { day: 'Thứ 5', morning: 35, afternoon: 58, evening: 78 },
    { day: 'Thứ 6', morning: 38, afternoon: 65, evening: 85 },
    { day: 'Thứ 7', morning: 45, afternoon: 78, evening: 92 },
    { day: 'Chủ nhật', morning: 52, afternoon: 85, evening: 88 }
]

const seasonalTrends = [
    { month: 'T1', football: 85, tennis: 65, basketball: 45, badminton: 78 },
    { month: 'T2', football: 82, tennis: 68, basketball: 48, badminton: 75 },
    { month: 'T3', football: 88, tennis: 72, basketball: 52, badminton: 82 },
    { month: 'T4', football: 92, tennis: 78, basketball: 58, badminton: 85 },
    { month: 'T5', football: 95, tennis: 82, basketball: 62, badminton: 88 },
    { month: 'T6', football: 98, tennis: 85, basketball: 65, badminton: 92 },
    { month: 'T7', football: 92, tennis: 88, basketball: 68, badminton: 85 },
    { month: 'T8', football: 88, tennis: 85, basketball: 65, badminton: 82 },
    { month: 'T9', football: 85, tennis: 78, basketball: 58, badminton: 78 },
    { month: 'T10', football: 82, tennis: 72, basketball: 52, badminton: 75 },
    { month: 'T11', football: 78, tennis: 68, basketball: 48, badminton: 72 },
    { month: 'T12', football: 75, tennis: 65, basketball: 45, badminton: 68 }
]

const performanceMetrics = [
    { subject: 'Doanh thu', A: 85, B: 78, fullMark: 100 },
    { subject: 'Tỷ lệ đặt sân', A: 92, B: 85, fullMark: 100 },
    { subject: 'Hài lòng KH', A: 88, B: 82, fullMark: 100 },
    { subject: 'Hiệu quả vận hành', A: 76, B: 71, fullMark: 100 },
    { subject: 'Tăng trưởng', A: 82, B: 79, fullMark: 100 },
    { subject: 'Khách quay lại', A: 89, B: 84, fullMark: 100 }
]

function StatCard({ title, value, change, changeType, icon: Icon, subtext, color = 'blue' }: {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: any
    subtext: string
    color?: string
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                    </div>
                    <div className="text-right">
                        <div className={`p-3 rounded-lg mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                            {changeType === 'increase' ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span>{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CustomerAnalytics() {
    return (
        <div className="space-y-6">
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
                    value="67"
                    change="+15.3%"
                    changeType="increase"
                    icon={UserCheck}
                    subtext="Tháng này"
                    color="green"
                />
                <StatCard
                    title="Tỷ lệ quay lại"
                    value="76.8%"
                    change="+4.1%"
                    changeType="increase"
                    icon={Repeat}
                    subtext="Khách hàng trung thành"
                    color="purple"
                />
                <StatCard
                    title="Giá trị TB/KH"
                    value="168K"
                    change="+2.7%"
                    changeType="increase"
                    icon={Target}
                    subtext="Doanh thu trung bình"
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Khách hàng mới vs Quay lại</CardTitle>
                        <CardDescription>Phân tích xu hướng khách hàng theo tháng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={customerAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="newCustomers" fill="#84cc16" name="Khách mới" />
                                <Bar yAxisId="left" dataKey="returningCustomers" fill="#06b6d4" name="Khách quay lại" />
                                <Line yAxisId="right" type="monotone" dataKey="totalRevenue" stroke="#f59e0b" strokeWidth={3} name="Doanh thu" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Phân khúc khách hàng</CardTitle>
                        <CardDescription>Doanh thu theo từng nhóm khách hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart>
                                <Pie
                                    data={customerSegments}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ segment, count }) => `${segment}: ${count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="revenue"
                                >
                                    {customerSegments.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {customerSegments.map((segment, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{segment.count}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Doanh thu</span>
                                    <span className="font-medium">{(segment.revenue / 1000000).toFixed(1)}M đ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Chi tiêu TB</span>
                                    <span className="font-medium">{segment.avgSpend.toLocaleString()}đ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function BookingAnalytics() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng đặt sân"
                    value="1,847"
                    change="+12.5%"
                    changeType="increase"
                    icon={Calendar}
                    subtext="Lượt đặt tháng này"
                    color="blue"
                />
                <StatCard
                    title="Tỷ lệ lấp đầy"
                    value="78.4%"
                    change="+5.2%"
                    changeType="increase"
                    icon={Activity}
                    subtext="Tỷ lệ sử dụng sân"
                    color="green"
                />
                <StatCard
                    title="Thời gian peak"
                    value="18-20h"
                    change="Không đổi"
                    changeType="increase"
                    icon={Clock}
                    subtext="Giờ cao điểm"
                    color="purple"
                />
                <StatCard
                    title="Sân hiệu quả nhất"
                    value="Sân 1"
                    change="+8.7%"
                    changeType="increase"
                    icon={Award}
                    subtext="Doanh thu cao nhất"
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mô hình đặt sân theo giờ</CardTitle>
                        <CardDescription>Số lượng đặt sân và doanh thu theo từng giờ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={bookingPatterns}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Bar yAxisId="left" dataKey="bookings" fill="#3b82f6" name="Số đặt sân" />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} name="Doanh thu (đ)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Khung giờ cao điểm</CardTitle>
                        <CardDescription>Phân tích lượng đặt sân theo khung giờ và ngày</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={peakTimes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="morning" stackId="a" fill="#fbbf24" name="Sáng (6-12h)" />
                                <Bar dataKey="afternoon" stackId="a" fill="#3b82f6" name="Chiều (12-18h)" />
                                <Bar dataKey="evening" stackId="a" fill="#8b5cf6" name="Tối (18-22h)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng theo mùa</CardTitle>
                    <CardDescription>Mức độ ưa chuộng các loại sân theo tháng trong năm</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={seasonalTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="football" stackId="1" stroke="#10b981" fill="#10b981" name="Bóng đá" />
                            <Area type="monotone" dataKey="tennis" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Tennis" />
                            <Area type="monotone" dataKey="basketball" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Bóng rổ" />
                            <Area type="monotone" dataKey="badminton" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Cầu lông" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

function FieldAnalytics() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng số sân"
                    value="12"
                    change="Không đổi"
                    changeType="increase"
                    icon={MapPin}
                    subtext="Sân đang hoạt động"
                    color="blue"
                />
                <StatCard
                    title="Tỷ lệ sử dụng TB"
                    value="74.2%"
                    change="+3.8%"
                    changeType="increase"
                    icon={BarChart3}
                    subtext="Hiệu suất trung bình"
                    color="green"
                />
                <StatCard
                    title="Đánh giá TB"
                    value="4.6"
                    change="+0.2"
                    changeType="increase"
                    icon={Star}
                    subtext="Điểm hài lòng khách hàng"
                    color="purple"
                />
                <StatCard
                    title="Doanh thu/sân TB"
                    value="4.8M"
                    change="+7.1%"
                    changeType="increase"
                    icon={DollarSign}
                    subtext="Doanh thu trung bình"
                    color="orange"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hiệu suất các sân</CardTitle>
                    <CardDescription>So sánh hiệu suất hoạt động của từng sân</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {fieldPerformance.map((field, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{field.name}</h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                            <span>{field.bookings} lượt đặt</span>
                                            <span className="flex items-center">
                                                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                                                {field.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{(field.revenue / 1000000).toFixed(1)}M đ</p>
                                        <p className="text-sm text-gray-500">{field.utilization}% sử dụng</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Đặt sân</span>
                                            <span>{field.bookings}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(field.bookings / 200) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Tỷ lệ sử dụng</span>
                                            <span>{field.utilization}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${field.utilization}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Đánh giá</span>
                                            <span>{field.rating}/5</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${(field.rating / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>So sánh doanh thu sân</CardTitle>
                        <CardDescription>Doanh thu của các sân trong tháng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fieldPerformance} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tỷ lệ sử dụng vs Đánh giá</CardTitle>
                        <CardDescription>Mối quan hệ giữa hiệu suất và chất lượng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fieldPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Bar yAxisId="left" dataKey="utilization" fill="#10b981" name="Tỷ lệ sử dụng (%)" />
                                <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} name="Đánh giá" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function PerformanceMetrics() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng điểm hiệu suất"
                    value="85.2"
                    change="+4.3"
                    changeType="increase"
                    icon={Activity}
                    subtext="Điểm tổng hợp"
                    color="blue"
                />
                <StatCard
                    title="Hiệu quả vận hành"
                    value="78.9%"
                    change="+2.1%"
                    changeType="increase"
                    icon={Zap}
                    subtext="Tỷ lệ hoạt động tối ưu"
                    color="green"
                />
                <StatCard
                    title="Chỉ số tăng trưởng"
                    value="124"
                    change="+8.4"
                    changeType="increase"
                    icon={TrendingUp}
                    subtext="Điểm tăng trưởng"
                    color="purple"
                />
                <StatCard
                    title="NPS Score"
                    value="68"
                    change="+5"
                    changeType="increase"
                    icon={Target}
                    subtext="Net Promoter Score"
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Radar Chart - Hiệu suất tổng thể</CardTitle>
                        <CardDescription>So sánh các chỉ số hiệu suất chính</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={performanceMetrics}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis domain={[0, 100]} />
                                <Radar name="Tháng này" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                <Radar name="Tháng trước" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chỉ số KPI chính</CardTitle>
                        <CardDescription>Các chỉ số hiệu suất quan trọng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Customer Acquisition Cost</p>
                                    <p className="text-sm text-gray-600">Chi phí thu hút khách hàng mới</p>
                                </div>
                                <span className="text-xl font-bold text-green-600">125K</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Customer Lifetime Value</p>
                                    <p className="text-sm text-gray-600">Giá trị suốt đời khách hàng</p>
                                </div>
                                <span className="text-xl font-bold text-blue-600">2.8M</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Average Revenue Per User</p>
                                    <p className="text-sm text-gray-600">Doanh thu trung bình mỗi người</p>
                                </div>
                                <span className="text-xl font-bold text-purple-600">168K</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Monthly Recurring Revenue</p>
                                    <p className="text-sm text-gray-600">Doanh thu định kỳ hàng tháng</p>
                                </div>
                                <span className="text-xl font-bold text-orange-600">22.4M</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mục tiêu tháng này</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Doanh thu</span>
                                    <span>22.4M / 25M</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '89.6%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">89.6% hoàn thành</p>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Khách hàng mới</span>
                                    <span>67 / 80</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '83.8%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">83.8% hoàn thành</p>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Tỷ lệ sử dụng</span>
                                    <span>78.4% / 80%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">98% hoàn thành</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thành tích nổi bật</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                                <Award className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900">Tăng trưởng 12.5%</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                                <Star className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Đánh giá 4.6/5</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                                <Users className="h-5 w-5 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">1,256 khách hàng</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded">
                                <Target className="h-5 w-5 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">85.2 điểm hiệu suất</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cải thiện cần làm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                                <p className="text-sm font-medium text-yellow-900">Tỷ lệ hủy sân</p>
                                <p className="text-xs text-yellow-700">Cần giảm từ 12% xuống 8%</p>
                            </div>
                            <div className="p-3 border-l-4 border-red-400 bg-red-50">
                                <p className="text-sm font-medium text-red-900">Thời gian phản hồi</p>
                                <p className="text-xs text-red-700">Cải thiện tốc độ xử lý booking</p>
                            </div>
                            <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                                <p className="text-sm font-medium text-blue-900">Marketing hiệu quả</p>
                                <p className="text-xs text-blue-700">Tăng ROI từ 3.2x lên 4x</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function StoreAnalytics() {
    const [timeRange, setTimeRange] = useState('month')
    const [activeTab, setActiveTab] = useState('customers')

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Phân tích chi tiết hiệu suất kinh doanh</p>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Tuần này</SelectItem>
                            <SelectItem value="month">Tháng này</SelectItem>
                            <SelectItem value="quarter">Quý này</SelectItem>
                            <SelectItem value="year">Năm này</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Analytics Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="customers">Khách hàng</TabsTrigger>
                        <TabsTrigger value="bookings">Đặt sân</TabsTrigger>
                        <TabsTrigger value="fields">Sân thể thao</TabsTrigger>
                        <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
                    </TabsList>

                    <TabsContent value="customers" className="mt-6">
                        <CustomerAnalytics />
                    </TabsContent>

                    <TabsContent value="bookings" className="mt-6">
                        <BookingAnalytics />
                    </TabsContent>

                    <TabsContent value="fields" className="mt-6">
                        <FieldAnalytics />
                    </TabsContent>

                    <TabsContent value="performance" className="mt-6">
                        <PerformanceMetrics />
                    </TabsContent>
                </Tabs>
            </div>
        </StoreLayout>
    )
}