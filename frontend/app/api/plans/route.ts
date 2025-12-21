// File: app/api/plans/route.ts
// Proxy API cho main plans và optional plans

import { NextRequest, NextResponse } from 'next/server';

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
            // No caching - rely on React Query
            cache: 'no-cache',
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return NextResponse.json(data, { status: 200 });
        }

        console.log(`[API Proxy]  Plans retrieved for type=${type}`);

        return NextResponse.json(data, {
            status: 200,
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
