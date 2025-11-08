import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: true, message: 'Unauthorized - No token provided', status: 401 },
                { status: 200 }
            );
        }

        const body = await request.json();

        console.log(`[API Proxy] POST /bank-accounts`);

        const response = await fetch(`${API_BASE_URL}/bank-accounts`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return NextResponse.json({ ...data, error: true, status: response.status }, { status: 200 });
        }

        console.log(`[API Proxy] ✅ Bank account created`);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create bank account';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: true, message: 'Failed to create bank account', details: errorMessage },
            { status: 200 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: true, message: 'Unauthorized - No token provided', status: 401 },
                { status: 200 }
            );
        }

        console.log(`[API Proxy] GET /bank-accounts?page=${page}&limit=${limit}`);

        const response = await fetch(`${API_BASE_URL}/bank-accounts?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return NextResponse.json({ ...data, error: true, status: response.status }, { status: 200 });
        }

        console.log(`[API Proxy] ✅ Bank accounts retrieved`);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bank accounts';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: true, message: 'Failed to fetch bank accounts', details: errorMessage },
            { status: 200 }
        );
    }
}
