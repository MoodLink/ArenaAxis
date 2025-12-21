export const API_CONFIG = {
	ENDPOINTS: {
		AUTH: {
			LOGIN: '/auth/login',
			REGISTER: '/auth/register',
			REFRESH: '/auth/refresh',
			LOGOUT: '/auth/logout',
			FORGOT_PASSWORD: '/auth/forgot-password',
			RESET_PASSWORD: '/auth/reset-password',
		},

		// User endpoints
		USERS: {
			PROFILE: '/users/profile',
			UPDATE_PROFILE: '/users/profile',
			CHANGE_PASSWORD: '/users/change-password',
			UPLOAD_AVATAR: '/users/avatar',
		},

		// Fields endpoints
		FIELDS: {
			LIST: '/fields',
			POPULAR: '/fields/popular',
			BY_ID: (id: string) => `/fields/${id}`,
			REVIEWS: (id: string) => `/fields/${id}/reviews`,
			ADD_REVIEW: (id: string) => `/fields/${id}/reviews`,
		},

		// Sports endpoints
		SPORTS: {
			LIST: '/sports',
			BY_ID: (id: string) => `/sports/${id}`,
		},

		// Tournaments endpoints
		TOURNAMENTS: {
			LIST: '/tournaments',
			BY_ID: (id: string) => `/tournaments/${id}`,
			REGISTER: '/tournaments/register',
			MY_TOURNAMENTS: '/tournaments/my',
		},

		// Community endpoints
		COMMUNITY: {
			POSTS: '/community/posts',
			BY_ID: (id: string) => `/community/posts/${id}`,
			CREATE: '/community/posts',
			UPDATE: (id: string) => `/community/posts/${id}`,
			DELETE: (id: string) => `/community/posts/${id}`,
			LIKE: (id: string) => `/community/posts/${id}/like`,
			COMMENTS: (id: string) => `/community/posts/${id}/comments`,
		},

		// Bookings endpoints
		BOOKINGS: {
			LIST: '/bookings',
			BY_ID: (id: string) => `/bookings/${id}`,
			CREATE: '/bookings',
			CANCEL: (id: string) => `/bookings/${id}/cancel`,
			HISTORY: '/bookings/history',
		},

		// Chat/Message endpoints (updated to match backend message-service API)
		MESSAGES: {
			CONVERSATIONS: '/api/messages/conversations',
			MESSAGES: '/api/messages/messages',
			// SEND_MESSAGE: Dùng WebSocket thay vì REST API
			MARK_AS_READ: (conversationId: string) => `/api/messages/conversations/${conversationId}/read`,
		},

		// Legacy chat endpoints (kept for compatibility)
		CHAT: {
			ROOMS: '/chat/rooms',
			MESSAGES: (roomId: string) => `/chat/rooms/${roomId}/messages`,
			SEND_MESSAGE: (roomId: string) => `/chat/rooms/${roomId}/messages`,
			CREATE_ROOM: '/chat/rooms',
		},

		// Payment endpoints
		PAYMENT: {
			PROCESS: '/payments/process',
			HISTORY: '/payments/history',
			VERIFY: '/payments/verify',
		},

		// File upload endpoints
		UPLOAD: {
			IMAGE: '/upload/image',
			DOCUMENT: '/upload/document',
		}
	}
}

// Request interceptor for adding auth token
export const authInterceptor = (config: any) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}

// Response interceptor for handling errors
export const responseInterceptor = {
	success: (response: any) => response,
	error: (error: any) => {
		if (error.response?.status === 401) {
			// Redirect to login
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
}

// Environment-specific configurations
export const ENV_CONFIG = {
	development: {
		API_URL: 'http://localhost:3000/api',
		DEBUG: true,
	},
	production: {
		API_URL: 'https://api.kickoffapp.com',
		DEBUG: false,
	},
	staging: {
		API_URL: 'https://staging-api.kickoffapp.com',
		DEBUG: true,
	}
}
