// File: services/field.service.ts
// Service layer for Fields API - Using Next.js API Routes as Proxy

export interface Field {
  _id: string;
  sportId: string;
  storeId: string;
  defaultPrice: string;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  name?: string;
  sport_name?: string;
  address?: string;
  avatar?: string;
  cover_image?: string;
  rating?: number;
}

export interface FieldsResponse {
  message: string;
  data: Field[];
}

export interface FieldResponse {
  message: string;
  data: Field;
}

export interface CreateFieldDto {
  sport_id: string;
  store_id: string;
  default_price: string;
  name?: string;
  sport_name?: string;
  address?: string;
  avatar?: string;
  cover_image?: string;
  rating?: number;
}

export interface UpdateFieldDto {
  sport_id?: string;
  store_id?: string;
  default_price?: string;
  name?: string;
  sport_name?: string;
  address?: string;
  active_status?: boolean; // Changed from string to boolean
}

// Use Next.js API proxy routes to bypass CORS issues
const API_BASE_URL = '/api/fields';

export class FieldService {
  /**
   * Get all fields with optional filters
   */
  static async getFields(params?: {
    sport_id?: string;
    store_id?: string;
    active_status?: boolean;
  }): Promise<FieldsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.sport_id) {
      queryParams.append('sport_id', params.sport_id);
    }
    if (params?.store_id) {
      queryParams.append('store_id', params.store_id);
    }
    if (params?.active_status !== undefined) {
      queryParams.append('active_status', String(params.active_status));
    }

    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fields: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get field by ID
   */
  static async getFieldById(fieldId: string): Promise<FieldResponse> {
    const response = await fetch(`${API_BASE_URL}/${fieldId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch field: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create new field
   */
  static async createField(data: CreateFieldDto): Promise<FieldResponse> {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('authToken') : null;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error (${response.status}):`, errorText);
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create field';
      console.error('POST /api/fields error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update field
   */
  static async updateField(
    fieldId: string,
    data: UpdateFieldDto
  ): Promise<FieldResponse> {
    const response = await fetch(`${API_BASE_URL}/${fieldId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to update field: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete field
   */
  static async deleteField(fieldId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/${fieldId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to delete field: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Toggle field active status
   */
  static async toggleFieldStatus(
    fieldId: string,
    currentStatus: boolean
  ): Promise<FieldResponse> {
    return this.updateField(fieldId, {
      active_status: !currentStatus,
    });
  }

  /**
   * Update field price
   */
  static async updateFieldPrice(
    fieldId: string,
    newPrice: string
  ): Promise<FieldResponse> {
    return this.updateField(fieldId, {
      default_price: newPrice,
    });
  }

  /**
   * Get active fields only
   */
  static async getActiveFields(storeId?: string): Promise<FieldsResponse> {
    return this.getFields({
      store_id: storeId,
      active_status: true,
    });
  }

  /**
   * Get fields by store
   */
  static async getFieldsByStore(storeId: string): Promise<FieldsResponse> {
    return this.getFields({ store_id: storeId });
  }

  /**
   * Get fields by sport
   */
  static async getFieldsBySport(
    sportId: string,
    storeId?: string
  ): Promise<FieldsResponse> {
    return this.getFields({
      sport_id: sportId,
      store_id: storeId,
    });
  }
}
