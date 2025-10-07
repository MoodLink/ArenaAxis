"use client"

import React, { useState } from 'react'
import ClientOnly from "../../common/ClientOnly";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Mock data
const recentBookings = [
    { id: 1, customerName: 'Nguyễn Văn A', field: 'Sân 1', time: '18:00-20:00', date: '2024-12-28', price: 200000, status: 'confirmed' },
    { id: 2, customerName: 'Trần Thị B', field: 'Sân 3', time: '16:00-18:00', date: '2024-12-28', price: 180000, status: 'confirmed' },
    { id: 3, customerName: 'Lê Văn C', field: 'Sân 2', time: '20:00-22:00', date: '2024-12-28', price: 220000, status: 'pending' },
    { id: 4, customerName: 'Phạm Thị D', field: 'Sân 4', time: '14:00-16:00', date: '2024-12-29', price: 160000, status: 'confirmed' },
    { id: 5, customerName: 'Hoàng Văn E', field: 'Sân 5', time: '08:00-10:00', date: '2024-12-29', price: 150000, status: 'confirmed' }
]

const topCustomers = [
    { name: 'Nguyễn Văn A', bookings: 24, revenue: 4800000, lastVisit: '2024-12-27' },
    { name: 'Trần Thị B', bookings: 18, revenue: 3600000, lastVisit: '2024-12-26' },
    { name: 'Lê Văn C', bookings: 15, revenue: 3000000, lastVisit: '2024-12-25' },
    { name: 'Phạm Thị D', bookings: 12, revenue: 2400000, lastVisit: '2024-12-24' },
    { name: 'Hoàng Văn E', bookings: 10, revenue: 2000000, lastVisit: '2024-12-23' }
]

function getStatusBadge(status: string) {
    const variants = {
        confirmed: { variant: 'default' as const, text: 'Đã xác nhận' },
        pending: { variant: 'secondary' as const, text: 'Chờ xác nhận' },
        cancelled: { variant: 'destructive' as const, text: 'Đã hủy' },
        completed: { variant: 'outline' as const, text: 'Hoàn thành' }
    }

    const config = variants[status as keyof typeof variants] || variants.pending
    return <Badge variant={config.variant}>{config.text}</Badge>
}

export default function DataSection() {
    const [selectedBooking, setSelectedBooking] = useState<typeof recentBookings[0] | null>(null)

    const handleBookingAction = (bookingId: number, action: string) => {
        console.log(`Action ${action} on booking ${bookingId}`)
        // Implement booking actions here
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Đặt sân gần đây</CardTitle>
                            <CardDescription>5 lượt đặt sân mới nhất</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            Xem tất cả
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{booking.customerName}</h4>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleBookingAction(booking.id, 'view')}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleBookingAction(booking.id, 'edit')}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>{booking.field} • {booking.time}</div>
                                        <div>{booking.date} • <ClientOnly>{booking.price.toLocaleString()}đ</ClientOnly></div>
                                    </div>
                                    <div className="mt-2">
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Khách hàng VIP</CardTitle>
                            <CardDescription>Top 5 khách hàng có doanh thu cao nhất</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            Xem tất cả
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topCustomers.map((customer, index) => (
                            <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-sm text-gray-500">{customer.bookings} lượt đặt</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{customer.revenue.toLocaleString()}đ</p>
                                    <p className="text-sm text-gray-500">{customer.lastVisit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}