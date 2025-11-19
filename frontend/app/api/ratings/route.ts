// File: app/api/ratings/route.ts
// Proxy API cho ratings

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const authHeader = request.headers.get('authorization');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const url = `${API_BASE_URL}/ratings${queryString ? `?${queryString}` : ''}`;
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ratings';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage },
            { status: 200 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'No auth token provided', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const contentType = request.headers.get('content-type');
        const headers: HeadersInit = {
            'Authorization': authHeader,
        };

        let body: BodyInit;

        if (contentType && contentType.includes('multipart/form-data')) {
            // Để browser tự động set Content-Type với boundary
            const formData = await request.formData();
            body = formData;
        } else {
            // JSON request
            headers['Content-Type'] = 'application/json';
            body = await request.text();
        }

        console.log(`[API Proxy] POST /ratings`, { contentType });

        const response = await fetch(`${API_BASE_URL}/ratings`, {
            method: 'POST',
            headers,
            body,
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to create rating';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { success: false, error: true, message: errorMessage },
            { status: 200 }
        );
    }
}
