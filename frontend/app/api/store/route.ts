// File: app/api/store/route.ts
// Proxy API để lấy thông tin store của user hiện tại

const API_BASE_URL = 'https://arena-axis.vercel.app/api/v1';

export async function GET(request: Request) {
    try {
        // Lấy token từ localStorage (từ client cookie/headers)
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch(`${API_BASE_URL}/stores/my-store`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch store' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
