"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { StoreAdminDetailResponse } from '@/types'
import { getStoresByOwnerId } from '@/services/api-new'
import { getMyProfile } from '@/services/get-my-profile'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, ShoppingCart, Eye, Star, Edit, Loader2, Grid3x3, List } from 'lucide-react'
import ClientOnly from '@/components/common/ClientOnly'

interface OwnerStoresListProps {
    ownerId?: string;
}

export default function OwnerStoresList({ ownerId }: OwnerStoresListProps) {
    const [stores, setStores] = useState<StoreAdminDetailResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true)

                //  Lấy owner-id: Ưu tiên prop, fallback sang getMyProfile()
                let currentOwnerId = ownerId

                if (!currentOwnerId) {
                    console.log(' Owner ID not provided, fetching current user profile...')
                    //  ĐÚNG: Gọi GET /users/myself để lấy thông tin user hiện tại
                    const currentUser = getMyProfile()

                    if (!currentUser?.id) {
                        console.error(' Cannot get user ID from getMyProfile()')
                        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.')
                        return
                    }

                    currentOwnerId = currentUser.id
                    console.log(' Got owner ID from getMyProfile():', currentOwnerId)
                }

                //  ĐÚNG: Gọi GET /stores/owner/{owner-id} với owner-id vừa lấy được
                console.log(' Fetching stores for owner ID:', currentOwnerId)
                const data = await getStoresByOwnerId(currentOwnerId)
                console.log('Stores data received:', data, '| Total:', data.length)

                setStores(data)
                setError(null)

                //  TẤT CẢ ĐỀU LỮU STORE ID VÀO LOCALSTORAGE
                // Nếu chỉ có 1 Trung tâm thể thao → lưu ngay
                // Nếu có nhiều Trung tâm thể thao → lưu cái đầu tiên (user sẽ sửa thành cái khác khi navigate)
                if (data.length > 0) {
                    const primaryStore = data[0]
                    localStorage.setItem('storeId', primaryStore.id)
                    localStorage.setItem('storeName', primaryStore.name)
                    console.log(' Saved primary store to localStorage:', {
                        storeId: primaryStore.id,
                        storeName: primaryStore.name
                    })
                }
            } catch (err) {
                console.error(' Error fetching stores:', err)
                const errorMsg = err instanceof Error ? err.message : 'Lỗi khi tải danh sách Trung tâm thể thao'
                setError(errorMsg)
                setStores([])
            } finally {
                setLoading(false)
            }
        }

        fetchStores()
    }, [ownerId])

    const formatTime = (time?: string) => {
        if (!time) return '--:--';
        return time.substring(0, 5); // HH:mm
    };

    //  Hàm xử lý khi user click vào store
    const handleStoreSelect = (store: StoreAdminDetailResponse) => {
        localStorage.setItem('storeId', store.id)
        localStorage.setItem('storeName', store.name)
        console.log(' Updated current store to:', {
            storeId: store.id,
            storeName: store.name
        })
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải danh sách Trung tâm thể thao...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200">
                <p className="font-semibold"> Lỗi: {error}</p>
                <p className="text-sm mt-2">Vui lòng thử lại hoặc liên hệ hỗ trợ</p>
            </div>
        )
    }

    if (!stores || stores.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Chưa có Trung tâm thể thao nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Tạo Trung tâm thể thao mới để bắt đầu kinh doanh
                    </p>
                    <Button asChild size="lg">
                        <Link href="/store-registration">Tạo Trung tâm thể thao</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Component hiển thị hàng trong bảng
    const TableRow = ({ store }: { store: StoreAdminDetailResponse }) => (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    {store.avatarUrl ? (
                        <img
                            src={store.avatarUrl}
                            alt={store.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
                            {store.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="font-medium text-gray-900 line-clamp-1">{store.name}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs line-clamp-1">{store.address || '--'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {store.startTime && store.endTime
                    ? `${formatTime(store.startTime)} - ${formatTime(store.endTime)}`
                    : '--'}
            </td>
            <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                        <ClientOnly>{(store as any).averageRating?.toFixed(1) || '0.0'}</ClientOnly>
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="font-semibold text-gray-900">
                    <ClientOnly>{store.orderCount || 0}</ClientOnly>
                </span>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="font-semibold text-gray-900">
                    <ClientOnly>{store.viewCount || 0}</ClientOnly>
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    {store.approved ? (
                        <Badge className="bg-green-600">✓ Đã duyệt</Badge>
                    ) : (
                        <Badge variant="secondary">⏳ Chờ duyệt</Badge>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <Button
                    size="sm"
                    variant="outline"
                    asChild
                    onClick={() => handleStoreSelect(store)}
                >
                    <Link href={`/store/detail/${store.id}`}>
                        <Eye className="w-4 h-4" />
                    </Link>
                </Button>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Trung tâm thể thao của bạn
                    </h2>
                    <p className="text-gray-600 mt-1">Quản lý {stores.length} trung tâm thể thao</p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <Button
                        size="sm"
                        variant={viewMode === 'card' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('card')}
                        className="gap-2"
                    >
                        <Grid3x3 className="w-4 h-4" />
                        Thẻ
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('table')}
                        className="gap-2"
                    >
                        <List className="w-4 h-4" />
                        Bảng
                    </Button>
                </div>
            </div>

            {/* Card View */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stores.map((store) => (
                        <Card
                            key={store.id}
                            className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary h-[520px] flex flex-col"
                        >
                            {/* Cover Image */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
                                {store.coverImageUrl ? (
                                    <img
                                        src={store.coverImageUrl}
                                        alt={store.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Status Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    {store.approved ? (
                                        <Badge className="bg-green-600 shadow-lg">✓ Đã duyệt</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="shadow-lg">⏳ Chờ duyệt</Badge>
                                    )}
                                    {store.active ? (
                                        <Badge variant="outline" className="bg-white shadow-lg">Hoạt động</Badge>
                                    ) : (
                                        <Badge variant="destructive" className="shadow-lg">Tạm ngừng</Badge>
                                    )}
                                </div>

                                {/* Avatar Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <div className="flex items-center gap-2">
                                        {store.avatarUrl ? (
                                            <img
                                                src={store.avatarUrl}
                                                alt={store.name}
                                                className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
                                                {store.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-shrink-0">
                                            {store.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-2 flex-1 flex flex-col overflow-hidden">
                                {/* Introduction */}
                                {store.introduction && (
                                    <p className="text-sm text-gray-600 line-clamp-2 flex-shrink-0">
                                        {store.introduction}
                                    </p>
                                )}

                                {/* Location */}
                                {store.address && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 flex-shrink-0">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                                        <span className="line-clamp-1">{store.address}</span>
                                    </div>
                                )}

                                {/* Opening Hours */}
                                {(store.startTime || store.endTime) && (
                                    <div className="flex items-center gap-2 text-sm flex-shrink-0">
                                        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium truncate">
                                            {formatTime(store.startTime)} - {formatTime(store.endTime)}
                                        </span>
                                    </div>
                                )}

                                {/* Stats - Bottom */}
                                <div className="mt-auto pt-2 border-t space-y-2 flex-shrink-0">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-yellow-50 p-2 rounded">
                                            <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                                            <p className="text-xs font-semibold text-gray-900">
                                                <ClientOnly>{(store as any).averageRating?.toFixed(1) || '0.0'}</ClientOnly>
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-2 rounded">
                                            <ShoppingCart className="w-4 h-4 text-green-500 mx-auto mb-1" />
                                            <p className="text-xs font-semibold text-gray-900">
                                                <ClientOnly>{store.orderCount || 0}</ClientOnly>
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-2 rounded">
                                            <Eye className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                                            <p className="text-xs font-semibold text-gray-900">
                                                <ClientOnly>{store.viewCount || 0}</ClientOnly>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        asChild
                                        onClick={() => handleStoreSelect(store)}
                                    >
                                        <Link href={`/store/detail/${store.id}`}>
                                            <Eye className="w-4 h-4 mr-1" />
                                            Xem chi tiết
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="px-6 py-3 text-left font-semibold text-gray-900">Tên trung tâm thể thao</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-900">Địa chỉ</th>
                                <th className="px-6 py-3 text-left font-semibold text-gray-900">Giờ mở cửa</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-900">Đánh giá</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-900">Đơn hàng</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-900">Lượt xem</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-900">Trạng thái</th>
                                <th className="px-6 py-3 text-center font-semibold text-gray-900">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <TableRow key={store.id} store={store} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
