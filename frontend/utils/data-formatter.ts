/**
 * Data Formatter Utilities - Chuẩn hóa dữ liệu VNĐ, ngày tháng, thời gian
 */

/**
 * Format giá tiền theo đơn vị VNĐ
 * @param amount - Số tiền (đơn vị VNĐ)
 * @returns Chuỗi định dạng tiền (e.g., "10,500")
 */
export function formatVND(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        console.warn(` formatVND: Invalid amount "${amount}"`);
        return '0';
    }

    // Làm tròn đến số nguyên gần nhất
    const rounded = Math.round(num);

    // Format với dấu phân cách hàng nghìn
    return rounded.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace('₫', '').trim();
}

/**
 * Format tiền VNĐ với ký hiệu ₫
 * @param amount - Số tiền
 * @returns Chuỗi "10,500 ₫"
 */
export function formatVNDWithSymbol(amount: number | string): string {
    return `${formatVND(amount)} ₫`;
}

/**
 * Validate amount là số dương
 * @param amount - Số tiền cần validate
 * @returns true nếu hợp lệ, false nếu không
 */
export function isValidAmount(amount: any): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num > 0;
}

/**
 * Format ngày tháng năm theo format Việt Nam
 * @param dateString - Chuỗi ngày (format YYYY-MM-DD)
 * @returns Chuỗi ngày định dạng (e.g., "12/11/2025")
 */
export function formatDateVN(dateString: string): string {
    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            console.warn(` formatDateVN: Invalid date "${dateString}"`);
            return dateString;
        }

        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch (e) {
        console.error(` formatDateVN: Error formatting "${dateString}":`, e);
        return dateString;
    }
}

/**
 * Format ngày tháng năm theo format US (YYYY-MM-DD)
 * @param date - Date object hoặc chuỗi ngày
 * @returns Chuỗi ngày format YYYY-MM-DD
 */
export function formatDateISO(date: Date | string): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            console.warn(` formatDateISO: Invalid date "${date}"`);
            return '';
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error(` formatDateISO: Error formatting:`, e);
        return '';
    }
}

/**
 * Format thời gian HH:MM
 * @param timeString - Chuỗi thời gian (HH:MM)
 * @returns Chuỗi thời gian định dạng (e.g., "14:30")
 */
export function formatTime(timeString: string): string {
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!timeRegex.test(timeString)) {
        console.warn(` formatTime: Invalid time format "${timeString}" (expected HH:MM)`);
        return timeString;
    }

    return timeString; // Đã đúng format rồi
}

/**
 * Validate format thời gian HH:MM
 * @param timeString - Chuỗi thời gian
 * @returns true nếu hợp lệ
 */
export function isValidTimeFormat(timeString: string): boolean {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(timeString)) return false;

    const [hours, minutes] = timeString.split(':').map(Number);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

/**
 * Validate format ngày YYYY-MM-DD
 * @param dateString - Chuỗi ngày
 * @returns true nếu hợp lệ
 */
export function isValidDateFormat(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

/**
 * Validate và normalize amount
 * @param amount - Số tiền cần kiểm tra
 * @returns Amount sau khi normalize (hoặc 0 nếu invalid)
 */
export function normalizeAmount(amount: any): number {
    if (typeof amount === 'number' && !isNaN(amount) && amount > 0) {
        return Math.round(amount); // Làm tròn đến số nguyên
    }

    if (typeof amount === 'string') {
        const parsed = parseFloat(amount);
        if (!isNaN(parsed) && parsed > 0) {
            return Math.round(parsed);
        }
    }

    console.warn(` normalizeAmount: Invalid amount "${amount}", using 0`);
    return 0;
}

/**
 * Validate và normalize thời gian
 * @param timeString - Chuỗi thời gian
 * @returns Chuỗi thời gian hợp lệ hoặc empty string nếu invalid
 */
export function normalizeTime(timeString: string): string {
    if (!isValidTimeFormat(timeString)) {
        console.warn(` normalizeTime: Invalid time format "${timeString}"`);
        return '';
    }
    return timeString;
}

/**
 * Validate và normalize ngày
 * @param dateString - Chuỗi ngày (YYYY-MM-DD)
 * @returns Chuỗi ngày hợp lệ hoặc empty string nếu invalid
 */
export function normalizeDate(dateString: string): string {
    if (!isValidDateFormat(dateString)) {
        console.warn(` normalizeDate: Invalid date format "${dateString}"`);
        return '';
    }
    return dateString;
}

/**
 * Tính thời gian kết thúc từ thời gian bắt đầu
 * @param startTime - Thời gian bắt đầu (HH:MM)
 * @param durationMinutes - Thời lượng (phút)
 * @returns Thời gian kết thúc (HH:MM)
 */
export function addMinutesToTime(startTime: string, durationMinutes: number = 30): string {
    try {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + durationMinutes;

        const endHours = Math.floor(totalMinutes / 60) % 24; // Mod 24 để handle ngày hôm sau
        const endMinutes = totalMinutes % 60;

        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    } catch (e) {
        console.error(` addMinutesToTime: Error calculating end time for "${startTime}":`, e);
        return startTime;
    }
}

/**
 * So sánh hai thời gian (trả về difference in minutes)
 * @param startTime - Thời gian bắt đầu (HH:MM)
 * @param endTime - Thời gian kết thúc (HH:MM)
 * @returns Chênh lệch thời gian (phút)
 */
export function getTimeDifference(startTime: string, endTime: string): number {
    try {
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        return endMinutes - startMinutes;
    } catch (e) {
        console.error(` getTimeDifference: Error:`, e);
        return 0;
    }
}

/**
 * Log tất cả dữ liệu đã format
 */
export function logFormattedData(data: any): void {
    console.log('========== FORMATTED DATA ==========');
    console.log(JSON.stringify(data, null, 2));
    console.log('=====================================\n');
}
