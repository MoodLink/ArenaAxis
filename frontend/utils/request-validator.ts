/**
 * Request Validator - Kiểm tra format request gửi tới backend
 */

import type { CreatePaymentOrderRequest } from "@/services/order.service";

/**
 * Validate request format
 */
export function validatePaymentOrderRequest(request: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!request.store_id) {
        errors.push("❌ Missing required field: store_id");
    } else if (typeof request.store_id !== "string") {
        errors.push(`❌ store_id should be string, got ${typeof request.store_id}`);
    }

    if (!request.user_id) {
        errors.push("❌ Missing required field: user_id");
    } else if (typeof request.user_id !== "string") {
        errors.push(`❌ user_id should be string, got ${typeof request.user_id}`);
    }

    if (!request.amount) {
        errors.push("❌ Missing required field: amount");
    } else if (typeof request.amount !== "number") {
        errors.push(`❌ amount should be number, got ${typeof request.amount}`);
    } else if (request.amount <= 0) {
        errors.push("❌ amount should be positive number");
    }

    if (!request.description) {
        errors.push("❌ Missing required field: description");
    } else if (typeof request.description !== "string") {
        errors.push(`❌ description should be string, got ${typeof request.description}`);
    }

    if (!request.date) {
        errors.push("❌ Missing required field: date");
    } else if (typeof request.date !== "string") {
        errors.push(`❌ date should be string, got ${typeof request.date}`);
    } else if (!isValidDateFormat(request.date)) {
        errors.push(`❌ date format should be YYYY-MM-DD, got ${request.date}`);
    }

    if (!request.items || !Array.isArray(request.items)) {
        errors.push("❌ Missing required field: items (should be array)");
    } else if (request.items.length === 0) {
        errors.push("❌ items array cannot be empty");
    } else {
        // Validate each item
        request.items.forEach((item: any, index: number) => {
            const itemErrors = validateOrderItem(item, index);
            errors.push(...itemErrors);
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate each order item
 */
function validateOrderItem(item: any, index: number): string[] {
    const errors: string[] = [];

    if (!item.field_id) {
        errors.push(`❌ Item[${index}].field_id is required`);
    } else if (typeof item.field_id !== "string") {
        errors.push(`❌ Item[${index}].field_id should be string, got ${typeof item.field_id}`);
    }

    if (!item.start_time) {
        errors.push(`❌ Item[${index}].start_time is required`);
    } else if (typeof item.start_time !== "string") {
        errors.push(`❌ Item[${index}].start_time should be string, got ${typeof item.start_time}`);
    } else if (!isValidTimeFormat(item.start_time)) {
        errors.push(`❌ Item[${index}].start_time format should be HH:MM, got ${item.start_time}`);
    }

    if (!item.end_time) {
        errors.push(`❌ Item[${index}].end_time is required`);
    } else if (typeof item.end_time !== "string") {
        errors.push(`❌ Item[${index}].end_time should be string, got ${typeof item.end_time}`);
    } else if (!isValidTimeFormat(item.end_time)) {
        errors.push(`❌ Item[${index}].end_time format should be HH:MM, got ${item.end_time}`);
    }

    if (!item.name) {
        errors.push(`❌ Item[${index}].name is required`);
    } else if (typeof item.name !== "string") {
        errors.push(`❌ Item[${index}].name should be string, got ${typeof item.name}`);
    }

    if (typeof item.quantity !== "number") {
        errors.push(`❌ Item[${index}].quantity should be number, got ${typeof item.quantity}`);
    } else if (item.quantity <= 0) {
        errors.push(`❌ Item[${index}].quantity should be positive number`);
    }

    if (typeof item.price !== "number") {
        errors.push(`❌ Item[${index}].price should be number, got ${typeof item.price}`);
    } else if (item.price <= 0) {
        errors.push(`❌ Item[${index}].price should be positive number`);
    }

    return errors;
}

/**
 * Check if date is in YYYY-MM-DD format
 */
function isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    // Also check if it's a valid date
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
}

/**
 * Check if time is in HH:MM format
 */
function isValidTimeFormat(time: string): boolean {
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) return false;

    const [hours, minutes] = time.split(":").map(Number);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

/**
 * Log validation result
 */
export function logValidationResult(validation: ReturnType<typeof validatePaymentOrderRequest>): void {
    console.log("📋 ========== VALIDATION RESULT ==========");
    console.log(`✓ Is Valid: ${validation.isValid}`);

    if (validation.errors.length > 0) {
        console.log("\n❌ ERRORS:");
        validation.errors.forEach((error) => console.log(`   ${error}`));
    }

    if (validation.warnings.length > 0) {
        console.log("\n⚠️ WARNINGS:");
        validation.warnings.forEach((warning) => console.log(`   ${warning}`));
    }

    if (validation.isValid) {
        console.log("\n✅ All validations passed!");
    }

    console.log("========================================\n");
}

/**
 * Example request for testing
 */
export const EXAMPLE_REQUEST: CreatePaymentOrderRequest = {
    store_id: "1",
    user_id: "2",
    amount: 3700,
    description: "Ngày: 10/11/2025",
    date: "2025-11-10",
    items: [
        {
            field_id: "3",
            start_time: "13:00",
            end_time: "13:30",
            name: "Sân A",
            quantity: 1,
            price: 500,
        },
        {
            field_id: "3",
            start_time: "13:30",
            end_time: "14:00",
            name: "Sân A",
            quantity: 1,
            price: 500,
        },
        {
            field_id: "3",
            start_time: "20:30",
            end_time: "21:00",
            name: "Sân A",
            quantity: 1,
            price: 700,
        },
        {
            field_id: "3",
            start_time: "21:00",
            end_time: "21:30",
            name: "Sân A",
            quantity: 1,
            price: 500,
        },
        {
            field_id: "3",
            start_time: "21:30",
            end_time: "22:00",
            name: "Sân A",
            quantity: 1,
            price: 500,
        },
        {
            field_id: "4",
            start_time: "19:00",
            end_time: "19:30",
            name: "Sân C",
            quantity: 1,
            price: 1000,
        },
    ],
};
