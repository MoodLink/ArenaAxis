// Component hiển thị header của khu vực chat
// Bao gồm thông tin phòng chat và các nút action

import { Button } from "@/components/ui/button"
import { Users, MoreVertical } from "lucide-react"
import { ChatRoom } from "@/types"

interface ChatHeaderProps {
    selectedChat: ChatRoom // Phòng chat đang được chọn
    memberCount?: number // Số lượng thành viên (optional)
    onMembersClick?: () => void // Callback khi click vào nút thành viên
    onMoreClick?: () => void // Callback khi click vào nút more options
}

export default function ChatHeader({
    selectedChat,
    memberCount = 4,
    onMembersClick,
    onMoreClick
}: ChatHeaderProps) {
    // Helper functions để derive avatar và color từ room data
    const getRoomColor = (roomType: string, name: string) => {
        if (roomType === "group") {
            const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"]
            const index = name.length % colors.length
            return colors[index]
        }
        return "bg-gray-500"
    }

    const getRoomAvatar = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    const actualMemberCount = selectedChat.participants?.length || memberCount
    return (
        <div className="p-4 border-b bg-white flex items-center justify-between">
            {/* Thông tin phòng chat */}
            <div className="flex items-center gap-3">
                {/* Avatar phòng chat */}
                <div
                    className={`w-10 h-10 ${getRoomColor(selectedChat.type, selectedChat.name)} rounded-full flex items-center justify-center text-white font-bold`}
                >
                    {getRoomAvatar(selectedChat.name)}
                </div>

                {/* Tên và số thành viên */}
                <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {actualMemberCount} thành viên
                    </p>
                </div>
            </div>

            {/* Các nút action */}
            <div className="flex items-center gap-2">
                {/* Nút xem danh sách thành viên */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMembersClick}
                    className="hover:bg-gray-100"
                >
                    <Users className="w-4 h-4" />
                </Button>

                {/* Nút more options */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoreClick}
                    className="hover:bg-gray-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
