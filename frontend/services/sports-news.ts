/**
 * Service để lấy tin tức thể thao
 * Gọi API route internal để tránh CORS
 */

export interface SportsNewsArticle {
    id: string
    title: string
    description: string
    content: string
    url: string
    urlToImage: string
    publishedAt: string
    source: {
        id: string | null
        name: string
    }
    author: string | null
    category: string
    sport?: string
}

export interface PaginationInfo {
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface SportsNewsResponse {
    status: string
    totalResults: number
    articles: SportsNewsArticle[]
    pagination?: PaginationInfo
}

/**
 * Lấy tin tức thể thao mới nhất với pagination
 * @param category - Loại môn thể thao: 'all', 'football', 'basketball', 'tennis', etc.
 * @param language - Ngôn ngữ: 'vi' hoặc 'en'
 * @param pageSize - Số lượng bài viết mỗi trang (mặc định 20)
 * @param page - Số trang (mặc định 1)
 * @returns Danh sách tin tức thể thao + pagination info
 */
export async function getSportsNews(
    category: string = 'all',
    language: string = 'vi',
    pageSize: number = 20,
    page: number = 1
): Promise<SportsNewsResponse> {
    try {
        // Gọi API route internal thay vì gọi trực tiếp NewsAPI (tránh CORS)
        const url = `/api/sports-news?category=${category}&language=${language}&pageSize=${pageSize}&page=${page}`

        const response = await fetch(url, {
            method: 'GET',
            // Cache trong 5 phút
            next: { revalidate: 300 }
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const data: SportsNewsResponse = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching sports news:', error)
        // Fallback về mock data nếu API fail
        return getMockSportsNewsResponse(category, page, pageSize)
    }
}

/**
 * Tìm kiếm tin tức thể thao
 * @param searchQuery - Từ khóa tìm kiếm
 * @param language - Ngôn ngữ
 * @param pageSize - Số lượng bài viết mỗi trang
 * @param page - Số trang
 * @returns Danh sách tin tức
 */
export async function searchSportsNews(
    searchQuery: string,
    language: string = 'vi',
    pageSize: number = 20,
    page: number = 1
): Promise<SportsNewsResponse> {
    try {
        // Gọi API route với search query
        const url = `/api/sports-news?q=${encodeURIComponent(searchQuery)}&language=${language}&pageSize=${pageSize}&page=${page}`

        const response = await fetch(url, {
            method: 'GET',
            next: { revalidate: 300 }
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const data: SportsNewsResponse = await response.json()
        return data
    } catch (error) {
        console.error('Error searching sports news:', error)
        return {
            status: 'error',
            totalResults: 0,
            articles: [],
            pagination: {
                page: 1,
                pageSize: pageSize,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
    }
}

/**
 * Mock data cho trường hợp API không hoạt động
 */
function getMockSportsNewsResponse(category: string, page: number = 1, pageSize: number = 20): SportsNewsResponse {
    const mockArticles: SportsNewsArticle[] = [
        {
            id: 'mock-1',
            title: 'Đội tuyển Việt Nam chuẩn bị cho giải đấu quan trọng',
            description: 'Đội tuyển quốc gia đang tích cực tập luyện cho giải đấu sắp tới với nhiều kỳ vọng từ người hâm mộ.',
            content: 'Nội dung chi tiết về đội tuyển Việt Nam...',
            url: '#',
            urlToImage: '/badminton-tournament-poster.png',
            publishedAt: new Date().toISOString(),
            source: { id: null, name: 'VnExpress' },
            author: 'Biên tập viên',
            category: category,
            sport: category !== 'all' ? category : 'football'
        },
        {
            id: 'mock-2',
            title: 'Giải đấu cầu lông quốc tế sắp diễn ra tại Hà Nội',
            description: 'Sự kiện thể thao lớn với sự tham gia của nhiều vận động viên hàng đầu thế giới.',
            content: 'Chi tiết về giải đấu cầu lông...',
            url: '#',
            urlToImage: '/badminton-court.png',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { id: null, name: 'Thể Thao 247' },
            author: 'Nhà báo thể thao',
            category: category,
            sport: 'badminton'
        }
    ]

    const totalResults = mockArticles.length
    const totalPages = Math.ceil(totalResults / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedArticles = mockArticles.slice(startIndex, endIndex)

    return {
        status: 'ok',
        totalResults: totalResults,
        articles: paginatedArticles,
        pagination: {
            page,
            pageSize,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    }
}
