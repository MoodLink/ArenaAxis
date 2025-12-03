import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: true, message: 'Unauthorized - No token provided', status: 401 },
                { status: 200 }
            );
        }

        console.log(`[API Proxy] GET /bank-accounts/my-account`);

        const response = await fetch(`${API_BASE_URL}/bank-accounts/myself`, {
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

        console.log(`[API Proxy]  Bank account retrieved`);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bank account';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to fetch my bank account', message: errorMessage },
            { status: 200 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: true, message: 'Unauthorized - No token provided', status: 401 },
                { status: 200 }
            );
        }

        const body = await request.json();

        console.log(`[API Proxy] PUT /bank-accounts/my-account`);

        const response = await fetch(`${API_BASE_URL}/bank-accounts/myself`, {
            method: 'PUT',
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

        console.log(`[API Proxy]  Bank account updated`);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update bank account';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to update my bank account', message: errorMessage },
            { status: 200 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: true, message: 'Unauthorized - No token provided', status: 401 },
                { status: 200 }
            );
        }

        console.log(`[API Proxy] DELETE /bank-accounts/my-account`);

        const response = await fetch(`${API_BASE_URL}/bank-accounts/myself`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return NextResponse.json({ ...data, error: true, status: response.status }, { status: 200 });
        }

        console.log(`[API Proxy]  Bank account deleted`);
        return NextResponse.json(
            { message: 'My bank account deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete bank account';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to delete my bank account', message: errorMessage },
            { status: 200 }
        );
    }
}
