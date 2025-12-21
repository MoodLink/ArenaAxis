import { NextRequest } from "next/server";

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function POST(request: NextRequest) {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};

	try {
		// Backend expect { token: "..." } trong body, KHÔNG phải Authorization header
		const body = await request.json();

		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: 'POST',
			headers: {
				...headers,
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			console.error(`[API Proxy] Refresh error (${response.status}):`, data);
			return new Response(JSON.stringify(data), {
				status: response.status,
				headers,
			});
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';
		console.error('[API Proxy] Refresh error:', errorMessage);
		return new Response(
			JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
			{ status: 500, headers }
		);
	}
}
