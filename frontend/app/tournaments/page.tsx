"use client"

// Import các components cho trang tin tức thể thao
import { useState, useMemo, useEffect } from "react"
import SportsNewsHeader from "@/components/tournaments/SportsNewsHeader"
import SportsNewsFilters from "@/components/tournaments/SportsNewsFilters"
import SportsNewsCard from "@/components/tournaments/SportsNewsCard"
import { getSportsNews, SportsNewsResponse } from "@/services/sports-news"
import { SportsNews } from "@/types"

// Interface cho filters
interface SportsNewsFiltersType {
  search: string
  sport: string
  timeRange: string
  source: string
}

const ITEMS_PER_PAGE = 12

export default function TournamentsPage() {
  // State quản lý filters
  const [filters, setFilters] = useState<SportsNewsFiltersType>({
    search: "",
    sport: "all",
    timeRange: "all",
    source: "all"
  })

  // State quản lý dữ liệu từ API
  const [newsResponse, setNewsResponse] = useState<SportsNewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Lấy dữ liệu từ API (chỉ phụ thuộc vào currentPage)
  useEffect(() => {
    async function fetchSportsNews() {
      try {
        setLoading(true)
        // Luôn lấy 'all' từ API để có tất cả bài viết, rồi filter client-side
        const response = await getSportsNews('all', 'vi', ITEMS_PER_PAGE, currentPage)
        setNewsResponse(response)
      } catch (error) {
        console.error("Error fetching sports news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSportsNews()
  }, [currentPage])

  // Filter news articles - chỉ theo search
  const filteredNews = useMemo(() => {
    if (!newsResponse?.articles) return []

    return newsResponse.articles.filter((news: SportsNews) => {
      // Filter theo search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          news.title.toLowerCase().includes(searchLower) ||
          news.description.toLowerCase().includes(searchLower) ||
          news.content?.toLowerCase().includes(searchLower)

        return matchesSearch
      }

      return true
    })
  }, [newsResponse?.articles, filters.search])

  // Tính toán stats từ tất cả tin tức (không chỉ trang hiện tại)
  const stats = useMemo(() => {
    if (!newsResponse?.articles) return { total: 0, today: 0, trending: 0 }

    const total = newsResponse.totalResults || newsResponse.articles.length
    const now = new Date()

    const today = newsResponse.articles.filter((news: SportsNews) => {
      const newsDate = new Date(news.publishedAt)
      const diffTime = Math.abs(now.getTime() - newsDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 1
    }).length

    // Tin nổi bật: tin trong 3 ngày gần nhất
    const trending = newsResponse.articles.filter((news: SportsNews) => {
      const newsDate = new Date(news.publishedAt)
      const diffTime = Math.abs(now.getTime() - newsDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 3
    }).length

    return { total, today, trending }
  }, [newsResponse?.articles, newsResponse?.totalResults])

  // Xử lý đọc thêm tin tức
  const handleReadMore = (url: string) => {
    // Mở link tin tức trong tab mới
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Xử lý xóa filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      sport: "all",
      timeRange: "all",
      source: "all"
    })
    setCurrentPage(1)
  }

  // Xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll lên top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header với stats */}
        <SportsNewsHeader
          totalNews={stats.total}
          todayNews={stats.today}
          trendingNews={stats.trending}
        />

        {/* Filters */}
        <SportsNewsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Kết quả tìm kiếm */}
        {filters.search && (
          <div className="mb-6 text-gray-600 font-medium">
            Tìm thấy {filteredNews.length} tin tức cho "{filters.search}"
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <p className="text-gray-600">Đang tải tin tức...</p>
          </div>
        ) : (
          <>
            {/* Grid news articles */}
            {filteredNews.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {filteredNews.map((news: SportsNews) => (
                    <SportsNewsCard
                      key={news.id}
                      news={news}
                      onReadMore={handleReadMore}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {newsResponse?.pagination && newsResponse.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mb-8">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!newsResponse.pagination.hasPreviousPage}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-white transition-colors"
                    >
                      ← Trước
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: newsResponse.pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${page === currentPage
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!newsResponse.pagination.hasNextPage}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-white transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                )}

                {/* Pagination Info */}
                {newsResponse?.pagination && (
                  <div className="text-center text-gray-600 text-sm">
                    Trang {currentPage} / {newsResponse.pagination.totalPages} ({newsResponse.totalResults} tin tức)
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy tin tức nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Xóa bộ lọc và xem tất cả
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
