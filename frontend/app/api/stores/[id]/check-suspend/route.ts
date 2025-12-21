import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const storeId = (await params).id
        const date = request.nextUrl.searchParams.get('date')

        if (!storeId || !date) {
            return NextResponse.json(
                { message: 'Missing storeId or date parameter' },
                { status: 400 }
            )
        }

        const backendUrl = `${process.env.USER_SERVICE_DOMAIN || 'https://www.executexan.store'}/stores/${storeId}/check-suspend?date=${date}`

        console.log('[API Proxy] GET', backendUrl)

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('[API Proxy] Backend error:', response.status, data)
            return NextResponse.json(data, { status: response.status })
        }

        console.log('[API Proxy] Response:', data)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('[API Proxy] Error:', error)
        return NextResponse.json(
            { message: 'Failed to check suspend status', error: String(error) },
            { status: 500 }
        )
    }
}
