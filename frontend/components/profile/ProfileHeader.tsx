"use client"

import { Camera, MapPin, Edit, Store, Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User } from "@/types"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { getMyStore, uploadAvatar } from "@/services/api-new"

interface ProfileHeaderProps {
    user: User
    showEditButton?: boolean
}

export default function ProfileHeader({ user, showEditButton = true }: ProfileHeaderProps) {
    const [hasStore, setHasStore] = useState<boolean | null>(null)
    const [storeStatus, setStoreStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase()
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File ảnh không được vượt quá 5MB')
            return
        }

        setUploading(true)
        try {
            const avatarUrl = await uploadAvatar(file)
            if (avatarUrl) {
                // Update user avatar (you might need to refresh the page or update state)
                alert('Cập nhật avatar thành công!')
                window.location.reload() // Temporary solution
            }
        } catch (error) {
            console.error('Upload avatar failed:', error)
            alert('Có lỗi xảy ra khi upload avatar')
        } finally {
            setUploading(false)
        }
    }

    // Check if user has a store
    useEffect(() => {
        const checkStore = async () => {
            try {
                const store = await getMyStore()
                if (store) {
                    setHasStore(true)
                    // You can add status checking logic here based on store.approved
                    setStoreStatus(store.approved ? 'approved' : 'pending')
                } else {
                    setHasStore(false)
                }
            } catch (error) {
                setHasStore(false)
            }
        }
        checkStore()
    }, [])

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
                                {(user.avatarUrl || user.avatar) ? (
                                    <Avatar className="w-32 h-32">
                                        <AvatarImage src={user.avatarUrl || user.avatar} alt={user.name} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    getInitials(user.name)
                                )}
                            </div>
                            <button
                                className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                onClick={handleAvatarClick}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Camera className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

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

                            {/* Store Status Badge */}
                            {hasStore !== null && (
                                <div className="mb-4">
                                    {hasStore ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-green-50">
                                            <Store className="w-4 h-4" />
                                            <span>
                                                {storeStatus === 'approved' ? 'Chủ Trung tâm thể thao' :
                                                    storeStatus === 'pending' ? 'Chờ duyệt Trung tâm thể thao' : 'Trung tâm thể thao'}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-green-50">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats?.totalBookings || 0}</div>
                                    <div className="text-sm">Lượt đặt sân</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats?.totalTournaments || 0}</div>
                                    <div className="text-sm">Giải đấu</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{user.stats?.totalPosts || 0}</div>
                                    <div className="text-sm">Bài viết</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="md:ml-auto flex flex-col gap-2">
                            {/* Edit Profile Button */}
                            {showEditButton && (
                                <Link href="/profile/edit">
                                    <Button className="w-full bg-white text-green-600 hover:bg-green-50">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                </Link>
                            )}

                            {/* Store Related Buttons */}
                            {hasStore !== null && (
                                <div className="flex flex-col gap-2">
                                    {!hasStore ? (
                                        // Show "Register Store" button if user doesn't have a store
                                        <Link href="/store-registration">
                                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                                <Store className="w-4 h-4 mr-2" />
                                                Đăng ký Trung tâm thể thao
                                            </Button>
                                        </Link>
                                    ) : storeStatus === 'approved' ? (
                                        // Show "Optional Plans" button only if store is approved
                                        <Link href="/optional-plans">
                                            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                                                <Package className="w-4 h-4 mr-2" />
                                                Gói dịch vụ
                                            </Button>
                                        </Link>
                                    ) : (
                                        // Show pending status for unapproved stores
                                        <div className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-center text-sm">
                                            Trung tâm thể thao đang chờ duyệt
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}