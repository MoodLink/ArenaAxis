// File: app/api/auth/refresh/route.ts
// Proxy API cho token refresh

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

		console.log('[API Proxy] POST /auth/refresh');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Forward Authorization header if provided
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers,
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
