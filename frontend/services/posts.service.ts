/**
 * Posts Service - Handle community post operations
 */

export interface CreatePostRequest {
    matchIds: string[];
    title: string;
    description: string;
    requiredNumber: number; // Total players needed
    currentNumber: number; // Players already have
    userId: string;
}

export interface PosterInfo {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
}

export interface StoreInfo {
    id: string;
    name: string;
    address: string;
}

export interface SportInfo {
    id: string;
    name: string;
    nameEn?: string;
}

export interface FieldInfo {
    id: string;
    name: string | null;
}

export interface MatchInfo {
    id: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
    field: FieldInfo;
    sport: SportInfo | null;
    price: number;
}

export interface CommunityPostAuthor {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
}

export interface CommunityPost {
    // Match types/index.ts interface
    id: string;
    title: string;
    content: string; // Maps from description
    author: CommunityPostAuthor;
    sport: string;
    location?: string;
    date?: string;
    time?: string;
    level?: string;
    participants?: number; // Maps from currentNumber
    maxParticipants?: number; // Maps from requiredNumber
    cost?: string; // Maps from pricePerPerson
    likes: number;
    comments: number;
    tags: string[];
    createdAt: string; // Maps from timestamp
    status?: string;
    urgency?: string;

    // Backend fields (for reference)
    posterId?: string;
    requiredNumber?: number;
    currentNumber?: number;
    pricePerPerson?: number;
    timestamp?: string;
    matches?: MatchInfo[];
    matchIds?: string[];
    active?: boolean;
    sportId?: string;
    store?: StoreInfo;
}

export interface CreatePostResponse {
    id: string;
    title: string;
    description: string;
    poster: PosterInfo;
    requiredNumber: number;
    currentNumber: number;
    participants: any[] | null;
    matches: MatchInfo[];
    pricePerPerson: number;
    timestamp: string;
    comments: any[] | null;
    store: StoreInfo;
    sport: SportInfo;
}

// Helper function to get token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
}

// Helper function to get API base URL
function getApiBaseUrl(): string {
    return process.env.USER_SERVICE_DOMAIN ? `${process.env.USER_SERVICE_DOMAIN}` : 'http://localhost:3000/api';
}

/**
 * Create a community post
 * @param data - Post creation data
 * @returns Created post response
 */
export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error creating post:', response.status, errorData);
            throw new Error(
                errorData.message ||
                errorData.error ||
                `Failed to create post: ${response.status}`
            );
        }

        const result = await response.json();
        return result.data || result;
    } catch (error) {
        console.error('Error in createPost:', error);
        throw error;
    }
}

/**
 * Get all community posts
 * @returns Array of posts
 */
export async function getCommunityPosts(): Promise<CommunityPost[]> {
    try {
        const token = getToken();
        const url = `/api/posts`;

        console.log('Fetching posts from:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        console.log('Posts response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching posts:', response.status, errorText);
            return [];
        }

        const data = await response.json();
        console.log('Posts data received:', data);
        const posts = data.data || data || [];
        console.log('Returning posts:', Array.isArray(posts) ? posts.length : 0, 'posts');
        return Array.isArray(posts) ? posts : [];
    } catch (error) {
        console.error('Error in getCommunityPosts:', error);
        return [];
    }
}

/**
 * Get a single post by ID
 * @param postId - Post ID
 * @returns Post details
 */
export async function getPostById(postId: string): Promise<CommunityPost> {
    try {
        const token = getToken();

        const response = await fetch(`/api/posts/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error('Error in getPostById:', error);
        throw error;
    }
}

/**
 * Calculate price per person
 * @param totalPrice - Total price
 * @param requiredNumber - Required number of players
 * @returns Price per person
 */
export function calculatePricePerPerson(totalPrice: number, requiredNumber: number): number {
    if (requiredNumber === 0) return 0;
    return Math.round(totalPrice / requiredNumber);
}

/**
 * Calculate needed players
 * @param requiredNumber - Total players needed
 * @param currentNumber - Players already have
 * @returns Number of additional players needed
 */
export function calculateNeededPlayers(requiredNumber: number, currentNumber: number): number {
    return Math.max(0, requiredNumber - currentNumber);
}

/**
 * Validate post creation data
 * @param data - Post creation data to validate
 * @returns Object with isValid flag and error messages
 */
export function validatePostData(data: CreatePostRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
        errors.push('Tiêu đề là bắt buộc');
    }

    if (!data.description?.trim()) {
        errors.push('Mô tả là bắt buộc');
    }

    if (data.matchIds.length === 0) {
        errors.push('Vui lòng chọn ít nhất một trận đấu');
    }

    if (data.requiredNumber <= 0) {
        errors.push('Số người chơi yêu cầu phải lớn hơn 0');
    }

    if (data.currentNumber < 0) {
        errors.push('Số người chơi hiện tại không thể âm');
    }

    if (data.currentNumber > data.requiredNumber) {
        errors.push('Số người chơi hiện tại không thể vượt quá số lượng yêu cầu');
    }

    if (!data.userId?.trim()) {
        errors.push('User ID là bắt buộc');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
