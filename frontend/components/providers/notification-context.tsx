"use client"

import React, { createContext, useCallback, useState, useRef, useEffect } from 'react'

export interface ChatNotification {
    id: string
    senderName: string
    senderId: string
    content: string
    conversationId: string
    timestamp: string
    read: boolean
}

interface NotificationContextType {
    notifications: ChatNotification[]
    addNotification: (notification: ChatNotification) => void
    removeNotification: (id: string) => void
    clearAll: () => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<ChatNotification[]>([])
    // Ref để track notification timeouts
    const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({})

    const addNotification = useCallback((notification: ChatNotification) => {
        console.log('🔔 [Notification] Adding:', {
            senderName: notification.senderName,
            conversationId: notification.conversationId,
            content: notification.content
        })

        setNotifications(prev => {
            // Kiểm tra xem thông báo này đã tồn tại chưa (tránh duplicate)
            const isDuplicate = prev.some(
                n => n.conversationId === notification.conversationId &&
                    n.senderId === notification.senderId &&
                    n.content === notification.content
            )

            if (isDuplicate) {
                console.log('⏭️  [Notification] Skipping duplicate')
                return prev
            }

            const updated = [notification, ...prev]
            console.log('📋 [Notification] Total notifications:', updated.length)
            return updated
        })

        // Auto-remove notification sau 5 giây
        const timeoutId = setTimeout(() => {
            console.log('⏰ [Notification] Auto-removing after 5s:', notification.id)
            removeNotification(notification.id)
        }, 5000)

        timeoutsRef.current[notification.id] = timeoutId
    }, [])

    const removeNotification = useCallback((id: string) => {
        console.log('❌ [Notification] Removing:', id)

        // Clear timeout nếu tồn tại
        if (timeoutsRef.current[id]) {
            clearTimeout(timeoutsRef.current[id])
            delete timeoutsRef.current[id]
        }

        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        console.log('🗑️  [Notification] Clearing all')

        // Clear tất cả timeouts
        Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout))
        timeoutsRef.current = {}

        setNotifications([])
    }, [])

    // Cleanup timeouts khi component unmount
    useEffect(() => {
        return () => {
            Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout))
        }
    }, [])

    const value: NotificationContextType = {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotificationContext() {
    const context = React.useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider')
    }
    return context
}
