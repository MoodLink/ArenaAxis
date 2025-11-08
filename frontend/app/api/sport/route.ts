// File: app/api/sport/route.ts
// Proxy API để lấy danh sách môn thể thao và tạo môn thể thao mới

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const url = `${API_BASE_URL}/sports${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sports';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch sports' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Lấy token từ headers
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/sports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend error (${response.status}):`, errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create sport';
        console.error('POST /api/sport error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to create sport' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
