"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Trang thanh toán chính
 * 
 * Thanh toán được xử lý trên platform bên ngoài
 * File này chỉ để redirect đến các trang success/failure
 * 
 * Cấu trúc:
 * - /payment/success → Thanh toán thành công, hiển thị hóa đơn
 * - /payment/failure → Thanh toán thất bại, hiển thị thông tin lỗi
 */
export default function PaymentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect đến checkout platform bên ngoài hoặc xử lý thích hợp
    // Hiện tại chưa có URL checkout cụ thể
    console.log("Payment page - Redirect to external payment platform")

    // Có thể thêm logic redirect tới platform thanh toán của bạn
    // Ví dụ: router.push(process.env.NEXT_PUBLIC_PAYMENT_URL)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">💳</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đang chuyển hướng...</h1>
        <p className="text-gray-600">Vui lòng chờ trong khi chúng tôi chuyển bạn đến trang thanh toán</p>
      </div>
    </div>
  )
}
