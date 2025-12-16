/**
 * POST /api/posts - Create a new community post
 * GET /api/posts - Get all community posts
 */

import { NextRequest, NextResponse } from 'next/server';

interface CreatePostRequest {
    matchIds: string[];
    title: string;
    description: string;
    requiredNumber: number;
    currentNumber: number;
    userId: string;
}

/**
 * Transform backend Post data to frontend format
 * Maps backend fields to CommunityPost interface
 */
function transformPost(post: any) {
    return {
        // Required CommunityPost fields
        id: post._id || post.id,
        title: post.title,
        content: post.description || '',
        author: {
            id: post.posterId || post.userId || '',
            name: post.poster?.name || post.author?.name || 'Unknown',
            email: post.poster?.email || post.author?.email || '',
            avatarUrl: post.poster?.avatarUrl || post.author?.avatarUrl || null,
        },
        sport: post.sport?.name || post.sportId || 'Unknown',
        participants: post.currentNumber || 0,
        maxParticipants: post.requiredNumber || 0,
        cost: post.pricePerPerson ? `${post.pricePerPerson}đ` : '0đ',
        likes: 0,
        comments: post.comments?.length || 0,
        tags: [],
        createdAt: post.timestamp || new Date().toISOString(),

        // Optional CommunityPost fields
        location: post.store?.address || post.location,
        status: post.active ? 'active' : 'inactive',

        // Backend fields (for reference)
        posterId: post.posterId,
        requiredNumber: post.requiredNumber,
        currentNumber: post.currentNumber,
        pricePerPerson: post.pricePerPerson,
        timestamp: post.timestamp,
        matches: post.matches,
        matchIds: post.matchIds,
        active: post.active,
        sportId: post.sportId,
        store: post.store,
    };
}

export async function GET(request: NextRequest) {
    try {
        let token = request.headers.get('authorization');
        const backendUrl = process.env.USER_SERVICE_DOMAIN;

        console.log('Fetching posts from backend:', `${backendUrl}/posts`);

        const headers: any = {
            'Content-Type': 'application/json',
        };

        if (token) {
            // Ensure Bearer prefix
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(`${backendUrl}/posts`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            console.error('Backend error:', response.status, response.statusText);
            return NextResponse.json(
                { error: 'Failed to fetch posts from backend' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Posts data from backend:', data);

        // Transform the data - handle both array and object with data property
        let posts = Array.isArray(data) ? data : data.data || [];
        posts = Array.isArray(posts) ? posts.map(transformPost) : [];

        return NextResponse.json({ data: posts });
    } catch (error) {
        console.error('Error in GET /api/posts:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        let token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body: CreatePostRequest = await request.json();

        // Validate required fields
        if (!body.matchIds || body.matchIds.length === 0) {
            return NextResponse.json(
                { error: 'Match IDs are required' },
                { status: 400 }
            );
        }

        if (!body.title?.trim()) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        if (!body.userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Call backend API
        const backendUrl = process.env.USER_SERVICE_DOMAIN;

        // Ensure Bearer prefix
        const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

        console.log('📤 POST to backend:', `${backendUrl}/posts`);
        console.log('📋 Request body:', JSON.stringify(body, null, 2));
        console.log('🔐 Token format:', `${authHeader.substring(0, 40)}...`);

        const response = await fetch(
            `${backendUrl}/posts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', response.status, response.statusText);
            console.error('📨 Error response:', errorText);

            let errorData: any = {};
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            return NextResponse.json(
                {
                    error: errorData?.error || errorData?.message || 'Failed to create post',
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Backend response:', JSON.stringify(data, null, 2));
        console.log(`🎉 Post created successfully with ID: ${data.id || data._id || 'unknown'}\n`);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST /api/posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


