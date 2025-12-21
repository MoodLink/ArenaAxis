"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, Download, Printer, Calendar, MapPin, Clock, DollarSign, Phone, AlertCircle } from "lucide-react"
import { OrderService, type OrderResponse } from "@/services/order.service"
import { FieldService } from "@/services/field.service"
import { StoreService } from "@/services/store.service"
import { getMyProfile } from "@/services/get-my-profile"

interface OrderDetailWithFieldName {
    fieldId: string;
    fieldName: string;
    startTime: string;
    endTime: string;
    price: number;
}

export default function PaymentSuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [orderData, setOrderData] = useState<OrderResponse | null>(null)
    const [orderId, setOrderId] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [enrichedOrderDetails, setEnrichedOrderDetails] = useState<OrderDetailWithFieldName[]>([])
    const [storeAddress, setStoreAddress] = useState<string>("")
    const [customerInfo, setCustomerInfo] = useState({ name: "", address: "" })

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Try multiple sources for order ID
                let id = searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id")

                if (!id) {
                    id = sessionStorage.getItem('pendingOrderId') || ""
                }

                setOrderId(id)

                console.log('Looking for order ID:', {
                    fromParams: searchParams.get("orderId") || searchParams.get("order_id") || searchParams.get("id"),
                    fromSessionStorage: sessionStorage.getItem('pendingOrderId'),
                    final: id
                })

                // Try to fetch order if id exists
                if (id) {
                    console.log('Fetching order data for orderId:', id)
                    try {
                        const order = await OrderService.getOrderByCode(id)
                        console.log('Order data received:', order)
                        setOrderData(order)

                        //  Get customer info from profile or order
                        const profile = getMyProfile()
                        const customerName = profile?.name || order.name || "Khách hàng"
                        const customerAddress = order.address || ""

                        setCustomerInfo({
                            name: customerName,
                            address: customerAddress
                        })
                        console.log('Customer info:', { name: customerName, address: customerAddress })

                        //  Get store info for address if not in order
                        if (order.storeId && !order.address) {
                            try {
                                const storeInfo = await StoreService.getMyStore()
                                if (storeInfo?.address) {
                                    setStoreAddress(storeInfo.address)
                                    console.log('Store address:', storeInfo.address)
                                }
                            } catch (storeErr: any) {
                                console.warn('Could not fetch store info:', storeErr.message)
                            }
                        }

                        // 🏐 Enrich order details with field names
                        if (order.orderDetails && order.orderDetails.length > 0) {
                            console.log('Enriching order details with field names...')

                            // Fetch all fields in parallel instead of sequential
                            const fieldPromises = order.orderDetails.map(detail =>
                                FieldService.getFieldById(detail.fieldId)
                                    .then(fieldResponse => ({
                                        fieldId: detail.fieldId,
                                        fieldName: fieldResponse.data?.name || `Sân ${detail.fieldId.slice(-4)}`,
                                        startTime: detail.startTime,
                                        endTime: detail.endTime,
                                        price: detail.price
                                    }))
                                    .catch(() => ({
                                        fieldId: detail.fieldId,
                                        fieldName: `Sân ${detail.fieldId.slice(-4)}`,
                                        startTime: detail.startTime,
                                        endTime: detail.endTime,
                                        price: detail.price
                                    }))
                            )

                            const enrichedDetails = await Promise.all(fieldPromises)
                            setEnrichedOrderDetails(enrichedDetails)
                            console.log('Enriched order details:', enrichedDetails)

                            // Extract date from first order detail (format: "2025-11-12 HH:MM")
                            const bookingDateStr = enrichedDetails[0].startTime.split(' ')[0]
                            sessionStorage.setItem('lastBookingDate', bookingDateStr)
                            console.log('Saved last booking date:', bookingDateStr)
                        }

                        sessionStorage.setItem('paymentCompleted', 'true')
                        //  Dispatch storage event to notify other tabs/windows
                        window.dispatchEvent(new StorageEvent('storage', {
                            key: 'paymentCompleted',
                            newValue: 'true',
                            oldValue: null,
                            storageArea: sessionStorage
                        }))
                        //  Also dispatch custom event for same-tab listeners
                        window.dispatchEvent(new CustomEvent('paymentCompleted', { detail: { orderCode: id } }))
                    } catch (apiErr: any) {
                        console.warn('Could not fetch order from API:', apiErr.message)
                        // If API fails, we'll just show success page without detailed order info
                        // This is acceptable since payment is successful
                        setError(null) // Clear error since it's a success page
                    }
                } else {
                    setError("Không tìm thấy mã đơn hàng")
                }

                // Clear pending order from sessionStorage
                sessionStorage.removeItem('pendingOrderId')
            } catch (err: any) {
                console.error('Error in success page:', err)
                setError(err.message || "Có lỗi xảy ra")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderData()
    }, [searchParams])

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        // Tạo PDF invoice
        const element = document.getElementById("invoice")
        if (element) {
            const printContents = element.innerHTML
            const originalContents = document.body.innerHTML
            document.body.innerHTML = printContents
            window.print()
            document.body.innerHTML = originalContents
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        )
    }

    // Show error state only if truly critical
    if (error && !orderId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-lg p-8 shadow-lg max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/list-store"
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        )
    }

    // Parse order data if available, otherwise use generic data
    const orderCode = orderData?.orderCode || searchParams.get("orderCode") || "N/A"
    const cost = orderData?.cost || 0
    const name = customerInfo.name
    const address = customerInfo.address || storeAddress
    const orderDetails = enrichedOrderDetails.length > 0 ? enrichedOrderDetails : []
    const createdAt = orderData?.createdAt || new Date().toISOString()

    // Format date from createdAt (payment date, not booking date)
    const bookingDate = new Date(createdAt).toLocaleDateString('vi-VN')

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <Check className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-2">Thanh Toán Thành Công!</h1>
                    <p className="text-gray-600">Đặt sân của bạn đã được xác nhận</p>
                </div>

                {/* Invoice Section */}
                <div id="invoice" className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    {/* Invoice Header */}
                    <div className="border-b pb-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">HÓA ĐƠN THANH TOÁN</h2>

                            </div>
                            <div className="text-right">
                                <p className="text-gray-600">
                                    <strong>Mã đơn hàng:</strong> {orderCode}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Ngày đặt:</strong> {bookingDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Khách Hàng</h3>
                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-600">Tên khách hàng</p>
                                <p className="font-semibold text-gray-800">{name}</p>
                            </div>
                            <div>

                                <p className="font-semibold text-gray-800">{address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi Tiết Đơn Hàng</h3>
                        <div className="space-y-2">
                            {orderDetails && orderDetails.length > 0 ? (
                                orderDetails.map((detail, index) => {
                                    const startTime = new Date(detail.startTime).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    const endTime = new Date(detail.endTime).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    const bookingDateDetail = new Date(detail.startTime).toLocaleDateString('vi-VN')

                                    return (
                                        <div key={index} className="flex justify-between items-center py-3 border-b">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-green-600 text-lg">🏐</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {detail.fieldName}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{bookingDateDetail} {startTime} - {endTime}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{detail.price.toLocaleString('vi-VN')} ₫</p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-gray-500 italic">Không có thông tin chi tiết sân</p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi Tiết Thanh Toán</h3>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex justify-between">
                                <span>Tổng tiền sân ({orderDetails && orderDetails.length > 0 ? orderDetails.length : 0} khung giờ)</span>
                                <span className="font-semibold">{cost !== undefined && cost > 0 ? cost.toLocaleString('vi-VN') : '0'} ₫</span>
                            </div>

                            <div className="border-t-2 pt-3 flex justify-between text-lg font-bold text-gray-800">
                                <span>Tổng cộng</span>
                                <span className="text-green-600">{cost !== undefined && cost > 0 ? cost.toLocaleString('vi-VN') : '0'} ₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    {/* <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương Thức Thanh Toán</h3>
                        <p className="text-gray-700">Thẻ ngân hàng / Ví điện tử</p>
                    </div> */}

                    {/* Footer Note */}
                    <div className="border-t pt-6 text-center text-gray-600 text-sm">
                        <p>
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                        </p>

                    </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex gap-4 justify-center mb-8 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Printer className="w-5 h-5" />
                        In hóa đơn
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <Download className="w-5 h-5" />
                        Tải xuống
                    </button>
                </div> */}

                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-4 print:hidden">
                    <Link
                        href="/booking-history"
                        className="px-6 py-3 bg-white text-center rounded-lg border border-gray-300 hover:bg-gray-50 transition font-semibold text-gray-700"
                    >
                        Lịch sử đặt sân
                    </Link>
                    <Link
                        href="/list-store"
                        className="px-6 py-3 bg-green-600 text-center rounded-lg text-white hover:bg-green-700 transition font-semibold"
                    >
                        Đặt sân tiếp
                    </Link>
                </div>
            </div>
        </div>
    )
}