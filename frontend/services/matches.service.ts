/**
 * Matches Service - Handle match-related operations
 * Fetches matches grouped from orders for recruiting players
 */

export interface FieldInfo {
    id: string;
    name: string | null;
}

export interface SportInfo {
    id: string;
    name: string;
    nameEn: string;
}

export interface Match {
    id: string;
    date: string; // Format: YYYY-MM-DD
    startTime: string; // Format: HH:mm:ss
    endTime: string; // Format: HH:mm:ss
    field: FieldInfo;
    sport: SportInfo;
    price: number;
}

export interface OrderDetail {
    fieldId: string;
    startTime: string; // Format: YYYY-MM-DD HH:mm
    endTime: string;
    price: number;
}

// Helper function to get token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
}

/**
 * Calculate matches from orderDetails by grouping consecutive time slots on same field
 * @param orderDetails - Array of order details with fieldId, startTime, endTime, price
 * @returns Array of calculated matches
 */
export function calculateMatchesFromOrderDetails(orderDetails: OrderDetail[]): Match[] {
    if (!orderDetails || orderDetails.length === 0) {
        return [];
    }

    // Group by fieldId
    const groupedByField: { [fieldId: string]: OrderDetail[] } = {};

    orderDetails.forEach(detail => {
        if (!groupedByField[detail.fieldId]) {
            groupedByField[detail.fieldId] = [];
        }
        groupedByField[detail.fieldId].push(detail);
    });

    const matches: Match[] = [];
    let matchId = 1;

    // For each field, group consecutive time slots
    Object.entries(groupedByField).forEach(([fieldId, details]) => {
        // Sort by startTime
        const sorted = [...details].sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Group consecutive slots
        let currentGroup: OrderDetail[] = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];

            // Check if consecutive (current start time = previous end time)
            if (prev.endTime === curr.startTime) {
                currentGroup.push(curr);
            } else {
                // Create match from group
                matches.push({
                    id: `match-${matchId++}`,
                    date: currentGroup[0].startTime.split(' ')[0],
                    startTime: currentGroup[0].startTime.split(' ')[1] + ':00',
                    endTime: currentGroup[currentGroup.length - 1].endTime.split(' ')[1] + ':00',
                    field: {
                        id: fieldId,
                        name: null,
                    },
                    sport: {
                        id: 'unknown',
                        name: 'Unknown',
                        nameEn: 'Unknown',
                    },
                    price: currentGroup.reduce((sum, d) => sum + d.price, 0),
                });

                currentGroup = [curr];
            }
        }

        // Add last group as match
        if (currentGroup.length > 0) {
            matches.push({
                id: `match-${matchId++}`,
                date: currentGroup[0].startTime.split(' ')[0],
                startTime: currentGroup[0].startTime.split(' ')[1] + ':00',
                endTime: currentGroup[currentGroup.length - 1].endTime.split(' ')[1] + ':00',
                field: {
                    id: fieldId,
                    name: null,
                },
                sport: {
                    id: 'unknown',
                    name: 'Unknown',
                    nameEn: 'Unknown',
                },
                price: currentGroup.reduce((sum, d) => sum + d.price, 0),
            });
        }
    });

    console.log('Calculated matches from orderDetails:', matches);
    return matches;
}

/**
 * Fetch matches from an order
 * Groups consecutive time slots on the same field into matches
 * @param orderId - The order ID to fetch matches for
 * @returns Array of matches
 */
export async function getMatchesByOrderId(orderId: string): Promise<Match[]> {
    try {
        const token = getToken();
        const url = `/api/matches/order/${orderId}`;

        console.log('Fetching matches from:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        console.log('Matches response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching matches:', response.status, errorText);
            throw new Error(`Failed to fetch matches: ${response.status}`);
        }

        const data = await response.json();
        console.log('Matches data received:', data);
        const matches = data.data || data || [];
        console.log('Returning matches:', Array.isArray(matches) ? matches.length : 0, 'matches');
        return Array.isArray(matches) ? matches : [];
    } catch (error) {
        console.error('Error in getMatchesByOrderId:', error);
        throw error;
    }
}

/**
 * Format match display time
 * @param startTime - Start time in HH:mm:ss format
 * @param endTime - End time in HH:mm:ss format
 * @returns Formatted time string (e.g., "19:00 - 21:00")
 */
export function formatMatchTime(startTime: string, endTime: string): string {
    const start = startTime.substring(0, 5); // HH:mm
    const end = endTime.substring(0, 5); // HH:mm
    return `${start} - ${end}`;
}

/**
 * Format match duration in minutes
 * @param startTime - Start time in HH:mm:ss format
 * @param endTime - End time in HH:mm:ss format
 * @returns Duration in minutes
 */
export function getMatchDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}Z`);
    const end = new Date(`2000-01-01T${endTime}Z`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Format price with currency
 * @param price - Price in VND
 * @returns Formatted price string (e.g., "400.000 đ")
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

/**
 * Format date for display
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date string
 */
export function formatMatchDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
