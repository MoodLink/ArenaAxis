import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import StarRating from './StarRating'
import {
    MessageSquare,
    Calendar,
    MapPin,
    MoreHorizontal,
    ThumbsUp,
    AlertTriangle,
    Send,
    Eye
} from 'lucide-react'

interface Customer {
    name: string
    avatar: string
    email: string
}

interface Field {
    name: string
    type: string
}

interface Response {
    content: string
    date: string
    author: string
}

interface Review {
    id: number
    customer: Customer
    field: Field
    rating: number
    date: string
    content: string
    photos?: string[]
    response?: Response | null
    status: 'pending' | 'responded'
    bookingId: string
    helpful: number
    reported: boolean
}

interface ReviewCardProps {
    review: Review
    onResponse?: (reviewId: number, responseText: string) => void
}

export default function ReviewCard({ review, onResponse }: ReviewCardProps) {
    const [showResponseDialog, setShowResponseDialog] = useState(false)
    const [responseText, setResponseText] = useState('')

    const handleSubmitResponse = () => {
        if (onResponse && responseText.trim()) {
            onResponse(review.id, responseText)
            setShowResponseDialog(false)
            setResponseText('')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Chờ phản hồi</Badge>
            case 'responded':
                return <Badge variant="outline" className="text-green-600 border-green-300">Đã phản hồi</Badge>
            default:
                return <Badge variant="outline">Không xác định</Badge>
        }
    }

    return (
        <Card className="mb-4">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        <Avatar>
                            <AvatarImage src={review.customer.avatar} />
                            <AvatarFallback>{review.customer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{review.customer.name}</h4>
                                <StarRating rating={review.rating} />
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {review.field.name}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {review.date}
                                </span>
                                <span>Booking #{review.bookingId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {review.reported && (
                            <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Báo cáo
                            </Badge>
                        )}
                        {getStatusBadge(review.status)}
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <p className="text-gray-700 mb-3">{review.content}</p>
                    {review.photos && review.photos.length > 0 && (
                        <div className="flex space-x-2">
                            {review.photos.map((photo: string, index: number) => (
                                <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {review.helpful} hữu ích
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        {review.status === 'pending' && (
                            <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Phản hồi
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Phản hồi đánh giá</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <StarRating rating={review.rating} />
                                                <span className="font-medium">{review.customer.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{review.content}</p>
                                        </div>
                                        <Textarea
                                            placeholder="Nhập phản hồi của bạn..."
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            rows={4}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                                                Hủy
                                            </Button>
                                            <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
                                                <Send className="h-4 w-4 mr-2" />
                                                Gửi phản hồi
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        {review.response && (
                            <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 mr-2" />
                                Xem phản hồi
                            </Button>
                        )}
                    </div>
                </div>

                {/* Response Section */}
                {review.response && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Phản hồi từ {review.response.author}</span>
                            <span className="text-sm text-blue-600">{review.response.date}</span>
                        </div>
                        <p className="text-sm text-blue-800">{review.response.content}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}