import { NextRequest, NextResponse } from 'next/server';

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
            // No caching - rely on React Query
            cache: 'no-cache',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Return data without cache headers
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching wards for province:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards for province' },
            { status: 500 }
        );
    }
}
