// File: app/api/store/images/route.ts
// Proxy API để upload ảnh cho store
// IMPROVED: Handle large image payloads with compression

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

// Configure maximum request body size for this route (Next.js default is 1MB)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb', // Allow up to 50MB for compressed images
        },
    },
};

export async function PUT(request: Request) {
    try {
        console.log('[Store Images API] API_BASE_URL:', API_BASE_URL);
        console.log('[Store Images API] Request URL:', request.url);
        console.log('[Store Images API] Content-Type:', request.headers.get('content-type'));
        console.log('[Store Images API] Content-Length:', request.headers.get('content-length'));

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

        // Log form data contents
        let totalSize = 0;
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`[Store Images API]   - ${key}: ${value.name} (${(value.size / 1024).toFixed(1)}KB)`);
                totalSize += value.size;
            }
        }
        console.log(`[Store Images API] Total payload size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);

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
            console.error(`[Store Images API] PUT error (${response.status}):`, errorText.substring(0, 500));

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
                        message: errorText.substring(0, 200),
                        status: response.status
                    }),
                    { status: response.status, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const data = await response.json();

        console.log('[Store Images API] Success! Response:', JSON.stringify(data).substring(0, 200) + '...');

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
