/**
 * Hook để xử lý post apply notifications từ WebSocket
 * Quản lý UI notifications khi người khác apply vào bài viết
 */

import { useEffect, useRef, useCallback } from 'react'
import { WebSocketPostApplyNotification } from '@/types'
import { useToast } from '@/hooks/use-toast'

export interface UsePostApplyNotificationOptions {
    enabled?: boolean
    onNotification?: (notification: WebSocketPostApplyNotification) => void
    autoShowToast?: boolean
}

export function usePostApplyNotification(options: UsePostApplyNotificationOptions = {}) {
    const {
        enabled = true,
        onNotification,
        autoShowToast = true,
    } = options

    const { toast } = useToast()
    const notificationsRef = useRef<WebSocketPostApplyNotification[]>([])

    const handleNotification = useCallback(
        (notification: WebSocketPostApplyNotification) => {
            if (!enabled) return

            // Store notification
            notificationsRef.current.push(notification)

            // Call custom handler if provided
            onNotification?.(notification)

            // Show toast if enabled
            if (autoShowToast) {
                const { applier, post, number } = notification.data
                const message = `${applier.name} vừa apply ${number} chỗ cho bài "${post.title}"`

                toast({
                    title: '✨ Có người mới apply',
                    description: message,
                    variant: 'default',
                    duration: 5000,
                })
            }

            console.log('🎯 Post apply notification received:', notification)
        },
        [enabled, onNotification, autoShowToast, toast]
    )

    const getNotifications = useCallback(() => {
        return [...notificationsRef.current]
    }, [])

    const clearNotifications = useCallback(() => {
        notificationsRef.current = []
    }, [])

    return {
        handleNotification,
        getNotifications,
        clearNotifications,
    }
}
