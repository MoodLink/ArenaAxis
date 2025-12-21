// File: app/api/ratings/store/[id]/route.ts
// Proxy API cho ratings của store

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Lấy token từ cookies hoặc headers
        const token = request.cookies.get('token')?.value || request.headers.get('authorization');
        if (token) {
            headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            console.log(`[API Proxy] Sending token to backend`);
        }

        const url = `${API_BASE_URL}/ratings/stores/${id}${queryString ? `?${queryString}` : ''}`;
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

            // Nếu endpoint không implement hoặc không tồn tại, trả về empty array
            if (response.status === 404 || response.status === 501) {
                console.log('[API Proxy] Ratings endpoint not available, returning empty array');
                return NextResponse.json([], {
                    status: 200,
                    headers: new Headers({ 'Cache-Control': 'no-cache' }),
                });
            }

            return NextResponse.json(
                { success: false, error: true, status: response.status, data: [] },
                { status: 200 }
            );
        }

        // Parse JSON safely - handle empty response body
        let data;
        try {
            const responseText = await response.text();
            data = responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
            console.error('[API Proxy] Failed to parse JSON response:', parseError);
            data = [];
        }

        return NextResponse.json(data, {
            status: 200,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store ratings';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage, data: [] },
            { status: 200 }
        );
    }
}
