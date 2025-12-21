import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/orders/user
 * Proxy to get orders of current user
 * Forwards request to: GET /api/v1/orders/user/{userId}
 */
export async function GET(request: NextRequest) {
    try {
        // Get Authorization header from request
        const authHeader = request.headers.get('authorization')

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Unauthorized - Missing auth token' },
                { status: 401 }
            )
        }

        // Extract userId from query params or auth token
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { error: 'userId query parameter is required' },
                { status: 400 }
            )
        }

        const BACKEND_URL = process.env.ORDER_SERVICE_DOMAIN || 'http://www.executexan.store/api/v1'
        const url = `${BACKEND_URL}/orders/user/${userId}`

        console.log(' [API Proxy] Fetching user orders from backend:', url)

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                signal: AbortSignal.timeout(5000), // 5 second timeout
            })

            if (!response.ok) {
                console.error(` [API Proxy] Backend error: ${response.status} ${response.statusText}`)
                const errorData = await response.text()
                console.error('Error response:', errorData)
                return NextResponse.json(
                    { error: `Backend error: ${response.statusText}` },
                    { status: response.status }
                )
            }

            const data = await response.json()
            console.log(' [API Proxy] User orders fetched from backend:', data)

            return NextResponse.json(data)
        } catch (fetchError) {
            console.warn(' [API Proxy] Backend fetch failed:', fetchError)
            // Return empty orders array when backend is not available
            return NextResponse.json(
                {
                    message: 'No orders found (backend not available)',
                    data: []
                },
                { status: 200 }
            )
        }
    } catch (error) {
        console.error(' [API Proxy] Error in user orders proxy:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch user orders',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
