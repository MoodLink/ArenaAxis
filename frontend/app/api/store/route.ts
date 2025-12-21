// File: app/api/store/route.ts
// Proxy API cho stores - GET list, POST register

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('token')?.value;
        const token = authHeader || cookieToken;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            headers['Authorization'] = bearerToken;
        }

        const url = `${API_BASE_URL}/stores${queryString ? `?${queryString}` : ''}`;
        console.log(`[API Proxy] GET ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers,
            // No caching - rely on React Query
            cache: 'no-cache',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Return data without cache headers
        return NextResponse.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to fetch stores',
                fallback: true
            },
            { status: 500 }
        );
    }
}

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
        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
        };

        console.log(`[API Proxy] POST /stores`);
        console.log(`[API Proxy] Request body:`, JSON.stringify(body, null, 2));

        const response = await fetch(`${API_BASE_URL}/stores`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const responseText = await response.text();
        console.log(`[API Proxy] Response status (${response.status}):`, responseText);

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, responseText);

            // Try to parse error response
            try {
                const errorData = JSON.parse(responseText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        error: 'Backend error',
                        message: responseText,
                        status: response.status
                    },
                    { status: response.status }
                );
            }
        }

        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to register store';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to register store',
                fallback: true
            },
            { status: 500 }
        );
    }
}
