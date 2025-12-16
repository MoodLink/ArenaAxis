// File: app/api/store/approve/route.ts
// Proxy API for approving stores (Admin only)

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('token')?.value;
        const token = authHeader || cookieToken;

        if (!token) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { storeId } = body;

        if (!storeId) {
            return NextResponse.json(
                { error: 'Missing storeId', message: 'Store ID is required' },
                { status: 400 }
            );
        }

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
        };

        console.log(`[API Proxy] POST /stores/approve for store ${storeId}`);

        const response = await fetch(`${API_BASE_URL}/stores/approve`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ storeId }),
        });

        const responseText = await response.text();
        console.log(`[API Proxy] Response status (${response.status}):`, responseText);

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, responseText);
            let errorMessage = 'Failed to approve store';

            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = responseText || errorMessage;
            }

            return NextResponse.json(
                { error: errorMessage, message: errorMessage },
                { status: response.status }
            );
        }

        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            data = { success: true };
        }

        console.log('[API Proxy] Store approved successfully');
        return NextResponse.json(
            {
                success: true,
                message: 'Store approved successfully',
                data
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to approve store';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to approve store',
            },
            { status: 500 }
        );
    }
}
