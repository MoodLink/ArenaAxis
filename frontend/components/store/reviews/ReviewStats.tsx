import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import StarRating from './StarRating'
import {
    TrendingUp,
    TrendingDown,
    MessageSquare,
    Star
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface RatingStat {
    rating: number
    count: number
    percentage: number
}

interface ReviewTrend {
    month: string
    reviews: number
    avgRating: number
}

interface ReviewStatsProps {
    ratingStats: RatingStat[]
    reviewTrends: ReviewTrend[]
    totalReviews: number
    averageRating: number
}

export default function ReviewStats({
    ratingStats,
    reviewTrends,
    totalReviews,
    averageRating
}: ReviewStatsProps) {
    const currentMonthReviews = reviewTrends[reviewTrends.length - 1]?.reviews || 0
    const previousMonthReviews = reviewTrends[reviewTrends.length - 2]?.reviews || 0
    const reviewsChange = currentMonthReviews - previousMonthReviews
    const reviewsPercentChange = previousMonthReviews > 0
        ? Math.round((reviewsChange / previousMonthReviews) * 100)
        : 0

    const currentMonthRating = reviewTrends[reviewTrends.length - 1]?.avgRating || 0
    const previousMonthRating = reviewTrends[reviewTrends.length - 2]?.avgRating || 0
    const ratingChange = currentMonthRating - previousMonthRating
    const ratingTrend = ratingChange >= 0 ? 'up' : 'down'

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Summary Stats */}
            <div className="lg:col-span-1 space-y-4">
                {/* Total Reviews */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng đánh giá</p>
                                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                                <div className="flex items-center mt-1">
                                    {reviewsChange >= 0 ? (
                                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                                    )}
                                    <span className={`text-sm ${reviewsChange >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {reviewsPercentChange > 0 ? '+' : ''}{reviewsPercentChange}% so với tháng trước
                                    </span>
                                </div>
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* Average Rating */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Điểm trung bình</p>
                                <div className="flex items-center mt-1">
                                    <p className="text-2xl font-bold text-gray-900 mr-2">{averageRating.toFixed(1)}</p>
                                    <StarRating rating={Math.round(averageRating)} />
                                </div>
                                <div className="flex items-center mt-1">
                                    {ratingTrend === 'up' ? (
                                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                                    )}
                                    <span className={`text-sm ${ratingTrend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {ratingChange > 0 ? '+' : ''}{ratingChange.toFixed(1)} so với tháng trước
                                    </span>
                                </div>
                            </div>
                            <Star className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* Rating Distribution */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Phân bố đánh giá</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {ratingStats.map((stat) => (
                                <div key={stat.rating} className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1 w-16">
                                        <span className="text-sm text-gray-600">{stat.rating}</span>
                                        <Star className="h-3 w-3 text-yellow-400" />
                                    </div>
                                    <Progress value={stat.percentage} className="flex-1 h-2" />
                                    <span className="text-sm text-gray-600 w-12 text-right">{stat.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="lg:col-span-2 space-y-4">
                {/* Review Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>xu hướng đánh giá theo tháng</CardTitle>
                        <CardDescription>Số lượng và điểm đánh giá trung bình</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reviewTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="reviews" orientation="left" />
                                    <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} />
                                    <Tooltip />
                                    <Bar yAxisId="reviews" dataKey="reviews" fill="#3b82f6" name="Số đánh giá" />
                                    <LineChart>
                                        <Line
                                            yAxisId="rating"
                                            type="monotone"
                                            dataKey="avgRating"
                                            stroke="#f59e0b"
                                            strokeWidth={3}
                                            name="Điểm TB"
                                        />
                                    </LineChart>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}