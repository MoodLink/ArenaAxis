/**
 * GET /api/matches/order/[orderId]
 * Proxy endpoint to fetch matches from the backend
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        let token = request.headers.get('authorization');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Call backend API
        const backendUrl = process.env.USER_SERVICE_DOMAIN;
        const headers: any = {
            'Content-Type': 'application/json',
        };

        // Pass token if present - ensure Bearer prefix
        if (token) {
            // Token from frontend comes as "Bearer {token}", pass it as-is
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            headers['Authorization'] = authHeader;
        }

        const url = `${backendUrl}/matches/order/${orderId}`;
        console.log(`\n🔵 [GET /api/matches/order/${orderId}]`);
        console.log(`   Calling: ${url}`);
        console.log(`   Token: ${token ? `YES (${token.substring(0, 30)}...)` : 'NO'}`);
        console.log(`   Authorization header: ${headers['Authorization'] ? `YES (${headers['Authorization'].substring(0, 30)}...)` : 'NO'}`);
        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        console.log(`   Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Backend error: ${response.status}`);
            console.error(`   Error body: ${errorText}`);
            return NextResponse.json(
                { error: 'Failed to fetch matches from backend' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`   ✅ Raw response:`, JSON.stringify(data, null, 2));

        // Backend returns array directly
        const matches = Array.isArray(data) ? data : data.data || [];
        console.log(`   Processed: ${matches.length} matches`);
        console.log(`   Returning to frontend: { data: ${matches.length} items }\n`);

        return NextResponse.json({ data: matches });
    } catch (error) {
        console.error('Error in GET /api/matches/order/[orderId]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
