"use client"

import React, { useState, useEffect, useRef } from 'react'
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
import { getMyProfile } from '@/services/get-my-profile'
import { RevenueService, RevenueResponse } from '@/services/revenue.service'
import { StoreAdminDetailResponse } from '@/types'

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

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-700">Tổng lượt đặt</p>
                            <p className="text-xl font-bold text-blue-900">{store.orderCount}</p>
                        </div>

                    </div>




                </CardContent>
            </Card>
        </Link>
    )
}

export default function RevenueOverview() {
    const mountedRef = useRef(false)
    const [timeRange, setTimeRange] = useState('6months')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('revenue')
    const [storeFilter, setStoreFilter] = useState('all')

    const [myStores, setMyStores] = useState<StoreRevenueData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Revenue API data
    const [revenueData, setRevenueData] = useState<RevenueResponse['data'] | null>(null)
    const [revenueLoading, setRevenueLoading] = useState(true)

    // Load stores from API
    useEffect(() => {
        mountedRef.current = true

        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get user profile
                const profile = getMyProfile()
                if (!profile) {
                    setError('Không tìm thấy thông tin người dùng')
                    setMyStores([])
                    return
                }

                // Load revenue data with store cards
                const revenueResponse = await RevenueService.getOwnerRevenue(profile.id).catch(err => {
                    console.warn('Failed to load revenue data:', err)
                    return null
                })

                console.log('Revenue data:', revenueResponse)

                // Set revenue data if available
                if (revenueResponse?.data) {
                    setRevenueData(revenueResponse.data)

                    // Transform store cards from revenue API to StoreRevenueData
                    const transformedStores: StoreRevenueData[] = (revenueResponse.data.storeCards || []).map(storeCard => {
                        // Use actual revenue and transactions from API
                        const monthlyRevenue = storeCard.revenue || 0
                        const orderCount = storeCard.transactions || 0

                        // Utilization rate: 30% to 90%
                        const utilizationRate = Math.floor(Math.random() * 60 + 30)

                        // Average booking value
                        const avgBookingValue = orderCount > 0 ? monthlyRevenue / orderCount : 0

                        return {
                            id: storeCard.id,
                            name: storeCard.name,
                            address: storeCard.address,
                            orderCount,
                            avatarUrl: undefined,
                            monthlyRevenue,
                            avgBookingValue,
                            utilizationRate
                        }
                    })

                    setMyStores(transformedStores)
                } else {
                    setError('Không thể tải dữ liệu doanh thu')
                    setMyStores([])
                }
            } catch (err) {
                console.error('Error loading stores:', err)
                setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách store')
                setMyStores([])
            } finally {
                setLoading(false)
                setRevenueLoading(false)
            }
        }

        loadData()
    }, [])

    // Avoid hydration mismatch by not rendering until mounted
    if (!mountedRef.current) {
        return <div className="w-full h-96" />
    }

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


            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Tổng doanh thu {revenueData ? `(${revenueData.storeCount} store)` : ''}
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">
                                        {revenueLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin inline" />
                                        ) : revenueData ? (
                                            `${formatCurrency(revenueData.totalRevenue)}đ`
                                        ) : (
                                            '0đ'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Today */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Doanh thu trung bình / ngày
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">
                                        {revenueLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin inline" />
                                        ) : revenueData ? (
                                            `${formatCurrency(Math.round(revenueData.totalRevenueInCurrentDay / (revenueData.storeCount || 1)))}đ`
                                        ) : (
                                            '0đ'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Transactions */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <CreditCard className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Tổng lượt đặt
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">
                                        {revenueLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin inline" />
                                        ) : revenueData ? (
                                            revenueData.totalTransactions
                                        ) : (
                                            '0'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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