"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

// Mock data
const revenueData = [
    { month: 'T1', revenue: 12000000, views: 150, avgRating: 4.2 },
    { month: 'T2', revenue: 15000000, views: 280, avgRating: 4.3 },
    { month: 'T3', revenue: 18000000, views: 420, avgRating: 4.4 },
    { month: 'T4', revenue: 14000000, views: 580, avgRating: 4.5 },
    { month: 'T5', revenue: 22000000, views: 850, avgRating: 4.6 },
    { month: 'T6', revenue: 25000000, views: 1200, avgRating: 4.7 }
]

const fieldViewsData = [
    { field: 'Sân 1', views: 250, avgRating: 4.8, revenue: 8500000 },
    { field: 'Sân 2', views: 280, avgRating: 4.6, revenue: 9200000 },
    { field: 'Sân 3', views: 200, avgRating: 4.4, revenue: 7800000 },
    { field: 'Sân 4', views: 270, avgRating: 4.7, revenue: 8800000 },
    { field: 'Sân 5', views: 320, avgRating: 4.5, revenue: 9500000 }
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

            {/* Field Views Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Views và Rating theo Sân</CardTitle>
                    <CardDescription>Lượt xem và rating trung bình từng sân</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fieldViewsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="field" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="views" fill="#10b981" name="Views" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}