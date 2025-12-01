'use client'

import React from 'react'
import type { StoreSearchItemResponse } from '@/types'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, MapPin, Star, Eye, ShoppingCart, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toggleFavourite, isFavourite } from '@/services/api-new'

interface AdminStoresContentProps {
    stores: StoreSearchItemResponse[]
    viewMode: 'grid' | 'list'
}

// Simple card component for admin stores (without hardcoded link)
function AdminStoreCard({ store }: { store: StoreSearchItemResponse }) {
    const [isFav, setIsFav] = useState(false)

    useEffect(() => {
        const checkFavourite = async () => {
            try {
                const result = await isFavourite(store.id)
                setIsFav(result)
            } catch (error) {
                // Silently fail
            }
        }
        checkFavourite()
    }, [store.id])

    const formatTime = (time?: string) => {
        if (!time) return '--:--'
        return time.substring(0, 5)
    }

    const getLocationText = () => {
        const parts = []
        if (store.ward?.name) parts.push(store.ward.name)
        if (store.province?.name) parts.push(store.province.name)
        return parts.join(', ') || 'Chưa có địa chỉ'
    }

    return (
        <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary h-[520px] flex flex-col">
            {/* Cover Image */}
            <div className="relative h-60 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300 flex-shrink-0">
                {store.coverUrl ? (
                    <img
                        src={store.coverUrl}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                        </svg>
                    </div>
                )}

                {/* Avatar Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-3">
                        {store.avatarUrl ? (
                            <img
                                src={store.avatarUrl}
                                alt={store.name}
                                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl">
                                {store.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">
                                {store.name}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
                {/* Location */}
                <div className="flex items-start gap-3 text-sm text-gray-600 flex-shrink-0">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                    <span className="line-clamp-1 font-medium">{getLocationText()}</span>
                </div>

                {/* Opening Hours */}
                <div className="flex items-center gap-3 text-sm flex-shrink-0 mt-2">
                    <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold truncate">
                        {formatTime(store.startTime)} - {formatTime(store.endTime)}
                    </span>
                </div>

                {/* Stats */}
                <div className="mt-auto pt-3 border-t flex-shrink-0">
                    <div className="flex items-center mb-3 gap-2 justify-between">
                        <div className="flex-1 flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg min-w-0">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <span className="font-bold text-gray-900 truncate">
                                {store.averageRating?.toFixed(1) || '0.0'}
                            </span>
                        </div>
                        <div className="flex-1 flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg min-w-0 justify-center">
                            <ShoppingCart className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-700 text-sm truncate">{store.orderCount || 0}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-1.5 bg-purple-50 px-2.5 py-1.5 rounded-lg min-w-0 justify-end">
                            <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-700 text-sm truncate">{store.viewCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* View Details Button */}
                <button className="w-full mt-3 bg-gradient-to-r from-primary to-primary/80 text-white py-2.5 px-3 rounded-lg font-bold text-sm hover:shadow-lg transition-all group-hover:shadow-xl flex-shrink-0">
                    Xem chi tiết
                </button>
            </CardContent>
        </Card>
    )
}

// Simple list item component
function AdminStoreListItem({ store }: { store: StoreSearchItemResponse }) {
    const formatTime = (time?: string) => {
        if (!time) return '--:--'
        return time.substring(0, 5)
    }

    const getLocationText = () => {
        const parts = []
        if (store.ward?.name) parts.push(store.ward.name)
        if (store.province?.name) parts.push(store.province.name)
        return parts.join(', ') || 'Chưa có địa chỉ'
    }

    return (
        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary">
            <CardContent className="p-4 flex items-center gap-4">
                {store.avatarUrl ? (
                    <img
                        src={store.avatarUrl}
                        alt={store.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                        {store.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{store.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{getLocationText()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(store.startTime)} - {formatTime(store.endTime)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center text-yellow-500 font-bold">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            {store.averageRating?.toFixed(1) || '0.0'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center text-green-600 font-bold">
                            <ShoppingCart className="w-4 h-4" />
                            {store.orderCount || 0}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center gap-1 justify-center text-purple-600 font-bold">
                            <Eye className="w-4 h-4" />
                            {store.viewCount || 0}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AdminStoresContent({ stores, viewMode }: AdminStoresContentProps) {
    if (stores.length === 0) {
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
                        Không tìm thấy Trung tâm thể thao
                    </h3>
                    <p className="text-gray-600">
                        Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                </div>
            </div>
        )
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {stores.map((store) => (
                    <Link key={store.id} href={`/admin/stores/${store.id}`} className="block hover:opacity-90 transition-opacity">
                        <AdminStoreCard store={store} />
                    </Link>
                ))}
            </div>
        )
    }

    // List view
    return (
        <div className="space-y-4 mb-8">
            {stores.map((store) => (
                <Link key={store.id} href={`/admin/stores/${store.id}`} className="block hover:opacity-90 transition-opacity">
                    <AdminStoreListItem store={store} />
                </Link>
            ))}
        </div>
    )
}
