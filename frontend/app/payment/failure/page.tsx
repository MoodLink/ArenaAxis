"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { X, AlertCircle, ChevronRight } from "lucide-react"
import { OrderService, type OrderResponse } from "@/services/order.service"

export default function PaymentFailurePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [orderData, setOrderData] = useState<OrderResponse | null>(null)
    const [orderId, setOrderId] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const [errorCode, setErrorCode] = useState("")

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Try multiple sources for order ID
                let id = searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id")

                if (!id) {
                    id = sessionStorage.getItem('pendingOrderId') || ""
                }

                setOrderId(id)

                console.log('🔍 Looking for order ID:', {
                    fromParams: searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id"),
                    fromSessionStorage: sessionStorage.getItem('pendingOrderId'),
                    final: id
                })

                // Get error message from params
                const error = searchParams.get("error") || searchParams.get("status") || "PAYMENT_FAILED"
                const message = searchParams.get("message") || "Thanh toán thất bại. Vui lòng thử lại."
                const orderCode = searchParams.get("orderCode")

                setErrorCode(error)
                setErrorMessage(message)

                // Try to fetch order if id exists
                if (id) {
                    console.log('📤 Fetching order data for orderId:', id)
                    try {
                        const order = await OrderService.getOrderByCode(id)
                        console.log('✅ Order data received:', order)
                        setOrderData(order)
                    } catch (apiErr: any) {
                        console.warn('⚠️ Could not fetch order from API:', apiErr.message)
                        // If API fails, we'll just show the error page without order details
                        // This is acceptable for failure page
                    }
                }

                // Clear pending order from sessionStorage
                sessionStorage.removeItem('pendingOrderId')
            } catch (err: any) {
                console.error('❌ Error in failure page:', err)
                setErrorMessage(err.message || "Thanh toán thất bại")
                setErrorCode("PAYMENT_FAILED")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderData()
    }, [searchParams])

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Error Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-red-600 mb-2">Thanh Toán Thất Bại</h1>
                    <p className="text-gray-600">Giao dịch của bạn không thể hoàn tất</p>
                </div>

                {/* Error Details */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    {/* Alert Box */}
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-700 mb-2">Lỗi thanh toán</h3>
                                <p className="text-red-600 mb-2">{errorMessage}</p>
                                <p className="text-sm text-gray-600">Mã lỗi: {errorCode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    {orderData && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span>📋</span> Thông Tin Đặt Sân
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Khách hàng</p>
                                        <p className="font-semibold text-gray-800">{orderData.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Mã đơn</p>
                                        <p className="font-semibold text-gray-800">#{orderData.orderCode}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">📅 Ngày đặt</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(orderData.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">📍 Địa chỉ</p>
                                        <p className="font-semibold text-gray-800">{orderData.address}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">🏐 Chi tiết sân</p>
                                    <div className="space-y-2">
                                        {orderData.orderDetails && orderData.orderDetails.length > 0 ? (
                                            orderData.orderDetails.map((detail, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                                    {detail.fieldName && (
                                                        <p className="text-sm font-semibold text-gray-800 mb-1">
                                                            {detail.fieldName}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-700">
                                                        {new Date(detail.startTime).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} - {new Date(detail.endTime).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {detail.price.toLocaleString('vi-VN')} ₫
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">Không có thông tin chi tiết sân</p>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 font-semibold">Tổng tiền</span>
                                        <span className="text-2xl font-bold text-red-600">
                                            {orderData.cost !== undefined ? orderData.cost.toLocaleString('vi-VN') : '0'} ₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Common Issues */}
                    <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Nguyên Nhân Có Thể</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-600 font-bold">•</span>
                                <span className="text-gray-700">Số dư tài khoản không đủ</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-600 font-bold">•</span>
                                <span className="text-gray-700">Thẻ/Ví bị khóa hoặc hạn chế giao dịch</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-600 font-bold">•</span>
                                <span className="text-gray-700">Sai mã PIN hoặc thông tin thẻ</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-600 font-bold">•</span>
                                <span className="text-gray-700">Kết nối mạng không ổn định</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-600 font-bold">•</span>
                                <span className="text-gray-700">Giới hạn giao dịch hàng ngày đã hết</span>
                            </li>
                        </ul>
                    </div>

                    {/* Support Info */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 Hỗ Trợ</h3>
                        <p className="text-gray-700 mb-3">
                            Nếu vấn đề tiếp tục, vui lòng liên hệ với chúng tôi:
                        </p>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2 text-gray-700">
                                <span>📧</span> support@arenaaxis.com
                            </p>
                            <p className="flex items-center gap-2 text-gray-700">
                                <span>📞</span> 0905 591 379
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Link
                        href={`/payment?orderId=${orderId || orderData?._id || ''}`}
                        className="px-6 py-4 bg-orange-600 text-center rounded-lg text-white hover:bg-orange-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                        <span>Thử lại</span>
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/booking-history"
                        className="px-6 py-4 bg-white text-center rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition font-semibold"
                    >
                        Lịch sử đặt sân
                    </Link>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link
                        href="/list-store"
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
                    >
                        <span>← Quay lại danh sách sân</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
