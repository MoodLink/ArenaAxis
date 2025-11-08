// File: app/api/store/owner/[ownerId]/route.ts
// Proxy API để lấy danh sách stores của owner

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: { ownerId: string } }
) {
    try {
        const { ownerId } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        console.log(`[API Proxy] GET /stores/owner/${ownerId}`);

        const response = await fetch(`${API_BASE_URL}/stores/owner/${ownerId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);

            return NextResponse.json(
                {
                    success: false,
                    error: true,
                    status: response.status,
                    message: `Backend error: ${response.status}`,
                    data: []
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        console.log(`[API Proxy] ✅ Stores by owner retrieved: ${data?.length || 0} items`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores by owner';
        console.error('[API Proxy] Error:', errorMessage);

        return NextResponse.json(
            {
                success: false,
                error: true,
                message: errorMessage,
                data: []
            },
            { status: 200 }
        );
    }
}
