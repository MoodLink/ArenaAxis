// File: services/location-helper.service.ts
// Helper service để xử lý locations - tìm province/ward từ danh sách

import { ProvinceResponse, WardResponse } from '@/types';

/**
 * Lấy danh sách tất cả provinces
 */
export async function getAllProvinces(): Promise<ProvinceResponse[]> {
    try {
        const response = await fetch('/api/locations/provinces', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('Failed to fetch provinces:', response.status);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error getting provinces:', error);
        return [];
    }
}

/**
 * Lấy danh sách wards theo province ID
 */
export async function getWardsByProvinceId(provinceId: string): Promise<WardResponse[]> {
    try {
        const response = await fetch(`/api/locations/provinces/${provinceId}/wards`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('Failed to fetch wards:', response.status);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error getting wards:', error);
        return [];
    }
}

/**
 * Tìm province từ tên (partial match)
 * @param provinceName - Tên province cần tìm (vd: "Đà Nẵng", "Da Nang")
 */
export async function findProvinceByName(provinceName: string): Promise<ProvinceResponse | null> {
    if (!provinceName || provinceName.trim() === '') {
        return null;
    }

    try {
        const provinces = await getAllProvinces();

        // Chuẩn hóa tên tìm kiếm - xóa accents và chuyển thành lowercase
        const normalizedSearch = normalizeVietnameseName(provinceName.trim());

        console.log(`🔍 Searching provinces for: "${provinceName}" (normalized: "${normalizedSearch}")`);
        console.log(`📊 Total provinces available: ${provinces.length}`);

        // Tìm exact match trước (priority cao)
        let foundProvince = provinces.find(p => {
            const normalizedName = normalizeVietnameseName(p.name || '');
            return normalizedName === normalizedSearch;
        });

        if (foundProvince) {
            console.log(`✅ Found exact match: "${foundProvince.name}"`);
            return foundProvince;
        }

        // Tìm partial match nếu không có exact match
        foundProvince = provinces.find(p => {
            const normalizedName = normalizeVietnameseName(p.name || '');
            return normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName);
        });

        if (foundProvince) {
            console.log(`✅ Found partial match: "${foundProvince.name}"`);
            return foundProvince;
        }

        // Nếu không tìm thấy, log danh sách tất cả provinces để debug
        console.warn(`❌ No province found for: "${provinceName}"`);
        console.log('Available provinces:', provinces.map(p => ({
            name: p.name,
            normalized: normalizeVietnameseName(p.name || '')
        })));

        return null;
    } catch (error) {
        console.error('Error finding province:', error);
        return null;
    }
}

/**
 * Chuẩn hóa tên Tiếng Việt - xóa accents
 * @param name - Tên cần chuẩn hóa
 * @returns Tên đã chuẩn hóa (lowercase, không dấu)
 */
function normalizeVietnameseName(name: string): string {
    if (!name) return '';
    
    // Bảng tương ứng các ký tự có dấu sang không dấu
    const vietnameseCharMap: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'À': 'a', 'Á': 'a', 'Ả': 'a', 'Ã': 'a', 'Ạ': 'a', 'Ă': 'a', 'Ằ': 'a', 'Ắ': 'a', 'Ẳ': 'a', 'Ẵ': 'a', 'Ặ': 'a',
        'Â': 'a', 'Ầ': 'a', 'Ấ': 'a', 'Ẩ': 'a', 'Ẫ': 'a', 'Ậ': 'a',
        'Đ': 'd',
        'È': 'e', 'É': 'e', 'Ẻ': 'e', 'Ẽ': 'e', 'Ẹ': 'e', 'Ê': 'e', 'Ề': 'e', 'Ế': 'e', 'Ể': 'e', 'Ễ': 'e', 'Ệ': 'e',
        'Ì': 'i', 'Í': 'i', 'Ỉ': 'i', 'Ĩ': 'i', 'Ị': 'i',
        'Ò': 'o', 'Ó': 'o', 'Ỏ': 'o', 'Õ': 'o', 'Ọ': 'o', 'Ô': 'o', 'Ồ': 'o', 'Ố': 'o', 'Ổ': 'o', 'Ỗ': 'o', 'Ộ': 'o',
        'Ơ': 'o', 'Ờ': 'o', 'Ớ': 'o', 'Ở': 'o', 'Ỡ': 'o', 'Ợ': 'o',
        'Ù': 'u', 'Ú': 'u', 'Ủ': 'u', 'Ũ': 'u', 'Ụ': 'u', 'Ư': 'u', 'Ừ': 'u', 'Ứ': 'u', 'Ử': 'u', 'Ữ': 'u', 'Ự': 'u',
        'Ỳ': 'y', 'Ý': 'y', 'Ỷ': 'y', 'Ỹ': 'y', 'Ỵ': 'y'
    };

    return name
        .split('')
        .map(char => vietnameseCharMap[char] || char)
        .join('')
        .toLowerCase()
        .trim();
}

/**
 * Tìm ward từ tên trong một province
 * @param wardName - Tên ward cần tìm
 * @param provinceId - ID của province
 */
export async function findWardByName(wardName: string, provinceId: string): Promise<WardResponse | null> {
    if (!wardName || !provinceId) {
        return null;
    }

    try {
        const wards = await getWardsByProvinceId(provinceId);

        if (wards.length === 0) {
            console.warn(`⚠️ No wards found for province ID: ${provinceId}`);
            return null;
        }

        // Chuẩn hóa tên tìm kiếm - xóa accents và chuyển thành lowercase
        const normalizedSearch = normalizeVietnameseName(wardName.trim());

        console.log(`🔍 Searching wards for: "${wardName}" (normalized: "${normalizedSearch}")`);
        console.log(`📊 Total wards available: ${wards.length}`);

        // Tìm exact match trước (priority cao)
        let foundWard = wards.find(w => {
            const normalizedName = normalizeVietnameseName(w.name || '');
            return normalizedName === normalizedSearch;
        });

        if (foundWard) {
            console.log(`✅ Found exact match: "${foundWard.name}"`);
            return foundWard;
        }

        // Tìm partial match nếu không có exact match
        foundWard = wards.find(w => {
            const normalizedName = normalizeVietnameseName(w.name || '');
            return normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName);
        });

        if (foundWard) {
            console.log(`✅ Found partial match: "${foundWard.name}"`);
            return foundWard;
        }

        // Nếu không tìm thấy, log danh sách wards để debug
        console.warn(`❌ No ward found for: "${wardName}"`);
        console.log('Available wards (first 10):', wards.slice(0, 10).map(w => ({
            name: w.name,
            normalized: normalizeVietnameseName(w.name || '')
        })));

        return null;
    } catch (error) {
        console.error('Error finding ward:', error);
        return null;
    }
}

/**
 * Reverse geocode (tọa độ → địa chỉ) và tìm province/ward tương ứng
 * @param latitude - Tọa độ latitude
 * @param longitude - Tọa độ longitude
 */
export async function reverseGeocodeAndFindLocation(
    latitude: number,
    longitude: number
): Promise<{
    address?: string;
    provinceName?: string;
    wardName?: string;
    province?: ProvinceResponse | null;
    ward?: WardResponse | null;
}> {
    try {
        console.log(`🔄 Reverse geocoding for [${latitude}, ${longitude}]...`);

        // 1. Lấy address từ tọa độ
        const reverseResponse = await fetch(
            `/api/locations/reverse?lat=${latitude}&lon=${longitude}`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );

        if (!reverseResponse.ok) {
            console.warn('Reverse geocoding failed:', reverseResponse.status);
            return {};
        }

        const addressData = await reverseResponse.json();
        const address = addressData.address || '';
        console.log('📍 Address from OSM (full data):', JSON.stringify(addressData, null, 2));

        // 2. Tìm province từ address
        // Nominatim trả về (không nhất quán):
        // - address.state (code tỉnh như "VN-DN")
        // - address.province (tên tỉnh)
        // - address.city (có thể là tên city hoặc ward - không tin được!)
        // - address.county (huyện/quận)
        // - address.suburb (quận/phường/xã)
        // - address.village (xã)
        // - ISO3166-2-lvl4 (code tỉnh như "VN-DN")
        // - display_name (chứa toàn bộ địa chỉ)
        
        let provinceName: string | undefined;
        
        // STRATEGY 1: Parse từ display_name (đáng tin nhất)
        // Format: "... phường/quận, Thành phố/Tỉnh XYZ, ..."
        if (addressData.display_name) {
            const displayStr = addressData.display_name;
            console.log('🔍 Parsing display_name:', displayStr);
            
            // Tìm kiếm các mẫu tên thành phố
            if (displayStr.includes('Thành phố Đà Nẵng') || displayStr.includes('Da Nang')) {
                provinceName = 'Đà Nẵng';
            } else if (displayStr.includes('Thành phố Hà Nội') || displayStr.includes('Ha Noi')) {
                provinceName = 'Hà Nội';
            } else if (displayStr.includes('Thành phố Hồ Chí Minh') || displayStr.includes('Ho Chi Minh')) {
                provinceName = 'Hồ Chí Minh';
            } else if (displayStr.includes('Thành phố Cần Thơ') || displayStr.includes('Can Tho')) {
                provinceName = 'Cần Thơ';
            } else if (displayStr.includes('Tỉnh')) {
                // Nếu không match được TP nào, cố gắng extract tên tỉnh
                const provinceMatch = displayStr.match(/Tỉnh\s+([^,]+)/);
                if (provinceMatch) {
                    provinceName = provinceMatch[1].trim();
                }
            }
        }

        console.log('🔍 Extracted province name from display_name:', provinceName);

        // STRATEGY 2: Nếu vẫn không có, thử address.province hoặc address.state
        if (!provinceName) {
            provinceName = addressData.address?.province || addressData.address?.state;
            console.log('🔍 Fallback to address.province or address.state:', provinceName);
        }

        let province: ProvinceResponse | null = null;

        if (provinceName && provinceName.trim() !== '') {
            console.log(`🔍 Searching for province: "${provinceName}"`);
            province = await findProvinceByName(provinceName);
            console.log('✅ Found province:', province?.name, '(ID:', province?.id, ')');
        } else {
            console.warn('⚠️ Could not determine province name from location data');
        }

        // 3. Tìm ward từ address nếu có province
        // Nominatim: county → suburb → village
        let ward: WardResponse | null = null;
        let wardName = addressData.address?.suburb || 
                      addressData.address?.county || 
                      addressData.address?.village;

        console.log('🔍 Extracted ward name from Nominatim:', wardName);
        
        // Nếu vẫn không có ward name từ address, thử parse từ display_name
        if (!wardName && addressData.display_name) {
            // Format: "Đường XYZ, Phường ABC, ..."
            const parts = addressData.display_name.split(',').map((s: string) => s.trim());
            // Phần thứ 2 thường là ward
            if (parts.length >= 2) {
                const secondPart = parts[1];
                // Kiểm tra xem có "Phường", "Quận", "Xã", "Thị trấn" không
                if (secondPart.match(/^(Phường|Quận|Xã|Thị trấn)\s+/)) {
                    wardName = secondPart;
                    console.log('🔍 Extracted ward from display_name:', wardName);
                }
            }
        }

        if (wardName && wardName.trim() !== '' && province?.id) {
            console.log(`🔍 Searching for ward: "${wardName}" in province ID: ${province.id}`);
            ward = await findWardByName(wardName, province.id);
            console.log('✅ Found ward:', ward?.name, '(ID:', ward?.id, ')');
        } else {
            console.warn('⚠️ Could not determine ward name or province ID not found');
        }

        return {
            address,
            provinceName: province?.name,
            wardName: ward?.name,
            province,
            ward
        };
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        return {};
    }
}
