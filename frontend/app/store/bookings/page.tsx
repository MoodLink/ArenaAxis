"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Search,
    Filter,
    Calendar as CalendarIcon,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Check,
    X,
    Eye,
    MessageSquare,
    AlertCircle,
    RefreshCw,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BookingQuickActions } from '@/components/store/bookings/BookingDialogs'

// Mock data
const bookings = [
    {
        id: 1,
        bookingCode: 'BK001',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        customerEmail: 'nguyenvana@email.com',
        fieldName: 'Sân bóng đá 1',
        fieldType: 'football',
        date: '2024-12-28',
        timeSlot: '18:00-20:00',
        duration: 2,
        pricePerHour: 200000,
        totalAmount: 400000,
        discount: 0,
        finalAmount: 400000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'bank_transfer',
        bookedAt: '2024-12-25T10:30:00',
        note: 'Đặt cho trận đấu giao hữu công ty',
        specialRequests: []
    },
    {
        id: 2,
        bookingCode: 'BK002',
        customerName: 'Trần Thị B',
        customerPhone: '0912345678',
        customerEmail: 'tranthib@email.com',
        fieldName: 'Sân tennis 1',
        fieldType: 'tennis',
        date: '2024-12-28',
        timeSlot: '16:00-17:00',
        duration: 1,
        pricePerHour: 120000,
        totalAmount: 120000,
        discount: 12000,
        finalAmount: 108000,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        bookedAt: '2024-12-27T14:20:00',
        note: 'Lớp học tennis cho trẻ em',
        specialRequests: ['Chuẩn bị bóng tennis', 'Lưới an toàn']
    },
    {
        id: 3,
        bookingCode: 'BK003',
        customerName: 'Lê Văn C',
        customerPhone: '0923456789',
        customerEmail: 'levanc@email.com',
        fieldName: 'Sân cầu lông 1',
        fieldType: 'badminton',
        date: '2024-12-29',
        timeSlot: '20:00-22:00',
        duration: 2,
        pricePerHour: 80000,
        totalAmount: 160000,
        discount: 0,
        finalAmount: 160000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'momo',
        bookedAt: '2024-12-26T16:45:00',
        note: '',
        specialRequests: []
    },
    {
        id: 4,
        bookingCode: 'BK004',
        customerName: 'Phạm Thị D',
        customerPhone: '0934567890',
        customerEmail: 'phamthid@email.com',
        fieldName: 'Sân bóng đá 2',
        fieldType: 'football',
        date: '2024-12-29',
        timeSlot: '08:00-10:00',
        duration: 2,
        pricePerHour: 150000,
        totalAmount: 300000,
        discount: 30000,
        finalAmount: 270000,
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'bank_transfer',
        bookedAt: '2024-12-24T09:15:00',
        note: 'Hủy do thời tiết xấu',
        specialRequests: []
    }
]

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
}

const statusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành'
}

const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800'
}

const paymentStatusLabels = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    refunded: 'Đã hoàn tiền',
    failed: 'Thất bại'
}

const paymentMethodLabels = {
    cash: 'Tiền mặt',
    bank_transfer: 'Chuyển khoản',
    momo: 'MoMo',
    vnpay: 'VNPay'
}

const fieldTypeLabels = {
    football: 'Bóng đá',
    tennis: 'Tennis',
    badminton: 'Cầu lông',
    basketball: 'Bóng rổ'
}

function BookingCard({ booking }: { booking: any }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{booking.bookingCode}</h3>
                            <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                                {statusLabels[booking.status as keyof typeof statusLabels]}
                            </Badge>
                            <Badge className={paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]}>
                                {paymentStatusLabels[booking.paymentStatus as keyof typeof paymentStatusLabels]}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{booking.customerName}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{booking.customerPhone}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{booking.finalAmount.toLocaleString()}đ</p>
                        <p className="text-sm text-gray-500">{paymentMethodLabels[booking.paymentMethod as keyof typeof paymentMethodLabels]}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{booking.fieldName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span>{booking.date}</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{booking.timeSlot}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span>{booking.duration} giờ • {fieldTypeLabels[booking.fieldType as keyof typeof fieldTypeLabels]}</span>
                        </div>
                    </div>
                </div>

                {booking.note && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">{booking.note}</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Đặt lúc: {format(new Date(booking.bookedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </div>
                    <div className="flex space-x-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Chi tiết
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Chi tiết đặt sân #{booking.bookingCode}</DialogTitle>
                                    <DialogDescription>
                                        Thông tin chi tiết về lượt đặt sân
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Họ tên:</span>
                                                <p className="font-medium">{booking.customerName}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Số điện thoại:</span>
                                                <p className="font-medium">{booking.customerPhone}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Email:</span>
                                                <p className="font-medium">{booking.customerEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Thông tin đặt sân</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Sân:</span>
                                                <p className="font-medium">{booking.fieldName}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Loại:</span>
                                                <p className="font-medium">{fieldTypeLabels[booking.fieldType as keyof typeof fieldTypeLabels]}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày:</span>
                                                <p className="font-medium">{booking.date}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Giờ:</span>
                                                <p className="font-medium">{booking.timeSlot}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Thời lượng:</span>
                                                <p className="font-medium">{booking.duration} giờ</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Giá thuê sân:</span>
                                                <span>{booking.pricePerHour.toLocaleString()}đ/giờ</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tổng tiền:</span>
                                                <span>{booking.totalAmount.toLocaleString()}đ</span>
                                            </div>
                                            {booking.discount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Giảm giá:</span>
                                                    <span className="text-green-600">-{booking.discount.toLocaleString()}đ</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-medium border-t pt-2">
                                                <span>Thành tiền:</span>
                                                <span className="text-green-600">{booking.finalAmount.toLocaleString()}đ</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Phương thức:</span>
                                                <span>{paymentMethodLabels[booking.paymentMethod as keyof typeof paymentMethodLabels]}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    {booking.specialRequests.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Yêu cầu đặc biệt</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {booking.specialRequests.map((request: string, index: number) => (
                                                    <li key={index}>{request}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Note */}
                                    {booking.note && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Ghi chú</h4>
                                            <p className="text-sm text-gray-600">{booking.note}</p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <BookingQuickActions
                            booking={booking}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function StoreBookings() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState<Date>()
    const [fieldFilter, setFieldFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.customerPhone.includes(searchQuery)

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
        const matchesDate = !dateFilter || booking.date === format(dateFilter, 'yyyy-MM-dd')
        const matchesField = fieldFilter === 'all' || booking.fieldName.includes(fieldFilter)

        return matchesSearch && matchesStatus && matchesDate && matchesField
    })

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentBookings = filteredBookings.slice(startIndex, endIndex)

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        totalRevenue: bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, booking) => sum + booking.finalAmount, 0)
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lịch đặt sân</h1>
                        <p className="text-gray-600 mt-1">Quản lý các lượt đặt sân của khách hàng</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Xuất báo cáo
                        </Button>
                        <Button>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-600">Tổng đặt sân</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                <p className="text-sm text-gray-600">Chờ xác nhận</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                                <p className="text-sm text-gray-600">Đã xác nhận</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                                <p className="text-sm text-gray-600">Hoàn thành</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{stats.totalRevenue.toLocaleString()}đ</p>
                                <p className="text-sm text-gray-600">Doanh thu</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                    <Input
                                        placeholder="Tìm kiếm theo mã đặt, tên khách hàng, số điện thoại..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                        <SelectItem value="completed">Hoàn thành</SelectItem>
                                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-40">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateFilter ? format(dateFilter, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dateFilter}
                                            onSelect={setDateFilter}
                                            initialFocus
                                            locale={vi}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Sân" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả sân</SelectItem>
                                        <SelectItem value="Sân bóng đá 1">Sân bóng đá 1</SelectItem>
                                        <SelectItem value="Sân bóng đá 2">Sân bóng đá 2</SelectItem>
                                        <SelectItem value="Sân tennis 1">Sân tennis 1</SelectItem>
                                        <SelectItem value="Sân cầu lông 1">Sân cầu lông 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings List */}
                <div className="space-y-4">
                    {currentBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>

                {filteredBookings.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đặt sân nào</h3>
                            <p className="text-gray-600 mb-6">
                                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                            </p>
                            <Button variant="outline" onClick={() => {
                                setSearchQuery('')
                                setStatusFilter('all')
                                setDateFilter(undefined)
                                setFieldFilter('all')
                            }}>
                                Xóa bộ lọc
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </StoreLayout>
    )
}