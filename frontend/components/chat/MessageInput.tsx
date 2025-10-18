// Component thanh nhập tin nhắn
// Cho phép người dùng nhập và gửi tin nhắn

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface MessageInputProps {
    onSendMessage: (content: string) => void // Callback khi gửi tin nhắn
    placeholder?: string // Placeholder text (optional)
    disabled?: boolean // Có disable input không (optional)
}

export default function MessageInput({
    onSendMessage,
    placeholder = "Nhập tin nhắn...",
    disabled = false
}: MessageInputProps) {
    const [message, setMessage] = useState("")

    // Xử lý gửi tin nhắn
    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim())
            setMessage("") // Clear input sau khi gửi
        }
    }

    // Xử lý khi nhấn Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-4 border-t bg-white">
            <div className="flex items-center gap-2">
                {/* Nút attach file (tạm thời) */}
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    className="text-gray-500 hover:bg-gray-100"
                >
                    <span className="text-lg">📎</span>
                </Button>

                {/* Ô nhập tin nhắn và nút gửi */}
                <div className="flex-1 flex items-center gap-2">
                    <Input
                        placeholder={placeholder}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={disabled}
                        className="flex-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />

                    {/* Nút gửi */}
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || disabled}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                        size="sm"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Typing indicator (tạm thời ẩn) */}
            <div className="text-xs text-gray-500 mt-2 text-center">
                {/* Sẽ hiển thị "Ai đó đang nhập..." khi có người đang typing */}
            </div>
        </div>
    )
}
