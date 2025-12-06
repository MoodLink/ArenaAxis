// File: app/api/ratings/[id]/route.ts
// Proxy API cho individual rating

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const url = `${API_BASE_URL}/ratings/${id}`;
        console.log(`[API Proxy] GET ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
            return NextResponse.json(
                { success: false, error: true, status: response.status },
                { status: 200 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rating';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage },
            { status: 200 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
        };

        console.log(`[API Proxy] DELETE /ratings/${id}`);

        const response = await fetch(`${API_BASE_URL}/ratings/${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
            return NextResponse.json(
                { success: false, error: true, status: response.status },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete rating';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage },
            { status: 200 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
        };

        console.log(`[API Proxy] PUT /ratings/${id}`);

        const response = await fetch(`${API_BASE_URL}/ratings/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);
            return NextResponse.json(
                { success: false, error: true, status: response.status },
                { status: 200 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update rating';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage },
            { status: 200 }
        );
    }
}
