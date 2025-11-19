// File: app/api/favourites/[storeId]/route.ts
// Proxy API cho dynamic favourites endpoints - BYPASS CORS

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

/**
 * DELETE /api/favourites/[storeId]
 * Xóa cửa hàng khỏi danh sách yêu thích
 */
export async function DELETE( 
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = params;
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized', error: 'No authorization token' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!storeId) {
            return new Response(
                JSON.stringify({ message: 'Bad Request', error: 'Store ID is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        console.log('[API Proxy] DELETE /api/favourites/' + storeId);
        console.log('[API Proxy] Auth Header:', authHeader?.substring(0, 30) + '...');

        const response = await fetch(`${API_BASE_URL}/favourites/store/${storeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        console.log('[API Proxy] DELETE Response Status:', response.status);

        // For DELETE requests, backend might return empty response
        let data: any = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            console.error(
                `[API Proxy] Remove favourite error (${response.status}):`,
                data
            );
            return new Response(JSON.stringify(data || { error: 'Failed to remove favourite' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`[API Proxy] Remove favourite successful`);
        return new Response(JSON.stringify({ success: true, ...data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove favourite';
        console.error('[API Proxy] Remove favourite error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * GET /api/favourites/[storeId]
 * Kiểm tra xem cửa hàng có trong danh sách yêu thích không
 */
export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = params;
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return new Response(
                JSON.stringify({ message: 'Unauthorized', error: 'No authorization token' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!storeId) {
            return new Response(
                JSON.stringify({ message: 'Bad Request', error: 'Store ID is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        console.log('[API Proxy] GET /api/favourites/' + storeId);

        // GET endpoint có thể không tồn tại, cần check isFavourite từ danh sách
        // Hoặc backend cần có GET /favourites/{storeId} endpoint
        const response = await fetch(`${API_BASE_URL}/favourites/${storeId}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(
                `[API Proxy] Check favourite error (${response.status}):`,
                data
            );
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(`[API Proxy] Check favourite successful`);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to check favourite';
        console.error('[API Proxy] Check favourite error:', errorMessage);
        return new Response(
            JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
