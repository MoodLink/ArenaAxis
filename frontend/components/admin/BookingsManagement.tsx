"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Import components đã tách
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import BookingStats from "./bookings/BookingStats"
import BookingTable from "./bookings/BookingTable"
import BookingForm from "./bookings/BookingForm"
import BookingDetail from "./bookings/BookingDetail"

// Import mock data
import { mockBookings, AdminBooking } from "@/data/mockDataAdmin"

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<AdminBooking[]>(mockBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userPhone.includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter

    // Date filter logic
    const bookingDate = new Date(booking.date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    let matchesDate = true
    if (dateFilter === 'today') {
      matchesDate = bookingDate.toDateString() === today.toDateString()
    } else if (dateFilter === 'tomorrow') {
      matchesDate = bookingDate.toDateString() === tomorrow.toDateString()
    } else if (dateFilter === 'week') {
      matchesDate = bookingDate >= today && bookingDate <= nextWeek
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate
  })

  const handleBookingAction = (bookingId: string, action: 'confirm' | 'cancel' | 'complete' | 'refund' | 'view' | 'edit' | 'delete') => {
    const booking = bookings.find(b => b.id === bookingId)

    switch (action) {
      case 'view':
        if (booking) {
          setSelectedBooking(booking)
          setIsViewDialogOpen(true)
        }
        break
      case 'edit':
        if (booking) {
          setSelectedBooking(booking)
          setIsEditDialogOpen(true)
        }
        break
      case 'confirm':
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'confirmed' as const }
            : booking
        ))
        break
      case 'cancel':
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ))
        break
      case 'complete':
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'completed' as const, paymentStatus: 'paid' as const }
            : booking
        ))
        break
      case 'refund':
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, paymentStatus: 'refunded' as const, status: 'cancelled' as const }
            : booking
        ))
        break
      case 'delete':
        setBookings(bookings.filter(booking => booking.id !== bookingId))
        break
      default:
        console.log(`${action} booking ${bookingId}`)
    }
  }

  const handleUpdateBooking = (formData: { status: string; paymentStatus: string }) => {
    if (!selectedBooking) return

    setBookings(bookings.map(b => b.id === selectedBooking.id ? {
      ...b,
      status: formData.status as any,
      paymentStatus: formData.paymentStatus as any
    } : b))
    setIsEditDialogOpen(false)
    setSelectedBooking(null)
  }

  // Filter options
  const filterOptions = [
    {
      key: 'status',
      placeholder: 'Trạng thái',
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
      ]
    },
    {
      key: 'payment',
      placeholder: 'Thanh toán',
      value: paymentFilter,
      onValueChange: setPaymentFilter,
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'pending', label: 'Chờ thanh toán' },
        { value: 'failed', label: 'Thất bại' },
        { value: 'refunded', label: 'Đã hoàn tiền' }
      ]
    },
    {
      key: 'date',
      placeholder: 'Ngày đặt',
      value: dateFilter,
      onValueChange: setDateFilter,
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'tomorrow', label: 'Ngày mai' },
        { value: 'week', label: 'Tuần này' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Quản lý booking"
        description="Theo dõi và quản lý các đặt sân trong hệ thống"
      />

      {/* Stats Cards */}
      <BookingStats bookings={bookings} />

      {/* Filters and Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách booking</CardTitle>
          <CardDescription>
            Quản lý {filteredBookings.length} booking trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterOptions}
          />

          <BookingTable
            bookings={filteredBookings}
            onBookingAction={handleBookingAction}
          />

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy booking nào phù hợp
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa booking</DialogTitle>
            <DialogDescription>
              Cập nhật trạng thái booking và thanh toán
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <BookingForm
              initialData={{
                status: selectedBooking.status as any,
                paymentStatus: selectedBooking.paymentStatus
              }}
              onSubmit={handleUpdateBooking}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedBooking(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết booking</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && <BookingDetail booking={selectedBooking} />}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}