// File: app/api/store-view-histories/[id]/route.ts
// Proxy API để xóa store view history

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: storeId } = await params;

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

        const url = `${API_BASE_URL}/store-view-histories/${storeId}`;
        console.log(`[API Proxy] DELETE ${url}`);

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-cache',
        });

        // 204 No Content hoặc 200 OK đều là thành công
        if (response.status === 204 || response.ok) {
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete store view history';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to delete store view history',
            },
            { status: 500 }
        );
    }
}
