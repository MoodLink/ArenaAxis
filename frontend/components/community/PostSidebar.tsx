// Component sidebar hiển thị thông tin chi tiết hoạt động
// Bao gồm thông tin cơ bản, yêu cầu, tiện ích và hoạt động liên quan

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    MapPin,
    Users,
    DollarSign,
    CloudRain,
    Thermometer,
    Droplets,
    Calendar,
    Shield,
    Wifi,
    Car,
    Coffee,
    CheckCircle,
    ExternalLink,
    ArrowRight
} from "lucide-react"
import { CommunityPostDetail, RelatedPost, SimilarActivity } from "@/data/mockData"

interface PostSidebarProps {
    postDetail: CommunityPostDetail
    relatedPosts: RelatedPost[]
    similarActivities: SimilarActivity[]
}

export default function PostSidebar({
    postDetail,
    relatedPosts,
    similarActivities
}: PostSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Activity Info Card */}
            {/*
            <Card className="shadow-lg border-0">
               <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 text-gray-900">Chi tiết hoạt động</h4>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <div>
                                <div className="font-medium">{postDetail.date}</div>
                                <div className="text-sm text-gray-600">{postDetail.time}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <div className="font-medium">{postDetail.location}</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-green-500" />
                            <div>
                                <div className="font-medium">{postDetail.participants}</div>
                                <div className="text-sm text-gray-600">người tham gia</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-yellow-500" />
                            <div>
                                <div className="font-bold text-lg text-green-600">{postDetail.price}</div>
                                <div className="text-sm text-gray-600">per person</div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">Trạng thái:</span>
                            </div>
                            {postDetail.isExpired ? (
                                <Badge variant="destructive" className="text-sm">
                                    Đã hết hạn
                                </Badge>
                            ) : (
                                <Badge className="bg-green-500 hover:bg-green-600 text-sm">
                                    Đang mở
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

           
            <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                        <CloudRain className="w-5 h-5 text-blue-500" />
                        Thời tiết
                    </h4>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-red-400" />
                                <span className="text-sm">Nhiệt độ</span>
                            </div>
                            <span className="font-bold">{postDetail.weather.temp}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CloudRain className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">Tình trạng</span>
                            </div>
                            <span className="font-medium">{postDetail.weather.condition}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm">Độ ẩm</span>
                            </div>
                            <span className="font-medium">{postDetail.weather.humidity}</span>
                        </div>
                    </div>
                </CardContent>
            </Card> */}

            {/* Facilities */}
            <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 text-gray-900">Tiện ích</h4>

                    <div className="grid grid-cols-2 gap-3">
                        {postDetail.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {facility.includes('WiFi') && <Wifi className="w-4 h-4 text-blue-500" />}
                                {facility.includes('Parking') && <Car className="w-4 h-4 text-gray-600" />}
                                {facility.includes('Refreshments') && <Coffee className="w-4 h-4 text-brown-500" />}
                                {facility.includes('Security') && <Shield className="w-4 h-4 text-red-500" />}
                                {!facility.includes('WiFi') && !facility.includes('Parking') && !facility.includes('Refreshments') && !facility.includes('Security') &&
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                }
                                <span className="text-sm font-medium">{facility}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 text-gray-900">Yêu cầu tham gia</h4>

                    <div className="space-y-2">
                        {postDetail.requirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{requirement}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <h4 className="font-bold text-xl mb-4 text-gray-900">Bài viết liên quan</h4>

                        <div className="space-y-3">
                            {relatedPosts.slice(0, 3).map((post) => (
                                <Card key={post.id} className="border hover:border-green-300 transition-all cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h6 className="font-bold text-sm text-gray-900 line-clamp-2">{post.title}</h6>
                                            {/* {post.urgent && (
                                                <Badge variant="destructive" className="text-xs ml-2">
                                                    Gấp
                                                </Badge>
                                            )} */}
                                        </div>

                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{post.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-green-600">{post.price}</span>
                                                <span>{post.participants}</span>
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* <Button variant="outline" className="w-full mt-3">
                                Xem tất cả
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Similar Activities */}
            {similarActivities.length > 0 && (
                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <h4 className="font-bold text-xl mb-4 text-gray-900">Hoạt động tương tự</h4>

                        <div className="space-y-3">
                            {similarActivities.slice(0, 2).map((activity) => (
                                <Card key={activity.id} className="border hover:border-blue-300 transition-all cursor-pointer">
                                    <CardContent className="p-4">
                                        <h6 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">{activity.title}</h6>

                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{activity.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{activity.date} • {activity.time}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-blue-600">{activity.price}</span>
                                                <span>{activity.participants}</span>
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Liên hệ với chủ sân
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}