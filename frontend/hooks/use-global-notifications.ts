"use client"

import { useNotificationContext } from '@/components/providers/notification-context'
import { ChatNotification } from '@/components/providers/notification-context'

export function useGlobalNotifications() {
    const context = useNotificationContext()

    const notifyNewMessage = (
        senderName: string,
        senderId: string,
        content: string,
        conversationId: string,
        timestamp: string
    ) => {
        const notification: ChatNotification = {
            id: `${Date.now()}-${Math.random()}`,
            senderName,
            senderId,
            content,
            conversationId,
            timestamp,
            read: false
        }

        context.addNotification(notification)
    }

    return {
        notifications: context.notifications,
        notifyNewMessage,
        removeNotification: context.removeNotification,
        clearAll: context.clearAll
    }
}
