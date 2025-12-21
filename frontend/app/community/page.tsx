"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Star, Flame, Loader2 } from "lucide-react"
import { searchPosts, CommunityPost } from "@/services/posts.service"
import PostSearchFilters, { SearchFilters } from "@/components/community/PostSearchFilters"
import CommunityStats from "@/components/community/CommunityStats"
import CommunityEmptyState from "@/components/community/CommunityEmptyState"
import CommunityPostCard from "@/components/community/CommunityPostCard"
import PostApplyDialog from "@/components/community/PostApplyDialog"
import { useUserId } from "@/hooks/use-user-id"
import { useMessageSocket } from "@/hooks/use-message-socket"
import { usePostApplyNotification } from "@/hooks/use-post-apply-notification"
import { WebSocketPostApplyNotification } from "@/types"

export default function CommunityPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})
  // Debounced filters - used for actual API calls
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>({})
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedPostForApply, setSelectedPostForApply] = useState<CommunityPost | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const itemsPerPage = 12

  // Get user ID từ authentication
  const userId = useUserId()

  // Setup socket connection cho post apply notifications
  const handlePostApplyNotification = (notification: WebSocketPostApplyNotification) => {
    console.log('📬 Post apply notification received:', notification)
    // Có thể thêm logic để update UI, show toast, etc
  }

  const { handleNotification } = usePostApplyNotification({
    enabled: true,
    onNotification: handlePostApplyNotification,
    autoShowToast: true,
  })

  // Setup WebSocket
  const { sendPostApply } = useMessageSocket({
    userId,
    onPostApplyNotification: handleNotification,
  })

  // Debounce filters changes - 800ms để tránh gọi API quá nhiều lần
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(selectedFilters)
      setCurrentPage(1) // Reset về trang 1 khi filters thay đổi
    }, 800) // Debounce 800ms như list-store

    return () => clearTimeout(timer)
  }, [selectedFilters])

  // Helper: Clean filters - remove empty values
  const cleanFilters = (filters: SearchFilters): SearchFilters => {
    const cleaned: SearchFilters = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        cleaned[key as keyof SearchFilters] = value
      }
    })
    return cleaned
  }

  const cleanedDebouncedFilters = cleanFilters(debouncedFilters)
  const hasFilters = Object.keys(cleanedDebouncedFilters).length > 0

  // Sử dụng React Query để fetch posts - luôn dùng searchPosts với cleaned filters
  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['posts', cleanedDebouncedFilters, currentPage],
    queryFn: async () => {
      console.log('🔍 Searching posts with filters:', cleanedDebouncedFilters)
      const postsData = await searchPosts(cleanedDebouncedFilters, currentPage - 1, itemsPerPage)
      return Array.isArray(postsData) ? postsData : []
    },
    staleTime: 3 * 1000, // Cache 3 giây
    gcTime: 2 * 1000, // 2 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000,
    placeholderData: (previousData) => previousData,
  })

  // Fetch tất cả pages để lấy total count - tương tự như list-store
  const { data: totalPosts = 0 } = useQuery({
    queryKey: ['postsTotalCount', cleanedDebouncedFilters],
    queryFn: async () => {
      // Lấy page đầu tiên để tính total
      const pageStores = await searchPosts(cleanedDebouncedFilters, 0, itemsPerPage)
      const firstPageCount = Array.isArray(pageStores) ? pageStores.length : 0

      // Nếu page đầu có < 12 items, đó chính là total
      if (firstPageCount < itemsPerPage) {
        return firstPageCount
      }

      // Nếu page đầu đầy, fetch thêm pages để tính total
      // Giới hạn chỉ fetch tối đa 5 pages để tránh quá chậm
      let total = firstPageCount
      for (let i = 1; i < 5; i++) {
        const nextPageStores = await searchPosts(cleanedDebouncedFilters, i, itemsPerPage)
        const nextPageCount = Array.isArray(nextPageStores) ? nextPageStores.length : 0

        if (nextPageCount === 0) break
        total += nextPageCount

        if (nextPageCount < itemsPerPage) break
      }

      console.log(`📊 Total posts: ${total}`)
      return total
    },
    staleTime: 3 * 1000,
    gcTime: 2 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000,
  })

  // Tính tổng số trang
  const totalPages = Math.ceil(totalPosts / itemsPerPage)

  const handleFiltersChange = (filters: SearchFilters) => {
    setSelectedFilters(filters)
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
    setCurrentPage(1)
  }

  const handleJoinPost = (postId: string) => {
    if (!userId) {
      console.error('User not logged in')
      return
    }

    // Find the post from current posts
    const post = posts.find(p => p.id === postId)
    if (post) {
      setSelectedPostForApply(post)
      setApplyDialogOpen(true)
    }
  }

  const handleApplySubmit = async (numberOfPlayers: number) => {
    if (!selectedPostForApply || !userId) {
      return
    }

    setIsApplying(true)
    try {
      const result = sendPostApply(selectedPostForApply.id, numberOfPlayers)
      if (result) {
        console.log('✅ Post apply sent successfully for post:', selectedPostForApply.id)
      } else {
        console.error('❌ Failed to send post apply')
        throw new Error('Failed to send post apply')
      }
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Cộng đồng sân bóng</h1>
            <p className="text-slate-600">Tìm các bài viết liên quan đến các sân bóng trên khắp đất nước</p>
          </div>
          <Link href="/community/create">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-5 h-5" />
              Tạo bài viết
            </Button>
          </Link>
        </div>

        {/* Search Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <PostSearchFilters onSearch={handleFiltersChange} onClear={handleClearFilters} isLoading={isLoading} />
        </div>

        {/* Status Info */}
        {hasFilters && (
          <div className="mb-4 text-sm text-slate-600">
            Tổng: <span className="font-semibold">{totalPosts}</span> bài viết
          </div>
        )}

        {/* Loading Overlay on First Load */}
        {isLoading && posts.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Không tìm thấy bài viết nào</p>
          </div>
        )}

        {/* Posts Grid - hiển thị data ngay, không chờ loading (optimistic UI) */}
        {posts.length > 0 && (
          <div className="relative">
            {/* Loading indicator trên grid - không block interaction */}
            {isLoading && posts.length > 0 && (
              <div className="absolute top-0 right-0 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tải...</span>
              </div>
            )}

            <div className="space-y-4 mb-8">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onJoin={handleJoinPost}
                  onComment={() => {
                    // TODO: Implement comment functionality
                  }}
                />
              ))}
            </div>

            {/* Pagination Info */}
            {hasFilters && (
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Trang <span className="font-semibold">{currentPage}</span> trên{' '}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post Apply Dialog */}
        <PostApplyDialog
          post={selectedPostForApply}
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          onSubmit={handleApplySubmit}
          isLoading={isApplying}
        />
      </div>
    </div>
  )
}
