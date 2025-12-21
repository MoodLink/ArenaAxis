// File: app/api/store-view-histories/all/route.ts
// Proxy API để xóa toàn bộ store view histories

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function DELETE(request: NextRequest) {
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

        const url = `${API_BASE_URL}/store-view-histories/all`;
        console.log(`[API Proxy] DELETE ${url}`);
        console.log(`[API Proxy] Token: ${bearerToken.substring(0, 20)}...`);

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-cache',
        });

        console.log(`[API Proxy] Response status: ${response.status}`);

        if (response.status === 204 || response.ok) {
            console.log(`[API Proxy] ✓ Deleted all store view histories`);
            return new NextResponse(null, { status: 204 });
        }

        if (response.status === 401) {
            return NextResponse.json(
                { error: 'Token expired', message: 'Vui lòng đăng nhập lại' },
                { status: 401 }
            );
        }

        const errorText = await response.text();
        console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
        throw new Error(`API responded with status: ${response.status}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to clear all view histories';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to clear all view histories',
            },
            { status: 500 }
        );
    }
}
