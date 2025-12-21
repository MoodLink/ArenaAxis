import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'API test endpoint works!',
        timestamp: new Date().toISOString(),
    });
}
