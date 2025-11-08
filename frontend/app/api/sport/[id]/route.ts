// File: app/api/sport/[id]/route.ts
// Proxy API cho detail, update, delete môn thể thao

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);

        const response = await fetch(`${API_BASE_URL}/sports/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`GET error (${response.status}):`, errorText);
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sport';
        console.error('GET /api/sport/[id] error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch sport' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();

        console.log(`PATCH /api/sport/${id}`, JSON.stringify(body));

        const response = await fetch(`${API_BASE_URL}/sports/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`PATCH error (${response.status}):`, errorText);
            throw new Error(`API responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update sport';
        console.error('PATCH error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to update sport' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`DELETE /api/sport/${id}`);

        const response = await fetch(`${API_BASE_URL}/sports/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DELETE error (${response.status}):`, errorText);
            throw new Error(`API responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete sport';
        console.error('DELETE error:', errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to delete sport' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
