// File: app/api/auth/refresh/route.ts
// Proxy API cho token refresh

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('[API Proxy] POST /auth/refresh');

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Refresh error (${response.status}):`, data);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';
        console.error('[API Proxy] Refresh error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
