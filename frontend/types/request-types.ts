// =================
// REQUEST DTOs - Các interface cho API requests
// Chuẩn bị sẵn để sử dụng khi có backend controllers
// =================

import { Role, ConversationType, DayOfWeek } from './enums'

// AUTH REQUESTS
// =================

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  phone: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface RefreshTokenRequest {
  token: string
}

export interface LogoutRequest {
  token: string
}

// =================
// USER REQUESTS
// =================

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  phone: string
  role?: Role
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  avatarFile?: File
}

export interface UpdateUserProfileRequest {
  name?: string
  phone?: string
  bio?: string
  location?: string
  favoriteSports?: string[]
}

// =================
// STORE REQUESTS
// =================

export interface StoreRegistrationRequest {
  name: string
  address: string
  linkGoogleMap?: string
  introduction?: string
  latitude?: number
  longitude?: number
  startTime: string  // "HH:mm" format
  endTime: string    // "HH:mm" format
  provinceId: string
  wardId: string
  avatarFile?: File
  coverImageFile?: File
  businessLicenseImageFile?: File
  mediaFiles?: File[]
}

export interface UpdateStoreRequest {
  name?: string
  address?: string
  linkGoogleMap?: string
  introduction?: string
  latitude?: number
  longitude?: number
  startTime?: string
  endTime?: string
  provinceId?: string
  wardId?: string
}

export interface StoreSearchRequest {
  keyword?: string
  provinceId?: string
  wardId?: string
  sportId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: 'rating' | 'price' | 'viewCount' | 'orderCount'
  sortOrder?: 'asc' | 'desc'
}

// =================
// FIELD REQUESTS
// =================

export interface CreateFieldRequest {
  name: string
  sportId: string
  defaultPrice: number
  active?: boolean
}

export interface UpdateFieldRequest {
  name?: string
  sportId?: string
  defaultPrice?: number
  active?: boolean
}

// =================
// FIELD PRICE REQUESTS
// =================

export interface CreateFieldPriceRequest {
  fieldId: string
  price: number
  dayOfWeeks: DayOfWeek[]
  startAt: string  // "HH:mm" format
  endAt: string    // "HH:mm" format
}

export interface UpdateFieldPriceRequest {
  price?: number
  dayOfWeeks?: DayOfWeek[]
  startAt?: string
  endAt?: string
}

// =================
// RATING REQUESTS
// =================

export interface CreateRatingRequest {
  storeId: string
  star: number  // 1-5
  comment: string
  mediaFiles?: File[]
}

export interface UpdateRatingRequest {
  star?: number
  comment?: string
  // Note: Media update might need separate endpoint
}

// =================
// BOOKING REQUESTS
// =================

export interface CreateBookingRequest {
  fieldId: string
  date: string        // "YYYY-MM-DD" format
  startTime: string   // "HH:mm" format
  endTime: string     // "HH:mm" format
  note?: string
}

export interface UpdateBookingRequest {
  date?: string
  startTime?: string
  endTime?: string
  note?: string
}

export interface CancelBookingRequest {
  bookingId: string
  reason?: string
}

// =================
// CONVERSATION/CHAT REQUESTS
// =================

export interface CreateConversationRequest {
  name?: string
  type: ConversationType
  participantUserIds: string[]  // List of user IDs to add to conversation
}

export interface SendMessageRequest {
  conversationId: string
  content: string
}

export interface AddParticipantRequest {
  conversationId: string
  userId: string
}

export interface RemoveParticipantRequest {
  conversationId: string
  userId: string
}

export interface UpdateConversationRequest {
  name?: string
}

// =================
// BANK ACCOUNT REQUESTS
// =================

export interface CreateBankAccountRequest {
  name: string
  number: string
  bankId: string
}

export interface UpdateBankAccountRequest {
  name?: string
  number?: string
  bankId?: string
}

// =================
// BANK REQUESTS (Admin only)
// =================

export interface CreateBankRequest {
  name: string
  logoFile?: File
}

export interface UpdateBankRequest {
  name?: string
  logoFile?: File
}

// =================
// SPORT REQUESTS (Admin only)
// =================

export interface CreateSportRequest {
  id: string        // Manual ID input
  name: string
  nameEn?: string
}

export interface UpdateSportRequest {
  name?: string
  nameEn?: string
}

// =================
// OPTIONAL PLAN REQUESTS
// =================

export interface CreateOptionalPlanRequest {
  name: string
  description?: string
  price: number
}

export interface UpdateOptionalPlanRequest {
  name?: string
  description?: string
  price?: number
}

export interface PurchaseOptionalPlanRequest {
  storeId: string
  optionalPlanId: string
}

// =================
// STORE FAVOURITE REQUESTS
// =================

export interface AddStoreFavouriteRequest {
  storeId: string
}

// Note: Remove không cần request body, chỉ cần storeId trong URL

// =================
// TOURNAMENT REQUESTS (Chờ backend)
// =================

export interface CreateTournamentRequest {
  name: string
  sport: string
  startDate: string
  endDate: string
  location: string
  prizePool: number
  maxTeams: number
  description: string
  imageFile?: File
}

export interface UpdateTournamentRequest {
  name?: string
  sport?: string
  startDate?: string
  endDate?: string
  location?: string
  prizePool?: number
  maxTeams?: number
  description?: string
  imageFile?: File
}

export interface RegisterTournamentRequest {
  tournamentId: string
  teamName?: string
  teamMembers?: string[]
}

// =================
// COMMUNITY POST REQUESTS (Chờ backend)
// =================

export interface CreateCommunityPostRequest {
  title: string
  content: string
  sport: string
  location?: string
  date?: string
  time?: string
  level?: string
  maxParticipants?: number
  cost?: string
  tags?: string[]
}

export interface UpdateCommunityPostRequest {
  title?: string
  content?: string
  sport?: string
  location?: string
  date?: string
  time?: string
  level?: string
  maxParticipants?: number
  cost?: string
  tags?: string[]
}

// =================
// MEDIA UPLOAD REQUESTS
// =================

export interface UploadMediaRequest {
  file: File
  mediaType?: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
}

// =================
// PAGINATION REQUESTS
// =================

export interface PaginationRequest {
  page: number      // 0-indexed
  pageSize: number  // số items per page
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// =================
// FILTER/SEARCH REQUESTS
// =================

export interface DateRangeFilter {
  startDate: string  // "YYYY-MM-DD"
  endDate: string    // "YYYY-MM-DD"
}

export interface PriceRangeFilter {
  minPrice: number
  maxPrice: number
}

export interface RatingFilter {
  minRating: number  // 0-5
  maxRating?: number
}
