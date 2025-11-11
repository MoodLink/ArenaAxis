// Trang lịch sử đặt sân - hiển thị các lần đặt sân của người dùng
"use client"

import { useState, useEffect } from "react"
import BookingHeader from "@/components/booking/BookingHeader"
import BookingStats from "@/components/booking/BookingStats"
import BookingFilters from "@/components/booking/BookingFilters"
import BookingTabsNav from "@/components/booking/BookingTabsNav"
import BookingItem from "@/components/booking/BookingItem"
import BookingEmptyState from "@/components/booking/BookingEmptyState"
import { getBookingHistory, cancelBooking, getBookingTabs, getBookingStatusMap, getSportOptions } from "@/services/api"
import { Booking, BookingTab } from "@/types"

export default function BookingHistoryPage() {
  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("Tất cả")

  // State quản lý search và filter
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [sportFilter, setSportFilter] = useState("")

  // State quản lý dữ liệu booking
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // State cho static data
  const [tabs, setTabs] = useState<BookingTab[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [sportOptions, setSportOptions] = useState<{ value: string; label: string }[]>([])

  // Fetch static data
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [tabsData, statusMapData, sportsData] = await Promise.all([
          getBookingTabs(),
          getBookingStatusMap(),
          getSportOptions()
        ])

        setTabs(tabsData)
        setStatusMap(statusMapData)
        setSportOptions(sportsData)
      } catch (error) {
        console.error('Error fetching static data:', error)
      }
    }

    fetchStaticData()
  }, [])

  // useEffect để fetch dữ liệu booking khi component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookingHistory()
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching booking history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Cập nhật tabs count dựa trên bookings data
  useEffect(() => {
    if (tabs.length > 0 && bookings.length > 0) {
      const updatedTabs = tabs.map(tab => ({
        ...tab,
        count: tab.id === "Tất cả"
          ? bookings.length
          : tab.id === "Sắp tới"
            ? bookings.filter(b => b.status === "confirmed").length
            : tab.id === "Đã xong"
              ? bookings.filter(b => b.status === "completed").length
              : tab.id === "Đã hủy"
                ? bookings.filter(b => b.status === "cancelled").length
                : 0
      }))
      setTabs(updatedTabs)
    }
  }, [bookings])

  // useEffect để lọc booking theo tab đang active và search
  useEffect(() => {
    let filtered = bookings

    // Lọc theo tab
    if (activeTab !== "Tất cả") {
      const statusValue = statusMap[activeTab]
      if (statusValue) {
        filtered = filtered.filter(booking => booking.status === statusValue)
      }
    }

    // Lọc theo search query
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Lọc theo date filter
    if (dateFilter) {
      // Logic lọc theo ngày sẽ được implement
    }

    setFilteredBookings(filtered)
  }, [activeTab, bookings, searchQuery, dateFilter, sportFilter])

  // Xử lý thay đổi tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Xử lý các hành động trên booking (Chi tiết, Hủy đặt, Đặt lại)
  const handleBookingAction = async (bookingId: string, action: string) => {
    switch (action) {
      case "Chi tiết":
        // Navigate đến trang chi tiết booking
        console.log(`View details for booking ${bookingId}`)
        break

      case "Hủy đặt":
        // Gọi API hủy đặt sân
        if (confirm("Bạn có chắc chắn muốn hủy đặt sân này?")) {
          try {
            const success = await cancelBooking(bookingId)
            if (success) {
              // Cập nhật trạng thái booking trong state
              setBookings(prev =>
                prev.map(booking =>
                  booking.id === bookingId
                    ? {
                      ...booking,
                      status: "cancelled" as const,
                      statusColor: "bg-red-100 text-red-800",
                      actions: ["Chi tiết"]
                    }
                    : booking
                )
              )
              alert("Hủy đặt sân thành công!")
            } else {
              alert("Không thể hủy đặt sân. Vui lòng thử lại.")
            }
          } catch (error) {
            console.error('Error canceling booking:', error)
            alert("Có lỗi xảy ra. Vui lòng thử lại.")
          }
        }
        break

      case "Đặt lại":
        // Navigate đến trang đặt sân với thông tin tương tự
        console.log(`Rebook booking ${bookingId}`)
        break

      default:
        console.log(`Unknown action: ${action}`)
    }
  }

  // Render giao diện chính
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header trang */}
      <BookingHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section với Title và Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đặt sân</h1>
              <p className="text-gray-600">Quản lý và theo dõi các lần đặt sân của bạn</p>
            </div>
            <BookingStats bookings={bookings} />
          </div>

          {/* Search and Filter Bar */}
          <BookingFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sportFilter={sportFilter}
            setSportFilter={setSportFilter}
            sportOptions={sportOptions}
          />

          {/* Modern Tab Navigation */}
          <BookingTabsNav
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải lịch sử đặt sân...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Booking Grid */}
            <div className="grid gap-6">
              {filteredBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  onBookingAction={handleBookingAction}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <BookingEmptyState activeTab={activeTab} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
