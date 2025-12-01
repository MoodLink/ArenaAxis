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
  pricings?: Array<{
    specialPrice: number;
    startAt: string;
    endAt: string;
  }>;
  statusField?: any[];
  // Thêm các field có thể được trả về từ API mới
  store?: any;
  sport?: any;
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
  active_status?: boolean;
}

const API_BASE_URL = '/api/fields/';

export class FieldService {
  static async getFields(params?: {
    sport_id?: string;
    store_id?: string;
    active_status?: boolean;
    date_time?: string;
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
    if (params?.date_time) {
      queryParams.append('date_time', params.date_time);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

    console.log('🔍 FieldService.getFields - Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FieldService.getFields - Error:', response.status, errorText);
      throw new Error(`Failed to fetch fields: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ FieldService.getFields - Response:', data);
    return data;
  }

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

  static async createField(data: CreateFieldDto): Promise<FieldResponse> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  static async toggleFieldStatus(
    fieldId: string,
    currentStatus: boolean
  ): Promise<FieldResponse> {
    return this.updateField(fieldId, {
      active_status: !currentStatus,
    });
  }

  static async updateFieldPrice(
    fieldId: string,
    newPrice: string
  ): Promise<FieldResponse> {
    return this.updateField(fieldId, {
      default_price: newPrice,
    });
  }

  static async getActiveFields(storeId?: string): Promise<FieldsResponse> {
    return this.getFields({
      store_id: storeId,
      active_status: true,
    });
  }

  static async getFieldsByStore(storeId: string, dateTime?: string): Promise<FieldsResponse> {
    // Backend yêu cầu date_time, nếu không truyền thì dùng ngày hiện tại
    const defaultDateTime = dateTime || new Date().toISOString().split('T')[0];
    return this.getFields({
      store_id: storeId,
      date_time: defaultDateTime
    });
  }

  static async getFieldsWithAllData(
    storeId: string,
    sportId: string,
    dateTime: string
  ): Promise<FieldsResponse> {
    // Đảm bảo dateTime format đúng: YYYY-MM-DD hoặc YYYY-M-D
    const formattedDate = dateTime.includes('T')
      ? dateTime.split('T')[0]
      : dateTime;

    return this.getFields({
      store_id: storeId,
      sport_id: sportId,
      date_time: formattedDate,
    });
  }
}
