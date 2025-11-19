// File: services/nearby-store.service.ts
// Service để lấy danh sách cửa hàng gần vị trí người dùng

import { StoreSearchItemResponse } from '@/types';
import { reverseGeocodeAndFindLocation } from './location-helper.service';

/**
 * Request để tìm kiếm cửa hàng gần vị trí
 */
export interface NearbyStoreRequest {
    latitude: number;
    longitude: number;
    distance?: number; // in meters, default 10000 (10km)
    wardName?: string;
    provinceName?: string;
}

/**
 * Lấy danh sách cửa hàng gần vị trí người dùng
 * 
 * @param request - Request payload với latitude, longitude và tùy chọn distance, wardName, provinceName
 * @returns Array của stores gần vị trí
 * 
 * @example
 * const stores = await getNearbyStores({
 *   latitude: 15.2312,
 *   longitude: 160.123,
 *   distance: 10000,
 *   wardName: "Phường Thanh Khê",
 *   provinceName: "Đà Nẵng"
 * });
 */
export async function getNearbyStores(
    request: NearbyStoreRequest
): Promise<StoreSearchItemResponse[]> {
    try {
        // Validate required fields
        if (!request.latitude || !request.longitude) {
            throw new Error('latitude and longitude are required');
        }

        // Distance phải > 0 nếu được cung cấp
        if (request.distance && request.distance <= 0) {
            throw new Error('distance must be greater than 0');
        }

        console.log('📍 Fetching nearby stores with params:', {
            latitude: request.latitude,
            longitude: request.longitude,
            distance: request.distance || 10000,
            wardName: request.wardName || 'NOT PROVIDED',
            provinceName: request.provinceName || 'NOT PROVIDED'
        });

        // Gọi qua proxy route (NextJS API route)
        // QUAN TRỌNG: Gửi wardName + provinceName với ưu tiên cao để backend lọc chính xác
        const requestBody = {
            latitude: request.latitude,
            longitude: request.longitude,
            distance: request.distance || 10000, // Default 10km
            ...(request.wardName && { wardName: request.wardName.trim() }),
            ...(request.provinceName && { provinceName: request.provinceName.trim() })
        };

        console.log('📤 Sending request body to backend:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('/api/recommends/near-by', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
            console.error(`❌ Failed to fetch nearby stores (HTTP ${response.status}):`, errorMessage);
            console.error('❌ Full error response:', errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(`✅ Backend returned ${Array.isArray(data) ? data.length : 'unknown'} nearby stores`);

        // Log thông tin về các cửa hàng trả về để debug
        if (Array.isArray(data) && data.length > 0) {
            console.log('📋 Sample stores received:');
            data.slice(0, 3).forEach((store, idx) => {
                console.log(`  Store ${idx + 1}: ${store.name} @ ${store.address}`, {
                    distance: (store as any).distance,
                    ward: (store as any).ward
                });
            });
        } else {
            console.warn('⚠️ No stores returned by backend');
        }

        // Ensure we return an array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching nearby stores:', error);
        throw error;
    }
}

/**
 * Lấy danh sách cửa hàng gần vị trí dựa trên Geolocation API
 * Tự động lấy wardName và provinceName từ reverse geocoding
 * 
 * @param distance - Khoảng cách tìm kiếm (mặc định 10km)
 * @returns Promise<StoreSearchItemResponse[]>
 */
export async function getNearbyStoresFromGeolocation(
    distance: number = 10000
): Promise<StoreSearchItemResponse[]> {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem Geolocation API có sẵn không
        if (!("geolocation" in navigator)) {
            console.warn('⚠️ Geolocation API not available');
            reject(new Error('Geolocation API not available'));
            return;
        }

        console.log('📍 Getting user location from Geolocation API...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    console.log(`📍 User location: ${latitude}, ${longitude}`);

                    // Lấy thông tin province/ward từ tọa độ
                    const locationInfo = await reverseGeocodeAndFindLocation(latitude, longitude);
                    console.log('📍 Location info result (raw):', locationInfo);

                    // Lấy wardName + provinceName
                    // IMPORTANT: Gửi giá trị từ locationInfo.wardName + locationInfo.provinceName
                    // Không phụ thuộc vào việc tìm được ward object hay không
                    let wardName = locationInfo.wardName?.trim();
                    let provinceName = locationInfo.provinceName?.trim();

                    console.log('📍 Extracted from locationInfo:', {
                        wardName: wardName || 'EMPTY',
                        provinceName: provinceName || 'EMPTY'
                    });

                    // Log chi tiết
                    if (wardName && provinceName) {
                        console.log(`✅ Using location filter - Province: "${provinceName}", Ward: "${wardName}"`);
                    } else if (provinceName) {
                        console.log(`⚠️ Using location filter - Province: "${provinceName}" only (Ward: "${wardName || 'EMPTY'}")`);
                    } else {
                        console.warn('⚠️ Could not determine province/ward from location - using coordinates only');
                    }

                    // LUÔN gửi wardName + provinceName nếu tìm được (ưu tiên lọc chính xác)
                    // Nếu không, chỉ gửi tọa độ
                    const stores = await getNearbyStores({
                        latitude,
                        longitude,
                        distance,
                        ...(wardName && { wardName }),
                        ...(provinceName && { provinceName })
                    });

                    console.log(`🎯 Final: Got ${stores.length} nearby stores`);
                    resolve(stores);
                } catch (error) {
                    console.error('❌ Error getting nearby stores:', error);
                    reject(error);
                }
            },
            (error) => {
                console.error('❌ Geolocation error:', error.message);
                reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // Cache location for 5 minutes
            }
        );
    });
}
