// File: app/api/field-pricings/special/get/route.ts
// Proxy API for GET special date field pricing

const API_BASE_URL = process.env.ORDER_SERVICE_DOMAIN;

export async function GET(request: Request) {
    try {
        // Get field_id from query params
        const { searchParams } = new URL(request.url);
        const fieldId = searchParams.get('field_id');

        if (!fieldId) {
            return new Response(
                JSON.stringify({ error: 'field_id is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`[PROXY] Fetching special date pricings for fieldId: ${fieldId}`);

        // Call the backend API
        const response = await fetch(`${API_BASE_URL}/field-pricings/special/${fieldId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[PROXY] Backend error (${response.status}):`, errorText);

            // If 404, just return empty data
            if (response.status === 404) {
                return new Response(
                    JSON.stringify({
                        message: 'No special date pricings found',
                        data: []
                    }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[PROXY] Special pricings response:`, data);

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch special date pricings';
        console.error('[PROXY] GET /api/field-pricings/special error:', errorMessage);
        return new Response(
            JSON.stringify({
                error: errorMessage,
                message: 'Failed to fetch special date pricings',
                data: []
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
