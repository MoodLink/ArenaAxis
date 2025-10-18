"use client"

import { Camera, MapPin, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User } from "@/types"
import Link from "next/link"

interface ProfileHeaderProps {
    user: User
    showEditButton?: boolean
}

export default function ProfileHeader({ user, showEditButton = true }: ProfileHeaderProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase()
    }

    return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-repeat opacity-50"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-green-600 shadow-2xl">
                                {user.avatar ? (
                                    <Avatar className="w-32 h-32">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    getInitials(user.name)
                                )}
                            </div>
                            <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow text-gray-600 hover:text-gray-900">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="text-center md:text-left text-white flex-1">
                            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                            <p className="text-green-100 mb-4 text-lg">{user.email}</p>

                            {user.bio && (
                                <p className="text-green-50 mb-4 max-w-2xl leading-relaxed">
                                    {user.bio}
                                </p>
                            )}

                            {user.location && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-green-100 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{user.location}</span>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-green-50">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats.totalBookings}</div>
                                    <div className="text-sm">Lượt đặt sân</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats.totalTournaments}</div>
                                    <div className="text-sm">Giải đấu</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats.totalPosts}</div>
                                    <div className="text-sm">Bài viết</div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {showEditButton && (
                            <div className="md:ml-auto">
                                <Link href="/profile/edit">
                                    <Button className="bg-white text-green-600 hover:bg-green-50">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}