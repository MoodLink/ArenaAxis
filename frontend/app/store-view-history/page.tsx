"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Trash2, AlertCircle, Clock, Star, ArrowRight } from "lucide-react"
import {
    getStoreViewHistories,
    deleteStoreViewHistory,
    clearAllViewHistories,
    type ViewHistory
} from "@/services/store-view-history.service"

export default function StoreViewHistoryPage() {
    const router = useRouter()
    const [viewHistories, setViewHistories] = useState<ViewHistory[]>([])
    const [filteredHistories, setFilteredHistories] = useState<ViewHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
            router.push('/login')
            return
        }

        fetchViewHistories()
    }, [router])

    const fetchViewHistories = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (!token) {
                throw new Error('Không có token')
            }

            // Use service to fetch view histories
            const histories = await getStoreViewHistories()

            // Sort by viewedAt descending (newest first)
            const sortedHistories = histories.sort((a: any, b: any) => {
                return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
            })

            setViewHistories(sortedHistories)
            setFilteredHistories(sortedHistories)
        } catch (error: any) {
            console.error('Error fetching view histories:', error)
            setError(error.message || 'Có lỗi xảy ra khi tải lịch sử xem')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)

        if (!query.trim()) {
            setFilteredHistories(viewHistories)
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = viewHistories.filter(
            history =>
                history.name.toLowerCase().includes(lowerQuery) ||
                history.address.toLowerCase().includes(lowerQuery)
        )
        setFilteredHistories(filtered)
    }

    const handleDeleteHistory = async (storeId: string) => {
        try {
            // Call service to delete from server
            await deleteStoreViewHistory(storeId)

            // Update local state
            const updated = viewHistories.filter(h => h.id !== storeId)
            setViewHistories(updated)
            setFilteredHistories(filtered => filtered.filter(h => h.id !== storeId))
        } catch (error: any) {
            console.error('Error deleting history:', error)
            setError(error.message || 'Không thể xóa lịch sử xem')
        }
    }

    const handleClearAll = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) {
            return
        }

        try {
            // Call service to clear all histories
            await clearAllViewHistories()

            // Update local state
            setViewHistories([])
            setFilteredHistories([])
        } catch (error: any) {
            console.error('Error clearing histories:', error)
            setError(error.message || 'Không thể xóa lịch sử xem')
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)

            if (diffMins < 1) return 'Vừa xem'
            if (diffMins < 60) return `${diffMins} phút trước`
            if (diffHours < 24) return `${diffHours} giờ trước`
            if (diffDays < 7) return `${diffDays} ngày trước`

            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return 'N/A'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gradient-to-r from-green-200 to-blue-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Đã Xem Gần Đây
                                </h1>
                            </div>
                            <p className="text-sm text-gray-600 ml-11">
                                {viewHistories.length > 0
                                    ? `${viewHistories.length} trung tâm thể thao đã xem`
                                    : 'Theo dõi các trung tâm bạn quan tâm'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {viewHistories.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Xóa tất cả
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="text-gray-700 hover:bg-gray-100 transition-all duration-200"
                            >
                                Quay lại
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-all duration-200"></div>
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm trung tâm thể thao..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-12 bg-white border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-100"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                                        <div className="flex gap-2 mt-4">
                                            <div className="h-3 bg-gray-100 rounded w-12"></div>
                                            <div className="h-3 bg-gray-100 rounded w-20"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900 mb-1">Lỗi</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredHistories.length === 0 && !error && (
                    <div className="py-20">
                        <div className="max-w-md mx-auto">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
                                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mx-auto shadow-lg">
                                    <MapPin className="w-12 h-12 text-gradient-to-br from-green-500 to-blue-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                {searchQuery ? '🔍 Không tìm thấy kết quả' : '📍 Chưa có lịch sử xem'}
                            </h2>
                            <p className="text-gray-600 mb-8 text-center leading-relaxed">
                                {searchQuery
                                    ? `Không tìm thấy trung tâm thể thao phù hợp với từ khóa "${searchQuery}". Hãy thử tìm kiếm với từ khóa khác.`
                                    : 'Hãy khám phá các trung tâm thể thao. Những nơi bạn xem sẽ được lưu lại ở đây để bạn dễ dàng quay lại.'}
                            </p>
                            <Link href="/list-store" className="block">
                                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Khám phá trung tâm thể thao
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* List of View Histories */}
                {!loading && filteredHistories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHistories.map((history) => (
                            <div
                                key={history.id}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
                            >
                                {/* Image */}
                                <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-100 overflow-hidden">
                                    {history.avatar ? (
                                        <>
                                            <img
                                                src={history.avatar}
                                                alt={history.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-green-100">
                                            <MapPin className="w-12 h-12 text-green-600 opacity-50" />
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteHistory(history.id)}
                                        className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110"
                                        title="Xóa khỏi lịch sử"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>

                                    {/* Viewed Time Badge */}
                                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
                                        <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            Xem {formatDate(history.viewedAt)}
                                        </div>
                                    </div> */}
                                </div>

                                {/* Content */}
                                <Link href={`/list-store/${history.id}`}>
                                    <div className="p-5 hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 transition-all duration-300 cursor-pointer">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-green-600 transition-colors">
                                            {history.name}
                                        </h3>

                                        {/* Address */}
                                        <div className="flex items-start gap-2 mb-4">
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {history.address}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        {history.rating !== undefined && (
                                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                                                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-bold text-gray-900">
                                                        {history.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                {history.reviewCount !== undefined && (
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {history.reviewCount} đánh giá
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Description */}
                                        {history.introduction && (
                                            <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                {history.introduction}
                                            </p>
                                        )}

                                        {/* View Button */}
                                        <div className="mt-4 flex items-center gap-1 text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-sm">Xem chi tiết</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {/* {!loading && filteredHistories.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-block bg-gradient-to-r from-green-50 to-blue-50 px-6 py-3 rounded-full border border-green-200">
                            <p className="text-sm font-semibold text-gray-700">
                                <span className="text-green-600">{filteredHistories.length}</span>
                                {' '}trên{' '}
                                <span className="text-blue-600">{viewHistories.length}</span>
                                {' '}lịch sử xem
                                {searchQuery && ` (tìm: "${searchQuery}")`}
                            </p>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    )
}
