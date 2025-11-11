import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReviewCard from './ReviewCard'
import {
    MessageSquare,
    Clock
} from 'lucide-react'

interface Review {
    id: number
    customer: {
        name: string
        avatar: string
        email: string
    }
    field: {
        name: string
        type: string
    }
    rating: number
    date: string
    content: string
    photos?: string[]
    response?: {
        content: string
        date: string
        author: string
    } | null
    status: 'pending' | 'responded'
    bookingId: string
    helpful: number
    reported: boolean
}

interface ReviewTabsProps {
    activeTab: string
    onTabChange: (value: string) => void
    allReviews: Review[]
    pendingReviews: Review[]
    respondedReviews: Review[]
    onResponse?: (reviewId: number, responseText: string) => void
}

export default function ReviewTabs({
    activeTab,
    onTabChange,
    allReviews,
    pendingReviews,
    respondedReviews,
    onResponse
}: ReviewTabsProps) {
    const EmptyState = ({
        icon: Icon,
        title,
        description
    }: {
        icon: React.ElementType
        title: string
        description: string
    }) => (
        <Card>
            <CardContent className="p-12 text-center">
                <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500">{description}</p>
            </CardContent>
        </Card>
    )

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                    Tất cả ({allReviews.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                    Chờ phản hồi ({pendingReviews.length})
                </TabsTrigger>
                <TabsTrigger value="responded">
                    Đã phản hồi ({respondedReviews.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                    {allReviews.length > 0 ? (
                        allReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onResponse={onResponse} />
                        ))
                    ) : (
                        <EmptyState
                            icon={MessageSquare}
                            title="Không tìm thấy đánh giá"
                            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                        />
                    )}
                </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
                <div className="space-y-4">
                    {pendingReviews.length > 0 ? (
                        pendingReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onResponse={onResponse} />
                        ))
                    ) : (
                        <EmptyState
                            icon={Clock}
                            title="Không có đánh giá chờ phản hồi"
                            description="Tất cả đánh giá đã được phản hồi"
                        />
                    )}
                </div>
            </TabsContent>

            <TabsContent value="responded" className="mt-6">
                <div className="space-y-4">
                    {respondedReviews.length > 0 ? (
                        respondedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onResponse={onResponse} />
                        ))
                    ) : (
                        <EmptyState
                            icon={MessageSquare}
                            title="Chưa có phản hồi nào"
                            description="Bắt đầu phản hồi đánh giá từ khách hàng"
                        />
                    )}
                </div>
            </TabsContent>
        </Tabs>
    )
}