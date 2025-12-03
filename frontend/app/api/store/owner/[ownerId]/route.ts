// File: app/api/store/owner/[ownerId]/route.ts
// Proxy API để lấy danh sách stores của owner

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ownerId: string }> }
) {
    try {
        const { ownerId } = await params;
        const authHeader = request.headers.get('authorization');

        // Check for auth token
        if (!authHeader) {
            console.error('[API Proxy] No authorization header provided');
            return NextResponse.json(
                { message: 'Unauthorized', error: 'No authorization token' },
                { status: 401 }
            );
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
        };

        console.log(`[API Proxy] GET /stores/owner/${ownerId}`);

        const response = await fetch(`${API_BASE_URL}/stores/owner/${ownerId}`, {
            method: 'GET',
            headers,
            // Add Next.js caching - cache 5 minutes
            next: {
                revalidate: 300, // 5 minutes
                tags: ['owner-stores', ownerId], // Tag for selective invalidation
            } as any,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            // Don't cache error responses - return actual status code
            return NextResponse.json(
                data,
                { status: response.status }
            );
        }

        console.log(`[API Proxy] Stores by owner retrieved: ${Array.isArray(data) ? data.length : 0} items`);

        // Add Cache-Control headers for browser
        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
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
