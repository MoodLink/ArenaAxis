// File: app/api/store/[id]/route.ts
// Proxy API cho store detail, update, images upload

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/stores/detail/${id}`, {
            method: 'GET',
            headers,
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch store' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`PUT error (${response.status}):`, errorText);
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to update store';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to update store' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
