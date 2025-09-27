// Component hiển thị danh sách online users
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OnlineUser } from "@/types"

interface OnlineUsersSectionProps {
    onlineUsers: OnlineUser[]
}

export default function OnlineUsersSection({ onlineUsers }: OnlineUsersSectionProps) {
    return (
        <div className="p-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Đang hoạt động ({onlineUsers.length})
            </h3>
            <div className="space-y-2">
                {onlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="relative">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 
                ${user.status === 'online' ? 'bg-green-400' : ''}
                ${user.status === 'away' ? 'bg-yellow-400' : ''}
                ${user.status === 'busy' ? 'bg-red-400' : ''}
              `}></div>
                        </div>
                        <span className="text-sm text-gray-300">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}