// File: app/api/store/admin-search/route.ts
// Proxy API for admin store search with approvable filter

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

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const perPage = searchParams.get('perPage') || '12';

        const body = await request.json();

        const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
        };

        const url = `${API_BASE_URL}/stores/admin-search?page=${page}&perPage=${perPage}`;
        console.log(`[API Proxy] POST ${url}`);
        console.log(`[API Proxy] Request body:`, JSON.stringify(body, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const responseText = await response.text();
        console.log(`[API Proxy] Response status (${response.status}):`, responseText);

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, responseText);
            let errorMessage = 'Failed to search stores';

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
            data = responseText ? JSON.parse(responseText) : [];
        } catch (e) {
            data = [];
        }

        console.log('[API Proxy] Admin search completed successfully');
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search stores';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to search stores',
            },
            { status: 500 }
        );
    }
}
