// Component sidebar đặt sân
// Hiển thị form đặt sân với khung giờ thực tế từ API

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getFieldBookingSlots } from "@/services/api"

interface FieldBookingSidebarProps {
    fieldId: string
}

interface TimeSlot {
    time: string
    price: number
    available: boolean
    date?: string
}

export default function FieldBookingSidebar({ fieldId }: FieldBookingSidebarProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [selectedDate, setSelectedDate] = useState(() => {
        // Default to today's date
        const today = new Date()
        return today.toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBookingSlots = async () => {
            try {
                setLoading(true)
                const slots = await getFieldBookingSlots(fieldId, selectedDate)
                setTimeSlots(slots)
            } catch (error) {
                console.error('Failed to load booking slots:', error)
                setTimeSlots([])
            } finally {
                setLoading(false)
            }
        }

        loadBookingSlots()
    }, [fieldId, selectedDate])

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value)
    }

    const formatPrice = (price: number) => {
        return `₫ ${price.toLocaleString('vi-VN')}`
    }

    const getEndTime = (startTime: string) => {
        const [hours, minutes] = startTime.split(":").map(Number)
        const endHour = hours === 23 ? 0 : hours + 1
        return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    return (
        <Card className="sticky top-8 shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-blue-50">
            <CardContent className="p-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Đặt sân ngay</h3>
                    <p className="text-gray-600 mt-1">Chọn ngày và giờ phù hợp</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Chọn ngày</label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700">Khung giờ có sẵn</label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Đang tải...</p>
                                </div>
                            ) : timeSlots.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Không có khung giờ nào khả dụng</p>
                                </div>
                            ) : (
                                timeSlots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800">{slot.time}</span>
                                                <span className="text-gray-500">- {getEndTime(slot.time)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-emerald-600 text-lg">{formatPrice(slot.price)}</span>
                                            {slot.available ? (
                                                <Link href={`/booking/${fieldId}`}>
                                                    <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium px-4">
                                                        ĐẶT NGAY
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button size="sm" disabled className="bg-gray-400 text-gray-600">
                                                    Đã đặt
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 mt-6 pt-4 border-t border-gray-200">
                        <Link href={`/reviews/${fieldId}`}>
                            <Button
                                variant="outline"
                                className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 bg-transparent font-medium"
                            >
                                Xem đánh giá sân
                            </Button>
                        </Link>
                        <Link href={`/booking/${fieldId}`}>
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium">
                                📅 Xem lịch đặt chi tiết
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
