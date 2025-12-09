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
  const [activeTab, setActiveTab] = useState("Sắp diễn ra")

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

  // Cache for store names and field names to avoid re-fetching
  const [storeNamesCache, setStoreNamesCache] = useState<Record<string, string>>({})
  const [fieldNamesCache, setFieldNamesCache] = useState<Record<string, string>>({})

  // State cho static data
  const [tabs, setTabs] = useState<BookingTab[]>([
    { id: "Sắp diễn ra", label: "Sắp diễn ra", icon: null, count: 0 },
    { id: "Đang diễn ra", label: "Đang diễn ra", icon: null, count: 0 },
    { id: "Đã diễn ra", label: "Đã diễn ra", icon: null, count: 0 },
  ])
  const [sportOptions, setSportOptions] = useState<{ value: string; label: string }[]>([])

  // Helper functions to fetch names
  const fetchStoreName = async (storeId: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/store/${storeId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.data?.name || data.name || storeId;
      }
    } catch (error) {
      console.error('Error fetching store name:', error);
    }
    return storeId;
  }

  const fetchFieldName = async (fieldId: string): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/fields/${fieldId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.data?.name || fieldId;
      }
    } catch (error) {
      console.error('Error fetching field name:', error);
    }
    return fieldId;
  }

  // Fetch user info
  useEffect(() => {
    const userInfo = getMyProfile()
    if (userInfo?.id) {
      setUserId(userInfo.id)
      setUserProfile(userInfo)
      console.log(' User ID loaded:', userInfo.id)
      console.log(' User Profile:', userInfo)
    } else {
      console.error(' No user info found')
      router.push('/login')
    }
  }, [router])

  // useEffect để fetch dữ liệu booking khi component mount và có userId
  useEffect(() => {
    if (!userId) return

    const fetchBookings = async () => {
      try {
        setLoading(true)
        console.log(' Fetching orders for user:', userId)
        const ordersData = await getUserOrders(userId)
        console.log(' Orders fetched:', ordersData)

        // Store raw orders data
        setOrdersData(ordersData)

        // Transform orders to bookings
        const transformedBookings = ordersData.map((order, index) =>
          mapOrderToBooking(order, index)
        )
        console.log(' Bookings transformed:', transformedBookings)
        setBookings(transformedBookings)
      } catch (error) {
        console.error(' Error fetching booking history:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  // Fetch all store names and field names once when orders are loaded
  useEffect(() => {
    if (ordersData.length === 0) return;

    const fetchAllNames = async () => {
      // Get unique store IDs
      const uniqueStoreIds = [...new Set(ordersData.map(order => order.storeId).filter(Boolean))] as string[];

      // Get unique field IDs from all orderDetails
      const uniqueFieldIds = [...new Set(
        ordersData.flatMap(order =>
          order.orderDetails?.map((d: any) => d.fieldId) || []
        ).filter(Boolean)
      )] as string[];

      console.log(' Fetching names for', uniqueStoreIds.length, 'stores and', uniqueFieldIds.length, 'fields');

      // Fetch all store names in parallel
      const storeNamePromises = uniqueStoreIds.map(async (storeId) => {
        const name = await fetchStoreName(storeId);
        return { id: storeId, name };
      });

      // Fetch all field names in parallel
      const fieldNamePromises = uniqueFieldIds.map(async (fieldId) => {
        const name = await fetchFieldName(fieldId);
        return { id: fieldId, name };
      });

      // Wait for all to complete
      const [storeResults, fieldResults] = await Promise.all([
        Promise.all(storeNamePromises),
        Promise.all(fieldNamePromises)
      ]);

      // Build cache objects
      const storeCache: Record<string, string> = {};
      storeResults.forEach(result => {
        storeCache[result.id] = result.name;
      });

      const fieldCache: Record<string, string> = {};
      fieldResults.forEach(result => {
        fieldCache[result.id] = result.name;
      });

      console.log(' Names cached:', { stores: Object.keys(storeCache).length, fields: Object.keys(fieldCache).length });

      setStoreNamesCache(storeCache);
      setFieldNamesCache(fieldCache);
    };

    fetchAllNames();
  }, [ordersData]);

  // Helper function to check booking time status
  const getBookingTimeStatus = (booking: Booking): 'upcoming' | 'ongoing' | 'past' => {
    const now = new Date()
    const bookingDate = booking.date.split('/').reverse().join('-') // Convert DD/MM/YYYY to YYYY-MM-DD
    const bookingTime = booking.time
    const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`)

    // Calculate end time based on duration
    const endDateTime = new Date(bookingDateTime.getTime() + booking.duration * 60000)

    if (now < bookingDateTime) {
      return 'upcoming' // Sắp diễn ra
    } else if (now >= bookingDateTime && now <= endDateTime) {
      return 'ongoing' // Đang diễn ra
    } else {
      return 'past' // Đã diễn ra
    }
  }

  // Cập nhật tabs count dựa trên bookings data
  useEffect(() => {
    if (tabs.length > 0 && bookings.length > 0) {
      const updatedTabs = tabs.map(tab => ({
        ...tab,
        count: tab.id === "Sắp diễn ra"
          ? bookings.filter(b => getBookingTimeStatus(b) === 'upcoming').length
          : tab.id === "Đang diễn ra"
            ? bookings.filter(b => getBookingTimeStatus(b) === 'ongoing').length
            : tab.id === "Đã diễn ra"
              ? bookings.filter(b => getBookingTimeStatus(b) === 'past').length
              : 0
      }))
      setTabs(updatedTabs)
    }
  }, [bookings])

  // useEffect để lọc booking theo tab đang active và search
  useEffect(() => {
    let filtered = bookings

    // Lọc theo tab dựa trên thời gian
    if (activeTab === "Sắp diễn ra") {
      filtered = filtered.filter(booking => getBookingTimeStatus(booking) === 'upcoming')
    } else if (activeTab === "Đang diễn ra") {
      filtered = filtered.filter(booking => getBookingTimeStatus(booking) === 'ongoing')
    } else if (activeTab === "Đã diễn ra") {
      filtered = filtered.filter(booking => getBookingTimeStatus(booking) === 'past')
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
                    storeNamesCache={storeNamesCache}
                    fieldNamesCache={fieldNamesCache}
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
