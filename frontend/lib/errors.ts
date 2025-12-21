/**
 * Custom error class để phân biệt các lỗi khác nhau
 */

export class NotAuthenticatedError extends Error {
    constructor(message: string = 'Vui lòng đăng nhập để tiếp tục') {
        super(message)
        this.name = 'NotAuthenticatedError'
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Lỗi kết nối mạng') {
        super(message)
        this.name = 'NetworkError'
    }
}

export class ApiError extends Error {
    public statusCode?: number

    constructor(message: string, statusCode?: number) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
    }
}

/**
 * Kiểm tra xem error có phải NotAuthenticatedError không
 */
export function isNotAuthenticatedError(error: any): error is NotAuthenticatedError {
    return error instanceof NotAuthenticatedError
}

/**
 * Kiểm tra xem error có phải NetworkError không
 */
export function isNetworkError(error: any): error is NetworkError {
    return error instanceof NetworkError
}

/**
 * Kiểm tra xem error có phải ApiError không
 */
export function isApiError(error: any): error is ApiError {
    return error instanceof ApiError
}
