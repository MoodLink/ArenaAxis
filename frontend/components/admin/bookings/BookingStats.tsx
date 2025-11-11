// Booking Stats Component
// Hiển thị thống kê về bookings

import AdminStats from "../shared/AdminStats"
import { Calendar, Clock, CheckCircle, DollarSign } from "lucide-react"
import { AdminBooking } from "@/data/mockDataAdmin"

interface BookingStatsProps {
    bookings: AdminBooking[]
}

export default function BookingStats({ bookings }: BookingStatsProps) {
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter(b => b.status === 'pending').length
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
    const completedBookings = bookings.filter(b => b.status === 'completed').length
    const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'paid' && b.status !== 'cancelled')
        .reduce((sum, booking) => sum + booking.totalPrice, 0)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const stats = [
        {
            title: "Tổng booking",
            value: totalBookings,
            icon: Calendar,
            iconColor: "text-blue-600"
        },
        {
            title: "Chờ xác nhận",
            value: pendingBookings,
            icon: Clock,
            iconColor: "text-yellow-600"
        },
        {
            title: "Đã xác nhận",
            value: confirmedBookings,
            icon: CheckCircle,
            iconColor: "text-blue-600"
        },
        {
            title: "Hoàn thành",
            value: completedBookings,
            icon: CheckCircle,
            iconColor: "text-green-600"
        },
        {
            title: "Tổng doanh thu",
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            iconColor: "text-green-600"
        }
    ]

    return <AdminStats stats={stats} />
}