"use client"

import React, { useEffect, useState } from 'react'
import { useGlobalNotifications } from '@/hooks/use-global-notifications'
import { X } from 'lucide-react'

/**
 * Component hiển thị thông báo tin nhắn toàn cục
 * Render một danh sách thông báo từ phía trên bên phải màn hình
 */
export default function GlobalNotificationCenter() {
    const { notifications, removeNotification } = useGlobalNotifications()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        console.log('🎨 [GlobalNotificationCenter] Mounted and ready')
    }, [])

    useEffect(() => {
        if (notifications.length > 0) {
            console.log('📢 [GlobalNotificationCenter] Rendering notifications:', notifications.length)
        }
    }, [notifications])

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none" style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999 }}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-80 pointer-events-auto border-l-4 border-green-600 animate-in slide-in-from-top fade-in duration-300"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {notification.senderName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {notification.senderName}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notification.timestamp).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                {notification.content}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
