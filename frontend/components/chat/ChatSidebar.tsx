// Component hiển thị danh sách phòng chat trong sidebar
// Cho phép người dùng chọn phòng để trò chuyện

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ChatRoom } from "@/types"

interface ChatSidebarProps {
    chatRooms: ChatRoom[] // Danh sách các phòng chat
    selectedChatId: string // ID phòng chat đang được chọn
    onSelectChat: (room: ChatRoom) => void // Callback khi chọn phòng chat
    searchQuery: string // Từ khóa tìm kiếm
    onSearchChange: (query: string) => void // Callback khi thay đổi từ khóa tìm kiếm
}

export default function ChatSidebar({
    chatRooms,
    selectedChatId,
    onSelectChat,
    searchQuery,
    onSearchChange
}: ChatSidebarProps) {
    // Helper functions để derive các giá trị từ ChatRoom data
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

    const formatTime = (timestamp: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Vừa xong"
        if (diffInMinutes < 60) return `${diffInMinutes} phút`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ`
        return `${Math.floor(diffInMinutes / 1440)} ngày`
    }
    return (
        <div className="w-80 bg-green-700 text-white flex flex-col">
            {/* Header với tiêu đề và ô tìm kiếm */}
            <div className="p-4 border-b border-green-600">
                <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>

                {/* Ô tìm kiếm cuộc trò chuyện */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-green-600 border-green-500 text-white placeholder-gray-300 focus:bg-green-500"
                    />
                </div>
            </div>

            {/* Danh sách các phòng chat */}
            <div className="flex-1 overflow-y-auto">
                {chatRooms.map((room) => (
                    <div
                        key={room.id}
                        onClick={() => onSelectChat(room)}
                        className={`p-4 border-b border-green-600 cursor-pointer hover:bg-green-600 transition-colors ${selectedChatId === room.id ? "bg-green-600" : ""
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {/* Avatar phòng chat */}
                            <div
                                className={`w-12 h-12 ${getRoomColor(room.type, room.name)} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
                            >
                                {getRoomAvatar(room.name)}
                            </div>

                            {/* Thông tin phòng chat */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    {/* Tên phòng chat - cắt bớt nếu quá dài */}
                                    <h3 className="font-semibold truncate">{room.name}</h3>

                                    {/* Thời gian tin nhắn cuối */}
                                    <span className="text-xs text-gray-300 flex-shrink-0">{formatTime(room.lastMessage.timestamp)}</span>
                                </div>

                                {/* Tin nhắn cuối cùng - cắt bớt nếu quá dài */}
                                <p className="text-sm text-gray-300 truncate">{room.lastMessage.text}</p>
                            </div>

                            {/* Badge số tin nhắn chưa đọc */}
                            {room.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {room.unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiển thị message nếu không có phòng chat nào */}
            {chatRooms.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-300">
                        <p>Không có cuộc trò chuyện nào</p>
                    </div>
                </div>
            )}
        </div>
    )
}
