"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Search,
    MapPin,
    DollarSign,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Calendar,
    Activity
} from 'lucide-react'

// Mock data - Stores instead of fields
const storeRevenue = [
    {
        id: 1,
        name: 'Khu thể thao Quận 1',
        location: 'Quận 1, TP.HCM',
        monthlyRevenue: 25600000,
        totalBookings: 456,
        avgBookingValue: 56140,
        utilizationRate: 88,
        fieldsCount: 8,
        growth: 18.5,
        status: 'active'
    },
    {
        id: 2,
        name: 'Khu thể thao Quận 3',
        location: 'Quận 3, TP.HCM',
        monthlyRevenue: 18900000,
        totalBookings: 334,
        avgBookingValue: 56584,
        utilizationRate: 82,
        fieldsCount: 6,
        growth: 12.3,
        status: 'active'
    },
    {
        id: 3,
        name: 'Khu thể thao Quận 7',
        location: 'Quận 7, TP.HCM',
        monthlyRevenue: 22100000,
        totalBookings: 389,
        avgBookingValue: 56810,
        utilizationRate: 79,
        fieldsCount: 7,
        growth: 15.7,
        status: 'active'
    },
    {
        id: 4,
        name: 'Khu thể thao Tân Bình',
        location: 'Quận Tân Bình, TP.HCM',
        monthlyRevenue: 15400000,
        totalBookings: 267,
        avgBookingValue: 57676,
        utilizationRate: 71,
        fieldsCount: 5,
        growth: 8.2,
        status: 'active'
    },
    {
        id: 5,
        name: 'Khu thể thao Bình Thạnh',
        location: 'Quận Bình Thạnh, TP.HCM',
        monthlyRevenue: 12100000,
        totalBookings: 198,
        avgBookingValue: 61111,
        utilizationRate: 65,
        fieldsCount: 4,
        growth: -3.5,
        status: 'active'
    }
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

function StoreRevenueCard({ store }: { store: any }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
                            <Badge className={(statusColors as any)[store.status]}>
                                {(statusLabels as any)[store.status]}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{store.location}</span>
                        </div>
                        <p className="text-sm text-gray-600">{store.fieldsCount} sân trong cơ sở</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{store.monthlyRevenue.toLocaleString()}đ</p>
                        <div className={`flex items-center mt-1 justify-end ${store.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {store.growth >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{Math.abs(store.growth)}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-700">Tổng booking</p>
                        <p className="text-xl font-bold text-blue-900">{store.totalBookings}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-green-700">Giá trị TB</p>
                        <p className="text-xl font-bold text-green-900">{store.avgBookingValue.toLocaleString()}đ</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ sử dụng:</span>
                        <span className="font-medium">{store.utilizationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số sân:</span>
                        <span className="font-medium">{store.fieldsCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Doanh thu trung bình:</span>
                        <span className="font-medium">{(store.monthlyRevenue / store.fieldsCount).toLocaleString()}đ/sân</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${store.utilizationRate}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RevenueByStore() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('revenue')

    const filteredStores = storeRevenue.filter(store => {
        return store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.location.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const sortedStores = [...filteredStores].sort((a, b) => {
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

    const totalRevenue = storeRevenue.reduce((sum, store) => sum + store.monthlyRevenue, 0)
    const totalBookings = storeRevenue.reduce((sum, store) => sum + store.totalBookings, 0)
    const avgUtilization = storeRevenue.reduce((sum, store) => sum + store.utilizationRate, 0) / storeRevenue.length

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
                                <p className="text-sm text-gray-600">Số store</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {storeRevenue.length}
                                </p>
                            </div>
                            <MapPin className="h-8 w-8 text-orange-600" />
                        </div>
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
                                    placeholder="Tìm kiếm store..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
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

            {/* Store Revenue Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedStores.map((store) => (
                    <StoreRevenueCard key={store.id} store={store} />
                ))}
            </div>

            {filteredStores.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy store nào</h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
