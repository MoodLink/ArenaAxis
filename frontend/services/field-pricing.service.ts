// File: services/field-pricing.service.ts
// Service layer for Field Pricing API - Managing special prices for time slots

export interface TimeObject {
  hour: number;
  minute: number;
}

export interface FieldPricing {
  _id: string;
  fieldId: string;
  specialPrice: number;
  startAt: TimeObject;
  endAt: TimeObject;
  dayOfWeek: string; // lowercase: "monday", "tuesday", etc.
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FieldPricingsResponse {
  message: string;
  data: FieldPricing[];
}

export interface FieldPricingResponse {
  message: string;
  data: FieldPricing;
}

export interface CreateFieldPricingDto {
  field_id: string;
  day_of_weeks: string[]; // ["monday", "tuesday", "friday"]
  start_at: string; // "17:00"
  end_at: string; // "19:30"
  price: string; // "333666"
}

export interface UpdateFieldPricingDto {
  field_id?: string;
  day_of_weeks?: string[];
  start_at?: string;
  end_at?: string;
  price?: string;
}

// Use Next.js API proxy routes
const API_BASE_URL = '/api/field-pricings';

export class FieldPricingService {
  /**
   * Get all field pricings for a specific field
   */
  static async getFieldPricings(fieldId: string): Promise<FieldPricingsResponse> {
    console.log(`[FieldPricingService] Fetching pricings for fieldId: ${fieldId}`);
    const url = `${API_BASE_URL}?field_id=${fieldId}`;
    console.log(`[FieldPricingService] URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[FieldPricingService] Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch field pricings: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[FieldPricingService] Response data:`, data);
    console.log(`[FieldPricingService] Total pricings: ${data.data?.length || 0}`);

    return data;
  }

  /**
   * Get field pricing by ID
   */
  static async getFieldPricingById(pricingId: string): Promise<FieldPricingResponse> {
    const response = await fetch(`${API_BASE_URL}/${pricingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch field pricing: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create new field pricing (supports multiple days of week)
   */
  static async createFieldPricing(data: CreateFieldPricingDto): Promise<FieldPricingResponse> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to create field pricing: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update field pricing
   */
  static async updateFieldPricing(
    pricingId: string,
    data: UpdateFieldPricingDto
  ): Promise<FieldPricingResponse> {
    const response = await fetch(`${API_BASE_URL}/${pricingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to update field pricing: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete field pricing
   */
  static async deleteFieldPricing(pricingId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/${pricingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to delete field pricing: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper: Convert time string "HH:MM" to TimeObject
   */
  static parseTime(timeStr: string): TimeObject {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
  }

  /**
   * Helper: Convert TimeObject to "HH:MM" string
   */
  static formatTime(time: TimeObject): string {
    const h = String(time.hour).padStart(2, '0');
    const m = String(time.minute).padStart(2, '0');
    return `${h}:${m}`;
  }

  /**
   * Helper: Get special price for a specific time slot and day
   * Returns null if no special price found (use default price)
   */
  static getSpecialPriceForSlot(
    pricings: FieldPricing[],
    timeSlot: string, // "17:00"
    dayOfWeek: string // "monday"
  ): number | null {
    if (!pricings || pricings.length === 0) {
      return null;
    }

    const slotTime = this.parseTime(timeSlot);
    const slotMinutes = slotTime.hour * 60 + slotTime.minute;

    // Normalize day of week to lowercase
    const normalizedDay = dayOfWeek.toLowerCase();

    // Debug logging
    console.log(`[DEBUG] Looking for price for: ${timeSlot} on ${normalizedDay}`, {
      slotMinutes,
      totalPricings: pricings.length,
      pricingsForDay: pricings.filter(p => p.dayOfWeek.toLowerCase() === normalizedDay).length
    });

    // Find matching pricing rule
    const matchingPricing = pricings.find((pricing) => {
      // Skip if day doesn't match
      if (pricing.dayOfWeek.toLowerCase() !== normalizedDay) {
        return false;
      }

      // Skip if startAt or endAt is missing
      if (!pricing.startAt || !pricing.endAt || typeof pricing.startAt.hour === 'undefined' || typeof pricing.endAt.hour === 'undefined') {
        console.warn('[DEBUG] Pricing missing time data:', pricing);
        return false;
      }

      const startMinutes = pricing.startAt.hour * 60 + (pricing.startAt.minute || 0);
      const endMinutes = pricing.endAt.hour * 60 + (pricing.endAt.minute || 0);

      // Check if slot falls within this pricing range
      const isInRange = slotMinutes >= startMinutes && slotMinutes < endMinutes;

      if (isInRange) {
        console.log(`[DEBUG] Found matching price! ${timeSlot}: ${pricing.specialPrice}đ`);
      }

      return isInRange;
    });

    return matchingPricing ? matchingPricing.specialPrice : null;
  }

  /**
   * Helper: Get day of week name from date
   */
  static getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  /**
   * Helper: Format price to VND
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
}
