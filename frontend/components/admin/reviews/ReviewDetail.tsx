import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Shield, MessageSquare, Send } from "lucide-react"
import { AdminReview } from "@/data/mockDataAdmin"

interface ReviewDetailProps {
    review: AdminReview | null
    isOpen: boolean
    onClose: () => void
    onResponse: (reviewId: string, responseText: string) => void
}

export default function ReviewDetail({ review, isOpen, onClose, onResponse }: ReviewDetailProps) {
    const [responseText, setResponseText] = useState('')

    if (!review) return null

    const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
        const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>
            case 'reported':
                return <Badge className="bg-orange-100 text-orange-800">Bị báo cáo</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const handleSubmitResponse = () => {
        if (responseText.trim()) {
            onResponse(review.id, responseText)
            setResponseText('')
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết đánh giá</DialogTitle>
                    <DialogDescription>
                        Xem chi tiết và phản hồi đánh giá từ khách hàng
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className="font-medium">{review.user.name}</p>
                                    {review.verified && (
                                        <div className="flex items-center space-x-1 text-xs text-green-600">
                                            <Shield className="h-3 w-3" />
                                            <span>Đã xác thực</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{review.createdAt}</p>
                            </div>
                        </div>
                        {getStatusBadge(review.status)}
                    </div>

                    {/* Field Info */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{review.field.name}</p>
                                    <p className="text-sm text-gray-500">{review.field.type}</p>
                                    {review.booking && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Booking: {review.booking.id} - {review.booking.date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Content */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            {renderStars(review.rating, 'md')}
                            <span className="font-medium text-lg">{review.title}</span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>❤️ {review.helpfulCount} người thấy hữu ích</span>
                            {review.reportCount > 0 && (
                                <span className="text-red-500">🚩 {review.reportCount} báo cáo</span>
                            )}
                        </div>
                    </div>

                    {/* Existing Response */}
                    {review.response && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Phản hồi từ {review.response.author}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{review.response.content}</p>
                                <p className="text-xs text-gray-500 mt-2">{review.response.date}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Response Form */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Phản hồi đánh giá</h4>
                        <Textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Viết phản hồi cho đánh giá này..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Gửi phản hồi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}