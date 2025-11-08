// File: app/api/ratings/store/[id]/route.ts
// Proxy API cho ratings của store

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://arena-user-service.onrender.com';

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
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store ratings';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage, data: [] },
            { status: 200 }
        );
    }
}
