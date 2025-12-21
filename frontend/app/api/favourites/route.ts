// File: app/api/favourites/route.ts
// Proxy API cho favourites endpoints - BYPASS CORS

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

/**
 * GET /api/favourites
 * Lấy danh sách yêu thích của user hiện tại
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Unauthorized', error: 'No authorization token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('[API Proxy] GET /api/favourites');

        const response = await fetch(`${API_BASE_URL}/favourites`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            cache: 'no-cache',
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Get favourites error (${response.status}):`, data);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`[API Proxy] Get favourites successful - ${Array.isArray(data) ? data.length : '?'} items`);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get favourites';
        console.error('[API Proxy] Get favourites error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * POST /api/favourites
 * Thêm Trung tâm thể thao vào danh sách yêu thích
 * Body: { storeId: string }
 */
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Unauthorized', error: 'No authorization token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const body = await request.json();

        console.log('[API Proxy] POST /api/favourites', body);

        const response = await fetch(`${API_BASE_URL}/favourites`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[API Proxy] Add favourite error (${response.status}):`, data);
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`[API Proxy] Add favourite successful`);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add favourite';
        console.error('[API Proxy] Add favourite error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}


