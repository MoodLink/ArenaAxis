import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Star, MessageSquare, CheckCircle, XCircle, Flag, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminReview } from "@/data/mockDataAdmin"

interface ReviewTableProps {
    reviews: AdminReview[]
    onReviewAction: (reviewId: string, action: 'approve' | 'reject' | 'respond' | 'delete') => void
    onSelectedReviewChange: (review: AdminReview | null) => void
}

export default function ReviewTable({ reviews, onReviewAction, onSelectedReviewChange }: ReviewTableProps) {
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
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

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Sân</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reviews.map((review) => (
                    <TableRow key={review.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onSelectedReviewChange(review)}>
                        <TableCell>
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={review.user.avatar} />
                                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{review.user.name}</p>
                                    {review.verified && (
                                        <div className="flex items-center space-x-1 text-xs text-green-600">
                                            <Shield className="h-3 w-3" />
                                            <span>Đã xác thực</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>
                                <p className="font-medium text-sm">{review.field.name}</p>
                                <p className="text-xs text-gray-500">{review.field.type}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                {renderStars(review.rating)}
                                <p className="font-medium text-sm">{review.title}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="max-w-xs">
                                <p className="text-sm truncate">{review.content}</p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    <span>❤️ {review.helpfulCount}</span>
                                    {review.reportCount > 0 && (
                                        <span className="text-red-500">🚩 {review.reportCount}</span>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm text-gray-500">{review.createdAt}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {review.status === 'pending' && (
                                        <>
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                onReviewAction(review.id, 'approve')
                                            }}>
                                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                Duyệt
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                onReviewAction(review.id, 'reject')
                                            }}>
                                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                                Từ chối
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        onSelectedReviewChange(review)
                                    }}>
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Phản hồi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        onReviewAction(review.id, 'delete')
                                    }}>
                                        <Flag className="h-4 w-4 mr-2 text-red-600" />
                                        Báo cáo
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onReviewAction(review.id, 'delete')
                                        }}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}