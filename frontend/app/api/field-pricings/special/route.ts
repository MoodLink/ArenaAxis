// File: app/api/field-pricings/special/route.ts
// Proxy API for special date field pricing management

const API_BASE_URL = process.env.ORDER_SERVICE_DOMAIN;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fieldId = searchParams.get('field_id');

        if (!fieldId) {
            return new Response(
                JSON.stringify({ error: 'field_id is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`[PROXY] Fetching special date pricings for field ${fieldId}...`);

        // Call the backend endpoint to get special date pricings
        // Backend API: GET /api/v1/field-pricings/special/{fieldId}
        const response = await fetch(`${API_BASE_URL}/field-pricings/special/${fieldId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn(`[PROXY] Backend returned ${response.status}`);
            return new Response(
                JSON.stringify({ message: 'No special date pricings found', data: [] }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json();
        console.log('[PROXY] Special date pricings response:', data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch special date pricings';
        console.error('[PROXY] GET /api/field-pricings/special error:', errorMessage);
        return new Response(
            JSON.stringify({
                message: 'No special date pricings found',
                data: []
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('[PROXY] Creating special date pricing with body:', body);

        // Call the new /api/v1/field-pricings/special endpoint
        const response = await fetch(`${API_BASE_URL}/field-pricings/special`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[PROXY] Backend error (${response.status}):`, errorText);

            // Try to parse error as JSON
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || `API responded with status: ${response.status}`);
            } catch {
                throw new Error(`API responded with status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('[PROXY] Success response:', data);

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create special date pricing';
        console.error('[PROXY] POST /api/field-pricings/special error:', errorMessage);
        return new Response(
            JSON.stringify({
                error: errorMessage,
                message: 'Failed to create special date pricing'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
