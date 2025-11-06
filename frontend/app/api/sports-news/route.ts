/**
 * API Route để lấy tin tức thể thao từ NewsAPI
 * Chạy trên server-side để tránh CORS
 * 
 * Query params:
 * - category: loại môn thể thao
 * - language: ngôn ngữ
 * - pageSize: số bài viết mỗi trang
 * - page: số trang (mặc định 1)
 * - q: search query
 */

import { NextRequest, NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || '12f3ebadc8da4e70b72c41e55b861073'
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

// Danh sách domain có vấn đề (từ từ user report)
const PROBLEMATIC_DOMAINS = ['dkn.tv', 'problematic-source.com']

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get('category') || 'all'
        const language = searchParams.get('language') || 'vi'
        const pageSize = parseInt(searchParams.get('pageSize') || '20')
        const page = parseInt(searchParams.get('page') || '1')
        const searchQuery = searchParams.get('q')

        // Validate pagination
        const validPageSize = Math.min(Math.max(pageSize, 1), 100) // 1-100
        const validPage = Math.max(page, 1)

        // Xây dựng query - Luôn lấy tất cả các môn thể thao
        let query = ''

        if (searchQuery) {
            query = `${searchQuery}`
        } else {
            // Query tất cả các môn thể thao để lấy nhiều bài viết
            query = 'thể thao OR bóng đá OR bóng rổ OR tennis OR cầu lông OR bóng chuyền OR giải đấu OR esports'
        }

        // NewsAPI không hỗ trợ page param, phải dùng sortBy + pagination ở client
        // Nên ta lấy nhiều articles rồi paginate ở server
        const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&sortBy=publishedAt&pageSize=100&apiKey=${NEWS_API_KEY}`

        const response = await fetch(url, {
            method: 'GET',
            next: { revalidate: 300 }
        })

        if (!response.ok) {
            const errorData = await response.json()
            return NextResponse.json(
                { error: errorData.message || 'Failed to fetch news' },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Không filter, lấy tất cả bài viết
        let articles = (data.articles || [])

        // Transform data thêm id và category
        articles = articles.map((article: any, index: number) => ({
            ...article,
            id: `${article.source.name}-${index}-${Date.now()}`,
            category: category,
            sport: category !== 'all' ? category : detectSportFromContent(article.title + ' ' + (article.description || ''))
        }))

        // Pagination
        const totalResults = articles.length
        const startIndex = (validPage - 1) * validPageSize
        const endIndex = startIndex + validPageSize
        const paginatedArticles = articles.slice(startIndex, endIndex)
        const totalPages = Math.ceil(totalResults / validPageSize)

        return NextResponse.json({
            status: 'ok',
            totalResults: totalResults,
            articles: paginatedArticles,
            // Pagination info
            pagination: {
                page: validPage,
                pageSize: validPageSize,
                totalPages: totalPages,
                hasNextPage: validPage < totalPages,
                hasPreviousPage: validPage > 1
            }
        })

    } catch (error) {
        console.error('Error in sports-news API route:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * Phát hiện môn thể thao từ nội dung
 */
function detectSportFromContent(content: string): string {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes('bóng đá') || lowerContent.includes('football')) return 'football'
    if (lowerContent.includes('bóng rổ') || lowerContent.includes('basketball')) return 'basketball'
    if (lowerContent.includes('tennis')) return 'tennis'
    if (lowerContent.includes('cầu lông') || lowerContent.includes('badminton')) return 'badminton'
    if (lowerContent.includes('bóng chuyền') || lowerContent.includes('volleyball')) return 'volleyball'
    if (lowerContent.includes('bơi lội') || lowerContent.includes('swimming')) return 'swimming'
    if (lowerContent.includes('esports') || lowerContent.includes('thể thao điện tử')) return 'esports'

    return 'all'
}
