/**
 * Order Service - Handle payment and order operations
 */

import {
    normalizeAmount,
    normalizeDate,
    normalizeTime,
    isValidAmount,
    isValidDateFormat,
    isValidTimeFormat,
    formatVND,
} from '@/utils/data-formatter'

// Helper function to get token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
}

/**
 * Create payment order request
 */
export interface CreatePaymentOrderRequest {
    store_id: string;
    user_id: string;
    amount: number;
    description: string;
    date: string;
    items: Array<{
        field_id: string;
        start_time: string;
        end_time: string;
        name: string;
        quantity: number;
        price: number;
    }>;
}

/**
 * Create payment order response
 */
export interface CreatePaymentOrderResponse {
    message: string;
    data: {
        orderCode: string | number;
        amount: number;
        checkoutUrl: string;
        description: string;
    };
}

/**
 * Order details response
 */
export interface OrderResponse {
    _id: string;
    userId: string;
    storeId: string;
    orderCode: string | number;
    statusPayment: string;
    cost: number;
    isRated: boolean;
    createdAt: string;
    updatedAt: string;
    name: string;
    address: string;
    orderDetails: Array<{
        fieldId: string;
        fieldName?: string;  // Field name from backend (if available)
        startTime: string;
        endTime: string;
        price: number;
    }>;
}

/**
 * Orders by store response
 */
export interface OrdersByStoreResponse {
    message: string;
    data: OrderResponse[];
}

/**
 * Create a payment order and get checkout URL
 * POST /api/orders/create-payment
 */
export async function createPaymentOrder(
    request: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse> {
    try {
        const token = getToken();

        // ✅ Normalize và validate request
        console.log('🔍 Normalizing request data...');
        const normalizedRequest = normalizePaymentOrderRequest(request);
        console.log('✅ Request normalized successfully');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add Authorization if token is available (try both formats)
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            // Also add X-Auth-Token as fallback
            headers['X-Auth-Token'] = token;
        }

        console.log('📤 Creating payment order:', normalizedRequest);
        console.log('🔐 Token available:', !!token);

        const response = await fetch('/api/orders/create-payment', {
            method: 'POST',
            headers,
            body: JSON.stringify(normalizedRequest),
        });

        const data = await response.json();
        console.log('📥 Response status:', response.status);
        console.log('📥 Response data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            const errorMessage = data.message || data.error || data.details?.message || 'Failed to create payment order';
            const fullError = `[${response.status}] ${errorMessage}`;
            console.error('❌ API error response:', { status: response.status, data });
            console.error('❌ Full error message:', fullError);
            throw new Error(fullError);
        }

        const typedData: CreatePaymentOrderResponse = data;
        console.log('✅ Payment order created:', typedData);

        return typedData;
    } catch (error) {
        console.error('❌ Error creating payment order:', error);
        throw error;
    }
}

/**
 * Normalize và validate payment order request
 */
function normalizePaymentOrderRequest(request: CreatePaymentOrderRequest): CreatePaymentOrderRequest {
    console.log('🔧 Normalizing payment order request...');

    // Normalize amount
    const normalizedAmount = normalizeAmount(request.amount);
    console.log(`   Amount: ${formatVND(request.amount)} → ${formatVND(normalizedAmount)}`);

    // Normalize date
    const normalizedDate = normalizeDate(request.date);
    console.log(`   Date: ${request.date} → ${normalizedDate}`);

    // Normalize items
    const normalizedItems = request.items.map((item, index) => ({
        field_id: String(item.field_id).trim(),
        start_time: normalizeTime(item.start_time),
        end_time: normalizeTime(item.end_time),
        name: String(item.name).trim(),
        quantity: Math.max(1, Math.round(item.quantity)),
        price: normalizeAmount(item.price),
    }));

    console.log(`   Items normalized: ${normalizedItems.length} items`);
    normalizedItems.forEach((item, i) => {
        console.log(`      [${i}] ${item.name} (${item.start_time}-${item.end_time}): ${formatVND(item.price)}`);
    });

    return {
        store_id: String(request.store_id).trim(),
        user_id: String(request.user_id).trim(),
        amount: normalizedAmount,
        description: String(request.description).trim(),
        date: normalizedDate,
        items: normalizedItems,
    };
}

/**
 * Get order details by order ID
 * GET /api/orders/{orderId} (proxied through Next.js API)
 */
export async function getOrderByCode(orderId: string): Promise<OrderResponse> {
    try {
        const token = getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add Authorization if token is available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('📤 Fetching order:', orderId);

        // Use local proxy to avoid CORS issues (same as POST)
        const apiUrl = `/api/orders/${orderId}`;

        console.log('📍 API URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Không thể lấy thông tin đơn hàng');
        }

        const data: OrderResponse = await response.json();
        console.log('✅ Order fetched:', data);

        return data;
    } catch (error) {
        console.error('❌ Error fetching order:', error);
        throw error;
    }
}

/**
 * Get all orders for a store within date range
 * GET /api/v1/orders/store/{storeId}?start_time={startDate}&end_time={endDate}
 */
export async function getOrdersByStore(
    storeId: string,
    startDate: string,
    endDate: string
): Promise<OrderResponse[]> {
    try {
        const token = getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add Authorization if token is available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Format dates as YYYY-MM-DD
        const formattedStartDate = startDate.split('T')[0];
        const formattedEndDate = endDate.split('T')[0];

        console.log('📤 Fetching orders for store:', { storeId, startDate: formattedStartDate, endDate: formattedEndDate });

        // Call frontend proxy route (which will forward to backend)
        const apiUrl = `/api/orders/store/${storeId}?start_time=${formattedStartDate}&end_time=${formattedEndDate}`;

        console.log('📍 API URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn(`⚠️ Failed to fetch orders: ${response.status}`, errorData);
            return [];
        }

        const data: OrdersByStoreResponse = await response.json();
        console.log('✅ Orders fetched for store:', { count: data.data.length, orders: data.data });

        return data.data || [];
    } catch (error) {
        console.error('❌ Error fetching orders by store:', error);
        // Return empty array on error instead of throwing
        return [];
    }
}

export const OrderService = {
    createPaymentOrder,
    getOrderByCode,
    getOrdersByStore,
};
