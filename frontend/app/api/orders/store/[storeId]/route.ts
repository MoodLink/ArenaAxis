import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params
        const { searchParams } = new URL(request.url)
        const startTime = searchParams.get('start_time')
        const endTime = searchParams.get('end_time')

        if (!storeId) {
            return NextResponse.json(
                { error: 'Store ID is required' },
                { status: 400 }
            )
        }

        if (!startTime || !endTime) {
            return NextResponse.json(
                { error: 'start_time and end_time are required' },
                { status: 400 }
            )
        }

        const BACKEND_URL = process.env.ORDER_SERVICE_DOMAIN || 'https://arena-axis.vercel.app/api/v1'
        const url = `${BACKEND_URL}/orders/store/${storeId}?start_time=${startTime}&end_time=${endTime}`

        console.log(' Fetching orders from backend:', url)

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(5000), // 5 second timeout
            })

            if (!response.ok) {
                console.error(` Backend error: ${response.status} ${response.statusText}`)
                const errorData = await response.text()
                console.error('Error response:', errorData)
                return NextResponse.json(
                    { error: `Backend error: ${response.statusText}` },
                    { status: response.status }
                )
            }

            const data = await response.json()
            console.log(' Orders fetched from backend:', data)

            return NextResponse.json(data)
        } catch (fetchError) {
            console.warn(' Backend fetch failed, returning empty orders array:', fetchError)
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
        console.error(' Error in orders store proxy:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch orders',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
