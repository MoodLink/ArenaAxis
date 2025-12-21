import { NextRequest, NextResponse } from 'next/server'

const ORDER_SERVICE_DOMAIN = 'https://www.executexan.store/api/v1'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params

        if (!storeId) {
            return NextResponse.json(
                { error: 'Store ID is required' },
                { status: 400 }
            )
        }

        // Call external API từ server
        const url = `${ORDER_SERVICE_DOMAIN}/revenue/store/${storeId}`
        console.log('Fetching from external API:', url)

        // Get token from request headers
        const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
            request.cookies.get('token')?.value

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // Add Bearer token if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
            console.log('Token included in request')
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(10000),
        })

        if (!response.ok) {
            console.error(`External API error: ${response.status} ${response.statusText}`)
            return NextResponse.json(
                { error: `External API error: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching store revenue:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch revenue data' },
            { status: 500 }
        )
    }
}
