// File: app/api/store-view-histories/route.ts
// Proxy API cho store view histories - GET danh sách, DELETE xóa

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
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

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers['Authorization'] = bearerToken;

        const url = `${API_BASE_URL}/store-view-histories`;
        console.log(`[API Proxy] GET ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-cache',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);

            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Token expired', message: 'Vui lòng đăng nhập lại' },
                    { status: 401 }
                );
            }

            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store view histories';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to fetch store view histories',
            },
            { status: 500 }
        );
    }
}
