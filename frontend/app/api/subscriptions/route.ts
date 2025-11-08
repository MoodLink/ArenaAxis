// File: app/api/subscriptions/route.ts
// Proxy API cho subscription operations - main plan purchase, optional plan purchase

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function POST(request: Request) {
    try {
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'main'; // 'main' or 'optional'

        const body = await request.json();

        const endpoint = type === 'optional' ? '/optional-plans/purchase' : '/subscriptions/main-plan';

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to purchase plan';
        console.error('POST /api/subscriptions error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to purchase plan' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
