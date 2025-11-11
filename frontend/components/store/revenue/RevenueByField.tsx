"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Search,
    Filter,
    MapPin,
    DollarSign,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Calendar,
    Clock,
    Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Mock data
const fieldRevenue = [
    {
        id: 1,
        name: 'Sân bóng đá 1',
        type: 'football',
        location: 'Khu A - Tầng 1',
        monthlyRevenue: 8500000,
        totalBookings: 156,
        avgBookingValue: 54487,
        utilizationRate: 85,
        peakHours: '18:00-22:00',
        topCustomer: 'Nguyễn Văn A',
        growth: 15.2,
        status: 'active'
    },
    {
        id: 2,
        name: 'Sân bóng đá 2',
        type: 'football',
        location: 'Khu A - Tầng 1',
        monthlyRevenue: 7200000,
        totalBookings: 142,
        avgBookingValue: 50704,
        utilizationRate: 78,
        peakHours: '16:00-20:00',
        topCustomer: 'Trần Thị B',
        growth: 8.7,
        status: 'active'
    },
    {
        id: 3,
        name: 'Sân tennis 1',
        type: 'tennis',
        location: 'Khu B - Tầng 2',
        monthlyRevenue: 5400000,
        totalBookings: 98,
        avgBookingValue: 55102,
        utilizationRate: 65,
        peakHours: '14:00-18:00',
        topCustomer: 'Lê Văn C',
        growth: -2.1,
        status: 'maintenance'
    },
    {
        id: 4,
        name: 'Sân cầu lông 1',
        type: 'badminton',
        location: 'Khu C - Tầng 3',
        monthlyRevenue: 9800000,
        totalBookings: 203,
        avgBookingValue: 48275,
        utilizationRate: 92,
        peakHours: '19:00-23:00',
        topCustomer: 'Phạm Thị D',
        growth: 25.6,
        status: 'active'
    },
    {
        id: 5,
        name: 'Sân bóng rổ 1',
        type: 'basketball',
        location: 'Khu D - Tầng 1',
        monthlyRevenue: 3200000,
        totalBookings: 76,
        avgBookingValue: 42105,
        utilizationRate: 45,
        peakHours: '15:00-19:00',
        topCustomer: 'Hoàng Văn E',
        growth: -5.3,
        status: 'inactive'
    }
]

const revenueByHour = [
    { hour: '06-08', revenue: 1200000, bookings: 24 },
    { hour: '08-10', revenue: 800000, bookings: 16 },
    { hour: '10-12', revenue: 600000, bookings: 12 },
    { hour: '14-16', revenue: 1500000, bookings: 30 },
    { hour: '16-18', revenue: 2200000, bookings: 44 },
    { hour: '18-20', revenue: 3400000, bookings: 68 },
    { hour: '20-22', revenue: 2800000, bookings: 56 }
]

const fieldTypeRevenue = [
    { name: 'Bóng đá', value: 15700000, color: '#22c55e' },
    { name: 'Cầu lông', value: 9800000, color: '#3b82f6' },
    { name: 'Tennis', value: 5400000, color: '#f59e0b' },
    { name: 'Bóng rổ', value: 3200000, color: '#ef4444' }
]

const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-orange-100 text-orange-800'
}

const statusLabels = {
    active: 'Hoạt động',
    inactive: 'Tạm ngừng',
    maintenance: 'Bảo trì'
}

const fieldTypeLabels = {
    football: 'Bóng đá',
    tennis: 'Tennis',
    badminton: 'Cầu lông',
    basketball: 'Bóng rổ'
}

function FieldRevenueCard({ field }: { field: any }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{field.name}</h3>
                            <Badge className={(statusColors as any)[field.status]}>
                                {(statusLabels as any)[field.status]}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{field.location}</span>
                        </div>
                        <p className="text-sm text-gray-600">{(fieldTypeLabels as any)[field.type]}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{field.monthlyRevenue.toLocaleString()}đ</p>
                        <div className={`flex items-center mt-1 ${field.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {field.growth >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{Math.abs(field.growth)}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-700">Tổng booking</p>
                        <p className="text-xl font-bold text-blue-900">{field.totalBookings}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-green-700">Giá trị TB</p>
                        <p className="text-xl font-bold text-green-900">{field.avgBookingValue.toLocaleString()}đ</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ sử dụng:</span>
                        <span className="font-medium">{field.utilizationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Giờ cao điểm:</span>
                        <span className="font-medium">{field.peakHours}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Khách VIP:</span>
                        <span className="font-medium">{field.topCustomer}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${field.utilizationRate}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RevenueByField() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('revenue')

    const filteredFields = fieldRevenue.filter(field => {
        const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || field.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const sortedFields = [...filteredFields].sort((a, b) => {
        switch (sortBy) {
            case 'revenue':
                return b.monthlyRevenue - a.monthlyRevenue
            case 'bookings':
                return b.totalBookings - a.totalBookings
            case 'growth':
                return b.growth - a.growth
            default:
                return 0
        }
    })

    const totalRevenue = fieldRevenue.reduce((sum, field) => sum + field.monthlyRevenue, 0)
    const totalBookings = fieldRevenue.reduce((sum, field) => sum + field.totalBookings, 0)
    const avgUtilization = fieldRevenue.reduce((sum, field) => sum + field.utilizationRate, 0) / fieldRevenue.length

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}đ</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng booking</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Sử dụng TB</p>
                                <p className="text-2xl font-bold text-gray-900">{avgUtilization.toFixed(1)}%</p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Sân hoạt động</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {fieldRevenue.filter(f => f.status === 'active').length}
                                </p>
                            </div>
                            <MapPin className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Hour */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo khung giờ</CardTitle>
                        <CardDescription>Phân tích doanh thu trong ngày</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueByHour}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue by Field Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo loại sân</CardTitle>
                        <CardDescription>Phân bố doanh thu theo từng loại sân</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={fieldTypeRevenue}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${(value / 1000000).toFixed(1)}M`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {fieldTypeRevenue.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                <Input
                                    placeholder="Tìm kiếm sân..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="inactive">Tạm ngừng</SelectItem>
                                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Doanh thu</SelectItem>
                                    <SelectItem value="bookings">Booking</SelectItem>
                                    <SelectItem value="growth">Tăng trưởng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Field Revenue Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedFields.map((field) => (
                    <FieldRevenueCard key={field.id} field={field} />
                ))}
            </div>

            {filteredFields.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}