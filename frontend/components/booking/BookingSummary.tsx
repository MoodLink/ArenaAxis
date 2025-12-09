// Component hiển thị tóm tắt các slot đã chọn
// Bao gồm danh sách, tổng tiền và action buttons

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"

interface SubCourt {
    id: string
    name: string
    type: string
    color: string
    rating: number
    price: number
}

interface BookingSummaryProps {
    selectedSlots: string[]
    selectedDate: string
    subCourts: SubCourt[]
    onClearSlots: () => void
}

export default function BookingSummary({
    selectedSlots,
    selectedDate,
    subCourts,
    onClearSlots
}: BookingSummaryProps) {
    if (selectedSlots.length === 0) {
        return null
    }

    const totalPrice = selectedSlots.reduce((total, slotKey) => {
        const [courtId] = slotKey.split(":")
        const court = subCourts.find((c) => c.id === courtId)
        return total + (court?.price || 0)
    }, 0)

    return (
        <Card className="mb-6 shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <CardTitle className="relative z-10 flex items-center gap-4 text-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                            <span className="bg-white text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black">
                                {selectedSlots.length}
                            </span>
                        </div>
                        <div>
                            <div className="font-black">Khung giờ đã chọn</div>
                            <div className="text-emerald-100 text-sm font-normal">
                                Xem lại lịch đặt của bạn
                            </div>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
                {/* Selected slots list */}
                <div className="space-y-4 mb-8">
                    {selectedSlots.map((slotKey, index) => {
                        const [courtId, timeSlot] = slotKey.split(":")
                        const court = subCourts.find((c) => c.id === courtId)
                        return (
                            <div
                                key={slotKey}
                                className="group relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Enhanced Court Icon */}
                                            <div className="relative">
                                                <div
                                                    className={`w-16 h-16 ${court?.color} rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    {court?.type}
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                            </div>

                                            {/* Court Details */}
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xl font-bold text-gray-800">{court?.name}</div>
                                                <div className="flex items-center gap-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-300 text-emerald-700 px-4 py-1 text-sm font-semibold"
                                                    >
                                                        🕐 {timeSlot}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span className="text-sm font-bold text-yellow-700">{court?.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Display */}
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600">
                                                {court?.price.toLocaleString('vi-VN')}
                                            </div>
                                            <div className="text-sm text-gray-500 font-medium">VNĐ / giờ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Total và Actions */}
                <div className="border-t-2 border-emerald-100 pt-8">
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold text-gray-700 mb-1">Tổng thanh toán</div>
                                <div className="text-sm text-gray-500">
                                    {selectedSlots.length} khung giờ • Ngày {selectedDate}
                                </div>
                            </div>
                            <div className="text-3xl font-black text-emerald-600">
                                {totalPrice.toLocaleString('vi-VN')} VNĐ
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClearSlots}
                            className="flex-1 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-medium py-3"
                        >
                            🗑️ Xóa tất cả
                        </Button>
                        <Link href="/payment" className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold py-3 text-lg">
                                💳 Thanh toán ngay →
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
