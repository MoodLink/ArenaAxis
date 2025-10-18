// Component header của chat sidebar
"use client"

import { Search, MoreVertical, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatSidebarHeaderProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    sidebarCollapsed: boolean
    setSidebarCollapsed: (collapsed: boolean) => void
}

export default function ChatSidebarHeader({
    searchQuery,
    setSearchQuery,
    sidebarCollapsed,
    setSidebarCollapsed
}: ChatSidebarHeaderProps) {
    return (
        <div className="p-4 border-b border-gray-700">
            {!sidebarCollapsed ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">ArenaAxis Chat</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(true)}
                            className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 w-full"
                >
                    <Hash className="w-4 h-4" />
                </Button>
            )}
        </div>
    )
}