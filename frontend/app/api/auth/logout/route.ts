import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = `${process.env.USER_SERVICE_DOMAIN}/auth`;

export async function POST(request: NextRequest) {
	const token = request.headers.get('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return NextResponse.json(
			{ error: 'Unauthorized - No token provided' },
			{ status: 401 }
		);
	}

	let response: NextResponse;
	const responseHeaders = { 'Content-Type': 'application/json' }

	try {
		const body = await request.json();
		const fetchResponse = await fetch(`${API_BASE_URL}/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
		});
		if (fetchResponse.status === 204) {
      response = new NextResponse(null, { 
        status: 204 
      });
    } else {
			const data = await fetchResponse.json();

			if (!fetchResponse.ok) {
				console.error(`[API Proxy] Logout error (${fetchResponse.status}):`, data);
				response = new NextResponse(JSON.stringify(data), { status: fetchResponse.status, headers: responseHeaders });
			} else {
				response = new NextResponse(JSON.stringify(data), { status: 200, headers: responseHeaders });
			}
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
		console.error('[API Proxy] Logout error:', errorMessage);
		response = new NextResponse(
			JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
			{ status: 500, headers: responseHeaders }
		);
	}

	return response;
}
