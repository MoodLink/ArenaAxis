import { NextRequest, NextResponse } from 'next/server';
import { withCache, CACHE_TIMES } from '@/lib/cache-utils';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(`${API_BASE_URL}/provinces`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			// Next.js automatic caching (Request Memoization + Data Cache)
			cache: 'force-cache',
			next: {
				revalidate: CACHE_TIMES.PROVINCES.maxAge, // Revalidate every 24 hours
				tags: ['provinces-cache']
			}
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		// Add CDN-friendly cache headers
		return withCache(data, CACHE_TIMES.PROVINCES);
	} catch (error) {
		console.error('Error fetching provinces:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch provinces' },
			{ status: 500 }
		);
	}
}
