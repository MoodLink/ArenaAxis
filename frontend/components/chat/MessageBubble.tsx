// Component hiển thị một tin nhắn trong chat
// Hỗ trợ các loại tin nhắn: text thường, system message

import { ChatMessage } from "@/types"

interface MessageBubbleProps {
    message: ChatMessage // Thông tin tin nhắn
    isMe?: boolean // Có phải tin nhắn của mình không (optional)
}

export default function MessageBubble({ message, isMe = false }: MessageBubbleProps) {
    // Tin nhắn thường
    return (
        <div className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
            {/* Avatar người gửi - chỉ hiển thị khi không phải tin nhắn của mình */}
            {!isMe && (
                <div
                    className={`w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                    {message.senderId.charAt(0).toUpperCase()}
                </div>
            )}

            {/* Nội dung tin nhắn */}
            <div className={`flex-1 max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Tên người gửi và thời gian - chỉ hiển thị khi không phải tin nhắn của mình */}
                {!isMe && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{message.senderId}</span>
                        <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                )}

                {/* Bubble tin nhắn */}
                <div
                    className={`rounded-lg px-3 py-2 max-w-full break-words ${isMe
                        ? 'bg-green-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                        }`}
                >
                    <p className="text-sm leading-relaxed">{message.text}</p>

                    {/* Thời gian cho tin nhắn của mình */}
                    {isMe && (
                        <p className="text-xs text-green-200 mt-1 text-right">
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
