/**
 * Hook để lấy user ID từ localStorage
 */

export function useUserId(): string {
    if (typeof window === 'undefined') {
        return '0';
    }

    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            // Try different possible property names
            const id = userObj.id || userObj._id || userObj.userId || userObj.sub || '0';
            console.log('👤 useUserId - Retrieved user ID:', id);
            return id;
        }
    } catch (e) {
        console.error('❌ useUserId - Error parsing user from localStorage:', e);
    }

    return '0';
}

/**
 * Hook để lấy user object từ localStorage
 */
export function useUser() {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    } catch (e) {
        console.error('❌ useUser - Error parsing user from localStorage:', e);
    }

    return null;
}
