"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface CurrentPageInfo {
    pathname: string
    isOnChatPage: boolean
    currentConversationId: string | null
}

/**
 * Hook để track trang hiện tại của user
 * Hỗ trợ detect khi user ở /chat page và conversation nào đang mở
 */
export function useCurrentPage(): CurrentPageInfo {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [pageInfo, setPageInfo] = useState<CurrentPageInfo>({
        pathname: '',
        isOnChatPage: false,
        currentConversationId: null
    })

    useEffect(() => {
        // Kiểm tra xem user có ở /chat page không
        const isOnChatPage = pathname === '/chat' || pathname === '/store/chat'

        let conversationId: string | null = null
        if (isOnChatPage) {
            // Lấy conversationId từ URL params hoặc component state
            // Note: Để chính xác, component chat phải pass conversationId vào session storage
            const stored = sessionStorage.getItem('currentChatConversationId')
            conversationId = stored || null

            console.log('📍 [useCurrentPage] On chat page:', {
                pathname,
                isOnChatPage,
                conversationId
            })
        }

        setPageInfo({
            pathname,
            isOnChatPage,
            currentConversationId: conversationId
        })
    }, [pathname, searchParams])

    return pageInfo
}
