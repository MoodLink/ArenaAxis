"use client"

import { ExternalLink, Calendar, User, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SportsNews } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface SportsNewsCardProps {
    news: SportsNews
    onReadMore: (url: string) => void
}

export default function SportsNewsCard({ news, onReadMore }: SportsNewsCardProps) {
    // Format thời gian
    const timeAgo = formatDistanceToNow(new Date(news.publishedAt), {
        addSuffix: true,
        locale: vi
    })

    // Sport badge color
    const getSportBadgeColor = (sport?: string) => {
        switch (sport) {
            case 'football': return 'bg-green-100 text-green-700'
            case 'basketball': return 'bg-orange-100 text-orange-700'
            case 'tennis': return 'bg-yellow-100 text-yellow-700'
            case 'badminton': return 'bg-blue-100 text-blue-700'
            case 'volleyball': return 'bg-purple-100 text-purple-700'
            case 'swimming': return 'bg-cyan-100 text-cyan-700'
            case 'esports': return 'bg-pink-100 text-pink-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    // Sport name in Vietnamese
    const getSportName = (sport?: string) => {
        switch (sport) {
            case 'football': return 'Bóng đá'
            case 'basketball': return 'Bóng rổ'
            case 'tennis': return 'Tennis'
            case 'badminton': return 'Cầu lông'
            case 'volleyball': return 'Bóng chuyền'
            case 'swimming': return 'Bơi lội'
            case 'athletics': return 'Điền kinh'
            case 'esports': return 'Esports'
            default: return 'Thể thao'
        }
    }

    // Fallback image nếu không có ảnh
    const imageUrl = news.urlToImage || '/badminton-tournament-poster.png'

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = '/badminton-tournament-poster.png'
                    }}
                />
                {/* Category Tag - góc trên trái */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <Badge className="bg-blue-500 text-white">
                        {getSportName(news.sport)}
                    </Badge>
                    {news.category && news.category !== 'all' && (
                        <Badge className="bg-green-500 text-white">
                            {getSportName(news.category)}
                        </Badge>
                    )}
                </div>
            </div>

            <CardHeader className="flex-grow">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                    {news.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">
                    {news.description || 'Không có mô tả'}
                </p>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Meta Info */}
                <div className="flex flex-col gap-2 text-xs text-gray-500">
                    {/* Source */}
                    <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span className="font-medium">{news.source.name}</span>
                    </div>

                    {/* Author */}
                    {news.author && (
                        <div className="flex items-center gap-1">
                            <User size={14} />
                            <span className="truncate">{news.author}</span>
                        </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    onClick={() => onReadMore(news.url)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                    <ExternalLink size={16} className="mr-2" />
                    Đọc thêm
                </Button>
            </CardFooter>
        </Card>
    )
}
