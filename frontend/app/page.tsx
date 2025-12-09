// Import các components và services cần thiết
"use client"

import HeroSection from "@/components/home/HeroSection"
import PopularFieldsSection from "@/components/home/PopularFieldsSection"
import SportsCategoriesSection from "@/components/home/SportsCategoriesSection"
import TournamentsSection from "@/components/home/TournamentsSection"
import AboutSection from "@/components/home/AboutSection"
import { useNearbyStores, useSports, useSportsNews } from "@/hooks/use-homepage-data"

// Component trang chủ - sử dụng React Query với automatic caching
export default function HomePage() {
  // React Query handles caching automatically - no data refetch on navigation back!
  const { data: nearbyStores = [], isLoading: storesLoading, error: storesError } = useNearbyStores()
  const { data: sports = [], isLoading: sportsLoading } = useSports()
  const { data: newsResponse, isLoading: newsLoading } = useSportsNews('all', 'vi', 8, 1)

  const loading = storesLoading || sportsLoading || newsLoading
  const locationError = storesError ? (storesError as Error).message : null
  const sportsNews = newsResponse?.articles || []


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Banner chính */}
      <HeroSection />

      {/* Popular Fields Section - Hiển thị các Trung tâm thể thao gần đây */}
      <PopularFieldsSection
        fields={nearbyStores as any}
        showNearby={true}
        nearbyDistance={10000}
      />

      {/* Hiển thị lỗi location nếu có */}
      {locationError && (
        <div className="container mx-auto px-4 py-4 mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <p className="font-semibold"> Không thể lấy vị trí của bạn</p>
            <p className="text-sm">{locationError}</p>
            <p className="text-sm mt-2"> Hãy cho phép ứng dụng truy cập vị trí để xem Trung tâm thể thao gần đây</p>
          </div>
        </div>
      )}

      {/* Sports Categories Section - Các môn thể thao */}
      <SportsCategoriesSection sports={sports} />

      {/* Sports News Section - Tin tức thể thao */}
      <TournamentsSection sportsNews={sportsNews} />

      {/* About Section - Giới thiệu */}
      <AboutSection />
    </div>
  )
}
