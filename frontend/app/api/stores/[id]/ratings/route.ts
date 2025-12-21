// File: app/api/stores/[id]/ratings/route.ts
// Proxy API cho ratings của store - route forwarding

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

        // Forward to backend: GET /stores/{id}/ratings?sportId=football&star=4&page=1&perPage=12
        const url = `${API_BASE_URL}/stores/${id}/ratings${queryString ? `?${queryString}` : ''}`;
        console.log(`[API Proxy] GET /stores/${id}/ratings -> ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers,
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

        const responseText = await response.text();
        console.log(`[API Proxy] Response text length: ${responseText.length}`);

        // Handle empty response body
        if (!responseText || responseText.trim() === '') {
            console.warn('[API Proxy] Backend returned empty response body');
            return NextResponse.json([], {
                status: 200,
                headers: new Headers({ 'Cache-Control': 'no-cache' }),
            });
        }

        try {
            const data = JSON.parse(responseText);
            console.log('[API Proxy] Response parsed successfully:', data?.length || 'object');
            return NextResponse.json(data, {
                status: 200,
            });
        } catch (parseError) {
            console.error('[API Proxy] JSON parse error:', parseError);
            console.log('[API Proxy] Response text preview:', responseText.substring(0, 200));
            // If response is not JSON, return empty array
            return NextResponse.json([], {
                status: 200,
                headers: new Headers({ 'Cache-Control': 'no-cache' }),
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store ratings';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage, data: [] },
            { status: 200 }
        );
    }
}
