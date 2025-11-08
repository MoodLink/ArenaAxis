// File: app/api/store/images/route.ts
// Proxy API để upload ảnh cho store

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
        const storeId = searchParams.get('storeId');

        if (!storeId) {
            return new Response(
                JSON.stringify({ error: 'storeId is required', message: 'Missing storeId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const formData = await request.formData();

        const response = await fetch(`${API_BASE_URL}/stores/${storeId}/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`POST error (${response.status}):`, errorText);
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload store images';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to upload store images' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
