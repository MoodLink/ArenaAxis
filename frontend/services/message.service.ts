import { ChatRoom, ChatMessage } from '@/types'

const API_BASE_URL = '/api/messages'

/**
 * Message Service
 * 
 * Các hàm để quản lý tin nhắn và cuộc hội thoại
 */

/**
 * Lấy danh sách cuộc hội thoại của user
 * GET /api/messages/conversations
 */
export async function getConversations(
    userId: string,
    receiverName?: string,
    page: number = 0,
    perPage: number = 20
): Promise<{ data?: ChatRoom[]; error?: string }> {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            return { error: 'Không tìm thấy token' }
        }

        const params = new URLSearchParams({
            userId: userId,
            page: page.toString(),
            perPage: perPage.toString(),
        })

        // Only append receiverName if it's explicitly provided (not undefined or empty)
        if (receiverName && receiverName.trim()) {
            params.append('receiverName', receiverName.trim())
            console.log(`🔍 [getConversations] Searching for receiver: "${receiverName}"`)
        } else {
            console.log(`🔍 [getConversations] Loading all conversations (no receiver filter)`)
        }

        const response = await fetch(`${API_BASE_URL}/conversations?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('❌ [getConversations] Error:', errorData)
            return { error: errorData.error || `API error: ${response.status}` }
        }

        const data = await response.json()
        const count = Array.isArray(data) ? data.length : 0
        console.log(`✅ [getConversations] Loaded ${count} conversations${receiverName ? ` (filtered by "${receiverName}")` : ''}`)
        return { data: Array.isArray(data) ? data : [] }
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Lấy danh sách tin nhắn trong một cuộc hội thoại
 * GET /api/messages/messages
 */
export async function getMessages(
    conversationId: string,
    page: number = 0,
    perPage: number = 1000
): Promise<{ data?: ChatMessage[]; error?: string }> {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            return { error: 'Không tìm thấy token' }
        }

        const params = new URLSearchParams({
            conversationId: conversationId,
            page: page.toString(),
            perPage: perPage.toString(),
        })

        const response = await fetch(`${API_BASE_URL}/messages?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return { error: errorData.error || `API error: ${response.status}` }
        }

        const data = await response.json()
        return { data: Array.isArray(data) ? data : [] }
    } catch (error) {
        console.error('Error fetching messages:', error)
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Gửi tin nhắn chỉ dùng WebSocket (sử dụng từ useMessageSocket hook)
 * REST API không được sử dụng
 */

export const messageService = {
    getConversations,
    getMessages,
}
