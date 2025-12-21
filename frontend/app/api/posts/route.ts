/**
 * POST /api/posts - Create a new community post / Search posts
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

interface SearchPostsRequest {
    storeName?: string;
    fromDate?: string;
    toDate?: string;
    provinceId?: string;
    wardId?: string;
    sportId?: string;
}

/**
 * Transform backend Post data to frontend format
 * Maps backend fields to CommunityPost interface
 */
function transformPost(post: any) {
    return {
        id: post.id || post._id,
        title: post.title,
        description: post.description || '',
        poster: {
            id: post.poster?.id || post.posterId || post.userId || '',
            name: post.poster?.name || 'Unknown',
            email: post.poster?.email || '',
            avatarUrl: post.poster?.avatarUrl || null,
        },
        requiredNumber: post.requiredNumber || 0,
        currentNumber: post.currentNumber || 0,
        participants: post.participants || null,
        matches: post.matches || [],
        pricePerPerson: post.pricePerPerson || 0,
        timestamp: post.timestamp || new Date().toISOString(),
        comments: post.comments || null,
        store: post.store || null,
        sport: post.sport || null,
    };
}

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isSearchRequest = searchParams.has('page') || searchParams.has('perPage');

        // Handle search request
        if (isSearchRequest) {
            return handleSearchPosts(request);
        }

        // Handle create post request
        return handleCreatePost(request);
    } catch (error) {
        console.error('Error in POST /api/posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handleSearchPosts(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const perPage = searchParams.get('perPage') || '12';

        const body: SearchPostsRequest = await request.json();
        const token = request.headers.get('authorization');
        const backendUrl = process.env.USER_SERVICE_DOMAIN;

        // Build query parameters for backend
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('perPage', perPage);

        // Build request body - only include non-empty fields
        const searchBody: any = {};
        if (body.storeName?.trim()) searchBody.storeName = body.storeName;
        if (body.fromDate?.trim()) searchBody.fromDate = body.fromDate;
        if (body.toDate?.trim()) searchBody.toDate = body.toDate;
        if (body.provinceId?.trim()) searchBody.provinceId = body.provinceId;
        if (body.wardId?.trim()) searchBody.wardId = body.wardId;
        if (body.sportId?.trim()) searchBody.sportId = body.sportId;

        const headers: any = {
            'Content-Type': 'application/json',
        };

        if (token) {
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            headers['Authorization'] = authHeader;
        }

        console.log('🔍 Searching posts');
        console.log('📍 Query params:', `page=${page}&perPage=${perPage}`);
        console.log('📋 Search body:', JSON.stringify(searchBody, null, 2));

        const backendSearchUrl = `${backendUrl}/posts/search?${queryParams.toString()}`;
        console.log('📤 POST to backend:', backendSearchUrl);

        const response = await fetch(backendSearchUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(searchBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', response.status, response.statusText);
            console.error('📨 Error response:', errorText);

            return NextResponse.json(
                { error: 'Failed to search posts', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('✅ Search results received:', Array.isArray(data) ? data.length : Array.isArray(data.data) ? data.data.length : 0, 'posts');

        // Transform posts if needed
        let posts = Array.isArray(data) ? data : data.data || [];
        posts = Array.isArray(posts) ? posts.map(transformPost) : [];

        return NextResponse.json({ data: posts });
    } catch (error) {
        console.error('Error in handleSearchPosts:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

async function handleCreatePost(request: NextRequest) {
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
        console.error('Error in handleCreatePost:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


