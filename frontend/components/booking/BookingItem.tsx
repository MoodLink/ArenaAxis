// Component hiển thị một booking item trong danh sách
"use client"

import { Calendar, MapPin, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Booking } from "@/types"
import { useState, useEffect } from "react"

interface BookingItemProps {
    booking: Booking
    rawOrder?: any
    userProfile?: any
    onBookingAction: (bookingId: string, action: string) => void
    storeNamesCache?: Record<string, string>
    fieldNamesCache?: Record<string, string>
}

export default function BookingItem({ booking, rawOrder, userProfile, onBookingAction, storeNamesCache = {}, fieldNamesCache = {} }: BookingItemProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            confirmed: { className: 'bg-blue-100 text-blue-800', label: 'Đã xác nhận' },
            completed: { className: 'bg-green-100 text-green-800', label: 'Đã hoàn thành' },
            cancelled: { className: 'bg-red-100 text-red-800', label: 'Đã hủy' },
            pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Chờ xác nhận' }
        }
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    }

    const statusInfo = getStatusBadge(booking.status)
    const [showDetailModal, setShowDetailModal] = useState(false)

    // Get store name from cache
    const storeName = booking.storeId ? (storeNamesCache[booking.storeId] || 'Đang tải...') : 'Trung tâm thể thao'

    // Get field names from cache for order details
    const getFieldNameFromCache = (fieldId: string) => {
        return fieldNamesCache[fieldId] || fieldId;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Booking Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {storeName || 'Đang tải...'}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    {/* <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {booking.location || "Chưa có địa chỉ"}
                                    </div> */}
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {booking.duration}p
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Information */}
                        {userProfile && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Thông tin đặt sân</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Tên khách:</span>
                                        <p className="font-semibold text-gray-900">{userProfile.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Số điện thoại:</span>
                                        <p className="font-semibold text-gray-900">{userProfile.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* All Order Details - REMOVED FROM HERE, MOVED TO MODAL */}

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Ngày thanh toán</p>
                                <p className="text-sm font-semibold text-gray-900">{booking.paymentDate || booking.date}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Ngày đặt sân</p>
                                <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tổng tiền</p>
                                <p className="text-sm font-semibold text-green-600">
                                    {booking.totalPrice.toLocaleString()}đ
                                </p>
                            </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDetailModal(true)}
                            >
                                Chi tiết
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Chi tiết đặt sân</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* User Information */}
                            {userProfile && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Thông tin đặt sân</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Tên khách:</p>
                                            <p className="font-semibold text-gray-900">{userProfile.name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Số điện thoại:</p>
                                            <p className="font-semibold text-gray-900">{userProfile.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Details */}
                            {rawOrder?.orderDetails && rawOrder.orderDetails.length > 0 && (
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Chi tiết lịch sử đặt sân</p>
                                    <div className="space-y-3">
                                        {rawOrder.orderDetails.map((detail: any, idx: number) => (
                                            <div key={idx} className="bg-white rounded-lg p-3 border border-amber-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-gray-900 font-semibold">
                                                        {getFieldNameFromCache(detail.fieldId)}
                                                    </p>
                                                    <p className="font-semibold text-green-600">{detail.price.toLocaleString()}đ</p>
                                                </div>
                                                <p className="text-gray-600">
                                                    <span className="font-semibold">{detail.startTime}</span>
                                                    <span className="text-gray-400"> → </span>
                                                    <span className="font-semibold">{detail.endTime}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-amber-100">
                                        <div className="flex justify-between">
                                            <p className="text-gray-900 font-semibold">Tổng cộng:</p>
                                            <p className="text-xl font-bold text-green-600">{booking.totalPrice.toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Summary Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Ngày thanh toán</p>
                                    <p className="font-semibold text-gray-900">{booking.paymentDate || booking.date}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Ngày đặt sân</p>
                                    <p className="font-semibold text-gray-900">{booking.date}</p>
                                </div>
                                {/* <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
                                    <Badge className={`${statusInfo.className} w-full justify-center`}>
                                        {statusInfo.label}
                                    </Badge>
                                </div> */}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}