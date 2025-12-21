import { useEffect, useState, useCallback } from 'react'
import { ChatRoom, ChatMessage } from '@/types'
import { getConversations as fetchConversations, getMessages as fetchMessages } from '@/services/message.service'

/**
 * Hook để fetch conversations từ API
 * Gọi /api/messages/conversations
 */
export function useConversations(
    userId?: string,
    receiverName?: string,
    page: number = 0,
    perPage: number = 20
) {
    const [conversations, setConversations] = useState<ChatRoom[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refetch = useCallback(async () => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            const result = await fetchConversations(userId, receiverName, page, perPage)

            if (result.error) {
                setError(result.error)
            } else {
                setConversations(result.data || [])
            }
        } finally {
            setLoading(false)
        }
    }, [userId, receiverName, page, perPage])

    useEffect(() => {
        refetch()
    }, [refetch])

    return {
        conversations,
        loading,
        error,
        refetch,
    }
}

/**
 * Hook để fetch messages từ một conversation
 * Gọi /api/messages/messages
 */
export function useConversationMessages(
    conversationId?: string,
    page: number = 0,
    perPage: number = 1000
) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refetch = useCallback(async () => {
        if (!conversationId) {
            console.log('⚠️ [useConversationMessages] No conversationId provided')
            return
        }

        setLoading(true)
        setError(null)

        try {
            console.log('📥 [useConversationMessages] Fetching messages for:', conversationId)
            const result = await fetchMessages(conversationId, page, perPage)
            console.log('📥 [useConversationMessages] Result:', result)

            if (result.error) {
                console.error('❌ [useConversationMessages] Error:', result.error)
                setError(result.error)
            } else {
                console.log('✅ [useConversationMessages] Messages loaded:', result.data?.length)

                // Transform API data to ChatMessage format
                const transformedMessages = (result.data || []).map((msg: any) => ({
                    id: msg.id || `${Date.now()}-${Math.random()}`,
                    conversationId: conversationId,
                    senderId: msg.senderId || msg.sender_id || '',
                    content: msg.content || '',
                    status: msg.status || 'RECEIVED',
                    timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
                }))

                console.log('📝 [useConversationMessages] Transformed:', transformedMessages.length)
                setMessages(transformedMessages)
            }
        } finally {
            setLoading(false)
        }
    }, [conversationId, page, perPage])

    useEffect(() => {
        refetch()
    }, [refetch])

    return {
        messages,
        loading,
        error,
        refetch,
    }
}
