// File: app/api/users/toggle-active/route.ts
// Proxy API để toggle active status của user (Admin only)

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function PUT(
    request: Request
) {
    try {
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'userId is required', message: 'Missing userId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle_active`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to toggle user active status';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to toggle user active status' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
