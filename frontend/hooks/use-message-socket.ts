import { useEffect, useRef, useCallback, useState } from 'react'
import {
    WebSocketRegisterMessage,
    WebSocketSendMessage,
    WebSocketIncomingMessage,
    WebSocketAckMessage,
    WebSocketMessage,
    WebSocketPostApplyMessage,
    WebSocketPostApplyNotification,
} from '@/types'

export interface UseMessageSocketOptions {
    userId?: string
    onMessageReceived?: (message: WebSocketIncomingMessage | WebSocketAckMessage) => void
    onPostApplyNotification?: (notification: WebSocketPostApplyNotification) => void
    onConnectionChange?: (connected: boolean) => void
    autoReconnect?: boolean
    reconnectDelay?: number
    maxReconnectAttempts?: number
}

/**
 * Hook để quản lý WebSocket connection cho messaging
 * Tự động connect/disconnect dựa trên userId
 * Hỗ trợ tự động reconnect khi mất kết nối
 */
export function useMessageSocket(options: UseMessageSocketOptions = {}) {
    const {
        userId,
        onMessageReceived,
        onPostApplyNotification,
        onConnectionChange,
        autoReconnect = true,
        reconnectDelay = 3000,
        maxReconnectAttempts = 5,
    } = options

    const socketRef = useRef<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const reconnectAttemptsRef = useRef(0)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isRegisteredRef = useRef(false)  // Track if register message already sent
    const userIdRef = useRef(userId)       // Keep track of current userId
    const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null)  // Heartbeat timeout

    // Update userIdRef when userId changes
    useEffect(() => {
        userIdRef.current = userId
    }, [userId])

    // Lấy token từ localStorage
    const getToken = () => localStorage.getItem('token') || ''

    // Heartbeat để giữ kết nối sống
    const startHeartbeat = useCallback(() => {
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current)
        }

        const sendHeartbeat = () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                // Gửi ping message để giữ kết nối
                socketRef.current.send(JSON.stringify({ type: 'ping' }))
                console.log('💓 Heartbeat sent')
            }
            // Gửi heartbeat mỗi 10 giây
            heartbeatTimeoutRef.current = setTimeout(sendHeartbeat, 10000)
        }

        heartbeatTimeoutRef.current = setTimeout(sendHeartbeat, 10000)
    }, [])

    // Connect tới WebSocket
    const connect = useCallback(() => {
        if (!userId) return

        // Nếu đã có socket kết nối, không tạo mới
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected')
            return
        }

        try {
            const token = getToken()
            if (!token) {
                console.warn('No auth token available for WebSocket connection')
                return
            }

            // Xác định URL WebSocket - luôn dùng backend domain
            const backendDomain = 'www.executexan.store'
            // Dùng wss (secure) cho production/HTTPS, ws cho development
            const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const wsUrl = `${protocol}//${backendDomain}/ws/messages?token=${token}`

            console.log('Connecting to WebSocket:', wsUrl)
            const socket = new WebSocket(wsUrl)

            socket.onopen = () => {
                console.log('WebSocket connected')
                setIsConnected(true)
                reconnectAttemptsRef.current = 0
                onConnectionChange?.(true)

                // Gửi register signal chỉ 1 lần
                if (!isRegisteredRef.current) {
                    const registerMessage: WebSocketRegisterMessage = {
                        type: 'register',
                        userId: userIdRef.current || userId,
                    }
                    socket.send(JSON.stringify(registerMessage))
                    isRegisteredRef.current = true
                    console.log('Register message sent:', registerMessage)
                }

                // Bắt đầu heartbeat
                startHeartbeat()
            }

            socket.onmessage = (event) => {
                try {
                    console.log('🔍 [RAW EVENT] Backend sent:', event.data)
                    const rawMessage = JSON.parse(event.data)
                    console.log('📨 Received message from WebSocket:', rawMessage)

                    // Handle different message types
                    // Support both new format (with type field) and old format (legacy)

                    if (rawMessage.type === 'message.receive') {
                        // New format: Incoming message from another user
                        const incomingMsg = rawMessage as WebSocketIncomingMessage
                        console.log('📩 [message.receive] From sender:', incomingMsg.data.sender.name)
                        onMessageReceived?.(incomingMsg)
                    } else if (rawMessage.type === 'message.send.ack') {
                        // New format: Acknowledgment for sent message
                        const ackMsg = rawMessage as WebSocketAckMessage
                        console.log('✅ [message.send.ack] Message status:', ackMsg.data.status)
                        onMessageReceived?.(ackMsg)
                    } else if (rawMessage.type === 'message.apply') {
                        // Post apply notification - gửi cho những người đã apply và chủ bài
                        const applyNotification = rawMessage as WebSocketPostApplyNotification
                        console.log('🎯 [message.apply] Applier:', applyNotification.data.applier.name, 'joined post:', applyNotification.data.post.title)
                        onPostApplyNotification?.(applyNotification)
                    } else if (rawMessage.type === 'message' || rawMessage.type === 'message.send' || (!rawMessage.type && rawMessage.senderId)) {
                        // Old format or legacy: {senderId, receiverId, content, status}
                        // Convert to new message.receive format
                        console.log('📩 [OLD FORMAT] Received legacy message, converting...')
                        const legacyMsg = rawMessage

                        // Transform old format to new format
                        const convertedMsg: WebSocketIncomingMessage = {
                            type: 'message.receive',
                            data: {
                                sender: {
                                    id: legacyMsg.senderId,
                                    name: 'Unknown', // Backend không gửi, sẽ update từ API
                                    email: '',
                                    avatarUrl: null
                                },
                                content: legacyMsg.content,
                                conversationId: legacyMsg.conversationId || 'unknown',
                                status: legacyMsg.status || 'RECEIVED',
                                timestamp: legacyMsg.timestamp || new Date().toLocaleString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
                            }
                        }
                        console.log('   Converted to new format:', convertedMsg)
                        onMessageReceived?.(convertedMsg)
                    } else if (rawMessage.type === 'pong') {
                        console.log('🏓 Pong received')
                    } else if (rawMessage.type === 'ping') {
                        console.log('🏓 Ping received, sending pong')
                        socket.send(JSON.stringify({ type: 'pong' }))
                    } else {
                        console.log('⚠️  Unknown message type:', rawMessage.type)
                    }
                } catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error, event.data)
                }
            }

            socket.onerror = (error) => {
                console.error('WebSocket error:', error)
                setIsConnected(false)
                onConnectionChange?.(false)
            }

            socket.onclose = () => {
                console.log('WebSocket disconnected')
                setIsConnected(false)
                onConnectionChange?.(false)
                isRegisteredRef.current = false  // Reset register flag for next connection

                // Reconnect nếu enabled
                if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current += 1
                    console.log(
                        `Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
                    )
                    reconnectTimeoutRef.current = setTimeout(
                        () => connect(),
                        reconnectDelay
                    )
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    console.warn('Max reconnection attempts reached')
                }
            }

            socketRef.current = socket
        } catch (error) {
            console.error('Error connecting to WebSocket:', error)
            setIsConnected(false)
            onConnectionChange?.(false)
        }
    }, [userId, onMessageReceived, onConnectionChange, autoReconnect, reconnectDelay, maxReconnectAttempts])

    // Disconnect
    const disconnect = useCallback(() => {
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current)
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
        }
        if (socketRef.current) {
            socketRef.current.close()
            socketRef.current = null
        }
        isRegisteredRef.current = false
        setIsConnected(false)
        onConnectionChange?.(false)
    }, [onConnectionChange])

    // Gửi tin nhắn
    const sendMessage = useCallback(
        (receiverId: string, content: string, conversationId?: string) => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                console.error('❌ WebSocket is not connected')
                return false
            }

            if (!userId) {
                console.error('❌ User ID is not set')
                return false
            }

            if (!content.trim()) {
                console.error('❌ Message content is empty')
                return false
            }

            try {
                // Backend tự tìm conversation từ senderId + receiverId
                // Không cần gửi conversationId
                const messageData = {
                    senderId: userId,
                    receiverId: receiverId,
                    content: content,
                }

                const message: WebSocketSendMessage = {
                    type: 'message.send',
                    data: messageData,
                }
                socketRef.current.send(JSON.stringify(message))
                console.log('✉️  Message sent via WebSocket:', message)
                console.log('   Raw data being sent:', JSON.stringify(messageData))
                return true
            } catch (error) {
                console.error('❌ Error sending message:', error)
                return false
            }
        },
        [userId]
    )

    // Gửi apply request cho một bài viết
    const sendPostApply = useCallback(
        (postId: string, number: number) => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                console.error('❌ WebSocket is not connected')
                return false
            }

            if (!postId) {
                console.error('❌ Post ID is not set')
                return false
            }

            if (!number || number <= 0) {
                console.error('❌ Number of players must be greater than 0')
                return false
            }

            try {
                const applyData = {
                    postId: postId,
                    number: number,
                }

                const applyMessage: WebSocketPostApplyMessage = {
                    type: 'post.apply',
                    data: applyData,
                }
                socketRef.current.send(JSON.stringify(applyMessage))
                console.log('🎯 Post apply sent via WebSocket:', applyMessage)
                return true
            } catch (error) {
                console.error('❌ Error sending post apply:', error)
                return false
            }
        },
        []
    )

    // Auto connect khi userId thay đổi
    useEffect(() => {
        if (userId) {
            // Reconnect setup
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                // Already connected
                return
            }

            // Đợi một chút trước khi connect để tránh race condition
            const timer = setTimeout(() => {
                connect()
            }, 100)

            return () => clearTimeout(timer)
        } else {
            disconnect()
        }
    }, [userId, connect, disconnect])

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (heartbeatTimeoutRef.current) {
                clearTimeout(heartbeatTimeoutRef.current)
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            // Không auto-disconnect khi unmount, cho phép WebSocket tiếp tục chạy
        }
    }, [])

    return {
        isConnected,
        sendMessage,
        sendPostApply,
        disconnect,
        reconnect: connect,
    }
}

