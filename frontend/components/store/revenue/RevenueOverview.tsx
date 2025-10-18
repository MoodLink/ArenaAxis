"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    CreditCard,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Download
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Mock data
const revenueData = [
    { month: 'T1', revenue: 12000000, expense: 2000000, profit: 10000000 },
    { month: 'T2', revenue: 15000000, expense: 2200000, profit: 12800000 },
    { month: 'T3', revenue: 18000000, expense: 2500000, profit: 15500000 },
    { month: 'T4', revenue: 14000000, expense: 2100000, profit: 11900000 },
    { month: 'T5', revenue: 22000000, expense: 2800000, profit: 19200000 },
    { month: 'T6', revenue: 25000000, expense: 3000000, profit: 22000000 }
]

const dailyRevenue = [
    { day: '1', revenue: 850000 },
    { day: '2', revenue: 920000 },
    { day: '3', revenue: 780000 },
    { day: '4', revenue: 1100000 },
    { day: '5', revenue: 950000 },
    { day: '6', revenue: 1200000 },
    { day: '7', revenue: 1350000 }
]

function StatCard({ title, value, change, changeType, icon: Icon, trend }: {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: any
    trend: string
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                            {changeType === 'increase' ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{trend}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RevenueOverview() {
    const [timeRange, setTimeRange] = useState('6months')

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">7 ngày qua</SelectItem>
                            <SelectItem value="30days">30 ngày qua</SelectItem>
                            <SelectItem value="6months">6 tháng qua</SelectItem>
                            <SelectItem value="1year">1 năm qua</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                </Button>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng doanh thu"
                    value="106.000.000đ"
                    change="+18.5%"
                    changeType="increase"
                    icon={DollarSign}
                    trend="So với tháng trước"
                />
                <StatCard
                    title="Lợi nhuận"
                    value="91.400.000đ"
                    change="+22.1%"
                    changeType="increase"
                    icon={Target}
                    trend="Sau khi trừ chi phí"
                />
                <StatCard
                    title="Doanh thu trung bình/ngày"
                    value="3.533.000đ"
                    change="+15.2%"
                    changeType="increase"
                    icon={Calendar}
                    trend="Trung bình tháng này"
                />
                <StatCard
                    title="Số giao dịch"
                    value="842"
                    change="+8.7%"
                    changeType="increase"
                    icon={CreditCard}
                    trend="Tổng giao dịch"
                />
            </div>

            {/* Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo tháng</CardTitle>
                        <CardDescription>Biểu đồ doanh thu và lợi nhuận 6 tháng gần nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, '']} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    name="Doanh thu"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    name="Lợi nhuận"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Daily Revenue Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
                        <CardDescription>Xu hướng doanh thu hàng ngày</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết doanh thu tháng này</CardTitle>
                    <CardDescription>Phân tích chi tiết các nguồn thu và chi phí</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Revenue Sources */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Nguồn doanh thu</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm text-green-800">Sân bóng đá</span>
                                    <span className="font-semibold text-green-900">15.200.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm text-blue-800">Sân cầu lông</span>
                                    <span className="font-semibold text-blue-900">6.800.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <span className="text-sm text-purple-800">Sân tennis</span>
                                    <span className="font-semibold text-purple-900">2.400.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <span className="text-sm text-orange-800">Sân bóng rổ</span>
                                    <span className="font-semibold text-orange-900">600.000đ</span>
                                </div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Chi phí vận hành</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <span className="text-sm text-red-800">Bảo trì sân</span>
                                    <span className="font-semibold text-red-900">1.200.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm text-yellow-800">Điện nước</span>
                                    <span className="font-semibold text-yellow-900">800.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm text-gray-800">Nhân viên</span>
                                    <span className="font-semibold text-gray-900">600.000đ</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                    <span className="text-sm text-indigo-800">Phí dịch vụ</span>
                                    <span className="font-semibold text-indigo-900">400.000đ</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Tóm tắt</h4>
                            <div className="space-y-3">
                                <div className="p-4 border border-green-200 rounded-lg">
                                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                                    <p className="text-2xl font-bold text-green-600">25.000.000đ</p>
                                </div>
                                <div className="p-4 border border-red-200 rounded-lg">
                                    <p className="text-sm text-gray-600">Tổng chi phí</p>
                                    <p className="text-xl font-bold text-red-600">3.000.000đ</p>
                                </div>
                                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <p className="text-sm text-gray-600">Lợi nhuận ròng</p>
                                    <p className="text-2xl font-bold text-blue-600">22.000.000đ</p>
                                    <div className="flex items-center mt-1">
                                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                        <span className="text-sm text-green-600">+15.5% so với tháng trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}