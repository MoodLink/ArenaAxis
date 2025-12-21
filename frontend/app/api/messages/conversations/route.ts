import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN || 'https://www.executexan.store'

/**
 * GET /api/messages/conversations
 * Lấy danh sách các cuộc hội thoại của user
 * 
 * Query params:
 * - userId: ID của user hiện tại
 * - receiverName: Tìm kiếm theo tên người nhận (optional)
 * - page: Trang (default: 0)
 * - perPage: Số item trên 1 trang (default: 20)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('userId')
        const receiverName = searchParams.get('receiverName')
        const page = searchParams.get('page') || '0'
        const perPage = searchParams.get('perPage') || '20'

        // Validate userId
        if (!userId) {
            return NextResponse.json(
                { error: 'userId là bắt buộc' },
                { status: 400 }
            )
        }

        // Lấy token từ request headers
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            console.error('❌ [conversations route] Token missing - Authorization header:', authHeader)
            return NextResponse.json(
                { error: 'Không tìm thấy token' },
                { status: 401 }
            )
        }

        console.log(`🔐 [conversations route] Token found: ${token.substring(0, 20)}...`)

        // Xây dựng URL backend
        const backendUrl = new URL('/conversations', API_BASE_URL)
        backendUrl.searchParams.append('userId', userId)
        backendUrl.searchParams.append('page', page)
        backendUrl.searchParams.append('perPage', perPage)

        if (receiverName) {
            backendUrl.searchParams.append('receiverName', receiverName)
            console.log(`🔍 [conversations route] Filtering by receiverName: "${receiverName}"`)
        }

        console.log(`📥 [conversations route] Fetching from: ${backendUrl.toString()}`)
        console.log(`📤 [conversations route] Sending Authorization header: Bearer ${token.substring(0, 20)}...`)

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
            console.error('❌ [conversations route] Backend error:', {
                status: response.status,
                error: errorData,
                receiverName
            })
            return NextResponse.json(
                { error: errorData.message || `API error: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        const resultCount = Array.isArray(data) ? data.length : 0
        console.log(`✅ [conversations route] Success - found ${resultCount} conversations${receiverName ? ` matching "${receiverName}"` : ''}`)

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json(
            { error: 'Lỗi khi lấy danh sách cuộc hội thoại' },
            { status: 500 }
        )
    }
}
