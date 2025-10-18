// Component danh sách chat rooms với collapsed state
"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatRoom } from "@/types"

interface ChatRoomsListProps {
    filteredChatRooms: ChatRoom[]
    selectedChat: ChatRoom | null
    setSelectedChat: (room: ChatRoom) => void
    sidebarCollapsed: boolean
}

export default function ChatRoomsList({
    filteredChatRooms,
    selectedChat,
    setSelectedChat,
    sidebarCollapsed
}: ChatRoomsListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {!sidebarCollapsed ? (
                <>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                Phòng chat ({filteredChatRooms.length})
                            </h3>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-1">
                            {filteredChatRooms.map((room) => (
                                <div
                                    key={room.id}
                                    onClick={() => setSelectedChat(room)}
                                    className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${selectedChat?.id === room.id
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                  `}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-semibold">
                                            {room.name.charAt(0).toUpperCase()}
                                        </div>
                                        {room.hasUnread && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium truncate">{room.name}</p>
                                            <span className="text-xs opacity-75">
                                                {room.lastMessage?.timestamp
                                                    ? new Date(room.lastMessage.timestamp).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : ''
                                                }
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-75 truncate">
                                            {room.lastMessage?.text || "Chưa có tin nhắn"}
                                        </p>
                                    </div>

                                    {room.hasUnread && (
                                        <Badge className="bg-red-500 text-white text-xs">
                                            {room.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                // Collapsed sidebar - only show icons
                <div className="p-2">
                    {filteredChatRooms.slice(0, 5).map((room) => (
                        <div
                            key={room.id}
                            onClick={() => setSelectedChat(room)}
                            className={`
                relative mb-2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all
                ${selectedChat?.id === room.id
                                    ? 'bg-green-600'
                                    : 'bg-gray-600 hover:bg-gray-500'
                                }
              `}
                        >
                            <span className="font-semibold">{room.name.charAt(0)}</span>
                            {room.hasUnread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}