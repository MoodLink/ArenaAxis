"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Star, Flame } from "lucide-react"
import { getCommunityPosts, CommunityPost } from "@/services/posts.service"
import { useCommunitySearchAndFilter } from "@/hooks/use-community-search-filter"
import CommunitySearchBar from "@/components/community/CommunitySearchBar"
import CommunityStats from "@/components/community/CommunityStats"
import CommunityResultsHeader from "@/components/community/CommunityResultsHeader"
import CommunityEmptyState from "@/components/community/CommunityEmptyState"
import CommunityPostCard from "@/components/community/CommunityPostCard"
import CommunityPagination from "@/components/community/CommunityPagination"

export default function CommunityPage() {
  // State quản lý dữ liệu
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [featuredCommunities, setFeaturedCommunities] = useState<any[]>([])
  const [trendingTopics, setTrendingTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Use custom hook for search and filtering
  const {
    searchQuery,
    selectedFilters,
    currentPage,
    filteredPosts,
    paginatedPosts,
    totalPages,
    totalFilteredItems,
    startIndex,
    endIndex,
    handleSearchChange,
    handleFiltersChange,
    handlePageChange,
    nextPage,
    prevPage,
    itemsPerPage
  } = useCommunitySearchAndFilter(posts, 8)

  // useEffect để fetch dữ liệu bài viết từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const postsData = await getCommunityPosts()

        setPosts(Array.isArray(postsData) ? postsData : [])
        // Featured communities and trending topics are not used right now, 
        // but we'll keep them as empty arrays for future use
        setFeaturedCommunities([])
        setTrendingTopics([])
      } catch (error) {
        console.error('Error fetching community posts:', error)
        // Set empty arrays on error
        setPosts([])
        setFeaturedCommunities([])
        setTrendingTopics([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Xử lý like bài viết
  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      )
    )
  }

  // Xử lý comment bài viết
  const handleComment = (postId: string) => {
    // Navigate đến trang chi tiết hoặc mở modal comment
    console.log('Comment on post:', postId)
  }

  // Xử lý tham gia hoạt động
  const handleJoin = (postId: string) => {
    // Gọi API để tham gia hoạt động
    console.log('Join activity:', postId)
    // Có thể cập nhật số lượng participants hoặc navigate đến chat
  }

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  const hasActiveFilters = !!searchQuery || selectedFilters.sport !== "Tất cả" || selectedFilters.distance !== "Tất cả"

  // Render giao diện chính
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Stats */}
      <CommunityStats />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Post Button */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
              <CardContent className="p-4">
                <Link href="/community/create">
                  <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold h-12">
                    <Plus className="w-5 h-5 mr-2" />
                    Tạo hoạt bài viết mới
                  </Button>
                </Link>
                <p className="text-sm text-green-100 mt-2 text-center">
                  Chia sẻ niềm đam mê của bạn với cộng đồng!
                </p>
              </CardContent>
            </Card>

            {/* Featured Communities */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Bài viết nổi bật
                </h3>
                <div className="space-y-3">
                  {featuredCommunities.map((community, index) => (
                    <div key={index} className="group p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{community.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm group-hover:text-green-600 transition-colors">
                                {community.name}
                              </span>
                              {community.trending
                                // && (
                                //   <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                                //     <Flame className="w-3 h-3 mr-1" />
                                //     Hot
                                //   </Badge>
                                // )
                              }
                            </div>
                            {/* <div className="text-xs text-gray-500 mt-0.5">
                              {community.members} thành viên • {community.posts} bài viết
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 ml-11">{community.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            {/* <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 hover:text-green-600">
                          #{topic.tag}
                        </span>
                        {topic.trending && (
                          <Badge className="bg-orange-100 text-orange-600 text-xs px-1 py-0.5">
                            🔥
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{topic.count} bài</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Search Filters */}
            <CommunitySearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedFilters={selectedFilters}
              onFiltersChange={handleFiltersChange}
              totalResults={totalFilteredItems}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Posts loading state */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Results header */}
                <CommunityResultsHeader
                  filteredPosts={filteredPosts}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  itemsPerPage={itemsPerPage}
                />

                {/* Posts list */}
                <div className="space-y-4">
                  {paginatedPosts.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onJoin={handleJoin}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <CommunityPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalFilteredItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onPrevPage={prevPage}
                  onNextPage={nextPage}
                />

                {/* Empty state */}
                {filteredPosts.length === 0 && <CommunityEmptyState />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating create button for mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Link href="/community/create">
          <Button className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16 shadow-xl">
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
