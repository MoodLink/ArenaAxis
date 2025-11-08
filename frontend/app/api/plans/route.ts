// File: app/api/plans/route.ts
// Proxy API cho main plans và optional plans

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'main'; // 'main' or 'optional'

        const endpoint = type === 'optional' ? '/optional-plans' : '/main-plans';

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch plans';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch plans' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
