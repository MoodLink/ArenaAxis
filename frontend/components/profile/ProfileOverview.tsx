"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Trophy } from "lucide-react"
import { User as UserType } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProfileStats from "./ProfileStats"

interface ProfileOverviewProps {
    user: UserType
}

export default function ProfileOverview({ user }: ProfileOverviewProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Thông tin cá nhân
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                <p className="text-gray-900 mt-1">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <p className="text-gray-900 mt-1">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                <p className="text-gray-900 mt-1">{user.phone}</p>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Sports Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Môn thể thao yêu thích
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {user.favoriteSports && user.favoriteSports.length > 0 ? (
                                user.favoriteSports.map((sport, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors cursor-pointer"
                                    >
                                        {sport}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">Chưa có môn thể thao yêu thích</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="space-y-6">
                <ProfileStats user={user} />

                {/* Notification Settings Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Thông báo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Nhắc nhở đặt sân</span>
                            <div className={`w-10 h-6 rounded-full ${user.notifications?.booking ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${user.notifications?.booking ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Cập nhật giải đấu</span>
                            <div className={`w-10 h-6 rounded-full ${user.notifications?.tournament ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${user.notifications?.tournament ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Tin nhắn cộng đồng</span>
                            <div className={`w-10 h-6 rounded-full ${user.notifications?.community ? 'bg-green-500' : 'bg-gray-300'} relative transition-colors`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${user.notifications?.community ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}