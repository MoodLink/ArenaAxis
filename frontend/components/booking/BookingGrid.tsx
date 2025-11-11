// Component grid đặt sân chính
// Hiển thị lịch trình và cho phép chọn slot

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react"

interface SubCourt {
    id: string
    name: string
    type: string
    color: string
    rating: number
    price: number
}

interface BookingGridProps {
    selectedDate: string
    selectedSlots: string[]
    onSlotClick: (courtId: string, timeSlot: string) => void
    subCourts: SubCourt[]
    timeSlots: string[]
    bookingData: { [key: string]: { [key: string]: "available" | "booked" | "locked" | "selected" } }
}

export default function BookingGrid({
    selectedDate,
    selectedSlots,
    onSlotClick,
    subCourts,
    timeSlots,
    bookingData
}: BookingGridProps) {
    const getSlotStatus = (courtId: string, timeSlot: string) => {
        const slotKey = `${courtId}:${timeSlot}`
        if (selectedSlots.includes(slotKey)) return "selected"
        return bookingData[courtId]?.[timeSlot] || "available"
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
                    {/* Fixed Sidebar với Courts */}
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

                        {/* Court list */}
                        {subCourts.map((court, index) => (
                            <div
                                key={court.id}
                                className={`w-64 px-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300 flex items-center ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                                    }`}
                                style={{ height: '72px' }}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    {/* Court Icon */}
                                    <div className="relative">
                                        <div
                                            className={`w-12 h-12 ${court.color} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg transform hover:scale-105 transition-transform`}
                                        >
                                            {court.type}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    </div>

                                    {/* Court Info */}
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 text-lg">{court.name}</div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                <span className="text-xs font-bold text-yellow-700">{court.rating.toFixed(1)}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-emerald-600 font-bold text-sm">
                                                    {(court.price / 1000).toFixed(0)}K
                                                </div>
                                                <div className="text-xs text-gray-500">VNĐ/giờ</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

                            {/* Court Rows */}
                            {subCourts.map((court, courtIndex) => (
                                <div
                                    key={court.id}
                                    className={`flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30 transition-all duration-300 ${courtIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                                        }`}
                                    style={{ height: '72px' }}
                                >
                                    {timeSlots.map((slot, slotIndex) => {
                                        const status = getSlotStatus(court.id, slot)
                                        return (
                                            <div
                                                key={slot}
                                                className={`w-20 border-r border-gray-100/50 flex items-center justify-center ${slotIndex % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => onSlotClick(court.id, slot)}
                                                    disabled={status === "booked" || status === "locked"}
                                                    className={`w-14 h-14 rounded-xl ${getSlotColor(status)} transition-all duration-300 transform ${status === "available"
                                                        ? "cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95 hover:rotate-1"
                                                        : "cursor-not-allowed"
                                                        } ${status === "selected"
                                                            ? "scale-110 shadow-xl ring-4 ring-emerald-300/50 rotate-2"
                                                            : ""
                                                        } flex items-center justify-center text-sm font-bold relative overflow-hidden`}
                                                >
                                                    {/* Background animation */}
                                                    {status === "available" && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                    )}

                                                    {/* Icons */}
                                                    <div className="relative z-10">
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
