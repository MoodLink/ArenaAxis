// File: app/api/plans/route.ts
// Proxy API cho main plans và optional plans

import { NextRequest, NextResponse } from 'next/server';
import { CACHE_TIMES } from '@/lib/cache-utils';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'main'; // 'main' or 'optional'

        const endpoint = type === 'optional' ? '/optional-plans' : '/main-plans';

        console.log(`[API Proxy] GET /plans?type=${type}`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Next.js caching - cache plans for 24 hours (static data)
            cache: 'force-cache',
            next: {
                revalidate: 86400, // 24 hours = 86400 seconds
                tags: ['plans', type],
            } as any,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return NextResponse.json(data, { status: 200 });
        }

        console.log(`[API Proxy]  Plans retrieved for type=${type}`);

        const responseHeaders = new Headers();
        responseHeaders.set('Cache-Control', `public, s-maxage=86400, stale-while-revalidate=172800`);

        return NextResponse.json(data, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch plans';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: true, message: 'Failed to fetch plans', details: errorMessage },
            { status: 200 }
        );
    }
}
