// File: app/api/auth/signup/route.ts
// Proxy API cho signup (POST /users)

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('[API Proxy] POST /auth/signup - Creating new user:', body.email);

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        // Always return success or error
        if (!response.ok) {
            console.error(`[API Proxy] Backend error (${response.status}):`, data);
            return new Response(
                JSON.stringify({
                    message: data.message || `Failed to create user`,
                    error: data.error || `HTTP ${response.status}`,
                    success: false,
                }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        console.log('[API Proxy] User created successfully:', data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        console.error('[API Proxy] Error during signup:', errorMessage);
        return new Response(
            JSON.stringify({
                message: errorMessage,
                error: 'Internal Server Error',
                success: false,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
