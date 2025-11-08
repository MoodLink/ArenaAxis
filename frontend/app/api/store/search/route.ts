// File: app/api/store/search/route.ts
// Proxy API để tìm kiếm stores với filters

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const perPage = searchParams.get('perPage') || '20';

        const body = await request.json();

        const response = await fetch(
            `${API_BASE_URL}/stores/search?page=${page}&perPage=${perPage}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

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
        const errorMessage = error instanceof Error ? error.message : 'Failed to search stores';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to search stores' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
