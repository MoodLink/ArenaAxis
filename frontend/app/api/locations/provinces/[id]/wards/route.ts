import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${API_BASE_URL}/provinces/${params.id}/wards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching wards for province:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards for province' },
            { status: 500 }
        );
    }
}
