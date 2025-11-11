// Component user profile ở cuối sidebar
"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileSectionProps {
    userName?: string
    userAvatar?: string
    userStatus?: string
}

export default function UserProfileSection({
    userName = "Your Username",
    userAvatar = "/placeholder-user.jpg",
    userStatus = "Đang hoạt động"
}: UserProfileSectionProps) {
    return (
        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium text-white">{userName}</p>
                    <p className="text-sm text-gray-400">{userStatus}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}