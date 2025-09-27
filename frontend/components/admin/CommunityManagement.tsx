"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Flag,
    MessageSquare,
    Heart,
    Users,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Pin,
    ThumbsUp
} from 'lucide-react'
import { CommunityPost } from '@/types'

// Extended community post interface for admin
interface AdminCommunityPost extends CommunityPost {
    reportCount: number;
    isReported: boolean;
    isPinned: boolean;
    moderationStatus: 'approved' | 'pending' | 'rejected';
    views: number;
    engagement: number;
    authorEmail: string;
    authorPhone?: string;
    lastActivity: string;
}

// Mock community posts data
const mockCommunityPosts: AdminCommunityPost[] = [
    {
        id: "1",
        title: "Tìm đội bóng đá thi đấu cuối tuần",
        content: "Mình đang tìm đội bóng đá để thi đấu vào cuối tuần tại khu vực quận 1. Team mình có 8 người, cần thêm 3 người nữa.",
        author: {
            id: "user1",
            name: "Nguyễn Văn An",
            avatar: "/placeholder-user.jpg"
        },
        sport: "Bóng đá",
        location: "Quận 1, TP.HCM",
        date: new Date("2024-12-25"),
        time: "14:00",
        level: "Trung bình",
        participants: 8,
        maxParticipants: 11,
        cost: "200,000đ/người",
        likes: 25,
        comments: 8,
        tags: ["bóng đá", "cuối tuần", "quận 1"],
        createdAt: "2 giờ trước",
        status: "active",
        urgency: "today",
        reportCount: 0,
        isReported: false,
        isPinned: false,
        moderationStatus: "approved",
        views: 156,
        engagement: 89,
        authorEmail: "nguyenvanan@email.com",
        authorPhone: "0123456789",
        lastActivity: "30 phút trước"
    },
    {
        id: "2",
        title: "Giải Tennis mở rộng - Đăng ký ngay!",
        content: "Giải tennis mở rộng dành cho các VĐV nghiệp dư. Giải thưởng hấp dẫn, cơ hội giao lưu với nhiều tay vợt giỏi.",
        author: {
            id: "user2",
            name: "Trần Thị Bình",
            avatar: "/placeholder-user.jpg"
        },
        sport: "Tennis",
        location: "Quận 3, TP.HCM",
        date: new Date("2024-12-30"),
        time: "08:00",
        level: "Cao",
        participants: 24,
        maxParticipants: 32,
        cost: "500,000đ",
        likes: 45,
        comments: 12,
        tags: ["tennis", "giải đấu", "chuyên nghiệp"],
        createdAt: "5 giờ trước",
        status: "hot",
        urgency: "upcoming",
        reportCount: 1,
        isReported: true,
        isPinned: true,
        moderationStatus: "approved",
        views: 324,
        engagement: 156,
        authorEmail: "tranthibinh@email.com",
        lastActivity: "1 giờ trước"
    },
    {
        id: "3",
        title: "Cầu lông giao hữu thứ 7 hàng tuần",
        content: "Nhóm cầu lông của chúng tôi tổ chức giao hữu mỗi thứ 7. Chào mừng mọi trình độ tham gia!",
        author: {
            id: "user3",
            name: "Lê Văn Cường",
            avatar: "/placeholder-user.jpg"
        },
        sport: "Cầu lông",
        location: "Quận 7, TP.HCM",
        date: new Date("2024-12-28"),
        time: "19:00",
        level: "Mọi trình độ",
        participants: 12,
        maxParticipants: 16,
        cost: "100,000đ",
        likes: 18,
        comments: 6,
        tags: ["cầu lông", "giao hữu", "thường xuyên"],
        createdAt: "1 ngày trước",
        status: "active",
        urgency: "weekend",
        reportCount: 0,
        isReported: false,
        isPinned: false,
        moderationStatus: "approved",
        views: 89,
        engagement: 45,
        authorEmail: "levancuong@email.com",
        lastActivity: "3 giờ trước"
    },
    {
        id: "4",
        title: "Bài viết có nội dung không phù hợp",
        content: "Nội dung này vi phạm quy định cộng đồng và cần được xem xét lại...",
        author: {
            id: "user4",
            name: "Người dùng vi phạm",
            avatar: "/placeholder-user.jpg"
        },
        sport: "Khác",
        likes: 2,
        comments: 15,
        tags: ["spam", "vi phạm"],
        createdAt: "3 ngày trước",
        status: "urgent",
        reportCount: 8,
        isReported: true,
        isPinned: false,
        moderationStatus: "pending",
        views: 234,
        engagement: 67,
        authorEmail: "spammer@fake.com",
        lastActivity: "2 ngày trước"
    }
]

export default function CommunityManagement() {
    const [posts, setPosts] = useState(mockCommunityPosts)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [moderationFilter, setModerationFilter] = useState<string>('all')

    // Filter posts
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'reported' && post.isReported) ||
            (statusFilter === 'pinned' && post.isPinned) ||
            post.status === statusFilter

        const matchesModeration = moderationFilter === 'all' || post.moderationStatus === moderationFilter

        return matchesSearch && matchesStatus && matchesModeration
    })

    const getModerationBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getStatusBadge = (post: AdminCommunityPost) => {
        if (post.isPinned) {
            return <Badge className="bg-purple-100 text-purple-800">Đã ghim</Badge>
        }
        if (post.isReported) {
            return <Badge className="bg-red-100 text-red-800">Bị báo cáo</Badge>
        }
        switch (post.status) {
            case 'hot':
                return <Badge className="bg-orange-100 text-orange-800">Hot</Badge>
            case 'active':
                return <Badge className="bg-blue-100 text-blue-800">Hoạt động</Badge>
            case 'urgent':
                return <Badge className="bg-red-100 text-red-800">Khẩn cấp</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">Bình thường</Badge>
        }
    }

    const handlePostAction = (postId: string, action: 'approve' | 'reject' | 'pin' | 'unpin' | 'delete') => {
        switch (action) {
            case 'approve':
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, moderationStatus: 'approved' as const, isReported: false } : post
                ))
                break
            case 'reject':
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, moderationStatus: 'rejected' as const } : post
                ))
                break
            case 'pin':
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, isPinned: true } : post
                ))
                break
            case 'unpin':
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, isPinned: false } : post
                ))
                break
            case 'delete':
                setPosts(posts.filter(post => post.id !== postId))
                break
            default:
                console.log(`${action} post ${postId}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý cộng đồng</h1>
                <p className="text-gray-600">Kiểm duyệt và quản lý nội dung cộng đồng</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng bài viết</p>
                                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                            </div>
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {posts.filter(p => p.moderationStatus === 'pending').length}
                                </p>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Bị báo cáo</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {posts.filter(p => p.isReported).length}
                                </p>
                            </div>
                            <Flag className="h-5 w-5 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Đã ghim</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {posts.filter(p => p.isPinned).length}
                                </p>
                            </div>
                            <Pin className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng tương tác</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {posts.reduce((sum, p) => sum + p.engagement, 0)}
                                </p>
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bài viết cộng đồng</CardTitle>
                    <CardDescription>
                        Quản lý {filteredPosts.length} bài viết trong cộng đồng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                            <Input
                                placeholder="Tìm kiếm bài viết, tác giả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="reported">Bị báo cáo</SelectItem>
                                <SelectItem value="pinned">Đã ghim</SelectItem>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="urgent">Khẩn cấp</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={moderationFilter} onValueChange={setModerationFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Kiểm duyệt" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="pending">Chờ duyệt</SelectItem>
                                <SelectItem value="approved">Đã duyệt</SelectItem>
                                <SelectItem value="rejected">Từ chối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Posts Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bài viết</TableHead>
                                    <TableHead>Tác giả</TableHead>
                                    <TableHead>Thống kê tương tác</TableHead>
                                    <TableHead>Báo cáo</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Kiểm duyệt</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPosts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            <div className="max-w-md">
                                                <p className="font-medium text-gray-900 line-clamp-2">{post.title}</p>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge variant="outline" className="text-xs">{post.sport}</Badge>
                                                    {post.location && (
                                                        <Badge variant="outline" className="text-xs">{post.location}</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{post.createdAt}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={post.author.avatar} />
                                                    <AvatarFallback>
                                                        {post.author.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{post.author.name}</p>
                                                    <p className="text-xs text-gray-500">{post.authorEmail}</p>
                                                    <p className="text-xs text-gray-400">Hoạt động: {post.lastActivity}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Heart className="h-3 w-3 text-red-500" />
                                                        <span className="text-sm">{post.likes}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageSquare className="h-3 w-3 text-blue-500" />
                                                        <span className="text-sm">{post.comments}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500">{post.views} lượt xem</p>
                                                <p className="text-xs text-green-600">Engagement: {post.engagement}%</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {post.reportCount > 0 ? (
                                                <div className="flex items-center space-x-2">
                                                    <Flag className="h-4 w-4 text-red-500" />
                                                    <span className="text-sm font-medium text-red-600">
                                                        {post.reportCount} báo cáo
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Không có</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(post)}</TableCell>
                                        <TableCell>{getModerationBadge(post.moderationStatus)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {post.moderationStatus === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handlePostAction(post.id, 'approve')}
                                                                className="text-green-600"
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Phê duyệt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handlePostAction(post.id, 'reject')}
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Từ chối
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {post.isPinned ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handlePostAction(post.id, 'unpin')}
                                                            className="text-purple-600"
                                                        >
                                                            <Pin className="mr-2 h-4 w-4" />
                                                            Bỏ ghim
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handlePostAction(post.id, 'pin')}
                                                            className="text-purple-600"
                                                        >
                                                            <Pin className="mr-2 h-4 w-4" />
                                                            Ghim bài viết
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handlePostAction(post.id, 'delete')}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa bài viết
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Không tìm thấy bài viết nào phù hợp</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}