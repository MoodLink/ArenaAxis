"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data
const revenueData = [
    { month: 'T1', revenue: 12000000, bookings: 85 },
    { month: 'T2', revenue: 15000000, bookings: 102 },
    { month: 'T3', revenue: 18000000, bookings: 120 },
    { month: 'T4', revenue: 14000000, bookings: 95 },
    { month: 'T5', revenue: 22000000, bookings: 135 },
    { month: 'T6', revenue: 25000000, bookings: 150 }
]

const fieldUsageData = [
    { field: 'Sân 1', usage: 85, revenue: 8500000 },
    { field: 'Sân 2', usage: 92, revenue: 9200000 },
    { field: 'Sân 3', usage: 78, revenue: 7800000 },
    { field: 'Sân 4', usage: 88, revenue: 8800000 },
    { field: 'Sân 5', usage: 95, revenue: 9500000 }
]

const timeSlotData = [
    { time: '6-8h', bookings: 45, color: '#8884d8' },
    { time: '8-10h', bookings: 32, color: '#82ca9d' },
    { time: '10-12h', bookings: 28, color: '#ffc658' },
    { time: '14-16h', bookings: 35, color: '#ff7300' },
    { time: '16-18h', bookings: 52, color: '#00ff00' },
    { time: '18-20h', bookings: 68, color: '#0088fe' },
    { time: '20-22h', bookings: 42, color: '#ff8042' }
]

export default function ChartsSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh thu theo tháng</CardTitle>
                    <CardDescription>Biểu đồ doanh thu 6 tháng gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Field Usage Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Tỷ lệ sử dụng sân</CardTitle>
                    <CardDescription>Tỷ lệ sử dụng từng sân trong tháng</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fieldUsageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="field" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ sử dụng']} />
                            <Bar dataKey="usage" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Time Slot Usage */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Lượt đặt theo khung giờ</CardTitle>
                    <CardDescription>Phân bố lượt đặt sân theo các khung giờ trong ngày</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={timeSlotData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ time, bookings }) => `${time}: ${bookings}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="bookings"
                                >
                                    {timeSlotData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">Chi tiết theo khung giờ</h4>
                            {timeSlotData.map((slot, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: slot.color }}
                                        />
                                        <span className="text-sm text-gray-600">{slot.time}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{slot.bookings} lượt</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}