import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, MessageSquare, AlertTriangle, Clock } from "lucide-react"
import { type ReviewStats } from "@/data/mockDataAdmin"

interface ReviewStatsProps {
    stats: ReviewStats
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}/5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Bị báo cáo</p>
                                <p className="text-2xl font-bold text-red-600">{stats.reportedReviews}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rating Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Phân bố đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {stats.ratingDistribution.map((item) => (
                            <div key={item.rating} className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 w-12">
                                    <span className="text-sm font-medium">{item.rating}</span>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <Progress value={item.percentage} className="h-2" />
                                </div>
                                <div className="text-sm text-gray-500 w-16 text-right">
                                    {item.count} ({item.percentage}%)
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}