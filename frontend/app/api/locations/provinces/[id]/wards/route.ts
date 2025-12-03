import { NextRequest, NextResponse } from 'next/server';
import { withCache, CACHE_TIMES } from '@/lib/cache-utils';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const response = await fetch(`${API_BASE_URL}/provinces/${resolvedParams.id}/wards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // Next.js automatic caching
            cache: 'force-cache',
            next: {
                revalidate: CACHE_TIMES.WARDS.maxAge,
                tags: ['wards-cache']
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Add CDN-friendly cache headers
        return withCache(data, CACHE_TIMES.WARDS);
    } catch (error) {
        console.error('Error fetching wards for province:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards for province' },
            { status: 500 }
        );
    }
}
