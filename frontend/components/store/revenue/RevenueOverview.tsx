"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Search,
    MapPin,
    Activity,
    BarChart3,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { getStoresByOwnerId } from '@/services/api-new'
import { getMyProfile } from '@/services/get-my-profile'
import { StoreAdminDetailResponse } from '@/types'

// Mock data - Revenue charts only
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

// Types for store revenue data (combining API data with calculated revenue)
interface StoreRevenueData {
    id: string
    name: string
    address?: string
    orderCount: number
    avatarUrl?: string
    // Calculated fields
    monthlyRevenue: number
    avgBookingValue: number
    // growth: number
    utilizationRate: number
}

// Format currency without locale (avoid hydration mismatch)
const formatCurrency = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

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
                    {/* <div className="text-right">
                        <div className={`flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                            {changeType === 'increase' ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{trend}</p>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    )
}

function StoreRevenueCard({ store }: { store: StoreRevenueData }) {
    return (
        <Link href={`/store/revenue/${store.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
                                <Badge className="bg-green-100 text-green-800">
                                    Hoạt động
                                </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{store.address || 'N/A'}</span>
                            </div>
                            {/* <p className="text-sm text-gray-600">{store.orderCount} đơn hàng</p> */}
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(store.monthlyRevenue)}đ</p>
                            {/* <div className={`flex items-center mt-1 justify-end ${store.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {store.growth >= 0 ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                <span className="text-sm font-medium">{Math.abs(store.growth)}%</span>
                            </div> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-700">Tổng booking</p>
                            <p className="text-xl font-bold text-blue-900">{store.orderCount}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-green-700">Giá trị TB</p>
                            <p className="text-xl font-bold text-green-900">{formatCurrency(store.avgBookingValue)}đ</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        {/* <div className="flex justify-between">
                            <span className="text-gray-600">Tỷ lệ sử dụng:</span>
                            <span className="font-medium">{store.utilizationRate}%</span>
                        </div> */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doanh thu trung bình:</span>
                            <span className="font-medium">{formatCurrency(store.monthlyRevenue / (store.orderCount || 1))}đ/booking</span>
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
        </Link>
    )
}

export default function RevenueOverview() {
    const [timeRange, setTimeRange] = useState('6months')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('revenue')
    const [storeFilter, setStoreFilter] = useState('all')

    const [myStores, setMyStores] = useState<StoreRevenueData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load stores from API
    useEffect(() => {
        const loadStores = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get user profile
                const profile = getMyProfile()
                console.log('User profile:', profile)

                // Get stores by owner ID
                const stores = await getStoresByOwnerId(profile.id)
                console.log('Stores from API:', stores)

                // Transform API data to StoreRevenueData
                const transformedStores: StoreRevenueData[] = stores.map(store => {
                    // Calculate revenue from orderCount
                    // Base price: 150,000đ per order (mock)
                    const basePrice = 150000
                    const monthlyRevenue = (store.orderCount || 0) * basePrice

                    // // Random growth between -5% to +20%
                    // const growth = Math.round((Math.random() * 25 - 5) * 10) / 10

                    // Utilization rate: 30% to 90%
                    const utilizationRate = Math.floor(Math.random() * 60 + 30)

                    // Average booking value
                    const avgBookingValue = basePrice

                    return {
                        id: store.id,
                        name: store.name,
                        address: store.address,
                        orderCount: store.orderCount || 0,
                        avatarUrl: store.avatarUrl,
                        monthlyRevenue,
                        avgBookingValue,
                        // growth,
                        utilizationRate
                    }
                })

                setMyStores(transformedStores)
            } catch (err) {
                console.error('Error loading stores:', err)
                setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách store')
                setMyStores([])
            } finally {
                setLoading(false)
            }
        }

        loadStores()
    }, [])

    // Filter stores
    const filteredStores = myStores.filter((store: StoreRevenueData) => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (store.address || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStore = storeFilter === 'all' || store.id === storeFilter
        return matchesSearch && matchesStore
    })

    // Sort stores
    const sortedStores = [...filteredStores].sort((a, b) => {
        switch (sortBy) {
            case 'revenue':
                return b.monthlyRevenue - a.monthlyRevenue
            case 'bookings':
                return b.orderCount - a.orderCount
            // case 'growth':
            //     return b.growth - a.growth
            default:
                return 0
        }
    })

    const totalRevenue = filteredStores.reduce((sum: number, store: StoreRevenueData) => sum + store.monthlyRevenue, 0)
    const totalBookings = filteredStores.reduce((sum: number, store: StoreRevenueData) => sum + store.orderCount, 0)
    const avgUtilization = filteredStores.length > 0
        ? Math.round(filteredStores.reduce((sum: number, store: StoreRevenueData) => sum + store.utilizationRate, 0) / filteredStores.length)
        : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi</h3>
                    <p className="text-gray-600">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (myStores.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có store nào</h3>
                    <p className="text-gray-600">Hãy tạo store để xem doanh thu</p>
                </CardContent>
            </Card>
        )
    }

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title={`Tổng doanh thu / ${filteredStores.length} store`}
                    value={`${(totalRevenue / 1000000).toFixed(1)}M đ`}

                    changeType="increase"
                    icon={DollarSign}

                />
                <StatCard
                    title="Doanh thu trung bình/ngày"
                    value="3.533.000đ"


                    icon={Calendar}

                />
                <StatCard
                    title="Số giao dịch"
                    value={totalBookings.toString()}


                    icon={CreditCard}

                />
            </div>




            {/* Store Filters */}
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
                            <Select value={storeFilter} onValueChange={setStoreFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Chọn store" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả store ({myStores.length})</SelectItem>
                                    {myStores.map((store) => (
                                        <SelectItem key={store.id} value={store.id}>
                                            {store.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sắp xếp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Doanh thu</SelectItem>
                                    <SelectItem value="bookings">Booking</SelectItem>
                                    {/* <SelectItem value="growth">Tăng trưởng</SelectItem> */}
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