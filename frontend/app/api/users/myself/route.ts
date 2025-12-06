// File: app/api/users/myself/route.ts
// Proxy endpoint for /users/myself from backend
// Gets current authenticated user's profile

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
    try {
        // Get token from cookies or headers
        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('token')?.value;
        const token = authHeader || cookieToken;

        if (!token) {
            console.warn('[API Proxy] No token provided for /users/myself');
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized - Vui lòng đăng nhập',
                    fallback: true,
                    reason: 'NO_TOKEN',
                },
                { status: 401 }
            );
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers['Authorization'] = bearerToken;

        console.log('[API Proxy] GET /users/myself');

        const response = await fetch(`${API_BASE_URL}/users/myself`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            console.error(
                `[API Proxy] Backend error: ${response.status} ${response.statusText}`
            );

            // Handle 401 (Unauthorized) - invalid or expired token
            if (response.status === 401) {
                console.warn('[API Proxy] Unauthorized - Invalid or expired token');
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Unauthorized - Token không hợp lệ',
                        fallback: true,
                        reason: 'INVALID_TOKEN',
                    },
                    { status: 401 }
                );
            }

            // Handle other errors
            return NextResponse.json(
                {
                    success: false,
                    message: `Backend error: ${response.status}`,
                    fallback: true,
                    reason: 'BACKEND_ERROR',
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('[API Proxy] Error:', error.message);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch user profile',
                fallback: true,
                reason: 'PROXY_ERROR',
            },
            { status: 500 }
        );
    }
}
