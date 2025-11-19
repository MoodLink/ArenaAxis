"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react"
import { FieldPricingService } from "@/services/field-pricing.service"
import type { Field as FieldServiceType } from "@/services/field.service"

interface StoreBookingGridProps {
    selectedDate: string
    selectedSlots: string[]
    onSlotClick: (fieldId: string, timeSlot: string) => void
    fields: FieldServiceType[]
    timeSlots: string[]
    bookingData: {
        [fieldId: string]: { [timeSlot: string]: "available" | "booked" | "locked" | "selected" }
    }
    storeName: string
    sportName: string
    fieldPricings?: {
        [fieldId: string]: any[]
    }
}

export default function StoreBookingGrid({
    selectedDate,
    selectedSlots,
    onSlotClick,
    fields,
    timeSlots,
    bookingData,
    storeName,
    sportName,
    fieldPricings = {},
}: StoreBookingGridProps) {
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

    // Debug: Log received props
    console.log('🔵 StoreBookingGrid rendered with:', {
        fieldsCount: fields.length,
        timeSlotsCount: timeSlots.length,
        selectedSlotsCount: selectedSlots.length,
        bookingDataKeys: Object.keys(bookingData),
        onSlotClickType: typeof onSlotClick,
        selectedDate: selectedDate,
    })

    // Debug: Log booking status for each field
    console.log('📊 Booking data details:')
    Object.entries(bookingData).forEach(([fieldId, slots]) => {
        const bookedCount = Object.values(slots).filter(s => s === 'booked').length
        const availableCount = Object.values(slots).filter(s => s === 'available').length
        console.log(`   Field ${fieldId}: ${bookedCount} booked, ${availableCount} available`)
    })

    const getSlotStatus = (fieldId: string, timeSlot: string) => {
        const slotKey = `${fieldId}:${timeSlot}`
        if (selectedSlots.includes(slotKey)) return "selected"
        return bookingData[fieldId]?.[timeSlot] || "available"
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

    const hasSpecialPrice = (fieldId: string, timeSlot: string): boolean => {
        const pricings = fieldPricings[fieldId] || []
        if (pricings.length === 0) return false

        const selectedDateObj = new Date(selectedDate)
        const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)

        const specialPrice = FieldPricingService.getSpecialPriceForSlot(
            pricings,
            timeSlot,
            dayOfWeek
        )

        return specialPrice !== null && specialPrice !== undefined
    }

    const getSlotColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-gradient-to-br from-emerald-100 to-blue-100 hover:from-emerald-200 hover:to-blue-200 border-2 border-emerald-200 text-emerald-700 shadow-sm hover:shadow-md"
            case "booked":
                return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg border-2 border-red-400"
            case "locked":
                return "bg-gradient-to-br from-gray-400 to-gray-500 text-white border-2 border-gray-300"
            case "selected":
                return "bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-xl border-2 border-emerald-400"
            default:
                return "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-blue-50 border-2 border-gray-200 hover:border-emerald-300 text-gray-600 hover:text-emerald-700"
        }
    }

    const scrollLeft = () => {
        const container = document.getElementById("booking-grid")
        if (container) {
            container.scrollBy({ left: -300, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        const container = document.getElementById("booking-grid")
        if (container) {
            container.scrollBy({ left: 300, behavior: "smooth" })
        }
    }

    return (
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
                {/* Modern Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Lịch đặt sân</h3>
                            <p className="text-emerald-100">Chọn ngày: {selectedDate} • Chọn khung giờ phù hợp</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Cuộn để xem thêm</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={scrollLeft}
                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={scrollRight}
                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="relative bg-white">
                    {/* Fixed Sidebar với Fields */}
                    <div className="absolute left-0 top-0 z-20 bg-white border-r-2 border-gray-100 shadow-lg">
                        {/* Header cho sidebar */}
                        <div className="w-64 px-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 flex items-center" style={{ height: '80px' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">⚽</span>
                                </div>
                                <span className="font-bold text-gray-800">Danh sách sân</span>
                            </div>
                        </div>

                        {/* Field list */}
                        {fields.map((field, index) => {
                            const fieldColors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-rose-500", "bg-indigo-500"]
                            const fieldColor = fieldColors[index % fieldColors.length]
                            const fieldLetter = String.fromCharCode(65 + index) // A, B, C, D...

                            return (
                                <div
                                    key={field._id}
                                    className={`w-64 px-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300 flex items-center ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                                        }`}
                                    style={{ height: '72px' }}
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        {/* Field Icon */}
                                        <div className="relative">
                                            <div
                                                className={`w-12 h-12 ${fieldColor} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-105 transition-transform`}
                                            >
                                                {fieldLetter}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        </div>

                                        {/* Field Info */}
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 text-base truncate">
                                                {field.name || `Sân ${fieldLetter}`}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                    <span className="text-xs font-bold text-yellow-700">{field.rating || 4.5}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-600 font-bold text-sm">
                                                        {(parseFloat(field.defaultPrice) / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}K
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {fieldPricings[field._id]?.length > 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Scrollable Time Grid */}
                    <div
                        id="booking-grid"
                        className="overflow-x-auto ml-64"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#10b981 #f3f4f6"
                        }}
                    >
                        <div className="min-w-max">
                            {/* Time Header */}
                            <div className="flex bg-gradient-to-r from-emerald-100 to-blue-100 border-b-2 border-emerald-200" style={{ height: '80px' }}>
                                {timeSlots.map((slot, index) => (
                                    <div
                                        key={slot}
                                        className={`w-20 px-2 text-center border-r border-emerald-200/50 flex flex-col justify-center ${index % 2 === 0 ? 'bg-white/50' : 'bg-emerald-50/50'
                                            }`}
                                    >
                                        <div className="text-sm font-bold text-gray-700">{slot}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {parseInt(slot.split(':')[0]) < 12 ? 'Sáng' :
                                                parseInt(slot.split(':')[0]) < 18 ? 'Chiều' : 'Tối'}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Field Rows */}
                            {fields.map((field, fieldIndex) => (
                                <div
                                    key={field._id}
                                    className={`flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30 transition-all duration-300 ${fieldIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                                        }`}
                                    style={{ height: '72px' }}
                                >
                                    {/* Offset spacer - dịch slot sang phải */}
                                    <div className="flex-shrink-0 w-10 border-r border-gray-100/50"></div>

                                    {timeSlots.slice(0, -1).map((slot, slotIndex) => {
                                        const status = getSlotStatus(field._id, slot)
                                        const slotKey = `${field._id}:${slot}`
                                        const price = getPriceForSlot(field._id, slot)
                                        const isSpecialPrice = hasSpecialPrice(field._id, slot)

                                        return (
                                            <div
                                                key={slot}
                                                className={`w-20 border-r border-gray-100/50 flex items-center justify-center relative group pointer-events-auto ${slotIndex % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'
                                                    }`}
                                                onMouseEnter={() => setHoveredSlot(slotKey)}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                            >
                                                <button
                                                    onClick={() => {
                                                        console.log('🔵 Button clicked:', { fieldId: field._id, slot, status })
                                                        onSlotClick(field._id, slot)
                                                    }}
                                                    disabled={status === "booked" || status === "locked"}
                                                    className={`w-14 h-14 rounded-xl ${getSlotColor(status)} transition-all duration-300 transform ${status === "available"
                                                        ? "cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95 hover:rotate-1"
                                                        : "cursor-not-allowed"
                                                        } ${status === "selected"
                                                            ? `scale-110 shadow-xl ring-4 ${isSpecialPrice ? "ring-yellow-400" : "ring-emerald-300/50"} rotate-2`
                                                            : ""
                                                        } ${isSpecialPrice && status === "available" ? "font-black ring-4 ring-yellow-400" : ""}
                                                        flex items-center justify-center text-sm font-bold relative overflow-visible pointer-events-auto`}
                                                    type="button"
                                                >
                                                    {/* Special Price Icon - ở ngoài góc trên trái */}

                                                    {/* Background animation */}
                                                    {status === "available" && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    )}

                                                    {/* Icons */}
                                                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                                                        {status === "booked" && (
                                                            <div className="text-white transform rotate-12">
                                                                <span className="text-lg">✕</span>
                                                            </div>
                                                        )}
                                                        {status === "locked" && (
                                                            <div className="text-white animate-pulse">
                                                                <span className="text-lg">🔒</span>
                                                            </div>
                                                        )}
                                                        {status === "selected" && (
                                                            <div className="text-white animate-bounce">
                                                                <span className="text-lg">✓</span>
                                                            </div>
                                                        )}
                                                        {status === "available" && (
                                                            <div className="text-emerald-600 group-hover:scale-125 transition-transform">
                                                                <span className="text-2xl font-light">+</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Price Tooltip - không làm tròn */}
                                                {hoveredSlot === slotKey && status === "available" && (
                                                    <div className={`absolute bottom-full mb-2 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg z-50 ${isSpecialPrice ? 'bg-orange-600' : 'bg-gray-900'
                                                        }`}>
                                                        <div>{price.toLocaleString('vi-VN')}₫</div>
                                                        <div className="text-gray-200 text-xs">
                                                            {isSpecialPrice ? "Giá đặc biệt ⭐" : "Giá/giờ"}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
