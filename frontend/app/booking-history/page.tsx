// Trang lịch sử đặt sân - hiển thị các lần đặt sân của người dùng
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BookingHeader from "@/components/booking/BookingHeader"
import BookingStats from "@/components/booking/BookingStats"
import BookingFilters from "@/components/booking/BookingFilters"
import BookingTabsNav from "@/components/booking/BookingTabsNav"
import BookingItem from "@/components/booking/BookingItem"
import BookingEmptyState from "@/components/booking/BookingEmptyState"
import { cancelBooking } from "@/services/api"
import { getUserOrders, OrderService } from "@/services/order.service"
import { getMyProfile } from "@/services/get-my-profile"
import { Booking, BookingTab } from "@/types"

// Map OrderResponse to Booking format
function mapOrderToBooking(order: any, index: number): Booking {
  // Get first order detail for date/time info
  const firstDetail = order.orderDetails?.[0]
  // Parse booking date from startTime using Date object (ngày đặt sân thực tế)
  let bookingDate = new Date().toLocaleDateString('vi-VN')
  let bookingTime = '00:00'
  let paymentDate = new Date().toLocaleDateString('vi-VN')

  if (firstDetail?.startTime) {
    bookingDate = new Date(firstDetail.startTime).toLocaleDateString('vi-VN')
    bookingTime = new Date(firstDetail.startTime).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Parse payment date from createdAt (ngày thanh toán)
  if (order.createdAt) {
    paymentDate = new Date(order.createdAt).toLocaleDateString('vi-VN')
  }

  // Calculate TOTAL duration from ALL orderDetails
  let totalDuration = 0
  if (order.orderDetails && order.orderDetails.length > 0) {
    order.orderDetails.forEach((detail: any) => {
      if (detail.startTime && detail.endTime) {
        const [, startTimeStr] = detail.startTime.split(' ')
        const [, endTimeStr] = detail.endTime.split(' ')
        if (startTimeStr && endTimeStr) {
          const [startHour, startMin] = startTimeStr.split(':').map(Number)
          const [endHour, endMin] = endTimeStr.split(':').map(Number)
          const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin)
          totalDuration += duration
        }
      }
    })
  }

  // Map payment status to booking status
  const statusMap: Record<string, 'confirmed' | 'pending' | 'completed' | 'cancelled'> = {
    'PAID': 'confirmed',
    'PENDING': 'pending',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'FAILED': 'cancelled'
  }

  return {
    id: order._id || `order-${index}`,
    fieldId: order.orderDetails?.[0]?.fieldId || '',
    fieldName: order.orderDetails?.[0]?.fieldId || 'Sân thể thao',
    userId: order.userId,
    storeId: order.storeId,
    date: bookingDate,
    paymentDate: paymentDate,
    time: bookingTime,
    duration: totalDuration || 60, // total duration from all orderDetails
    status: statusMap[order.statusPayment] || 'pending',
    totalPrice: order.cost,
  }
}

export default function BookingHistoryPage() {
  const router = useRouter()

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

  // State cho user info
  const [userId, setUserId] = useState<string>('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [ordersData, setOrdersData] = useState<any[]>([])

  // State cho static data
  const [tabs, setTabs] = useState<BookingTab[]>([
    { id: "Tất cả", label: "Tất cả", icon: null, count: 0 },
    { id: "Sắp tới", label: "Sắp tới", icon: null, count: 0 },
    { id: "Đã xong", label: "Đã xong", icon: null, count: 0 },
    { id: "Đã hủy", label: "Đã hủy", icon: null, count: 0 },
  ])
  const [statusMap, setStatusMap] = useState<Record<string, string>>({
    "Tất cả": "all",
    "Sắp tới": "confirmed",
    "Đã xong": "completed",
    "Đã hủy": "cancelled"
  })
  const [sportOptions, setSportOptions] = useState<{ value: string; label: string }[]>([])

  // Fetch user info
  useEffect(() => {
    const userInfo = getMyProfile()
    if (userInfo?.id) {
      setUserId(userInfo.id)
      setUserProfile(userInfo)
      console.log('✅ User ID loaded:', userInfo.id)
      console.log('✅ User Profile:', userInfo)
    } else {
      console.error('❌ No user info found')
      router.push('/login')
    }
  }, [router])

  // useEffect để fetch dữ liệu booking khi component mount và có userId
  useEffect(() => {
    if (!userId) return

    const fetchBookings = async () => {
      try {
        setLoading(true)
        console.log('📤 Fetching orders for user:', userId)
        const ordersData = await getUserOrders(userId)
        console.log('📥 Orders fetched:', ordersData)

        // Store raw orders data
        setOrdersData(ordersData)

        // Transform orders to bookings
        const transformedBookings = ordersData.map((order, index) =>
          mapOrderToBooking(order, index)
        )
        console.log('✅ Bookings transformed:', transformedBookings)
        setBookings(transformedBookings)
      } catch (error) {
        console.error('❌ Error fetching booking history:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

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
      {/* <BookingHeader /> */}

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
          {/* <BookingTabsNav
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          /> */}
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
              {filteredBookings.map((booking) => {
                // Find corresponding raw order data
                const rawOrder = ordersData.find(o => o._id === booking.id)
                return (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    rawOrder={rawOrder}
                    userProfile={userProfile}
                    onBookingAction={handleBookingAction}
                  />
                )
              })}
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
