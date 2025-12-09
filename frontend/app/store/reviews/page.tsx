"use client"

import React, { useState, useMemo } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import ReviewStats from '@/components/store/reviews/ReviewStats'
import ReviewFilters from '@/components/store/reviews/ReviewFilters'
import ReviewTabs from '@/components/store/reviews/ReviewTabs'

// Mock data
const reviews = [
    {
        id: 1,
        customer: {
            name: 'Nguyễn Văn A',
            avatar: '/placeholder-user.jpg',
            email: 'nguyenvana@email.com'
        },
        field: {
            name: 'Sân bóng đá mini số 1',
            type: 'football'
        },
        rating: 5,
        date: '2024-01-15',
        content: 'Sân rất đẹp, cỏ nhân tạo chất lượng cao. Nhân viên phục vụ nhiệt tình. Sẽ quay lại!',
        photos: ['/placeholder.jpg'],
        response: null,
        status: 'pending' as const,
        bookingId: 'BK001',
        helpful: 12,
        reported: false
    },
    {
        id: 2,
        customer: {
            name: 'Trần Thị B',
            avatar: '/placeholder-user.jpg',
            email: 'tranthib@email.com'
        },
        field: {
            name: 'Sân tennis số 2',
            type: 'tennis'
        },
        rating: 4,
        date: '2024-01-14',
        content: 'Sân tennis khá ổn, tuy nhiên ánh sáng hơi yếu vào buổi tối. Giá cả hợp lý.',
        photos: [],
        response: {
            content: 'Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện hệ thống chiếu sáng sớm nhất.',
            date: '2024-01-14',
            author: 'Admin'
        },
        status: 'responded' as const,
        bookingId: 'BK002',
        helpful: 8,
        reported: false
    },
    {
        id: 3,
        customer: {
            name: 'Lê Văn C',
            avatar: '/placeholder-user.jpg',
            email: 'levanc@email.com'
        },
        field: {
            name: 'Sân bóng rổ số 1',
            type: 'basketball'
        },
        rating: 2,
        date: '2024-01-13',
        content: 'Sân bóng rổ cũ kỹ, rổ bị lỏng. Nhân viên không thân thiện. Không khuyến khích!',
        photos: ['/placeholder.jpg', '/placeholder.jpg'],
        response: {
            content: 'Xin lỗi về trải nghiệm không tốt. Chúng tôi đã sửa chữa rổ bóng và trao đổi với nhân viên.',
            date: '2024-01-13',
            author: 'Manager'
        },
        status: 'responded' as const,
        bookingId: 'BK003',
        helpful: 3,
        reported: true
    },
    {
        id: 4,
        customer: {
            name: 'Phạm Thị D',
            avatar: '/placeholder-user.jpg',
            email: 'phamthid@email.com'
        },
        field: {
            name: 'Sân cầu lông số 3',
            type: 'badminton'
        },
        rating: 5,
        date: '2024-01-12',
        content: 'Sân cầu lông tuyệt vời! Sàn không bị trượt, lưới chuẩn. Dịch vụ 5 sao!',
        photos: [],
        response: null,
        status: 'pending' as const,
        bookingId: 'BK004',
        helpful: 15,
        reported: false
    }
]

const ratingStats = [
    { rating: 5, count: 156, percentage: 65 },
    { rating: 4, count: 48, percentage: 20 },
    { rating: 3, count: 24, percentage: 10 },
    { rating: 2, count: 8, percentage: 3 },
    { rating: 1, count: 4, percentage: 2 }
]

const reviewTrends = [
    { month: 'T1', reviews: 45, avgRating: 4.2 },
    { month: 'T2', reviews: 52, avgRating: 4.1 },
    { month: 'T3', reviews: 48, avgRating: 4.3 },
    { month: 'T4', reviews: 61, avgRating: 4.4 },
    { month: 'T5', reviews: 58, avgRating: 4.5 },
    { month: 'T6', reviews: 67, avgRating: 4.6 }
]

export default function StoreReviews() {
    const [activeTab, setActiveTab] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRating, setFilterRating] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    // Calculate stats
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    // Filter reviews
    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const matchesSearch = searchTerm === '' ||
                review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.content.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)

            const matchesStatus = filterStatus === 'all' || review.status === filterStatus

            return matchesSearch && matchesRating && matchesStatus
        })
    }, [searchTerm, filterRating, filterStatus])

    const pendingReviews = filteredReviews.filter(review => review.status === 'pending')
    const respondedReviews = filteredReviews.filter(review => review.status === 'responded')

    const handleResponse = (reviewId: number, responseText: string) => {
        // Handle response submission
        console.log(`Response for review ${reviewId}:`, responseText)
        // In a real app, this would make an API call to submit the response
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá</h1>
                    <p className="text-gray-600 mt-1">Theo dõi và phản hồi đánh giá từ khách hàng</p>
                </div>

                {/* Statistics */}
                <ReviewStats
                    ratingStats={ratingStats}
                    reviewTrends={reviewTrends}
                    totalReviews={totalReviews}
                    averageRating={averageRating}
                />

                {/* Filters */}
                <ReviewFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterRating={filterRating}
                    onRatingChange={setFilterRating}
                    filterStatus={filterStatus}
                    onStatusChange={setFilterStatus}
                />

                {/* Review Tabs */}
                <ReviewTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    allReviews={filteredReviews}
                    pendingReviews={pendingReviews}
                    respondedReviews={respondedReviews}
                    onResponse={handleResponse}
                />
            </div>
        </StoreLayout>
    )
}