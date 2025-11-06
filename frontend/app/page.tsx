// Import các components và services cần thiết
"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/home/HeroSection"
import PopularFieldsSection from "@/components/home/PopularFieldsSection"
import SportsCategoriesSection from "@/components/home/SportsCategoriesSection"
import TournamentsSection from "@/components/home/TournamentsSection"
import AboutSection from "@/components/home/AboutSection"
import { getPopularFields } from "@/services/api"
import { getSports } from "@/services/api-new"
import { getSportsNews } from "@/services/sports-news"
import { Field, Sport, SportsNews } from "@/types"

// Component trang chủ - sử dụng client-side data fetching
export default function HomePage() {
  // State để lưu trữ dữ liệu từ API
  const [popularFields, setPopularFields] = useState<Field[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [sportsNews, setSportsNews] = useState<SportsNews[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi các API song song để tăng hiệu suất
        const [fieldsData, sportsData, newsResponse] = await Promise.all([
          getPopularFields(),
          getSports(),
          getSportsNews('all', 'vi', 8, 1) // Lấy 8 tin tức mới nhất từ trang 1
        ])

        // Cập nhật state với dữ liệu từ API
        setPopularFields(fieldsData)
        setSports(sportsData)
        setSportsNews(newsResponse.articles || []) // Lấy articles từ response
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false) // Kết thúc loading dù thành công hay thất bại
      }
    }

    fetchData() // Gọi hàm fetch dữ liệu
  }, []) // Dependency array rỗng - chỉ chạy 1 lần khi component mount

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  // Render giao diện chính của trang chủ
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Banner chính */}
      <HeroSection />

      {/* Popular Fields Section - Các sân phổ biến */}
      <PopularFieldsSection fields={popularFields} />

      {/* Sports Categories Section - Các môn thể thao */}
      <SportsCategoriesSection sports={sports} />

      {/* Sports News Section - Tin tức thể thao */}
      <TournamentsSection sportsNews={sportsNews} />

      {/* About Section - Giới thiệu */}
      <AboutSection />
    </div>
  )
}
