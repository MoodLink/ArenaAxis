// File: services/nearby-store.service.ts
// Service để lấy danh sách Trung tâm thể thao gần vị trí người dùng

import { StoreSearchItemResponse } from '@/types';
import { reverseGeocodeAndFindLocation } from './location-helper.service';


/**
 * Request để tìm kiếm Trung tâm thể thao gần vị trí
 */
export interface NearbyStoreRequest {
    latitude: number;
    longitude: number;
    distance?: number; // in meters, default 10000 (10km)
    wardName?: string;
    provinceName?: string;
}

/**
 * Lấy danh sách Trung tâm thể thao gần vị trí người dùng
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

        // CHIẾN LƯỢC ĐƠN GIẢN: CHỈ LỌC THEO PROVINCE
        // Không gửi distance, wardName - để backend trả về TẤT CẢ stores trong province
        const requestBody: any = {
            latitude: request.latitude,
            longitude: request.longitude,
            distance: 999999, // Distance rất lớn để không bị giới hạn
        };

        // CHỈ gửi provinceName (nếu có)
        if (request.provinceName && request.provinceName.trim() !== '') {
            requestBody.provinceName = request.provinceName.trim();
        }

        console.log('📤 Sending request body to backend:', JSON.stringify(requestBody, null, 2));
        console.log('🌐 API endpoint: /api/recommends/near-by (POST)');
        console.log('⚠️ Strategy: PROVINCE-ONLY filtering (no ward, no distance limit)');

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

        // Log thông tin về các Trung tâm thể thao trả về để debug
        if (Array.isArray(data) && data.length > 0) {
            console.log('📋 Sample stores received from backend:');
            data.forEach((store, idx) => {
                console.log(`  Store ${idx + 1}:`, {
                    name: store.name,
                    province: store.province?.name || 'NO PROVINCE',
                    provinceId: store.province?.id || 'NO ID',
                    ward: store.ward?.name || 'NO WARD',
                    wardId: store.ward?.id || 'NO ID'
                });
            });
        } else {
            console.warn('⚠️ No stores returned by backend');
        }

        // Ensure we return an array
        const stores = Array.isArray(data) ? data : [];

        // CLIENT-SIDE FILTERING: Lọc stores theo provinceName nếu có
        let filteredStores = stores;

        if (request.provinceName && request.provinceName.trim() !== '') {
            console.log(`🔍 Client-side filtering by province: "${request.provinceName}"`);

            // Chuẩn hóa tên province để so sánh (xóa dấu, lowercase)
            const normalizeProvinceName = (name: string) => {
                return name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'd')
                    .trim();
            };

            const normalizedTargetProvince = normalizeProvinceName(request.provinceName);
            console.log(`📍 Normalized target province: "${normalizedTargetProvince}"`);

            filteredStores = stores.filter((store) => {
                // Sử dụng province object từ backend (chính xác hơn là parse address)
                const storeProvinceName = store.province?.name;

                if (storeProvinceName) {
                    const normalizedStoreProvince = normalizeProvinceName(storeProvinceName);

                    // So sánh chính xác: chỉ match khi 2 province giống hệt nhau
                    const isMatch = normalizedStoreProvince === normalizedTargetProvince;

                    console.log(`   ${isMatch ? '✅' : '❌'} ${store.name}: "${storeProvinceName}" (normalized: "${normalizedStoreProvince}")`);
                    return isMatch;
                } else {
                    // Nếu không có province object, loại bỏ store này
                    console.warn(`⚠️ Store "${store.name}" has no province data - EXCLUDED`);
                    return false; // Loại bỏ để đảm bảo an toàn
                }
            });

            console.log(`🎯 After client-side filtering: ${filteredStores.length} stores (removed ${stores.length - filteredStores.length} out-of-province stores)`);
        }

        return filteredStores;
    } catch (error) {
        console.error('Error fetching nearby stores:', error);
        throw error;
    }
}

/**
 * Lấy danh sách Trung tâm thể thao gần vị trí dựa trên Geolocation API
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

                    // CHIẾN LƯỢC ĐơN GIẢN: CHỈ LỌC THEO PROVINCE
                    // Không quan tâm ward, distance - chỉ cần cùng tỉnh
                    console.log('📋 Filtering strategy: PROVINCE-ONLY (simple & effective)');

                    const stores = await getNearbyStores({
                        latitude,
                        longitude,
                        distance: 999999, // Distance rất lớn
                        // wardName: KHÔNG gửi
                        ...(provinceName && { provinceName }) // CHỈ gửi province
                    });

                    console.log(`🎯 Final: Returning ${stores.length} stores in province "${provinceName || 'unknown'}"`);
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
