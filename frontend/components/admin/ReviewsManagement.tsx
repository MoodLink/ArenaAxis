"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Import shared components
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import RatingsStats from "./ratings/RatingsStats"
import StoreRatingsTable from "./ratings/StoreRatingsTable"

// Import hook for fetching ratings
import { useAdminStoresRatings, StoreRating } from "@/hooks/use-admin-stores-ratings"

export default function ReviewsManagement() {
    const [searchTerm, setSearchTerm] = useState('')
    const [ratingFilter, setRatingFilter] = useState<string>('all')
    const [selectedStore, setSelectedStore] = useState<StoreRating | null>(null)

    // Fetch stores with ratings
    const { data: stores = [], isLoading } = useAdminStoresRatings()

    // Filter stores
    const filteredStores = useMemo(() => {
        return stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.id.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesRating = ratingFilter === 'all' ||
                (ratingFilter === 'high' && store.averageRating >= 4) ||
                (ratingFilter === 'medium' && store.averageRating >= 3 && store.averageRating < 4) ||
                (ratingFilter === 'low' && store.averageRating < 3)

            return matchesSearch && matchesRating
        })
    }, [stores, searchTerm, ratingFilter])

    // Calculate stats
    const stats = useMemo(() => {
        const totalRatings = stores.reduce((sum, store) => sum + store.ratingCount, 0)
        const totalViews = stores.reduce((sum, store) => sum + store.viewCount, 0)
        const averageRating = stores.length > 0
            ? stores.reduce((sum, store) => sum + store.averageRating, 0) / stores.length
            : 0

        return {
            totalStores: stores.length,
            totalRatings,
            averageRating,
            totalViews
        }
    }, [stores])

    const handleViewRatings = (store: StoreRating) => {
        // Navigate to admin reviews detail page
        window.location.href = `/admin/reviews/${store.id}`
    }

    const ratingOptions = [
        { value: 'all', label: 'Tất cả đánh giá' },
        { value: 'high', label: 'Cao (≥4 sao)' },
        { value: 'medium', label: 'Trung bình (3-4 sao)' },
        { value: 'low', label: 'Thấp (<3 sao)' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Quản lý đánh giá"
                description="Quản lý đánh giá của các cửa hàng"
            />

            {/* Stats */}
            <RatingsStats
                totalStores={stats.totalStores}
                totalRatings={stats.totalRatings}
                averageRating={stats.averageRating}
                totalViews={stats.totalViews}
            />

            {/* Ratings Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách cửa hàng và đánh giá</CardTitle>
                    <CardDescription>Xem thống kê đánh giá của từng cửa hàng</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminFilters
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={[
                            {
                                key: "rating",
                                placeholder: "Đánh giá",
                                value: ratingFilter,
                                onValueChange: setRatingFilter,
                                options: ratingOptions
                            }
                        ]}
                    />

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            <StoreRatingsTable
                                stores={filteredStores}
                                onViewRatings={handleViewRatings}
                            />

                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Hiển thị {filteredStores.length} trong tổng số {stores.length} cửa hàng
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}