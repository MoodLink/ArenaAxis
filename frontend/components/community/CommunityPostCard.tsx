// Component hiển thị một bài viết trong cộng đồng
// Cho phép người dùng xem thông tin chi tiết và tương tác

import Link from "next/link"
import { useRouter } from "next/navigation"
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
    Zap,
    Send
} from "lucide-react"
import { CommunityPost } from "@/services/posts.service"

interface CommunityPostCardProps {
    post: CommunityPost // Props nhận thông tin bài viết
    onComment?: (postId: string) => void // Callback khi comment (optional)
    onJoin?: (postId: string) => void // Callback khi tham gia (optional)
}

export default function CommunityPostCard({
    post,
    onComment,
    onJoin
}: CommunityPostCardProps) {
    const router = useRouter()

    const handleChatWithOwner = () => {
        // Redirect to chat page with post owner ID as query param
        router.push(`/chat?userId=${post.poster?.id}`)
    }

    // Helper functions để derive các giá trị từ CommunityPost data
    const getSportColor = (sportName: string) => {
        const sportLower = sportName.toLowerCase()
        if (sportLower.includes("bóng đá") || sportLower.includes("football")) return "bg-green-500"
        if (sportLower.includes("tennis")) return "bg-blue-500"
        if (sportLower.includes("cầu lông") || sportLower.includes("badminton")) return "bg-purple-500"
        if (sportLower.includes("bóng rổ") || sportLower.includes("basketball")) return "bg-orange-500"
        return "bg-gray-500"
    }

    const formatTimeAgo = (timestamp: string) => {
        try {
            // Handle format like "21:04:10 16/12/2025"
            const now = new Date()
            let created: Date

            if (timestamp.includes('/')) {
                // Format: "21:04:10 16/12/2025"
                const parts = timestamp.split(' ')
                if (parts.length === 2) {
                    const [day, month, year] = parts[1].split('/')
                    created = new Date(`${year}-${month}-${day}T${parts[0]}`)
                } else {
                    created = new Date(timestamp)
                }
            } else {
                created = new Date(timestamp)
            }

            const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

            if (diffInMinutes < 1) return "Vừa xong"
            if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
            if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
            return `${Math.floor(diffInMinutes / 1440)} ngày trước`
        } catch {
            return "Chưa xác định"
        }
    }

    const getAuthorAvatar = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    // Get first match info
    const firstMatch = post.matches && post.matches.length > 0 ? post.matches[0] : null
    const matchDate = firstMatch?.date ? new Date(firstMatch.date).toLocaleDateString('vi-VN') : "Chưa xác định"
    const matchStartTime = firstMatch?.startTime || "Chưa xác định"
    const matchEndTime = firstMatch?.endTime || "Chưa xác định"
    const matchTime = matchStartTime === "Chưa xác định" || matchEndTime === "Chưa xác định"
        ? matchStartTime === "Chưa xác định" ? "Chưa xác định" : matchStartTime
        : `${matchStartTime} - ${matchEndTime}`
    const location = post.store?.address || "Chưa xác định"
    const sportName = post.sport?.name || "Chưa xác định"
    const participants = post.currentNumber || 0
    const maxParticipants = post.requiredNumber || 0
    const pricePerPerson = post.pricePerPerson || 0
    const comments = post.comments?.length || 0

    return (
        <Card className="hover:shadow-md transition-all duration-300 bg-white border border-gray-200 hover:border-green-300 group">
            <CardContent className="p-6">
                <div className="flex gap-6">
                    {/* Left section - Avatar */}
                    <div className="flex-shrink-0">
                        <Avatar className="w-14 h-14 ring-2 ring-green-100">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold">
                                {getAuthorAvatar(post.poster?.name || 'U')}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Middle section - Main content */}
                    <div className="flex-grow min-w-0">
                        {/* Header with author and time */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900">{post.poster?.name || 'Unknown'}</h4>
                                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                </div>
                                <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp || new Date().toISOString())}</p>
                            </div>
                            <Badge className={`${getSportColor(sportName)} text-white border-0 flex-shrink-0`}>
                                {sportName}
                            </Badge>
                        </div>

                        {/* Post title */}
                        <Link href={`/community/${post.id}`}>
                            <h3 className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-1 mb-2">
                                {post.title}
                            </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{post.description}</p>

                        {/* Quick info row */}
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span>{matchDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-purple-500" />
                                <span>{matchTime}</span>
                            </div>
                            {location && location !== "Chưa xác định" && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                    <span className="truncate max-w-[150px]">{location}</span>
                                </div>
                            )}
                        </div>

                        {/* Stats inline */}
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Giá:</span>
                                <span className="font-semibold text-green-600">{pricePerPerson > 0 ? `${pricePerPerson.toLocaleString()}đ` : 'Miễn phí'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-blue-600">{participants}/{maxParticipants}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right section - Actions */}
                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <Button
                            size="sm"
                            onClick={() => onJoin?.(post.id)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium px-4 whitespace-nowrap"
                        >
                            Tham gia
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleChatWithOwner}
                            className="flex items-center gap-1 px-3 whitespace-nowrap text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            <Send className="w-4 h-4" />
                            <span>Chat</span>
                        </Button>
                        <button
                            onClick={() => onComment?.(post.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{comments}</span>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
