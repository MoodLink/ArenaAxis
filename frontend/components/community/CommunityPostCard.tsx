// Component hiển thị một bài viết trong cộng đồng
// Cho phép người dùng xem thông tin chi tiết và tương tác

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    MapPin,
    Clock,
    Heart,
    MessageCircle,
    Users,
    Calendar,
    Star,
    TrendingUp,
    CheckCircle,
    Zap
} from "lucide-react"
import { CommunityPost } from "@/types"

interface CommunityPostCardProps {
    post: CommunityPost // Props nhận thông tin bài viết
    onLike?: (postId: string) => void // Callback khi like bài viết (optional)
    onComment?: (postId: string) => void // Callback khi comment (optional)
    onJoin?: (postId: string) => void // Callback khi tham gia (optional)
}

export default function CommunityPostCard({
    post,
    onLike,
    onComment,
    onJoin
}: CommunityPostCardProps) {
    // Helper functions để derive các giá trị từ CommunityPost data
    const getSportColor = (sport: string) => {
        const sportLower = sport.toLowerCase()
        if (sportLower.includes("bóng đá")) return "bg-green-500"
        if (sportLower.includes("tennis")) return "bg-blue-500"
        if (sportLower.includes("cầu lông")) return "bg-purple-500"
        if (sportLower.includes("bóng rổ")) return "bg-orange-500"
        return "bg-gray-500"
    }

    const formatTimeAgo = (createdAt: string) => {
        const now = new Date()
        const created = new Date(createdAt)
        const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Vừa xong"
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const getAuthorAvatar = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    // Use actual data from CommunityPost interface
    const location = post.location || "Chưa xác định"
    const time = post.time || "Chưa xác định"
    const level = post.level || "Tất cả"
    const cost = post.cost || "Miễn phí"
    const participants = post.participants || 0
    const maxParticipants = post.maxParticipants || 0
    const isHot = post.status === "hot"
    const isUrgent = post.urgency === "urgent" || post.urgency === "today"

    // Calculate duration from createdAt
    const calculateDuration = (createdAt: string) => {
        const now = new Date()
        const created = new Date(createdAt)
        const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
        if (diffInDays < 1) return "Hôm nay"
        if (diffInDays === 1) return "1 ngày trước"
        return `${diffInDays} ngày trước`
    }
    const duration = calculateDuration(post.createdAt)

    return (
        <Card className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-green-300 group">
            <CardContent className="p-0">
                {/* Modern header with author info */}
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Modern Avatar */}
                            <Avatar className="w-12 h-12 ring-2 ring-green-100">
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold">
                                    {getAuthorAvatar(post.author.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Author info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900 hover:text-green-600 cursor-pointer">
                                        {post.author.name}
                                    </h4>
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    {isHot && (
                                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Hot
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                            </div>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2">
                            {isUrgent && (
                                <Badge className="bg-orange-500 text-white animate-pulse">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Gấp
                                </Badge>
                            )}
                            <Badge className={`${getSportColor(post.sport)} text-white border-0`}>
                                {post.sport}
                            </Badge>
                        </div>
                    </div>

                    {/* Post title - clickable */}
                    <Link href={`/community/${post.id}`}>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-green-600 cursor-pointer transition-colors group-hover:text-green-700 line-clamp-2">
                            {post.title}
                        </h3>
                    </Link>

                    {/* Quick info row */}
                    <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>Hôm nay</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate max-w-[120px]">{location}</span>
                        </div>
                    </div>

                    {/* Content preview */}
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">{post.content}</p>

                    {/* Activity details card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Trình độ</div>
                            <Badge variant="outline" className="text-xs">{level}</Badge>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Chi phí</div>
                            <span className="text-green-600 font-medium text-sm">50k</span>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Tham gia</div>
                            <span className="text-blue-600 font-medium text-sm">{participants}/{maxParticipants || '∞'}</span>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Thời gian</div>
                            <span className="text-orange-600 font-medium text-sm">{duration}</span>
                        </div>
                    </div>
                </div>

                {/* Modern action bar */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Like button */}
                            <button
                                onClick={() => onLike?.(post.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                            >
                                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{post.likes}</span>
                            </button>

                            {/* Comment button */}
                            <button
                                onClick={() => onComment?.(post.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                            >
                                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{post.comments}</span>
                            </button>

                            {/* Participants indicator */}
                            <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                                <Users className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">{participants} tham gia</span>
                            </div>
                        </div>

                        {/* Join button */}
                        <Button
                            size="sm"
                            onClick={() => onJoin?.(post.id)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Tham gia ngay
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
