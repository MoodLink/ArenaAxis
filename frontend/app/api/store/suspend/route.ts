// File: app/api/store/suspend/route.ts
// Proxy API for suspending stores

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
        const { storeId, startAt, endAt, reason, force } = body;

        // Validate required fields
        if (!storeId || !startAt || !reason) {
            return NextResponse.json(
                {
                    error: 'Missing required fields',
                    message: 'storeId, startAt, and reason are required',
                    missingFields: [
                        !storeId && 'storeId',
                        !startAt && 'startAt',
                        !reason && 'reason'
                    ].filter(Boolean)
                },
                { status: 400 }
            );
        }

        // Validate date format (yyyy/MM/dd)
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!dateRegex.test(startAt)) {
            return NextResponse.json(
                {
                    error: 'Invalid date format',
                    message: 'startAt must be in format yyyy/MM/dd'
                },
                { status: 400 }
            );
        }
        if (endAt && !dateRegex.test(endAt)) {
            return NextResponse.json(
                {
                    error: 'Invalid date format',
                    message: 'endAt must be in format yyyy/MM/dd'
                },
                { status: 400 }
            );
        }

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
        };

        console.log(`[API Proxy] POST /suspend-stores for store ${storeId}`);
        console.log(`[API Proxy] Auth token present: ${!!token}`);
        console.log(`[API Proxy] Bearer token: ${bearerToken.substring(0, 20)}...`);
        console.log(`[API Proxy] Request body:`, JSON.stringify(body, null, 2));

        const response = await fetch(`${API_BASE_URL}/suspend-stores`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                storeId,
                startAt,
                endAt: endAt || null,
                reason,
                force: force || false
            }),
        });

        const responseText = await response.text();
        console.log(`[API Proxy] Response status (${response.status}):`, responseText);

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, responseText);

            try {
                const errorData = JSON.parse(responseText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        error: 'Backend error',
                        message: responseText || 'Failed to suspend store',
                        status: response.status
                    },
                    { status: response.status }
                );
            }
        }

        const data = responseText ? JSON.parse(responseText) : {};
        console.log('[API Proxy] Store suspended successfully');

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to suspend store';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to suspend store',
                fallback: true
            },
            { status: 500 }
        );
    }
}
