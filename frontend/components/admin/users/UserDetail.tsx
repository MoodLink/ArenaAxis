// User Detail View Component
// Hiển thị chi tiết thông tin người dùng

import { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Calendar, Trophy, MessageSquare, BookOpen } from "lucide-react"

interface UserDetailProps {
    user: User & {
        status: 'active' | 'inactive' | 'banned'
        joinDate: string
        lastActive: string
    }
}

export default function UserDetail({ user }: UserDetailProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
            case 'inactive':
                return <Badge className="bg-yellow-100 text-yellow-800">Không hoạt động</Badge>
            case 'banned':
                return <Badge className="bg-red-100 text-red-800">Bị khóa</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    return (
        <div className="space-y-6">
            {/* User Info Header */}
            <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        {getStatusBadge(user.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {user.phone}
                        </div>
                        {user.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {user.location}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio */}
            {user.bio && (
                <Card>
                    <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Giới thiệu</h4>
                        <p className="text-gray-600">{user.bio}</p>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tổng booking</p>
                                <p className="text-xl font-bold">{user.stats.totalBookings}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Trophy className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Giải đấu</p>
                                <p className="text-xl font-bold">{user.stats.totalTournaments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Bài viết</p>
                                <p className="text-xl font-bold">{user.stats.totalPosts}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Favorite Sports */}
            <Card>
                <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Môn thể thao yêu thích</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.favoriteSports.map((sport) => (
                            <Badge key={sport} variant="outline">
                                {sport}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Ngày tham gia</span>
                        </div>
                        <p className="text-gray-600">{formatDate(user.joinDate)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Hoạt động cuối</span>
                        </div>
                        <p className="text-gray-600">{formatDate(user.lastActive)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Notification Settings */}
            <Card>
                <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Cài đặt thông báo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(user.notifications).map(([key, enabled]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="text-sm capitalize">
                                    {key === 'booking' ? 'Booking' :
                                        key === 'tournament' ? 'Giải đấu' :
                                            key === 'community' ? 'Cộng đồng' :
                                                key === 'email' ? 'Email' : 'Push'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}