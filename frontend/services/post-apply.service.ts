/**
 * Post Apply Service - Handle community post apply operations via socket
 */

import { WebSocketPostApplyNotification } from '@/types'

export interface PostApplyRequest {
    postId: string
    number: number // số lượng người chơi muốn apply
}

export interface PostApplyNotification extends WebSocketPostApplyNotification {
    // Extends WebSocketPostApplyNotification which contains:
    // - applier: PostApplyApplierData (id, name, email, avatarUrl)
    // - post: PostApplyPostData (id, title, poster, timestamp, store, participantIds)
    // - number: number
    // - timestamp: string
}

/**
 * Format apply notification for display
 */
export function formatApplyNotification(notification: PostApplyNotification): string {
    const { applier, post, number } = notification.data
    return `${applier.name} vừa apply ${number} chỗ cho bài viết "${post.title}"`
}

/**
 * Get applier info from notification
 */
export function getApplierInfo(notification: PostApplyNotification) {
    return {
        id: notification.data.applier.id,
        name: notification.data.applier.name,
        email: notification.data.applier.email,
        avatarUrl: notification.data.applier.avatarUrl,
    }
}

/**
 * Get post info from notification
 */
export function getPostInfo(notification: PostApplyNotification) {
    const { post } = notification.data
    return {
        id: post.id,
        title: post.title,
        storeName: post.store.name,
        storeAddress: post.store.address,
        posterName: post.poster.name,
        posterEmail: post.poster.email,
        timestamp: post.timestamp,
        currentParticipants: post.participantIds?.length || 0,
    }
}

/**
 * Validate post apply request
 */
export function validatePostApplyRequest(request: PostApplyRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!request.postId?.trim()) {
        errors.push('Post ID là bắt buộc')
    }

    if (!request.number || request.number <= 0) {
        errors.push('Số lượng người chơi phải lớn hơn 0')
    }

    if (request.number > 100) {
        errors.push('Số lượng người chơi không thể vượt quá 100')
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}
