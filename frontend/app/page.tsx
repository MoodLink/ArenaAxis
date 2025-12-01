// Import các components và services cần thiết
"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/home/HeroSection"
import PopularFieldsSection from "@/components/home/PopularFieldsSection"
import SportsCategoriesSection from "@/components/home/SportsCategoriesSection"
import TournamentsSection from "@/components/home/TournamentsSection"
import AboutSection from "@/components/home/AboutSection"
import { getSports } from "@/services/api-new"
import { getSportsNews } from "@/services/sports-news"
import { getNearbyStoresFromGeolocation } from "@/services/nearby-store.service"
import { Sport, SportsNews, StoreSearchItemResponse } from "@/types"

// Component trang chủ - sử dụng client-side data fetching
export default function HomePage() {
  // State để lưu trữ dữ liệu từ API
  const [nearbyStores, setNearbyStores] = useState<StoreSearchItemResponse[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [sportsNews, setSportsNews] = useState<SportsNews[]>([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi các API song song để tăng hiệu suất
        // 1. Lấy danh sách Trung tâm thể thao gần vị trí người dùng (10km)
        let storesData: StoreSearchItemResponse[] = []
        try {
          storesData = await getNearbyStoresFromGeolocation(10000)
          console.log('✅ Nearby stores loaded:', storesData.length)
          setLocationError(null)
        } catch (locationError: any) {
          console.warn('⚠️ Cannot get nearby stores:', locationError.message)
          setLocationError(locationError.message)
          // Tiếp tục fetch dữ liệu khác ngay cả khi geolocation fail
        }

        // 2. Lấy danh sách môn thể thao
        const sportsData = await getSports()

        // 3. Lấy tin tức thể thao
        const newsResponse = await getSportsNews('all', 'vi', 8, 1)

        // Cập nhật state với dữ liệu từ API
        setNearbyStores(storesData)
        setSports(sportsData)
        setSportsNews(newsResponse.articles || []) // Lấy articles từ response
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false) // Kết thúc loading dù thành công hay thất bại
      }
    }

    fetchData()
  }, [])


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
            <p className="font-semibold">⚠️ Không thể lấy vị trí của bạn</p>
            <p className="text-sm">{locationError}</p>
            <p className="text-sm mt-2">💡 Hãy cho phép ứng dụng truy cập vị trí để xem Trung tâm thể thao gần đây</p>
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
