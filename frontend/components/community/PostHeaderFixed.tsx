// Component header cho trang chi tiết community post
// Hiển thị thông tin bài viết, tác giả và các action buttons

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    Heart,
    MessageCircle,
    Share2,
    CheckCircle
} from "lucide-react"
import { CommunityPost } from "@/types"
import { CommunityPostDetail } from "@/data/mockData"

interface PostHeaderProps {
    post: CommunityPost
    postDetail: CommunityPostDetail
    isLiked?: boolean
    isJoined?: boolean
    commentsCount?: number
    onLike?: () => void
    onShare?: () => void
    onJoin?: () => void
}

export default function PostHeader({
    post,
    postDetail,
    isLiked = false,
    isJoined = false,
    commentsCount = 0,
    onLike = () => { },
    onShare = () => { },
    onJoin = () => { }
}: PostHeaderProps) {

    const getSportColor = (sport: string) => {
        const sportLower = sport.toLowerCase()
        if (sportLower.includes("tennis")) return "bg-purple-600"
        if (sportLower.includes("bóng đá")) return "bg-green-600"
        if (sportLower.includes("cầu lông")) return "bg-blue-600"
        return "bg-gray-600"
    }

    const getAuthorAvatar = (name: string) => {
        return name.charAt(0).toUpperCase()
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

    return (
        <Card className="overflow-hidden shadow-lg border-0">
            <CardContent className="p-8">
                {/* Author info and badges */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-4 ring-green-100">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xl font-bold">
                                {typeof post.author === 'string' ? getAuthorAvatar(post.author) : post.author.avatar || getAuthorAvatar(post.author.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {typeof post.author === 'string' ? post.author : post.author.name}
                                </h3>
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-3 py-1">
                                    Host
                                </Badge>
                            </div>
                            <p className="text-gray-600 font-medium">{formatTimeAgo(post.createdAt)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* {!postDetail.isExpired ? (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm">
                                🟢 Đang mở
                            </Badge>
                        ) : (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm">
                                🔴 Đã hết hạn
                            </Badge>
                        )} */}
                        <Badge className={`${getSportColor(post.sport)} text-white px-4 py-2 text-sm`}>
                            {post.sport}
                        </Badge>
                    </div>
                </div>

                {/* Post title and content */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed">{post.content}</p>
                </div>

                {/* Activity details - Enhanced grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Ngày</div>
                            <div className="font-bold text-gray-900">{postDetail.date}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Giờ</div>
                            <div className="font-bold text-gray-900">{postDetail.time}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Địa điểm</div>
                            <div className="font-bold text-gray-900">Quận 1, HCM</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-600">Chi phí</div>
                            <div className="font-bold text-green-600">{postDetail.price}</div>
                        </div>
                    </div>
                </div>

                {/* Action buttons - Enhanced */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${isLiked
                                ? "text-red-600 bg-red-50 border border-red-200 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                            <span className="font-medium">{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{commentsCount}</span>
                        </button>
                        <button
                            onClick={onShare}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="font-medium">Share</span>
                        </button>
                    </div>

                    <Button
                        onClick={onJoin}
                        size="lg"
                        className={`px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 ${isJoined
                            ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200"
                            }`}
                    >
                        {isJoined ? "Liên hệ với chủ sân" : "Liên hệ với chủ sân"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}