// File: app/api/store/images/route.ts
// Proxy API để upload ảnh cho store

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function PUT(request: Request) {
    try {
        console.log('[Store Images API] API_BASE_URL:', API_BASE_URL);
        console.log('[Store Images API] Request URL:', request.url);

        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            console.error('[Store Images API] No auth token');
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('storeId');

        console.log('[Store Images API] Store ID:', storeId);

        if (!storeId) {
            console.error('[Store Images API] Missing storeId');
            return new Response(
                JSON.stringify({ error: 'storeId is required', message: 'Missing storeId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const formData = await request.formData();
        const backendUrl = `${API_BASE_URL}/stores/${storeId}/images`;

        console.log('[Store Images API] Forwarding to backend:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
        });

        console.log('[Store Images API] Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Store Images API] PUT error (${response.status}):`, errorText);

            // Preserve original status code and error response
            try {
                const errorData = JSON.parse(errorText);
                return new Response(
                    JSON.stringify(errorData),
                    { status: response.status, headers: { 'Content-Type': 'application/json' } }
                );
            } catch {
                return new Response(
                    JSON.stringify({
                        error: `API responded with status: ${response.status}`,
                        message: errorText,
                        status: response.status
                    }),
                    { status: response.status, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const data = await response.json();

        console.log('[Store Images API] Success! Response:', data);

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload store images';
        console.error('[Store Images API] Error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to upload store images' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
