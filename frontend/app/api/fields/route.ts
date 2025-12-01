// File: app/api/fields/route.ts
// Proxy API để bypass CORS issue

import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.ORDER_SERVICE_DOMAIN;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/fields/${queryString ? '?' + queryString : ''}`;

    console.log('🔍 Proxying fields request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Backend error (${response.status}):`, errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Fields data received:', data);

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch fields';
    console.error('❌ GET /api/fields error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to fetch fields' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/fields/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error (${response.status}):`, errorText);
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to create field';
    console.error('POST /api/fields error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to create field' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
