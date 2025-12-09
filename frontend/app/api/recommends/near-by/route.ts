// File: app/api/recommends/near-by/route.ts
// API Proxy cho endpoint: POST /recommends/near-by
// Tìm kiếm các Trung tâm thể thao gần vị trí người dùng

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

/**
 * Request body format:
 * {
 *   "latitude": 15.2312,
 *   "longitude": 160.123,
 *   "distance": 10000,      // in meters
 *   "wardName": "Khanh",     // optional
 *   "provinceName": "Ca"     // optional
 * }
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.latitude || !body.longitude) {
            return NextResponse.json(
                {
                    error: 'Missing required fields',
                    message: 'latitude and longitude are required',
                    requiredFields: ['latitude', 'longitude']
                },
                { status: 400 }
            );
        }

        // Distance must be a positive number
        if (body.distance && body.distance <= 0) {
            return NextResponse.json(
                {
                    error: 'Invalid distance',
                    message: 'distance must be greater than 0'
                },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get('authorization');
        const cookieToken = request.cookies.get('token')?.value;
        const token = authHeader || cookieToken;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            headers['Authorization'] = bearerToken;
        }

        // Prepare request payload
        const payload = {
            latitude: body.latitude,
            longitude: body.longitude,
            distance: body.distance || 10000, // Default 10km
            ...(body.wardName && { wardName: body.wardName }),
            ...(body.provinceName && { provinceName: body.provinceName })
        };

        const url = `${API_BASE_URL}/recommends/near-by`;
        console.log(`[API Proxy] POST ${url}`, payload);

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Backend error (${response.status}):`, errorText);

            // Return error response
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            return NextResponse.json(
                {
                    error: errorData.message || `API responded with status: ${response.status}`,
                    status: response.status,
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`[API Proxy] Success: Found ${Array.isArray(data) ? data.length : 'unknown'} nearby stores`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nearby stores';
        console.error('[API Proxy] Error:', errorMessage);
        return NextResponse.json(
            {
                error: errorMessage,
                message: 'Failed to fetch nearby stores',
            },
            { status: 500 }
        );
    }
}
