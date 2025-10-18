"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import shared components
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import ReviewStats from "./reviews/ReviewStats"
import ReviewTable from "./reviews/ReviewTable"
import ReviewDetail from "./reviews/ReviewDetail"

// Import mock data
import { mockReviews, mockReviewStats, AdminReview } from "@/data/mockDataAdmin"

export default function ReviewsManagement() {
    const [reviews, setReviews] = useState<AdminReview[]>(mockReviews)
    const [searchTerm, setSearchTerm] = useState('')
    const [ratingFilter, setRatingFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null)

    // Filter reviews
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.field.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
        const matchesStatus = statusFilter === 'all' || review.status === statusFilter

        return matchesSearch && matchesRating && matchesStatus
    })

    const handleReviewAction = (reviewId: string, action: 'approve' | 'reject' | 'respond' | 'delete') => {
        switch (action) {
            case 'approve':
                setReviews(reviews.map(review =>
                    review.id === reviewId ? { ...review, status: 'published' as const } : review
                ))
                break
            case 'reject':
                setReviews(reviews.map(review =>
                    review.id === reviewId ? { ...review, status: 'rejected' as const } : review
                ))
                break
            case 'delete':
                setReviews(reviews.filter(review => review.id !== reviewId))
                break
            default:
                console.log(`${action} review ${reviewId}`)
        }
    }

    const handleResponse = (reviewId: string, responseText: string) => {
        setReviews(reviews.map(review =>
            review.id === reviewId
                ? {
                    ...review,
                    response: {
                        content: responseText,
                        author: "Admin",
                        date: "Vừa xong"
                    }
                }
                : review
        ))
    }

    const ratingOptions = [
        { value: 'all', label: 'Tất cả sao' },
        { value: '5', label: '5 sao' },
        { value: '4', label: '4 sao' },
        { value: '3', label: '3 sao' },
        { value: '2', label: '2 sao' },
        { value: '1', label: '1 sao' }
    ]

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'published', label: 'Đã xuất bản' },
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'rejected', label: 'Từ chối' },
        { value: 'reported', label: 'Bị báo cáo' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Quản lý đánh giá"
                description="Kiểm duyệt và phản hồi đánh giá khách hàng"
            />

            {/* Stats */}
            <ReviewStats stats={mockReviewStats} />

            {/* Reviews Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đánh giá</CardTitle>
                    <CardDescription>Quản lý tất cả đánh giá từ khách hàng</CardDescription>
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
                            },
                            {
                                key: "status",
                                placeholder: "Trạng thái",
                                value: statusFilter,
                                onValueChange: setStatusFilter,
                                options: statusOptions
                            }
                        ]}
                    />

                    <ReviewTable
                        reviews={filteredReviews}
                        onReviewAction={handleReviewAction}
                        onSelectedReviewChange={setSelectedReview}
                    />

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                            Hiển thị {filteredReviews.length} trong tổng số {reviews.length} đánh giá
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Review Detail Dialog */}
            <ReviewDetail
                review={selectedReview}
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                onResponse={handleResponse}
            />
        </div>
    )
}