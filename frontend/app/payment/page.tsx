"use client"

// Import các components đã tách riêng cho trang thanh toán
import { useState, useEffect } from "react"
import BookingSummary from "@/components/payment/BookingSummary"
import PaymentForm from "@/components/payment/PaymentForm"
import PaymentRules from "@/components/payment/PaymentRules"
import PaymentSidebar from "@/components/payment/PaymentSidebar"
import { processPayment } from "@/services/api"

// Interface cho dữ liệu booking hiện tại
interface BookingInfo {
  id: string
  fieldName: string
  location: string
  date: string
  time: string
  duration: string
  court: string
  price: number
  image?: string
}

export default function PaymentPage() {
  // State quản lý trạng thái loading
  const [isLoading, setIsLoading] = useState(false)

  // Mock data booking hiện tại - trong thực tế sẽ lấy từ props hoặc URL params
  const currentBooking: BookingInfo = {
    id: "1",
    fieldName: "Turfs Up",
    location: "Chatmongol",
    date: "9/11/2025 - Chủ nhật",
    time: "19:00",
    duration: "1 Giờ",
    court: "Sân số 1 (5 người)",
    price: 650000,
    image: "/green-football-field-with-trees-and-goal-posts.png"
  }

  // Xử lý submit form thanh toán
  const handlePaymentSubmit = async (paymentData: any, method: string) => {
    setIsLoading(true)

    try {
      // Gọi API xử lý thanh toán
      const result = await processPayment(currentBooking.id, paymentData, method)

      if (result.success) {
        alert(`Thanh toán thành công! Mã giao dịch: ${result.transactionId}`)
        // Redirect đến trang success hoặc booking history
        // window.location.href = '/booking-history'
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Có lỗi xảy ra trong quá trình thanh toán")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="text-sm text-gray-600 mb-6">
          Trang chủ &gt; Đặt sân &gt; Thanh toán
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Section - Cột chính chứa form thanh toán */}
          <div className="lg:col-span-2">
            {/* Tóm tắt booking */}
            <BookingSummary booking={currentBooking} />

            {/* Form thanh toán */}
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              isLoading={isLoading}
            />

            {/* Quy tắc và điều khoản */}
            <PaymentRules />
          </div>

          {/* Sidebar - Cột phụ chứa ưu đãi và giải đấu */}
          <div className="lg:col-span-1">
            <PaymentSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
