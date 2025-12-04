// File: app/api/users/route.ts
// Proxy endpoint for /users from backend
// Handles authorization issues with fallback gracefully
// Note: GET /users requires ADMIN role, so this provides fallback data

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get('page') || '0';
		const pageSize = searchParams.get('pageSize') || '30';

		// Get token from cookies or headers
		const token = request.headers.get('authorization') || request.cookies.get('token')?.value;

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
		};

		if (token) {
			headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
		}

		console.log(`[API Proxy] GET /users?page=${page}&pageSize=${pageSize}`);

		const response = await fetch(
			`${API_BASE_URL}/users?page=${page}&pageSize=${pageSize}`,
			{
				method: 'GET',
				headers,
			}
		);

		if (!response.ok) {
			console.error(
				`[API Proxy] Backend error: ${response.status} ${response.statusText}`
			);

			// Handle 403 (Forbidden) - user doesn't have ADMIN role
			if (response.status === 403) {
				console.warn('[API Proxy] Access Denied - User may not have ADMIN role');
				return NextResponse.json(
					{
						success: false,
						message: 'Access Denied - Cần quyền ADMIN để xem danh sách người dùng',
						data: [],
						fallback: true,
						reason: 'ADMIN_ROLE_REQUIRED',
					},
					{ status: 200 } // Return 200 to prevent cascade errors
				);
			}

			// Handle 401 (Unauthorized) - no token or invalid token
			if (response.status === 401) {
				console.warn('[API Proxy] Unauthorized - No valid token');
				return NextResponse.json(
					{
						success: false,
						message: 'Unauthorized - Vui lòng đăng nhập',
						data: [],
						fallback: true,
						reason: 'UNAUTHORIZED',
					},
					{ status: 200 }
				);
			}

			// Handle other errors with fallback
			return NextResponse.json(
				{
					success: false,
					message: `Backend error: ${response.status}`,
					data: [],
					fallback: true,
					reason: 'BACKEND_ERROR',
				},
				{ status: 200 }
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		console.error('[API Proxy] Error:', error.message);

		// Return fallback response instead of error
		return NextResponse.json(
			{
				success: false,
				message: error.message,
				data: [],
				fallback: true,
				reason: 'PROXY_ERROR',
			},
			{ status: 200 }
		);
	}
}
