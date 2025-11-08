// File: app/api/subscriptions/route.ts
// Proxy API cho subscription operations - main plan purchase, optional plan purchase

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

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
        const type = searchParams.get('type') || 'main'; // 'main' or 'optional'

        const body = await request.json();

        const endpoint = type === 'optional' ? '/optional-plans/purchase' : '/subscriptions/main-plan';

        console.log(`[API Proxy] POST ${endpoint}`);
        console.log(`[API Proxy] Request body:`, JSON.stringify(body));
        console.log(`[API Proxy] Backend URL: ${API_BASE_URL}${endpoint}`);
        console.log(`[API Proxy] Auth token present: ${!!authToken}`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        console.log(`[API Proxy] Response status: ${response.status}`);
        console.log(`[API Proxy] Response ok: ${response.ok}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);

            // Preserve original status code and error response
            try {
                const errorData = JSON.parse(errorText);
                console.error(`[API Proxy] Parsed error data:`, errorData);
                return new Response(
                    JSON.stringify(errorData),
                    { status: response.status, headers: { 'Content-Type': 'application/json' } }
                );
            } catch {
                console.error(`[API Proxy] Failed to parse error, returning raw text`);
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

        // Handle empty response (204 No Content or ResponseEntity<Void>)
        const contentLength = response.headers.get('content-length');
        const text = await response.text();

        console.log(`[API Proxy] Response content-length: ${contentLength}`);
        console.log(`[API Proxy] Response body length: ${text.length}`);

        if (!text || text.trim() === '') {
            console.log(`[API Proxy] Empty response body - subscription created successfully`);
            return new Response(
                JSON.stringify({ success: true, message: 'Subscription created successfully' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = JSON.parse(text);

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to purchase plan';
        console.error('POST /api/subscriptions error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to purchase plan' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
