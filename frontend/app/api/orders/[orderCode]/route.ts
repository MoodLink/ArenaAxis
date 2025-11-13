import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/orders/[orderId]
 * Proxy to order-service to get order by order ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { orderCode: string } }
) {
    try {
        // Await params as required by Next.js
        const { orderCode } = await params;
        const orderId = orderCode;

        // Get Authorization header from request
        const authHeader = request.headers.get('authorization');

        console.log('📤 [API Proxy] Fetching order:', orderId);

        // Get ORDER_SERVICE_URL from environment
        const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'https://arena-axis.vercel.app/api/v1';

        // Forward request to order-service
        const response = await fetch(`${orderServiceUrl}/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { 'Authorization': authHeader }),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ [API Proxy] Order service error:', data);
            return NextResponse.json(
                {
                    error: true,
                    message: data.message || 'Failed to get order',
                    status: response.status
                },
                { status: response.status }
            );
        }

        console.log('✅ [API Proxy] Order fetched:', data);

        // Backend returns { message, data: OrderResponse }, extract the data part
        const orderData = data.data || data;
        return NextResponse.json(orderData, { status: 200 });

    } catch (error: any) {
        console.error('❌ [API Proxy] Error:', error);
        return NextResponse.json(
            {
                error: true,
                message: error.message || 'Internal server error'
            },
            { status: 500 }
        );
    }
}
