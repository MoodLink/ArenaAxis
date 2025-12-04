// File: app/api/ratings/store/[id]/route.ts
// Proxy API cho ratings của store

import { NextRequest, NextResponse } from 'next/server';
import { CACHE_TIMES } from '@/lib/cache-utils';

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

        // Store ratings là public endpoint, không cần auth
        const url = `${API_BASE_URL}/ratings/store/${id}${queryString ? `?${queryString}` : ''}`;
        console.log(`[API Proxy] GET ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers,
            // Next.js caching - cache ratings for 10 minutes
            cache: 'force-cache',
            next: {
                revalidate: 600, // 10 minutes
                tags: ['ratings', id],
            } as any,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
            return NextResponse.json(
                { success: false, error: true, status: response.status, data: [] },
                { status: 200 }
            );
        }

        const data = await response.json();

        const responseHeaders = new Headers();
        responseHeaders.set('Cache-Control', `public, s-maxage=600, stale-while-revalidate=1200`);

        return NextResponse.json(data, {
            status: 200,
            headers: responseHeaders,
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
