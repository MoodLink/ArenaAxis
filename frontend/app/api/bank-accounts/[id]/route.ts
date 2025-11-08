import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/bank-accounts/${params.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching bank account:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bank account' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/bank-accounts/${params.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error updating bank account:', error);
        return NextResponse.json(
            { error: 'Failed to update bank account' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/bank-accounts/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(
            { message: 'Bank account deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting bank account:', error);
        return NextResponse.json(
            { error: 'Failed to delete bank account' },
            { status: 500 }
        );
    }
}
