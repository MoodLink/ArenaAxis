import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${API_BASE_URL}/wards`, {
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
        console.error('Error fetching wards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wards' },
            { status: 500 }
        );
    }
}
