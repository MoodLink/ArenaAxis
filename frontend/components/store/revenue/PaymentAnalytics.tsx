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
    CreditCard,
    Smartphone,
    Banknote,
    PieChart,
    BarChart3,
    Users,
    Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts'

// Mock data
const paymentMethodData = [
    { method: 'Chuyển khoản', amount: 15200000, transactions: 156, color: '#3b82f6', icon: CreditCard },
    { method: 'MoMo', amount: 8500000, transactions: 124, color: '#ec4899', icon: Smartphone },
    { method: 'VNPay', amount: 4800000, transactions: 89, color: '#10b981', icon: CreditCard },
    { method: 'Tiền mặt', amount: 2100000, transactions: 32, color: '#f59e0b', icon: Banknote }
]

const hourlyPayments = [
    { hour: '06-08', amount: 850000, transactions: 12 },
    { hour: '08-10', amount: 650000, transactions: 9 },
    { hour: '10-12', amount: 450000, transactions: 6 },
    { hour: '14-16', amount: 1200000, transactions: 18 },
    { hour: '16-18', amount: 2100000, transactions: 32 },
    { hour: '18-20', amount: 3200000, transactions: 48 },
    { hour: '20-22', amount: 2800000, transactions: 42 }
]

const weeklyTrends = [
    { day: 'T2', amount: 2800000, transactions: 42 },
    { day: 'T3', amount: 3200000, transactions: 48 },
    { day: 'T4', amount: 2950000, transactions: 44 },
    { day: 'T5', amount: 3800000, transactions: 56 },
    { day: 'T6', amount: 4200000, transactions: 62 },
    { day: 'T7', amount: 4800000, transactions: 68 },
    { day: 'CN', amount: 5100000, transactions: 72 }
]

const customerSegments = [
    { segment: 'Khách VIP', amount: 12500000, transactions: 85, avgValue: 147058, color: '#8b5cf6' },
    { segment: 'Khách quen', amount: 8200000, transactions: 124, avgValue: 66129, color: '#06b6d4' },
    { segment: 'Khách mới', amount: 6800000, transactions: 156, avgValue: 43589, color: '#84cc16' },
    { segment: 'Khách lẻ', amount: 3100000, transactions: 89, avgValue: 34831, color: '#f97316' }
]

function StatCard({ title, value, change, changeType, icon: Icon, subtext }: {
    title: string
    value: string
    change: string
    changeType: 'increase' | 'decrease'
    icon: any
    subtext: string
}) {
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
                        <div className="p-3 bg-blue-50 rounded-lg mb-2">
                            <Icon className="h-6 w-6 text-blue-600" />
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

function PaymentMethodCard({ method }: { method: any }) {
    const Icon = method.icon
    const percentage = ((method.amount / 30600000) * 100).toFixed(1)

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${method.color}20` }}>
                            <Icon className="h-6 w-6" style={{ color: method.color }} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{method.method}</h3>
                            <p className="text-sm text-gray-500">{method.transactions} giao dịch</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{method.amount.toLocaleString()}đ</p>
                        <p className="text-sm text-gray-500">{percentage}% tổng</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="h-2 rounded-full transition-all"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: method.color
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default function PaymentAnalytics() {
    const [timeRange, setTimeRange] = useState('month')

    const totalAmount = paymentMethodData.reduce((sum, method) => sum + method.amount, 0)
    const totalTransactions = paymentMethodData.reduce((sum, method) => sum + method.transactions, 0)
    const avgTransactionValue = totalAmount / totalTransactions

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Phân tích thanh toán</h2>
                    <p className="text-gray-600">Chi tiết về phương thức thanh toán và xu hướng</p>
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

            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng thanh toán"
                    value={`${(totalAmount / 1000000).toFixed(1)}M`}
                    change="+12.8%"
                    changeType="increase"
                    icon={DollarSign}
                    subtext="So với tháng trước"
                />
                <StatCard
                    title="Số giao dịch"
                    value={totalTransactions.toString()}
                    change="+8.5%"
                    changeType="increase"
                    icon={CreditCard}
                    subtext="Tổng giao dịch thành công"
                />
                <StatCard
                    title="Giá trị TB/GD"
                    value={`${avgTransactionValue.toLocaleString()}đ`}
                    change="+4.2%"
                    changeType="increase"
                    icon={BarChart3}
                    subtext="Trung bình mỗi giao dịch"
                />
                <StatCard
                    title="Tỷ lệ thành công"
                    value="96.8%"
                    change="+1.2%"
                    changeType="increase"
                    icon={TrendingUp}
                    subtext="Giao dịch hoàn thành"
                />
            </div>

            {/* Payment Methods */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentMethodData.map((method, index) => (
                        <PaymentMethodCard key={index} method={method} />
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Method Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố theo phương thức</CardTitle>
                        <CardDescription>Tỷ lệ doanh thu từ các phương thức thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ method, amount }) => `${method}: ${(amount / 1000000).toFixed(1)}M`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="amount"
                                >
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Hourly Payment Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thanh toán theo khung giờ</CardTitle>
                        <CardDescription>Phân tích giao dịch theo từng khung giờ trong ngày</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyPayments}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Thanh toán']} />
                                <Bar dataKey="amount" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng thanh toán theo tuần</CardTitle>
                    <CardDescription>Phân tích doanh thu và số giao dịch theo từng ngày trong tuần</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="amount" fill="#10b981" name="Doanh thu (đ)" />
                            <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#f59e0b" strokeWidth={3} name="Số GD" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card>
                <CardHeader>
                    <CardTitle>Phân khúc khách hàng</CardTitle>
                    <CardDescription>Phân tích doanh thu theo từng nhóm khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {customerSegments.map((segment, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: segment.color }}
                                        />
                                        <h4 className="font-medium text-gray-900">{segment.segment}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{segment.amount.toLocaleString()}đ</p>
                                        <p className="text-sm text-gray-500">{segment.transactions} GD</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Doanh thu</p>
                                        <p className="font-medium">{(segment.amount / 1000000).toFixed(1)}M đ</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Số giao dịch</p>
                                        <p className="font-medium">{segment.transactions}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Giá trị TB</p>
                                        <p className="font-medium">{segment.avgValue.toLocaleString()}đ</p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${(segment.amount / 30600000) * 100}%`,
                                                backgroundColor: segment.color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Success Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tỷ lệ thành công</CardTitle>
                        <CardDescription>Phân tích tỷ lệ thành công theo phương thức thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                    <span className="font-medium">Chuyển khoản</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">98.2%</p>
                                    <p className="text-sm text-gray-500">156/159 GD</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Smartphone className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">MoMo</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">96.8%</p>
                                    <p className="text-sm text-gray-500">124/128 GD</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="h-5 w-5 text-purple-600" />
                                    <span className="font-medium">VNPay</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-purple-600">94.4%</p>
                                    <p className="text-sm text-gray-500">89/94 GD</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Banknote className="h-5 w-5 text-yellow-600" />
                                    <span className="font-medium">Tiền mặt</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-yellow-600">100%</p>
                                    <p className="text-sm text-gray-500">32/32 GD</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thời gian xử lý TB</CardTitle>
                        <CardDescription>Thời gian trung bình để hoàn thành giao dịch</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium">Chuyển khoản</span>
                                </div>
                                <span className="font-bold text-gray-900">2.5 phút</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium">MoMo</span>
                                </div>
                                <span className="font-bold text-gray-900">1.2 phút</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium">VNPay</span>
                                </div>
                                <span className="font-bold text-gray-900">1.8 phút</span>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium">Tiền mặt</span>
                                </div>
                                <span className="font-bold text-gray-900">Ngay lập tức</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}