// =================
// API Service layer - MỚI - Match với backend controllers
// File này chứa đầy đủ API functions theo controllers đã có
// Controllers chưa có sẽ được comment out
// ĐÃ CHUYỂN TỪ MOCK DATA SANG REAL API CALLS
// =================

import {
  AuthenticationResponse,
  RefreshResponse,
  UserResponse,
  BankAccountResponse,
  BankResponse,
  ProvinceResponse,
  WardResponse,
  StoreSearchItemResponse,
  StoreAdminDetailResponse,
  StoreClientDetailResponse,
  MediaResponse,
  ErrorResponse,
  Sport,
  Tournament,
  CommunityPost,
  Booking,
  ChatRoom,
  ChatMessage,
  Review,
  Field,
  OptionalPlan,
  ApplyOptionalPlan,
  StoreRegistrationRequest,
  StoreRegistrationResponse,
  OptionalPlanPurchaseRequest,
  OptionalPlanPurchaseResponse
} from '@/types';
import { getMyProfile } from './get-my-profile';

// Import mock data for stores - TEMPORARY: File is empty, will use inline fallback
// import { mockStoreSearchItems, mockStoreDetails } from '@/data/mockStores';

const API_BASE_URL = process.env.USER_SERVICE_DOMAIN;

// Helper function để lấy token từ localStorage
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    // Try both token keys
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  }
  return null;
}

/**
 * Helper function để gửi authenticated requests với automatic token refresh
 * Nếu token hết hạn, sẽ tự động refresh và retry request
 */
async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  // Thêm Authorization header nếu có token
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response = await fetch(url, options);

  // Nếu nhận được 401 Unauthorized, thử refresh token và retry
  if (response.status === 401 && token) {
    console.log('Token expired (401), attempting to refresh...');

    try {
      // Refresh token via proxy to avoid CORS
      const refreshResponse = await fetch(`/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (refreshResponse.ok) {
        const refreshData: RefreshResponse = await refreshResponse.json();

        if (refreshData.token) {
          // Lưu token mới
          localStorage.setItem('token', refreshData.token);

          // Retry request với token mới
          const newToken = refreshData.token;
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          };

          console.log('Token refreshed successfully, retrying request...');
          response = await fetch(url, options);
        }
      } else {
        console.warn('Token refresh failed, redirecting to login...');
        // Token refresh failed, clear auth data and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      // Clear auth data and redirect to login on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  }

  return response;
}

// =================
// AUTH SERVICES - Match AuthenticationController 
// =================

// Đăng nhập user
export async function loginUser(email: string, password: string): Promise<AuthenticationResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/login?type=user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
}

// Đăng nhập client/owner
export async function loginClient(email: string, password: string): Promise<AuthenticationResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/login?type=client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
}

// Đăng nhập admin
export async function loginAdmin(email: string, password: string): Promise<AuthenticationResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/login?type=admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
}

// Refresh token
export async function refreshToken(token: string): Promise<RefreshResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Refresh token thất bại');
  }

  return response.json();
}

// Logout
export async function logout(token: string): Promise<void> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng xuất thất bại');
  }
}

// =================
// USER SERVICES - Match UserController 
// =================

// Đăng ký user
export async function signupUser({ name, email, password, phone }: { name: string; email: string; password: string; phone?: string }): Promise<UserResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng ký thất bại');
  }

  return response.json();
}

// Lấy thông tin user theo ID
export async function getUserById(id: string): Promise<UserResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Thêm Authorization header nếu có token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/users/${id}`, {
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin user thất bại');
  }

  return response.json();
}

// Lấy danh sách users với phân trang
export async function getUsers(page: number = 0, pageSize: number = 30): Promise<UserResponse[]> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Use NextJS proxy endpoint to bypass backend 500 errors
    const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      console.error('Failed to get users:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    // If backend returned fallback data
    if (data.fallback) {
      console.warn('Using fallback data for users:', data.message);
      return data.data || [];
    }

    // If response is directly the array
    if (Array.isArray(data)) {
      return data;
    }

    // If response has data property
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error: any) {
    console.error('Error getting users:', error.message);
    return [];
  }
}

// Toggle active status của user (Admin only)
export async function toggleUserActive(id: string): Promise<UserResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/users/toggle-active`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ userId: id })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cập nhật trạng thái user thất bại');
  }

  return response.json();
}

// Xóa user (Admin only)
export async function deleteUser(id: string): Promise<void> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Xóa user thất bại');
  }
}

// Lấy profile của người khác (optional auth)
export async function getUserProfile(userId: string): Promise<UserResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/users/${userId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy profile người dùng thất bại');
  }

  return response.json();
}

// Cập nhật profile của mình (require auth) - backend chưa có, dùng mock
export async function updateMyProfile(data: Partial<UserResponse>): Promise<UserResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập');
  }

  try {
    const response = await fetchWithTokenRefresh(`/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Fallback: save to localStorage khi backend chưa ready
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updated = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      }
      throw new Error('Cập nhật profile thất bại');
    }

    return response.json();
  } catch (error: any) {
    // Mock: save to localStorage
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updated = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
    throw error;
  }
}

// Đổi mật khẩu (require auth) - backend chưa có, dùng mock
export async function changeMyPassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập');
  }

  try {
    const response = await fetchWithTokenRefresh(`/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Mock response
      return {
        success: true,
        message: 'Đổi mật khẩu thành công (mock)'
      };
    }

    return response.json();
  } catch (error: any) {
    // Mock: always success
    return {
      success: true,
      message: 'Đổi mật khẩu thành công (mock)'
    };
  }
}

// =================
// SPORT SERVICES - Match SportController 
// =================

// Lấy danh sách tất cả môn thể thao
export async function getSports(): Promise<Sport[]> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/sport`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách môn thể thao thất bại');
  }

  return response.json();
}

// Lấy môn thể thao theo ID
export async function getSportById(id: string): Promise<Sport> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/sport/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin môn thể thao thất bại');
  }

  return response.json();
}

// Tạo môn thể thao mới (Admin only)
export async function createSport(request: { name: string; nameEn?: string }): Promise<Sport> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/sport`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tạo môn thể thao thất bại');
  }

  return response.json();
}

// Cập nhật môn thể thao (Admin only)
export async function updateSport(id: string, request: { name?: string; nameEn?: string }): Promise<Sport> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/sport/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cập nhật môn thể thao thất bại');
  }

  return response.json();
}

// =================
// STORE SERVICES - Using Mock Data (Backend return null)
// =================

// Helper: Simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Lấy danh sách stores với phân trang (không filter)
// Backend: GET /stores với query params page và perPage
export async function getStores(
  page: number = 0,
  perPage: number = 20
): Promise<StoreSearchItemResponse[]> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    // Backend sử dụng 1-indexed pagination, frontend sử dụng 0-indexed
    const backendPage = page + 1;

    const response = await fetch(
      `/api/store?page=${backendPage}&perPage=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.warn('Backend not available, returning empty array');
      return [];
    }

    const stores: StoreSearchItemResponse[] = await response.json();
    console.log(`Stores: Found ${stores.length} stores from API (page ${backendPage})`);

    return stores;

  } catch (error) {
    console.error('Error fetching stores:', error);
    console.warn('Backend not available, returning empty array');
    return [];
  }
}

// Tìm kiếm stores với phân trang và filters
// Backend: POST /stores/search với SearchStoreRequest body
export async function searchStores(
  searchRequest: {
    name?: string;
    address?: string;
    wardId?: string;
    provinceId?: string;
    sportId?: string;
    price?: {
      min?: number;
      max?: number;
    };
  },
  page: number = 0,
  perPage: number = 20
): Promise<StoreSearchItemResponse[]> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    // Backend sử dụng 1-indexed pagination, frontend sử dụng 0-indexed
    const backendPage = page + 1;

    const response = await fetch(
      `/api/store/search?page=${backendPage}&perPage=${perPage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest),
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.warn('Backend not available, returning empty array');
      return [];
    }

    const stores: StoreSearchItemResponse[] = await response.json();
    console.log(` Search: Found ${stores.length} stores from API (page ${backendPage})`);

    return stores;

  } catch (error) {
    console.error('Error searching stores:', error);
    console.warn('Backend not available, returning empty array');
    return [];
  }
}

// Admin search stores với thêm filter approvable
// Backend: POST /stores/admin-search với filters: name, wardId, provinceId, sportId, approvable
export async function adminSearchStores(
  searchRequest: {
    name?: string;
    wardId?: string;
    provinceId?: string;
    sportId?: string;
    approvable?: boolean;
  },
  page: number = 0,
  perPage: number = 12
): Promise<StoreSearchItemResponse[]> {
  try {
    const token = getToken();
    if (!token) {
      console.error('No auth token for admin search');
      return [];
    }

    // Backend sử dụng 1-indexed pagination, frontend sử dụng 0-indexed
    const backendPage = page + 1;
    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    const response = await fetch(
      `/api/store/admin-search?page=${backendPage}&perPage=${perPage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
        body: JSON.stringify(searchRequest),
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.warn('Backend not available, returning empty array');
      return [];
    }

    const stores: StoreSearchItemResponse[] = await response.json();
    console.log(`Admin Search: Found ${stores.length} stores from API (page ${backendPage})`);

    return stores;

  } catch (error) {
    console.error('Error searching stores (admin):', error);
    console.warn('Backend not available, returning empty array');
    return [];
  }
}

export async function getStoreById(id: string): Promise<StoreClientDetailResponse | null> {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Thêm Authorization header nếu có token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `/api/store/${id}`,
      {
        method: 'GET',
        headers,
      }
    );

    // Kiểm tra response status trước
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`, {
        storeId: id,
        url: `/api/store/${id}`
      });
      return null;
    }

    const data = await response.json();

    if (data.success === false || data.error) {
      console.error(`API error: ${data.status || response.status} - ${data.message}`, {
        storeId: id,
        url: `/api/store/${id}`
      });
      return null;
    }

    const storeDetail: StoreClientDetailResponse = data;
    console.log(` Store detail từ API: ${storeDetail.name}`);
    return storeDetail;

  } catch (error) {
    console.error('Error fetching store detail:', error);
    return null;
  }
}

// Cập nhật thông tin Store
export async function updateStoreInfo(
  storeId: string,
  updateData: Partial<StoreAdminDetailResponse>
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    const token = getToken();
    if (!token) {
      console.error('No authentication token');
      return {
        success: false,
        message: 'Vui lòng đăng nhập'
      };
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Prepare update data
    const payload = {
      name: updateData.name,
      introduction: updateData.introduction || null,
      address: updateData.address,
      linkGoogleMap: updateData.linkGoogleMap || null,
      startTime: updateData.startTime || null,
      endTime: updateData.endTime || null,
      wardId: (updateData as any)?.wardId || null,
      latitude: (updateData as any)?.latitude || null,
      longitude: (updateData as any)?.longitude || null,
    };

    console.log('Updating store:', storeId, payload);

    const response = await fetch(
      `/api/store/${storeId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error: ${response.status} ${response.statusText}`, errorData);
      return {
        success: false,
        message: errorData?.message || `Lỗi cập nhật: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('Store updated successfully:', result);
    return {
      success: true,
      message: 'Cập nhật thông tin Trung tâm thể thao thành công',
      data: result
    };

  } catch (error: any) {
    console.error('Error updating store:', error);
    return {
      success: false,
      message: error?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
    };
  }
}

// Đăng ký Store mới cho USER
export async function registerStore(request: StoreRegistrationRequest): Promise<StoreRegistrationResponse> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    // Step 1: Create store with JSON data ONLY - images will be handled separately in Step 2
    const storeData = {
      name: request.name,
      introduction: request.introduction || null,
      address: request.address,
      startTime: request.startTime,
      endTime: request.endTime,
      wardId: request.wardId,
      linkGoogleMap: request.linkGoogleMap || null,
      utilities: request.amenities || [],
      // latitude: request.latitude || null,
      // longitude: request.longitude || null
    };

    const token = getToken();
    if (!token) {
      return {
        success: false,
        message: 'Bạn cần đăng nhập để đăng ký Trung tâm thể thao'
      };
    }

    const createResponse = await fetch(`/api/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(storeData)
    });

    if (!createResponse.ok) {
      let errorMessage = 'Failed to register store';

      // Try to parse error response
      try {
        const errorData = await createResponse.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Response body is empty or not JSON
        if (createResponse.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
        } else if (createResponse.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện thao tác này';
        } else {
          errorMessage = `Lỗi ${createResponse.status}: ${createResponse.statusText}`;
        }
      }

      return {
        success: false,
        message: errorMessage
      };
    }

    const createdStore = await createResponse.json();
    const storeId = createdStore.id;

    // NOTE: Images will be uploaded in a separate step (Step 2) using updateStoreImages()
    // This allows users to skip image upload or update images later using "Cập nhật sau" button

    return {
      success: true,
      message: 'Store registration submitted successfully',
      storeId: storeId,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error registering store:', error);
    return {
      success: false,
      message: 'An error occurred while registering store'
    };
  }
}

// Upload/Update ảnh cho Store (gọi riêng sau khi tạo store)
export async function updateStoreImages(
  storeId: string,
  images: {
    avatar?: File;
    coverImage?: File;
    businessLicenseImage?: File;
    medias?: File[];
  }
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    const token = getToken();
    if (!token) {
      console.error('No authentication token');
      return {
        success: false,
        message: 'Vui lòng đăng nhập'
      };
    }

    console.log('Token:', token.substring(0, 20) + '...');
    console.log('Store ID:', storeId);

    const hasFiles = images.avatar || images.coverImage || images.businessLicenseImage || (images.medias && images.medias.length > 0);
    if (!hasFiles) {
      console.warn('No files provided to upload');
      return {
        success: false,
        message: 'Vui lòng chọn ít nhất một ảnh để upload'
      };
    }

    const formData = new FormData();

    if (images.avatar) {
      formData.append('avatar', images.avatar);
      console.log(`Avatar: ${images.avatar.name} (${(images.avatar.size / 1024).toFixed(1)}KB)`);
    }
    if (images.coverImage) {
      formData.append('coverImage', images.coverImage);
      console.log(`Cover: ${images.coverImage.name} (${(images.coverImage.size / 1024).toFixed(1)}KB)`);
    }
    if (images.businessLicenseImage) {
      formData.append('businessLicenceImage', images.businessLicenseImage);
      console.log(`License: ${images.businessLicenseImage.name} (${(images.businessLicenseImage.size / 1024).toFixed(1)}KB)`);
    }
    if (images.medias && images.medias.length > 0) {
      images.medias.forEach((media, index) => {
        formData.append('medias', media);
        console.log(`Media ${index + 1}: ${media.name} (${(media.size / 1024).toFixed(1)}KB)`);
      });
    }

    let totalSize = 0;
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        totalSize += value.size;
      }
    }
    console.log(`Total upload size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
    console.log(' Uploading to:', `/api/store/images?storeId=${storeId}`);

    const response = await fetch(`/api/store/images?storeId=${storeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log(' Response status:', response.status);
    console.log(' Response statusText:', response.statusText);
    console.log(' Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Có lỗi xảy ra khi upload ảnh';
      let errorBody = '';

      try {
        errorBody = await response.text();
        console.error('Error response body:', errorBody);

        // Kiểm tra xem response có phải JSON không
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          try {
            const jsonError = JSON.parse(errorBody);
            errorMessage = jsonError.message || jsonError.error || errorMessage;
            console.error('Error details:', jsonError);
          } catch (e) {
            console.error('Failed to parse JSON error:', e);
          }
        } else {
          // Xử lý response không phải JSON
          if (response.status === 401) {
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (response.status === 403) {
            errorMessage = 'Không có quyền truy cập!\n' +
              '• Bạn cần đăng nhập với tài khoản CLIENT/OWNER\n' +
              '• Hoặc Trung tâm thể thao này không thuộc về bạn\n' +
              '• Vui lòng kiểm tra token và role';
            console.error('Authorization denied. Check:');
            console.error('   - Token valid?');
            console.error('   - User has CLIENT/OWNER role?');
            console.error('   - Store belongs to this user?');
          } else if (response.status === 404) {
            errorMessage = 'Trung tâm thể thao không tồn tại';
          } else if (response.status === 400) {
            errorMessage = 'Dữ liệu không hợp lệ. ' + errorBody;
          } else if (response.status === 413) {
            errorMessage = 'Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn (max 2MB mỗi ảnh)';
          } else if (response.status === 415) {
            errorMessage = 'Định dạng file không được hỗ trợ. Vui lòng chọn file ảnh (JPG, PNG, WebP)';
          } else if (response.status === 500) {
            // Kiểm tra nếu là lỗi file size
            if (errorBody.includes('MaxUploadSizeExceededException') ||
              errorBody.includes('upload size exceeded') ||
              errorBody.includes('maximum upload size')) {
              errorMessage = 'File quá lớn! Backend chỉ cho phép upload file tối đa 1-2MB. Vui lòng:\n' +
                '• Chọn ảnh nhỏ hơn (< 2MB)\n' +
                '• Hoặc nén ảnh trước khi upload';
            } else if (errorBody.includes('AuthorizationDeniedException') ||
              errorBody.includes('Access Denied')) {
              errorMessage = 'Lỗi phân quyền!\n' +
                '• Backend từ chối truy cập\n' +
                '• Cần đăng nhập với role CLIENT hoặc OWNER\n' +
                '• Store phải thuộc về user hiện tại';
            } else {
              errorMessage = 'Lỗi server: ' + (errorBody.substring(0, 200) || 'Unknown');
            }
          } else {
            errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
          }
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      console.error('Upload failed:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }

    let data;
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = {};
      }
    } catch (e) {
      console.warn('Response is not valid JSON');
      data = {};
    }

    console.log('Upload request accepted! Backend will process images asynchronously. Response:', data);
    return {
      success: true,
      message: 'Upload ảnh thành công (xử lý ở background)',
      data
    };
  } catch (error) {
    console.error('Error uploading store images:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload ảnh'
    };
  }
}

// Lấy thông tin store của user hiện tại
export async function getMyStore(): Promise<StoreAdminDetailResponse | null> {
  try {
    const token = getToken();
    if (!token) {
      console.warn('No token - user not logged in');
      return null;
    }

    const currentUser = getMyProfile()
    if (!currentUser?.id) {
      throw new Error('User ID is undefined');
    }
    const stores = await getStoresByOwnerId(currentUser.id);

    if (stores && stores.length > 0) {
      console.log('Got store:', stores[0].id)
      return stores[0];
    }

    console.log('User has no store yet');
    return null;
  } catch (error) {
    console.error('Error getting my store:', error);
    return null;
  }
}

// Lấy danh sách stores của user theo ID
export async function getUserStores(page: number = 1, perPage: number = 12): Promise<StoreSearchItemResponse[]> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/store?page=${page}&perPage=${perPage}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      console.error('Failed to get user stores:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting user stores:', error);
    return [];
  }
}

// Lấy danh sách Trung tâm thể thao của owner theo owner-id
export async function getStoresByOwnerId(ownerId: string): Promise<StoreAdminDetailResponse[]> {
  try {
    const token = getToken();

    // REQUIRED: Token là bắt buộc vì backend yêu cầu @PreAuthorize
    if (!token) {
      console.error('ERROR: No token found! Endpoint /stores/owner/{owner-id} requires authentication!')
      console.error('   localStorage keys:', Object.keys(localStorage))
      return [];
    }

    console.log('Token found:', token.substring(0, 50) + '...')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // REQUIRED
    };

    console.log(` Fetching stores for owner: ${ownerId}`)
    console.log(`Headers:`, { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.substring(0, 30) + '...' })

    const response = await fetch(`/api/store/owner/${ownerId}`, {
      method: 'GET',
      headers
    });

    console.log(`Response status: ${response.status} ${response.statusText}`)

    const data = await response.json();

    if (data.success === false || data.error) {
      let errorMsg = data.message || `${response.status} ${response.statusText}`;
      console.error(`Failed to get stores by owner: ${errorMsg}`);

      if (data.status === 401) {
        console.error(' Error 401: Token invalid or expired - please login again')
      } else if (data.status === 403) {
        console.error(' Error 403: User does not have permission - check user role')
      } else if (data.status === 500) {
        console.error(' Error 500: Server error - check backend logs')
      }

      return [];
    }

    // Kiểm tra response status bình thường
    if (!response.ok) {
      let errorMsg = `${response.status} ${response.statusText}`
      console.error(`Failed to get stores by owner: ${errorMsg}`)

      if (response.status === 401) {
        console.error(' Error 401: Token invalid or expired - please login again')
      } else if (response.status === 403) {
        console.error(' Error 403: User does not have permission - check user role')
      } else if (response.status === 500) {
        console.error(' Error 500: Server error - check backend logs')
      }

      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting stores by owner:', error);
    return [];
  }
}

export async function getMainPlans(): Promise<any[]> {
  try {
    const response = await fetch(`/api/plans?type=main`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.message || 'Lấy danh sách gói dịch vụ thất bại');
    }

    return data
  } catch (error: any) {
    console.error('Error getting main plans:', error)
    throw error
  }
}

export async function purchaseMainPlan(storeId: string, planId: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const token = getToken();
    console.log(`Auth token present: ${!!token}`)

    const body = {
      storeId: storeId,
      mainPlanId: planId
    };
    console.log(` Sending payload:`, body);

    const response = await fetch(`/api/subscriptions?type=main`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });

    console.log(` Response status: ${response.status}`);
    console.log(` Response ok: ${response.ok}`);

    if (!response.ok) {
      let errorData;
      let errorText = '';
      try {
        errorText = await response.text();
        console.error(`Error response body:`, errorText);

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          errorData = JSON.parse(errorText);
        } else {
          errorData = { message: errorText };
        }
      } catch (parseError) {
        console.error(`Failed to parse error response:`, parseError);
        errorData = { message: `HTTP ${response.status}: ${errorText || 'Unknown error'}` };
      }

      console.error(`Error details:`, errorData);
      return {
        success: false,
        message: errorData?.message || errorData?.error || 'Đăng ký gói dịch vụ thất bại'
      }
    }

    // Parse response - might be empty (204) or contain data
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        const text = await response.text();
        if (text && text.trim() !== '') {
          responseData = JSON.parse(text);
        } else {
          responseData = { success: true };
        }
      } catch (e) {
        console.error(`Failed to parse success response:`, e);
        responseData = { success: true };
      }
    } else {
      responseData = { success: true };
    }

    console.log(`Main Plan registered successfully!`)
    return {
      success: true,
      message: `Đã đăng ký gói dịch vụ thành công`,
      data: {
        storeId,
        planId,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    }
  } catch (error: any) {
    console.error('Error registering main plan:', error)
    return {
      success: false,
      message: error?.message || 'Có lỗi xảy ra khi đăng ký gói dịch vụ'
    }
  }
}

export async function getOptionalPlans(): Promise<OptionalPlan[]> {
  // SỬ DỤNG PROXY để bypass CORS
  try {
    const response = await fetch(`/api/plans?type=optional`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.warn('Optional plans API not available, using mock data');
    }
  } catch (error) {
    console.warn('Error getting optional plans, using mock data:', error);
  }

  // Return mock data for development - chỉ với các trường có trong entity
  return [
    {
      id: '1',
      name: 'Gói Cơ bản',
      price: 299000,
      description: 'Gói dành cho các Trung tâm thể thao nhỏ mới bắt đầu'
    },
    {
      id: '2',
      name: 'Gói Tiêu chuẩn',
      price: 599000,
      description: 'Gói phù hợp cho các Trung tâm thể thao trung bình'
    },
    {
      id: '3',
      name: 'Gói Cao cấp',
      price: 999000,
      description: 'Gói dành cho các Trung tâm thể thao lớn và chuyên nghiệp'
    }
  ];
}

// Mua Optional Plan cho Store
export async function purchaseOptionalPlan(request: OptionalPlanPurchaseRequest): Promise<OptionalPlanPurchaseResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  try {
    const response = await fetch(`/api/subscriptions?type=optional`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to purchase optional plan'
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Optional plan purchased successfully',
      applyOptionalPlanId: data.id,
      endDate: data.endDate
    };
  } catch (error) {
    console.error('Error purchasing optional plan:', error);
    return {
      success: false,
      message: 'An error occurred while purchasing optional plan'
    };
  }
}

// Lấy danh sách Optional Plans đã mua của Store
export async function getMyOptionalPlans(storeId: string): Promise<ApplyOptionalPlan[]> {
  // SỬ DỤNG PROXY để bypass CORS
  try {
    const response = await fetch(`/api/subscriptions?type=optional&storeId=${storeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.warn('My optional plans API not available, returning empty array');
    }
  } catch (error) {
    console.warn('Error getting my optional plans, returning empty array:', error);
  }
  return [];
}

// =================
// BANK SERVICES - Match BankController 
// =================

// Lấy danh sách tất cả banks
export async function getBanks(): Promise<BankResponse[]> {
  // SỬ DỤNG PROXY để bypass CORS
  const token = getToken();
  console.log(" getBanks - Token:", token ? "Present" : "Missing");

  const response = await fetch(`/api/banks`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });

  console.log("getBanks - Response status:", response.status);
  console.log("getBanks - Response headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("getBanks - Error response:", errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log("getBanks - Success:", data);
  return data;
}

// Lấy bank theo ID
export async function getBankById(id: string): Promise<BankResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/banks/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin bank thất bại');
  }

  return response.json();
}

// Tạo bank mới (Admin only) - với file upload
export async function createBank(name: string, logo?: File): Promise<BankResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const formData = new FormData();
  formData.append('name', name);
  if (logo) {
    formData.append('logo', logo);
  }

  const response = await fetch(`/api/banks`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tạo bank thất bại');
  }

  return response.json();
}

export async function updateBank(id: string, name: string, logo?: File): Promise<BankResponse> {
  const formData = new FormData();
  formData.append('name', name);
  if (logo) {
    formData.append('logo', logo);
  }

  const response = await fetch(`/api/banks/${id}`, {
    method: 'PATCH',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cập nhật bank thất bại');
  }

  return response.json();
}

export async function createBankAccount(request: { name: string; number: string; bankId: string }): Promise<BankAccountResponse> {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    const response = await fetch(`/api/bank-accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    // Kiểm tra lỗi từ proxy
    if (data.error) {
      throw new Error(data.message || 'Tạo tài khoản ngân hàng thất bại');
    }

    return data;
  } catch (error) {
    console.error('Error creating bank account:', error);
    throw error;
  }
}

// Lấy bank account theo ID
export async function getBankAccountById(id: string): Promise<BankAccountResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/bank-accounts/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin tài khoản ngân hàng thất bại');
  }

  return response.json();
}

// Lấy bank account của user hiện tại
export async function getMyBankAccount(): Promise<BankAccountResponse> {
  try {
    // SỬ DỤNG PROXY để bypass CORS
    const token = getToken();

    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    const response = await fetch(`/api/bank-accounts/my-account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.error) {
      if (data.status === 404) {
        const error = new Error('Bank account not found');
        (error as any).status = 404;
        throw error;
      }
      throw new Error(data.message || 'Lấy thông tin tài khoản ngân hàng thất bại');
    }

    return data;
  } catch (error) {
    console.error('Error checking bank account:', error);
    throw error;
  }
}

export async function updateMyBankAccount(request: { name: string; number: string; bankId: string }): Promise<BankAccountResponse> {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    const response = await fetch(`/api/bank-accounts/my-account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error || data.message || 'Cập nhật tài khoản ngân hàng thất bại');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Cập nhật tài khoản ngân hàng thất bại');
    }

    return data;
  } catch (error) {
    console.error('Error updating bank account:', error);
    throw error;
  }
}

export async function deleteMyBankAccount(): Promise<BankAccountResponse> {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Vui lòng đăng nhập');
    }

    const response = await fetch(`/api/bank-accounts/my-account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error || data.message || 'Xóa tài khoản ngân hàng thất bại');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Xóa tài khoản ngân hàng thất bại');
    }

    return data;
  } catch (error) {
    console.error('Error deleting bank account:', error);
    throw error;
  }
}

export async function getProvinces(): Promise<ProvinceResponse[]> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/locations/provinces`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách tỉnh/thành thất bại');
  }

  return response.json();
}

// Lấy province theo ID
export async function getProvinceById(id: string): Promise<ProvinceResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/locations/provinces/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin tỉnh/thành thất bại');
  }

  return response.json();
}

// Lấy danh sách wards theo province ID
export async function getWardsByProvinceId(provinceId: string): Promise<WardResponse[]> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/locations/provinces/${provinceId}/wards`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách phường/xã thất bại');
  }

  return response.json();
}

// Lấy danh sách tất cả wards
export async function getWards(): Promise<WardResponse[]> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/locations/wards`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách phường/xã thất bại');
  }

  return response.json();
}

// Lấy ward theo ID
export async function getWardById(id: string): Promise<WardResponse> {
  // SỬ DỤNG PROXY để bypass CORS
  const response = await fetch(`/api/locations/wards/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin phường/xã thất bại');
  }

  return response.json();
}

export async function getPopularFields(): Promise<Field[]> {
  const response = await fetch(`${API_BASE_URL}/fields/popular`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách sân phổ biến thất bại');
  }

  return response.json();
}

// Lấy chi tiết một sân - đang dùng mock
export async function getFieldById(id: string): Promise<Field | null> {
  const response = await fetch(`${API_BASE_URL}/fields/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin sân thất bại');
  }

  return response.json();
}

// Lấy các slot booking cho một sân cụ thể - đang dùng mock
export async function getFieldBookingSlots(fieldId: string, date?: string): Promise<Array<{
  time: string;
  price: number;
  available: boolean;
  date?: string;
}>> {
  const queryParams = date ? `?date=${date}` : '';
  const response = await fetch(`${API_BASE_URL}/fields/${fieldId}/slots${queryParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin slot booking thất bại');
  }

  return response.json();
}

// =================
// TOURNAMENT SERVICES - Đã chuyển sang real API calls
// =================

// Lấy danh sách giải đấu - đang dùng mock
export async function getTournaments(): Promise<Tournament[]> {
  const response = await fetch(`${API_BASE_URL}/tournaments`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách giải đấu thất bại');
  }

  return response.json();
}

// Lấy chi tiết giải đấu - đang dùng mock
export async function getTournamentById(id: string): Promise<Tournament | null> {
  const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin giải đấu thất bại');
  }

  return response.json();
}

// Đăng ký tham gia giải đấu - đang dùng mock
export async function registerTournament(tournamentId: string, userId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/tournaments/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tournamentId, userId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng ký giải đấu thất bại');
  }

  return response.ok;
}

// =================
// COMMUNITY SERVICES - Đã chuyển sang real API calls
// =================

// Lấy bài viết cộng đồng với filtering - đang dùng mock
export async function getCommunityPosts(filters?: { sport?: string, distance?: string }): Promise<CommunityPost[]> {
  const queryParams = new URLSearchParams(filters as any).toString();
  const url = queryParams ? `${API_BASE_URL}/community/posts?${queryParams}` : `${API_BASE_URL}/community/posts`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách bài viết cộng đồng thất bại');
  }

  return response.json();
}

// Lấy bài viết cộng đồng theo ID - đang dùng mock
export async function getCommunityPostById(id: string): Promise<CommunityPost | null> {
  const response = await fetch(`${API_BASE_URL}/community/posts/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin bài viết thất bại');
  }

  return response.json();
}

// Tạo bài viết mới - đang dùng mock
export async function createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/community/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tạo bài viết thất bại');
  }

  return response.ok;
}

// =================
// BOOKING SERVICES - Đã chuyển sang real API calls
// =================

// Lấy lịch sử đặt sân - đang dùng mock
export async function getBookingHistory(status?: string): Promise<Booking[]> {
  const queryParams = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE_URL}/bookings${queryParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy lịch sử đặt sân thất bại');
  }

  return response.json();
}

// Đặt sân mới - đang dùng mock
export async function createBooking(bookingData: any): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đặt sân thất bại');
  }

  return response.ok;
}

// Lấy thông tin đặt sân theo ID - đang dùng mock
export async function getBookingById(id: string): Promise<Booking | null> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin đặt sân thất bại');
  }

  return response.json();
}

// Hủy đặt sân - đang dùng mock
export async function cancelBooking(bookingId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'POST'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Hủy đặt sân thất bại');
  }

  return response.ok;
}

// =================
// CHAT SERVICES - Đã chuyển sang real API calls
// =================

// Lấy danh sách phòng chat - đang dùng mock
export async function getChatRooms(): Promise<ChatRoom[]> {
  const response = await fetch(`${API_BASE_URL}/chat/rooms`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách phòng chat thất bại');
  }

  return response.json();
}

// Lấy tin nhắn trong phòng - đang dùng mock
export async function getChatMessages(roomId: string): Promise<ChatMessage[]> {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy tin nhắn thất bại');
  }

  return response.json();
}

// Gửi tin nhắn - đang dùng mock
export async function sendMessage(roomId: string, content: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gửi tin nhắn thất bại');
  }

  return response.ok;
}

// =================
// PAYMENT SERVICES - Đã chuyển sang real API calls
// =================

// Xử lý thanh toán - đang dùng mock
export async function processPayment(
  bookingId: string,
  paymentData: any,
  method: string
): Promise<{ success: boolean; transactionId?: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/payment/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId, paymentData, method })
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      message: error.message || 'Thanh toán thất bại. Vui lòng thử lại.'
    };
  }

  return response.json();
}

// =================
// USER PROFILE SERVICES - Đã chuyển sang real API calls
// =================

// Lấy thông tin user hiện tại - sử dụng endpoint /users/myself
export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    const token = getToken();
    if (!token) {
      console.log('Không có token, không thể lấy current user')
      return null;
    }

    // Use proxy route instead of direct backend API to avoid CORS issues
    const response = await fetch('/api/users/myself', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated')
        return null;
      }
      const error = await response.json();
      throw new Error(error.message || 'Lấy thông tin user thất bại');
    }

    const data = await response.json();
    console.log('Current user retrieved:', data);
    return data;
  } catch (error) {
    console.error('Error getting current user:', error)
    return null;
  }
}

// Cập nhật thông tin user - đang dùng mock
export async function updateUserProfile(userData: any): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cập nhật thông tin user thất bại');
  }

  return response.ok;
}

// Thay đổi mật khẩu - đang dùng mock
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/user/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Thay đổi mật khẩu thất bại');
  }

  return response.ok;
}

// Upload avatar - gọi API backend
export async function uploadAvatar(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_BASE_URL}/users/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload avatar thất bại');
  }

  const result = await response.json();
  return result.avatarUrl || null;
}

// =================
// UTILITY FUNCTIONS - Đã chuyển sang real API calls
// =================

// Lấy danh sách tabs booking - đang dùng mock
export const getBookingTabs = async (): Promise<{ id: string; label: string; icon: any; count: number }[]> => {
  const response = await fetch(`${API_BASE_URL}/bookings/tabs`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách tabs thất bại');
  }

  return response.json();
}

// Lấy danh sách sport options - đang dùng mock
export const getSportOptions = async (): Promise<{ value: string; label: string }[]> => {
  const response = await fetch(`${API_BASE_URL}/sports/options`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh sách môn thể thao thất bại');
  }

  return response.json();
}

// Lấy booking status mapping - đang dùng mock
export const getBookingStatusMap = async (): Promise<Record<string, string>> => {
  const response = await fetch(`${API_BASE_URL}/bookings/status-map`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy mapping trạng thái thất bại');
  }

  return response.json();
}

// =================
// STORE FAVOURITE SERVICES - Match StoreFavouriteController 
// =================

/**
 * Lấy danh sách tất cả Trung tâm thể thao yêu thích của người dùng
 * GET /api/favourites (proxy route - bypass CORS)
 */
export async function getFavourites(): Promise<StoreSearchItemResponse[]> {
  const token = getToken();
  if (!token) {
    console.warn('Không có token, không thể lấy danh sách yêu thích');
    return [];
  }

  try {
    // SỬ DỤNG PROXY để bypass CORS
    const response = await fetch('/api/favourites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('Token hết hạn, không thể lấy yêu thích');
        return [];
      }
      const error = await response.json();
      throw new Error(error.message || 'Lấy danh sách yêu thích thất bại');
    }

    const data = await response.json();
    console.log('Danh sách yêu thích đã được tải:', Array.isArray(data) ? data.length : 'N/A');

    return data;
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error.message);
    return [];
  }
}

/**
 * Kiểm tra xem Trung tâm thể thao có trong danh sách yêu thích không
 */
export async function isFavourite(storeId: string): Promise<boolean> {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const favourites = await getFavourites();
    const result = favourites.some(store => store.id === storeId);
    console.log(` Store ${storeId} favourite:`, result);
    return result;
  } catch (error) {
    console.error('Lỗi khi kiểm tra yêu thích:', error);
    return false;
  }
}

/**
 * Thêm Trung tâm thể thao vào danh sách yêu thích
 * POST /api/favourites (proxy route - bypass CORS)
 */
export async function addFavourite(storeId: string): Promise<StoreClientDetailResponse | null> {
  const token = getToken();
  if (!token) {
    console.error('Không có token, không thể thêm yêu thích');
    throw new Error('Vui lòng đăng nhập để thêm yêu thích');
  }

  try {
    // SỬ DỤNG PROXY để bypass CORS
    const response = await fetch('/api/favourites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ storeId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Thêm yêu thích thất bại');
    }

    const data = await response.json();
    console.log('Đã thêm vào yêu thích:', storeId);

    return data;
  } catch (error: any) {
    console.error('Lỗi khi thêm yêu thích:', error.message);
    throw error;
  }
}

/**
 * Xóa Trung tâm thể thao khỏi danh sách yêu thích
 * DELETE /api/favourites/[storeId] (proxy route - bypass CORS)
 */
export async function removeFavourite(storeId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    console.error('Không có token, không thể xóa yêu thích');
    throw new Error('Vui lòng đăng nhập để xóa yêu thích');
  }

  try {
    // SỬ DỤNG PROXY để bypass CORS
    const response = await fetch(`/api/favourites/${storeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log(' Delete response status:', response.status);

    // Thành công: 204 No Content hoặc 200 OK
    if (response.ok || response.status === 204) {
      console.log('Đã xóa khỏi yêu thích:', storeId);
      return;
    }

    // Lỗi: Parse error message
    let errorMsg = 'Xóa yêu thích thất bại';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
        console.error('🔴 Backend error:', errorData);
      } else {
        const text = await response.text();
        console.error('🔴 Backend error (text):', text);
        errorMsg = text || errorMsg;
      }
    } catch (parseError) {
      console.error('Không thể parse error response');
    }

    throw new Error(errorMsg);
  } catch (error: any) {
    if (error.message) {
      console.error('Lỗi khi xóa yêu thích:', error.message);
    }
    throw error;
  }
}

/**
 * Toggle favourite - Thêm hoặc xóa
 * Xóa sử dụng workaround: DELETE /all + re-add những cái còn lại
 */
export async function toggleFavourite(storeId: string): Promise<boolean> {
  // Check xem đã favourite chưa
  const isFav = await isFavourite(storeId);

  if (!isFav) {
    // Chưa favourite -> ADD
    await addFavourite(storeId);
    return true;
  } else {
    // Đã favourite -> DELETE
    await removeFavourite(storeId);
    return false;
  }
}

// =================
// RATING SERVICES - Match RatingController 
// =================

/**
 * Tạo rating mới cho store
 * @param request - Rating request data
 * @returns RatingResponse
 */
export async function createRating(request: {
  storeId: string;
  sportId: string;
  star: number;
  comment: string;
  mediaFiles?: File[];
}): Promise<any> {
  const token = getToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập để đánh giá');
  }

  try {
    // Create FormData for multipart upload
    const formData = new FormData();

    // Append form fields directly (backend expects these as form parameters)
    formData.append('storeId', request.storeId);
    formData.append('sportId', request.sportId);
    formData.append('star', request.star.toString());
    formData.append('comment', request.comment);

    // Append media files if any
    if (request.mediaFiles && request.mediaFiles.length > 0) {
      console.log(`Uploading ${request.mediaFiles.length} media files for rating`);
      request.mediaFiles.forEach((file, index) => {
        console.log(`Adding file ${index}: ${file.name} (${file.size} bytes)`);
        formData.append('medias', file);
      });
    }

    console.log('Creating rating with:', {
      storeId: request.storeId,
      sportId: request.sportId,
      star: request.star,
      comment: request.comment,
      mediaCount: request.mediaFiles?.length || 0
    });

    const response = await fetch(`/api/ratings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser will set it to multipart/form-data automatically
      },
      body: formData
    });

    console.log('Rating API response status:', response.status);

    if (!response.ok) {
      let errorMsg = 'Không thể gửi đánh giá';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
        console.error('Backend error response:', errorData);
      } catch (e) {
        const text = await response.text();
        console.error('Backend error text:', text);
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('Rating created successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Error creating rating:', error);
    throw error;
  }
}

/**
 * Xóa rating
 * @param ratingId - ID của rating cần xóa
 */
export async function deleteRating(ratingId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập');
  }

  try {
    const response = await fetch(`/api/ratings/${ratingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Không thể xóa đánh giá');
    }
  } catch (error: any) {
    console.error('Error deleting rating:', error);
    throw error;
  }
}

/**
 * Cập nhật rating (backend chưa implement, sẽ implement sau)
 * @param ratingId - ID của rating
 * @param data - Updated data
 */
export async function updateRating(
  ratingId: string,
  data: {
    star?: number;
    comment?: string;
    newImages?: File[];
  }
): Promise<any> {
  const token = getToken();
  if (!token) {
    throw new Error('Vui lòng đăng nhập');
  }

  try {
    // Create FormData for multipart upload
    const formData = new FormData();

    // Append rating data as JSON string
    const updateRequest: any = {};
    if (data.star !== undefined) updateRequest.star = data.star;
    if (data.comment !== undefined) updateRequest.comment = data.comment;

    formData.append('ratingRequest', JSON.stringify(updateRequest));

    // Append new media files if any
    if (data.newImages && data.newImages.length > 0) {
      data.newImages.forEach((file) => {
        formData.append('medias', file);
      });
    }

    const response = await fetch(`/api/ratings/${ratingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Không thể cập nhật đánh giá');
    }

    return response.json();
  } catch (error: any) {
    console.error('Error updating rating:', error);
    throw error;
  }
}

/**
 * Lấy danh sách ratings của store
 * @param storeId - ID của store
 * @param page - Trang (0-indexed)
 * @param perPage - Số ratings per page
 */
export async function getStoreRatings(
  storeId: string,
  page: number = 0,
  perPage: number = 20
): Promise<any[]> {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // SỬ DỤNG PROXY để bypass CORS
    const response = await fetch(
      `/api/ratings/store/${storeId}?page=${page}&perPage=${perPage}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch store ratings: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Handle empty array response (endpoint not implemented)
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log(`No ratings found for store ${storeId}`);
      return [];
    }

    if (data.success === false || data.error) {
      console.warn('Cannot fetch store ratings');
      return [];
    }

    return Array.isArray(data) ? data : data.content || [];
  } catch (error: any) {
    console.error('Error fetching store ratings:', error);
    return [];
  }
}

// ============= STORE APPROVAL =============

/**
 * Phê duyệt store (Admin only)
 * @param storeId - ID của store cần phê duyệt
 */
export async function approveStore(storeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Vui lòng đăng nhập để phê duyệt Trung tâm thể thao');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch('/api/store/approve', {
      method: 'POST',
      headers,
      body: JSON.stringify({ storeId })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
      const errorMessage = error?.message || error?.error || `Lỗi ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      success: true,
      message: result?.message || 'Phê duyệt Trung tâm thể thao thành công'
    };
  } catch (error: any) {
    console.error('Error approving store:', error);
    return {
      success: false,
      message: error?.message || 'Có lỗi xảy ra khi phê duyệt Trung tâm thể thao'
    };
  }
}

//  Re-export getMyProfile từ get-my-profile.ts
export { getMyProfile } from './get-my-profile';