// File: app/api/store/owner/[ownerId]/route.ts
// Proxy API để lấy danh sách stores của owner

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(
    request: Request,
    { params }: { params: { ownerId: string } }
) {
    try {
        const { ownerId } = await Promise.resolve(params);
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/stores/owner/${ownerId}`, {
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores by owner';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch stores by owner' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
