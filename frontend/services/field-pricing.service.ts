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
  day_of_weeks?: string[]; // ["monday", "tuesday", "friday"] - for day-of-week pricing
  start_at: string; // "17:00" or "2025-12-01 20:00"
  end_at: string; // "19:30" or "2025-12-01 23:30"
  price: string; // "333666"
}

export interface UpdateFieldPricingDto {
  field_id?: string;
  day_of_weeks?: string[];
  start_at?: string;
  end_at?: string;
  price?: string;
}

export interface SpecialDatePricingDto {
  field_id: string;
  start_at: string; // "2025-12-01 20:00" - yyyy-mm-dd hh:mm
  end_at: string;   // "2025-12-01 23:30" - yyyy-mm-dd hh:mm
  price: string;    // "19000"
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
   * Get all field pricings combining both day-of-week and special date pricing
   * This makes two separate API calls and merges the results
   */
  static async getAllFieldPricings(fieldId: string): Promise<FieldPricingsResponse> {
    try {
      console.log(`[FieldPricingService] Fetching ALL pricings (day-of-week + special date) for fieldId: ${fieldId}`);

      // Fetch day-of-week pricings
      const dayOfWeekResponse = await this.getFieldPricings(fieldId);
      const allPricings = dayOfWeekResponse.data || [];

      // Try to fetch special date pricings from proxy
      try {
        const specialResponse = await fetch(`${API_BASE_URL}/special?field_id=${fieldId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (specialResponse.ok) {
          const specialData = await specialResponse.json();
          console.log(`[FieldPricingService] Special date pricings (raw):`, specialData);

          if (Array.isArray(specialData.data)) {
            // Fix timezone issue: backend returns UTC+7 offset incorrectly
            // Need to subtract 7 hours from the returned times
            const fixedSpecialPricings = specialData.data.map((pricing: any) => {
              const startAt = pricing.startAt; // Format: "2025-12-03 03:00"
              const endAt = pricing.endAt;     // Format: "2025-12-03 03:30"

              // Parse and adjust for timezone offset (subtract 7 hours)
              const startDateTime = this.adjustTimezoneOffset(startAt, -7);
              const endDateTime = this.adjustTimezoneOffset(endAt, -7);

              console.log(`[FieldPricingService] Adjusted pricing: "${startAt}" → "${startDateTime}", "${endAt}" → "${endDateTime}"`);

              return {
                ...pricing,
                startAt: startDateTime,
                endAt: endDateTime
              };
            });

            allPricings.push(...fixedSpecialPricings);
          }
        }
      } catch (error) {
        console.warn(`[FieldPricingService] Failed to fetch special date pricings:`, error);
        // Continue with only day-of-week pricings
      }

      console.log(`[FieldPricingService] Total combined pricings: ${allPricings.length}`);
      return {
        message: 'Success',
        data: allPricings
      };
    } catch (error) {
      console.error(`[FieldPricingService] Error in getAllFieldPricings:`, error);
      throw error;
    }
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
   * Create field pricing (supports both day-of-week and specific date)
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
   * Create special date pricing (new API for specific dates)
   */
  static async createSpecialDatePricing(data: SpecialDatePricingDto): Promise<FieldPricingResponse> {
    const response = await fetch(`${API_BASE_URL}/special`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to create special date pricing: ${response.statusText}`);
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
  static formatTime(time: TimeObject | string): string {
    // Handle string format: "2025-12-02 20:00" or "20:00"
    if (typeof time === 'string') {
      // Extract time part if it contains date
      let timeStr = time;
      if (time.includes(' ')) {
        // Format: "2025-12-02 20:00"
        timeStr = time.split(' ')[1]; // Get "20:00"
      }
      // timeStr is now "20:00" or "HH:MM"
      return timeStr.substring(0, 5); // Return "20:00"
    }

    // Handle object format: { hour: 20, minute: 30 }
    const h = String(time.hour).padStart(2, '0');
    const m = String(time.minute).padStart(2, '0');
    return `${h}:${m}`;
  }

  /**
   * Helper: Get special price for a specific time slot and day
   * Supports both old format (with dayOfWeek) and new format (without dayOfWeek)
   * Returns null if no special price found (use default price)
   */
  static getSpecialPriceForSlot(
    pricings: any[],
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
    });

    // Find matching pricing rule
    const matchingPricing = pricings.find((pricing) => {
      // If pricing has dayOfWeek field (old format), check it
      if (pricing.dayOfWeek) {
        if (pricing.dayOfWeek.toLowerCase() !== normalizedDay) {
          return false;
        }
      }
      // New format doesn't have dayOfWeek, so we apply to all days

      // Handle both formats:
      // Old: { startAt: { hour, minute }, endAt: { hour, minute } }
      // New: { startAt: "05:00", endAt: "06:30" }

      let startMinutes: number;
      let endMinutes: number;

      if (typeof pricing.startAt === 'string') {
        // New format: string "HH:MM"
        const startParts = pricing.startAt.split(':');
        if (!startParts[0] || !startParts[1]) {
          console.warn('[DEBUG] Pricing has invalid startAt format:', pricing);
          return false;
        }
        startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
      } else if (pricing.startAt && typeof pricing.startAt === 'object') {
        // Old format: TimeObject { hour, minute }
        if (typeof pricing.startAt.hour === 'undefined') {
          console.warn('[DEBUG] Pricing missing startAt.hour:', pricing);
          return false;
        }
        startMinutes = pricing.startAt.hour * 60 + (pricing.startAt.minute || 0);
      } else {
        console.warn('[DEBUG] Pricing has invalid startAt:', pricing);
        return false;
      }

      if (typeof pricing.endAt === 'string') {
        // New format: string "HH:MM"
        const endParts = pricing.endAt.split(':');
        if (!endParts[0] || !endParts[1]) {
          console.warn('[DEBUG] Pricing has invalid endAt format:', pricing);
          return false;
        }
        endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
      } else if (pricing.endAt && typeof pricing.endAt === 'object') {
        // Old format: TimeObject { hour, minute }
        if (typeof pricing.endAt.hour === 'undefined') {
          console.warn('[DEBUG] Pricing missing endAt.hour:', pricing);
          return false;
        }
        endMinutes = pricing.endAt.hour * 60 + (pricing.endAt.minute || 0);
      } else {
        console.warn('[DEBUG] Pricing has invalid endAt:', pricing);
        return false;
      }

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

  /**
   * Helper: Adjust datetime for timezone offset
   * Backend returns times with timezone offset applied incorrectly
   * This adjusts by the specified hours (e.g., -7 to subtract 7 hours)
   * Input format: "2025-12-03 03:00"
   * Output format: "2025-12-02 20:00"
   */
  static adjustTimezoneOffset(datetimeStr: string, hours: number): string {
    // Parse format: "2025-12-03 03:00"
    const parts = datetimeStr.split(' ');
    if (parts.length < 2) return datetimeStr;

    const [dateStr, timeStr] = parts;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    // Create date object and adjust hours
    const date = new Date(year, month - 1, day, hour, minute, 0);
    date.setHours(date.getHours() + hours);

    // Format back to "YYYY-MM-DD HH:MM"
    const adjustedYear = date.getFullYear();
    const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const adjustedDay = String(date.getDate()).padStart(2, '0');
    const adjustedHour = String(date.getHours()).padStart(2, '0');
    const adjustedMinute = String(date.getMinutes()).padStart(2, '0');

    return `${adjustedYear}-${adjustedMonth}-${adjustedDay} ${adjustedHour}:${adjustedMinute}`;
  }
}
