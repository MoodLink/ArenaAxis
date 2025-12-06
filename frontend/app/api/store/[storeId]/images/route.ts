// File: app/api/store/[storeId]/images/route.ts
// Proxy API để upload ảnh cho store - Dynamic route version

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function PUT(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const storeId = params.storeId;

        if (!storeId) {
            return new Response(
                JSON.stringify({ error: 'storeId is required', message: 'Missing storeId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const formData = await request.formData();

        const response = await fetch(`${API_BASE_URL}/stores/${storeId}/images`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`PUT error (${response.status}):`, errorText);

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

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload store images';
        console.error('[API Proxy] Store images upload error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to upload store images' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
