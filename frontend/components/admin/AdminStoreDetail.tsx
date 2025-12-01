'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, MapPin, Clock, Star, ShoppingCart, Eye, User, CheckCircle, XCircle, ChevronDown, ChevronLeft, ChevronRight, Play, Pause, MessageCircle, Wifi, Shield, Camera, Lightbulb, Droplets, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StoreClientDetailResponse } from '@/types'
import { getStoreById, getSports } from '@/services/api-new'

interface AdminStoreDetailProps {
    storeId: string
}

export default function AdminStoreDetail({ storeId }: AdminStoreDetailProps) {
    const router = useRouter()
    const [store, setStore] = useState<StoreClientDetailResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false)
    const [sports, setSports] = useState<any[]>([])
    const [sportsLoading, setSportsLoading] = useState(false)

    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getStoreById(storeId)

                if (data) {
                    setStore(data)
                } else {
                    setError('Không tìm thấy Trung tâm thể thao')
                }
            } catch (err) {
                console.error('Error fetching store:', err)
                setError('Lỗi khi tải thông tin Trung tâm thể thao')
            } finally {
                setLoading(false)
            }
        }

        if (storeId) {
            fetchStore()
        }
    }, [storeId])

    // Fetch sports when dropdown opens
    useEffect(() => {
        if (isRatingDropdownOpen && sports.length === 0) {
            const fetchSports = async () => {
                setSportsLoading(true)
                try {
                    const sportsData = await getSports()
                    setSports(sportsData)
                } catch (error) {
                    console.error('Error fetching sports:', error)
                } finally {
                    setSportsLoading(false)
                }
            }
            fetchSports()
        }
    }, [isRatingDropdownOpen])

    // Auto-play slides
    useEffect(() => {
        if (!isAutoPlaying || !store) return

        const allImages = [
            store.coverImageUrl,
            store.avatarUrl,
            ...(store.mediaUrls || []),
        ].filter(Boolean) as string[]

        if (allImages.length <= 1) return

        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) =>
                prev === allImages.length - 1 ? 0 : prev + 1
            )
        }, 3000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, store, currentSlideIndex])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin Trung tâm thể thao...</p>
                </div>
            </div>
        )
    }

    if (error || !store) {
        return (
            <div className="space-y-4">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error || 'Không tìm thấy Trung tâm thể thao'}
                </div>
            </div>
        )
    }

    const getLocationText = () => {
        if (store.address) {
            return store.address
        }
        return 'Chưa có địa chỉ'
    }

    const formatTime = (time?: string) => {
        if (!time) return '--:--'
        return time.substring(0, 5)
    }

    const allImages = [
        store.coverImageUrl,
        store.avatarUrl,
        ...(store.mediaUrls || []),
    ].filter(Boolean) as string[]

    const handlePrevSlide = () => {
        setIsAutoPlaying(false)
        setCurrentSlideIndex((prev) =>
            prev === 0 ? allImages.length - 1 : prev - 1
        )
    }

    const handleNextSlide = () => {
        setIsAutoPlaying(false)
        setCurrentSlideIndex((prev) =>
            prev === allImages.length - 1 ? 0 : prev + 1
        )
    }

    const handleDotClick = (index: number) => {
        setIsAutoPlaying(false)
        setCurrentSlideIndex(index)
    }

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying)
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
            </Button>

            {/* Cover and Profile Section */}
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg">
                {/* Cover Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-400 overflow-hidden">
                    {store.coverImageUrl ? (
                        <img
                            src={store.coverImageUrl}
                            alt={store.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-40 h-40 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Store Header Info */}
                <div className="px-6 py-6 border-b border-gray-200 relative">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            {store.avatarUrl ? (
                                <img
                                    src={store.avatarUrl}
                                    alt={store.name}
                                    className="w-20 h-20 rounded-lg border-4 border-white shadow-lg object-cover -mt-12 relative z-10"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-lg border-4 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl -mt-12 relative z-10">
                                    {store.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 pt-2">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h1>
                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {store.approved !== undefined && (
                                        <Badge variant={store.approved ? 'default' : 'secondary'}>
                                            {store.approved ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Đã duyệt
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Chưa duyệt
                                                </>
                                            )}
                                        </Badge>
                                    )}
                                    {store.active !== undefined && (
                                        <Badge variant={store.active ? 'default' : 'destructive'}>
                                            {store.active ? 'Đang hoạt động' : 'Tạm đóng'}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-yellow-500">⭐</div>
                            <div className="text-2xl font-bold text-gray-900">0.0</div>
                            <p className="text-sm text-gray-600">Đánh giá</p>
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                            <ShoppingCart className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Đơn hàng</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {store.orderCount || 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                            <Eye className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">Lượt xem</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {store.viewCount || 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Giờ mở cửa</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {formatTime(store.startTime)} - {formatTime(store.endTime)}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-sm">Địa điểm</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {getLocationText()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Slider */}
                    {allImages.length > 0 && (
                        <Card className="shadow-lg overflow-hidden">
                            <div className="relative">
                                {/* Main Slider */}
                                <div className="relative h-96 bg-gray-900 overflow-hidden group">
                                    {/* Slides */}
                                    <div className="relative w-full h-full">
                                        {allImages.map((url, index) => (
                                            <div
                                                key={index}
                                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlideIndex
                                                    ? 'opacity-100 scale-100'
                                                    : 'opacity-0 scale-105'
                                                    }`}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`${store.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Left Arrow */}
                                    {allImages.length > 1 && (
                                        <button
                                            onClick={handlePrevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 shadow-lg"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                    )}

                                    {/* Right Arrow */}
                                    {allImages.length > 1 && (
                                        <button
                                            onClick={handleNextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110 shadow-lg"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    )}

                                    {/* Slide Counter */}
                                    {allImages.length > 1 && (
                                        <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                                            {currentSlideIndex + 1} / {allImages.length}
                                        </div>
                                    )}

                                    {/* Auto-play Toggle Button */}
                                    {allImages.length > 1 && (
                                        <button
                                            onClick={toggleAutoPlay}
                                            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
                                            title={isAutoPlaying ? 'Tạm dừng' : 'Phát tự động'}
                                        >
                                            {isAutoPlaying ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5 ml-0.5" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Dots Navigation */}
                                {allImages.length > 1 && (
                                    <div className="flex justify-center gap-2 p-4 bg-gray-50">
                                        {allImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDotClick(index)}
                                                className={`relative h-2 rounded-full transition-all duration-300 ${index === currentSlideIndex
                                                    ? 'w-8 bg-primary'
                                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            >
                                                {index === currentSlideIndex && isAutoPlaying && (
                                                    <div
                                                        className="absolute inset-0 bg-blue-600 rounded-full"
                                                        style={{
                                                            animation: 'progressBar 3s linear forwards',
                                                        }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <style jsx>{`
                                    @keyframes progressBar {
                                        from {
                                            width: 0%;
                                        }
                                        to {
                                            width: 100%;
                                        }
                                    }
                                `}</style>
                            </div>
                        </Card>
                    )}

                    {/* Location & Hours */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả sân</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {store.introduction || 'Thông tin chi tiết sẽ được cập nhật sớm.'}
                        </p>

                        {/* Time, Capacity, Rating */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Giờ mở cửa</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{formatTime(store.startTime)} - {formatTime(store.endTime)}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-2">
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Đơn hàng</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{store.orderCount || 0}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-2">
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Lượt xem</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{store.viewCount || 0}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Đang hoạt động</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">✓</p>
                            </div>
                        </div>

                        {/* Address and Map */}
                        <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                    <p className="font-semibold text-gray-900">{getLocationText()}</p>
                                </div>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <p className="text-xs text-gray-600 mb-1">Xem trên</p>
                                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 justify-center">
                                    🗺️ Google Maps
                                </button>
                                <p className="text-xs text-gray-500 mt-1">Nhấn để mở bản đồ</p>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tiện ích & Cơ sở vật chất</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Wifi className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Wifi miễn phí</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <ShoppingCart className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Bãi đỗ xe rộng</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Phòng thay đồ</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Camera className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Nhà vệ sinh</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Đèn chiếu sáng</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <Droplets className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">Nước uống miễn phí</p>
                                    <p className="text-xs text-gray-600">Có sẵn</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sports */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Các môn thể thao</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {sports.length > 0 ? (
                                sports.slice(0, 6).map((sport) => (
                                    <div key={sport.id} className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-3xl">🏟️</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-sm">{sport.name}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-xs">🏐 1</span>
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs font-semibold">4.0</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Đặt
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8 text-gray-500">
                                    <p>Chưa có môn thể thao nào</p>
                                </div>
                            )}
                        </div>
                        <Button className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white h-12 font-bold text-base">
                            🛒 Đặt sân ngay
                        </Button>
                    </div>
                </div>

                {/* Right Column - Stats & Actions */}
                <div className="space-y-6">
                    {/* Booking Button */}
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-12 font-bold text-base">
                        🛒 Đặt sân ngay
                    </Button>

                    {/* Owner Info */}
                    {store.owner && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Chủ sở hữu
                                </h2>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                {store.owner.avatarUrl ? (
                                    <img
                                        src={store.owner.avatarUrl}
                                        alt={store.owner.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                                        {store.owner.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900">{store.owner.name}</p>
                                    <p className="text-sm text-gray-600 truncate">
                                        {store.owner.email || 'Email không có'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t">
                                <Button variant="outline" className="w-full border-2">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat ngay
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Thống kê</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">Lượt xem</span>
                                </div>
                                <span className="font-bold text-gray-900">{store.viewCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-600">Đơn hàng</span>
                                </div>
                                <span className="font-bold text-gray-900">{store.orderCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-600" />
                                    <span className="text-sm text-gray-600">Đánh giá</span>
                                </div>
                                <span className="font-bold text-gray-900">0.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
