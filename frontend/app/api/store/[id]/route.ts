// File: app/api/store/[id]/route.ts
// Proxy API cho store detail, update, images upload

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        // ⚠️ Không gửi token cho endpoint public này
        // Store detail endpoint không cần authentication
        console.log(`[API Proxy] GET /stores/detail/${id}`, {
            hasAuth: !!authHeader,
            willSendAuth: false  // Không gửi auth header
        });

        const url = `${API_BASE_URL}/stores/detail/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        console.log(`[API Proxy] Backend response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] ❌ Backend error (${response.status}):`, errorText);

            return NextResponse.json(
                {
                    success: false,
                    error: true,
                    status: response.status,
                    message: `Backend error: ${response.status}`,
                    details: errorText,
                    storeId: id
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        console.log(`[API Proxy] ✅ Store detail retrieved: ${data?.name || id}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Không thể lấy thông tin cửa hàng';
        console.error('[API Proxy] ❌ Error:', errorMessage, error);

        return NextResponse.json(
            {
                success: false,
                error: true,
                message: `Proxy error: ${errorMessage}`
            },
            { status: 200 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
        };

        const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] PUT error (${response.status}):`, errorText);

            return NextResponse.json(
                {
                    error: 'Backend API error',
                    status: response.status,
                    details: errorText
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[API Proxy] Store updated successfully`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update store';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to update store'
            },
            { status: 500 }
        );
    }
}
