import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MessageSquare, Eye, ShoppingCart } from "lucide-react"

interface RatingsStatsProps {
    totalStores: number
    totalRatings: number
    averageRating: number
    totalViews: number
}

export default function RatingsStats({ totalStores, totalRatings, averageRating, totalViews }: RatingsStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Stores */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng cửa hàng</p>
                            <p className="text-2xl font-bold text-blue-600">{totalStores}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Ratings */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                            <p className="text-2xl font-bold text-yellow-600">{totalRatings}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Average Rating */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Star className="h-5 w-5 text-orange-600 fill-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                            <p className="text-2xl font-bold text-orange-600">{averageRating.toFixed(1)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Views */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Eye className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                            <p className="text-2xl font-bold text-green-600">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
