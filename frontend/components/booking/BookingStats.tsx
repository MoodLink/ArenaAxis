// Component hiển thị statistics của booking
"use client"

import { Calendar, CheckCircle } from "lucide-react"
import { Booking } from "@/types"

interface BookingStatsProps {
    bookings: Booking[]
}

export default function BookingStats({ bookings }: BookingStatsProps) {
    const completedBookings = bookings.filter(b => b.status === "completed").length

    return (
        <div className="flex gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tổng đơn đặt</p>
                        <p className="text-xl font-semibold text-gray-900">{bookings.length}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}