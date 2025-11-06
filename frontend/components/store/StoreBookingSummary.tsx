"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { FieldPricingService } from "@/services/field-pricing.service"
import type { Field as FieldServiceType } from "@/services/field.service"

interface StoreBookingSummaryProps {
    selectedSlots: string[]
    selectedDate: string
    fields: FieldServiceType[]
    onClearSlots: () => void
    storeName: string
    sportName: string
    fieldPricings?: {
        [fieldId: string]: any[]
    }
}

export default function StoreBookingSummary({
    selectedSlots,
    selectedDate,
    fields,
    onClearSlots,
    storeName,
    sportName,
    fieldPricings = {},
}: StoreBookingSummaryProps) {
    const router = useRouter()

    if (selectedSlots.length === 0) {
        return null
    }

    // Calculate total price and group slots by field
    const groupedSlots: { [fieldId: string]: string[] } = {}
    let totalPrice = 0

    selectedSlots.forEach((slotKey) => {
        // slotKey format: "fieldId:HH:MM" -> need to split correctly
        const lastColonIndex = slotKey.lastIndexOf(':')
        const fieldId = slotKey.substring(0, slotKey.indexOf(':'))
        const timeSlot = slotKey.substring(slotKey.indexOf(':') + 1) // "HH:MM"

        if (!groupedSlots[fieldId]) {
            groupedSlots[fieldId] = []
        }
        groupedSlots[fieldId].push(timeSlot)

        const field = fields.find((f) => f._id === fieldId)
        if (field) {
            // Get special price for this slot if available
            const pricings = fieldPricings[fieldId] || []
            const defaultPrice = parseFloat(field.defaultPrice || "0")

            if (pricings.length > 0) {
                const selectedDateObj = new Date(selectedDate)
                const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)
                const specialPrice = FieldPricingService.getSpecialPriceForSlot(
                    pricings,
                    timeSlot,
                    dayOfWeek
                )
                totalPrice += specialPrice || defaultPrice
            } else {
                totalPrice += defaultPrice
            }
        }
    })

    const handleCheckout = () => {
        // Prepare booking data to pass to payment page
        const bookingData = {
            storeId: fields[0]?.storeId,
            storeName,
            sportName,
            selectedDate,
            slots: Object.entries(groupedSlots).map(([fieldId, timeSlots]) => {
                const field = fields.find((f) => f._id === fieldId)
                const pricings = fieldPricings[fieldId] || []
                const defaultPrice = parseFloat(field?.defaultPrice || "0")

                // Calculate price for this field
                let fieldTotalPrice = 0
                timeSlots.forEach((timeSlot) => {
                    if (pricings.length > 0) {
                        const selectedDateObj = new Date(selectedDate)
                        const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)
                        const specialPrice = FieldPricingService.getSpecialPriceForSlot(
                            pricings,
                            timeSlot,
                            dayOfWeek
                        )
                        fieldTotalPrice += specialPrice || defaultPrice
                    } else {
                        fieldTotalPrice += defaultPrice
                    }
                })

                return {
                    fieldId,
                    fieldName: field?.name || `Sân ${fieldId.slice(-4)}`,
                    timeSlots,
                    price: defaultPrice,
                    actualPrice: fieldTotalPrice,
                }
            }),
            totalPrice,
        }

        // Store in sessionStorage to pass to payment page
        sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData))

        // Navigate to payment page
        router.push("/payment")
    }

    const getPriceForSlot = (fieldId: string, timeSlot: string): number => {
        const pricings = fieldPricings[fieldId] || []
        const field = fields.find(f => f._id === fieldId)
        const defaultPrice = field ? parseFloat(field.defaultPrice || "0") : 0

        if (pricings.length === 0) {
            return defaultPrice
        }

        const selectedDateObj = new Date(selectedDate)
        const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)

        const specialPrice = FieldPricingService.getSpecialPriceForSlot(
            pricings,
            timeSlot,
            dayOfWeek
        )

        return specialPrice || defaultPrice
    }

    /**
     * Convert time string "HH:MM" to minutes for comparison
     */
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    /**
     * Convert minutes back to "HH:MM" format
     */
    const minutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    }

    /**
     * Group consecutive time slots into ranges
     * Example: ["07:30", "08:00", "08:30"] -> [{ start: "07:30", end: "09:00" }]
     * Assuming each slot is 30 minutes
     */
    const groupTimeSlotsByRange = (timeSlots: string[]): Array<{ start: string; end: string; count: number }> => {
        if (timeSlots.length === 0) return []

        // Sort time slots
        const sortedSlots = [...timeSlots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b))

        const ranges: Array<{ start: string; end: string; count: number }> = []
        let currentStart = sortedSlots[0]
        let currentEnd = timeToMinutes(sortedSlots[0]) + 30 // Assume 30-min slots
        let slotCount = 1

        for (let i = 1; i < sortedSlots.length; i++) {
            const slotMinutes = timeToMinutes(sortedSlots[i])

            // If this slot is consecutive (30 mins after current end), extend the range
            if (slotMinutes === currentEnd) {
                currentEnd += 30
                slotCount++
            } else {
                // Not consecutive, save current range and start a new one
                ranges.push({
                    start: currentStart,
                    end: minutesToTime(currentEnd),
                    count: slotCount
                })
                currentStart = sortedSlots[i]
                currentEnd = slotMinutes + 30
                slotCount = 1
            }
        }

        // Add the last range
        ranges.push({
            start: currentStart,
            end: minutesToTime(currentEnd),
            count: slotCount
        })

        return ranges
    }

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
                    {Object.entries(groupedSlots).map(([fieldId, timeSlots], index) => {
                        const field = fields.find((f) => f._id === fieldId)
                        const fieldIndex = fields.findIndex((f) => f._id === fieldId)
                        const fieldColors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-rose-500", "bg-indigo-500"]
                        const fieldColor = fieldColors[fieldIndex % fieldColors.length]
                        const fieldLetter = String.fromCharCode(65 + fieldIndex)

                        return (
                            <div
                                key={fieldId}
                                className="group relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Enhanced Field Icon */}
                                            <div className="relative">
                                                <div
                                                    className={`w-16 h-16 ${fieldColor} rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    {fieldLetter}
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                            </div>

                                            {/* Field Details */}
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xl font-bold text-gray-800">
                                                    {field?.name || `Sân ${fieldLetter}`}
                                                </div>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    {groupTimeSlotsByRange(timeSlots).map((range) => {
                                                        // Calculate total price for this range
                                                        const rangePrice = timeSlots
                                                            .filter(t => {
                                                                const tMin = timeToMinutes(t)
                                                                const startMin = timeToMinutes(range.start)
                                                                return tMin >= startMin && tMin < timeToMinutes(range.end)
                                                            })
                                                            .reduce((sum, time) => sum + getPriceForSlot(fieldId, time), 0)

                                                        return (
                                                            <Badge
                                                                key={`${fieldId}:${range.start}-${range.end}`}
                                                                variant="outline"
                                                                className="bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-300 text-emerald-700 px-4 py-1.5 text-sm font-semibold"
                                                                title={`${rangePrice.toLocaleString('vi-VN')}₫`}
                                                            >
                                                                🕐 {range.start} - {range.end}
                                                            </Badge>
                                                        )
                                                    })}
                                                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span className="text-sm font-bold text-yellow-700">{field?.rating || 4.5}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Display */}
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600">
                                                {timeSlots.reduce((sum, time) => sum + getPriceForSlot(fieldId, time), 0).toLocaleString('vi-VN')}
                                            </div>
                                            <div className="text-sm text-gray-500 font-medium">VNĐ</div>
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
                        <Button
                            onClick={handleCheckout}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold py-3 text-lg"
                        >
                            💳 Thanh toán ngay →
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
