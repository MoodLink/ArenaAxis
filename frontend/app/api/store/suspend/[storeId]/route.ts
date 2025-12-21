// File: app/api/store/suspend/[storeId]/route.ts
// Proxy API for getting suspend records for a specific store

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('token')?.value;
        const token = authHeader || cookieToken;

        if (!token) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
        };

        console.log(`[API Proxy] GET /suspend-stores/${storeId}`);

        const response = await fetch(`${API_BASE_URL}/suspend-stores/${storeId}`, {
            method: 'GET',
            headers,
        });

        console.log(`[API Proxy] Backend response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);

            return NextResponse.json(
                {
                    success: false,
                    error: true,
                    status: response.status,
                    message: `Backend error: ${response.status}`,
                    details: errorText,
                    storeId
                },
                { status: 200 }
            );
        }

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : [];

        console.log(`[API Proxy] Successfully fetched suspend records for store ${storeId}`);

        return NextResponse.json(
            {
                success: true,
                data,
                storeId
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch suspend records';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to fetch suspend records',
                fallback: true
            },
            { status: 500 }
        );
    }
}
