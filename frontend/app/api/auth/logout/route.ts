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

	const responseHeaders = { 'Content-Type': 'application/json' }

	try {
		let body = {};
		try {
			body = await request.json();
		} catch {
			body = {};
		}

		try {
			const fetchResponse = await fetch(`${API_BASE_URL}/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(5000) // 5 second timeout
			});

			if (fetchResponse.status === 204 || fetchResponse.status === 200) {
				return new NextResponse(JSON.stringify({ success: true }), {
					status: 200,
					headers: responseHeaders
				});
			}
		} catch (backendError) {
			console.warn('[API Proxy] Backend logout failed, but allowing frontend logout:',
				backendError instanceof Error ? backendError.message : 'Unknown error');
		}

		// Even if backend fails, we consider logout successful for the frontend
		return new NextResponse(JSON.stringify({ success: true }), {
			status: 200,
			headers: responseHeaders
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
		console.error('[API Proxy] Logout error:', errorMessage);

		// Return 200 anyway so frontend can proceed with logout
		return new NextResponse(
			JSON.stringify({ success: true, message: 'Logout processed' }),
			{ status: 200, headers: responseHeaders }
		);
	}
}
