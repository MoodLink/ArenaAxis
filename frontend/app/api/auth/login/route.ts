// File: app/api/auth/login/route.ts
// Proxy API cho login endpoints

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const loginType = url.searchParams.get('type') || 'user'; // user, client, admin

        const body = await request.json();
        const endpoint = `auth/${loginType}`;

        console.log(`[API Proxy] POST /auth/login?type=${loginType}`);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Login error (${response.status}):`, data);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`[API Proxy] Login successful for ${loginType}`);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to login';
        console.error('[API Proxy] Login error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
