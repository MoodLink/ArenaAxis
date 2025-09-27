// Trang chat - nơi người dùng trao đổi tin nhắn với nhau
"use client"

import { useState, useEffect, useRef } from "react"
import {
  Phone,
  Video,
  Users,
  Settings,
  Smile,
  Paperclip,
  Send,
  Pin,
  MoreVertical,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChatSidebarHeader from "@/components/chat/ChatSidebarHeader"
import ChatRoomsList from "@/components/chat/ChatRoomsList"
import OnlineUsersSection from "@/components/chat/OnlineUsersSection"
import UserProfileSection from "@/components/chat/UserProfileSection"
import { getChatRooms, getChatMessages, sendMessage, getOnlineUsers, getCurrentChatUser } from "@/services/api"
import { ChatRoom, ChatMessage } from "@/types"

export default function ChatPage() {
  // State quản lý danh sách phòng chat
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // State quản lý tin nhắn
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Ref để auto scroll xuống tin nhắn mới nhất
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [roomsData, usersData, currentUserData] = await Promise.all([
          getChatRooms(),
          getOnlineUsers(),
          getCurrentChatUser()
        ])

        setChatRooms(roomsData)
        setOnlineUsers(usersData)
        setCurrentUser(currentUserData)

        // Chọn phòng đầu tiên nếu có
        if (roomsData.length > 0) {
          setSelectedChat(roomsData[0])
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])  // useEffect để fetch tin nhắn khi thay đổi phòng chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const messagesData = await getChatMessages(selectedChat.id)
          setMessages(messagesData)
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }
    }

    fetchMessages()
  }, [selectedChat])

  // useEffect để auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Xử lý chọn phòng chat
  const handleSelectChat = (room: ChatRoom) => {
    setSelectedChat(room)
  }

  // Xử lý gửi tin nhắn
  const handleSendMessage = async (content: string) => {
    if (!selectedChat || !content.trim()) return

    setSendingMessage(true)
    try {
      // Gọi API gửi tin nhắn
      const success = await sendMessage(selectedChat.id, content)

      if (success) {
        // Thêm tin nhắn mới vào state (giả lập real-time)
        const optimisticMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          text: content,
          senderId: currentUser?.id || "current-user",
          roomId: selectedChat.id,
          timestamp: new Date(),
          type: "text"
        }

        setMessages(prev => [...prev, optimisticMessage])

        // Cập nhật last message trong sidebar
        setChatRooms(prev =>
          prev.map(room =>
            room.id === selectedChat.id
              ? {
                ...room,
                lastMessage: {
                  id: optimisticMessage.id,
                  text: optimisticMessage.text,
                  senderId: optimisticMessage.senderId,
                  timestamp: optimisticMessage.timestamp
                }
              }
              : room
          )
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  // Lọc phòng chat theo từ khóa tìm kiếm
  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Render giao diện chat hiện đại
  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Modern Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300`}>
        <ChatSidebarHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <ChatRoomsList
          filteredChatRooms={filteredChatRooms}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          sidebarCollapsed={sidebarCollapsed}
        />

        {!sidebarCollapsed && (
          <OnlineUsersSection onlineUsers={onlineUsers} />
        )}

        {!sidebarCollapsed && (
          <UserProfileSection
            userName={currentUser?.name}
            userAvatar={currentUser?.avatar}
          />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-semibold text-white">
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-500">
                      {typingUsers.length > 0
                        ? `${typingUsers.join(', ')} đang nhập...`
                        : `${selectedChat.memberCount || 4} thành viên • Hoạt động gần đây`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Users className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Pin className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
            >
              {messages.map((message, index) => {
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
                const isMe = message.senderId === currentUser?.id

                return (
                  <div key={message.id} className="flex items-start gap-3 group">
                    {showAvatar ? (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={isMe ? currentUser?.avatar : "/placeholder-user.jpg"} />
                        <AvatarFallback>
                          {isMe ? (currentUser?.name?.charAt(0).toUpperCase() || 'U') : message.senderId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 flex-shrink-0"></div>
                    )}

                    <div className="flex-1">
                      {showAvatar && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {isMe ? 'Bạn' : `Người dùng ${message.senderId}`}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-4 shadow-sm border max-w-2xl">
                        <p className="text-gray-800 leading-relaxed">{message.text}</p>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder={`Nhắn tin trong ${selectedChat.name}...`}
                    className="pr-12 h-12 bg-gray-100 border-gray-200 focus:bg-white focus:border-green-500 focus:ring-green-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  className="bg-green-600 hover:bg-green-700 h-12 px-6"
                  disabled={sendingMessage}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Chào mừng đến với ArenaAxis Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Chọn một cuộc trò chuyện để bắt đầu nhắn tin với cộng đồng thể thao
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Tạo phòng chat mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
