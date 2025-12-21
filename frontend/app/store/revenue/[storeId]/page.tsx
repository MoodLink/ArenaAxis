"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Loader2,
    AlertCircle,
    MapPin
} from 'lucide-react'
import { getStoreById } from '@/services/api-new'
import { RevenueService, StoreRevenueResponse } from '@/services/revenue.service'
import { StoreClientDetailResponse } from '@/types'

interface FieldRevenueData {
    id: string
    name: string
    defaultPrice: string
    revenue: number
    transactions: number
}

export default function StoreDetailPage() {
    const params = useParams()
    const router = useRouter()
    const storeId = params.storeId as string

    const [store, setStore] = useState<StoreClientDetailResponse | null>(null)
    const [storeRevenue, setStoreRevenue] = useState<StoreRevenueResponse['data'] | null>(null)
    const [fields, setFields] = useState<FieldRevenueData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalRevenue, setTotalRevenue] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get store detail
                const storeData = await getStoreById(storeId)
                if (!storeData) {
                    setError('Không tìm thấy Trung tâm thể thao')
                    return
                }
                setStore(storeData)

                // Get store revenue data
                const revenueResponse = await RevenueService.getStoreRevenue(storeId).catch(err => {
                    console.warn('Failed to load store revenue:', err)
                    return null
                })

                if (revenueResponse?.data) {
                    setStoreRevenue(revenueResponse.data)
                    setTotalRevenue(revenueResponse.data.totalRevenue)
                    setFields(revenueResponse.data.fieldCards)
                }
            } catch (err) {
                console.error('Error loading store detail:', err)
                setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu')
            } finally {
                setLoading(false)
            }
        }

        if (storeId) {
            loadData()
        }
    }, [storeId])

    if (loading) {
        return (
            <StoreLayout>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </StoreLayout>
        )
    }

    if (error || !store) {
        return (
            <StoreLayout>
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi</h3>
                        <p className="text-gray-600 mb-6">{error || 'Không tìm thấy Trung tâm thể thao'}</p>
                        <Button onClick={() => router.back()}>Quay lại</Button>
                    </CardContent>
                </Card>
            </StoreLayout>
        )
    }

    // Calculate totals - only from storeRevenue API data
    const avgRevenuePerField = fields.length > 0 ? totalRevenue / fields.length : 0

    // Format currency
    const formatCurrency = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>

                {/* Store Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{store.address || 'N/A'}</span>
                            </div>
                            {store.introduction && (
                                <p className="text-gray-700">{store.introduction}</p>
                            )}
                        </div>
                        <Badge className={store.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {store.active ? 'Hoạt động' : 'Tạm ngừng'}
                        </Badge>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {storeRevenue ? `${formatCurrency(storeRevenue.totalRevenue)}đ` : '0đ'}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng booking</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {storeRevenue ? storeRevenue.totalOrder : 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu trung bình</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {storeRevenue ? `${formatCurrency(Math.round(avgRevenuePerField))}đ` : '0đ'}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Fields List */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách sân ({fields.length})</h2>

                    {fields.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sân nào</h3>
                                <p className="text-gray-600">Hãy tạo sân để bắt đầu quản lý</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fields.map((item) => (
                                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                Hoạt động
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Giá tiền:</span>
                                                <span className="font-medium">{formatCurrency(typeof item.defaultPrice === 'string' ? parseInt(item.defaultPrice) || 0 : item.defaultPrice || 0)}đ</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Giao dịch:</span>
                                                <span className="font-medium text-blue-600">{item.transactions}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Doanh thu:</span>
                                                <span className="font-medium text-green-600">{formatCurrency(item.revenue)}đ</span>
                                            </div>
                                        </div>

                                        {/* Revenue Bar */}



                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    )
}
