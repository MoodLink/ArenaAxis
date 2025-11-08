// File: app/api/users/profile/route.ts
// Proxy API cho profile operations - GET my profile, PUT update profile

const API_BASE_URL = 'https://arena-user-service.onrender.com';

export async function GET(request: Request) {
    try {
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const response = await fetch(`${API_BASE_URL}/users/myself`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to fetch profile' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const authToken = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!authToken) {
            return new Response(
                JSON.stringify({ error: 'No auth token provided', message: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/users/myself`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`PUT error (${response.status}):`, errorText);
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
        return new Response(
            JSON.stringify({ error: errorMessage, message: 'Failed to update profile' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
