import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN || 'https://www.executexan.store'

/**
 * GET /api/messages/messages
 * Lấy danh sách các tin nhắn trong một cuộc hội thoại
 * 
 * Query params:
 * - conversationId: ID của cuộc hội thoại
 * - page: Trang (default: 0)
 * - perPage: Số item trên 1 trang (default: 50)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const conversationId = searchParams.get('conversationId')
        const page = searchParams.get('page') || '0'
        const perPage = searchParams.get('perPage') || '50'

        // Validate conversationId
        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId là bắt buộc' },
                { status: 400 }
            )
        }

        // Lấy token từ request headers
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            console.error('❌ [messages route] Token missing - Authorization header:', authHeader)
            return NextResponse.json(
                { error: 'Không tìm thấy token' },
                { status: 401 }
            )
        }

        console.log(`🔐 [messages route] Token found: ${token.substring(0, 20)}...`)

        // Xây dựng URL backend
        const backendUrl = new URL('/messages', API_BASE_URL)
        backendUrl.searchParams.append('conversationId', conversationId)
        backendUrl.searchParams.append('page', page)
        backendUrl.searchParams.append('perPage', perPage)

        console.log(`📥 [messages route] Fetching from: ${backendUrl.toString()}`)
        console.log(`📤 [messages route] Sending Authorization header: Bearer ${token.substring(0, 20)}...`)

        // Gọi backend API
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('❌ [messages route] Backend error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
                conversationId
            })
            const errorMsg = errorData.message || errorData.error || `API error: ${response.status}`
            return NextResponse.json(
                { error: errorMsg },
                { status: response.status }
            )
        }

        const data = await response.json()
        console.log(`✅ [messages route] Success - loaded ${Array.isArray(data) ? data.length : 0} messages`)

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json(
            { error: 'Lỗi khi lấy danh sách tin nhắn' },
            { status: 500 }
        )
    }
}
