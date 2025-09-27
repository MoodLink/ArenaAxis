import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Edit,
    Trash2,
    User,
    Phone,
    Mail,
    MapPin,
    Clock,
    DollarSign,
    Calendar as CalendarIcon,
    AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Edit Booking Dialog
export function EditBookingDialog({ booking, trigger }: { booking: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState(booking.status || '')
    const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || '')

    const handleSubmit = () => {
        // Handle form submission
        console.log('Updating booking:', booking.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa đặt sân #{booking.bookingCode}</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin đặt sân của khách hàng
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Thông tin khách hàng</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-customer-name">Tên khách hàng</Label>
                                <Input id="edit-customer-name" defaultValue={booking.customerName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-customer-phone">Số điện thoại</Label>
                                <Input id="edit-customer-phone" defaultValue={booking.customerPhone} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-customer-email">Email</Label>
                            <Input id="edit-customer-email" defaultValue={booking.customerEmail} />
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Chi tiết đặt sân</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-field-name">Sân</Label>
                                <Input id="edit-field-name" defaultValue={booking.fieldName} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-time-slot">Khung giờ</Label>
                                <Input id="edit-time-slot" defaultValue={booking.timeSlot} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Thời lượng (giờ)</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    defaultValue={booking.duration}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Giá/giờ (VNĐ)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    defaultValue={booking.pricePerHour}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Trạng thái đặt sân</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Trạng thái thanh toán</Label>
                            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chưa thanh toán</SelectItem>
                                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-note">Ghi chú</Label>
                        <Textarea
                            id="edit-note"
                            defaultValue={booking.note}
                            rows={3}
                        />
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && booking.specialRequests.length > 0 && (
                        <div className="space-y-2">
                            <Label>Yêu cầu đặc biệt</Label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <ul className="text-sm space-y-1">
                                    {booking.specialRequests.map((request: string, index: number) => (
                                        <li key={index}>• {request}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Cancel/Delete Booking Dialog
export function CancelBookingDialog({ booking, trigger }: { booking: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState('')

    const handleCancel = () => {
        // Handle cancel/delete operation
        console.log('Cancelling booking:', booking.id, 'Reason:', reason)
        setOpen(false)
    }

    const isCompleted = booking.status === 'completed'
    const isPaid = booking.paymentStatus === 'paid'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Xác nhận hủy đặt sân</span>
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn hủy đặt sân <strong>#{booking.bookingCode}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Booking Info */}
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <p><strong>Khách hàng:</strong> {booking.customerName}</p>
                        <p><strong>Sân:</strong> {booking.fieldName}</p>
                        <p><strong>Ngày:</strong> {booking.date}</p>
                        <p><strong>Giờ:</strong> {booking.timeSlot}</p>
                        <p><strong>Tổng tiền:</strong> {booking.finalAmount?.toLocaleString()}đ</p>
                    </div>

                    {/* Warnings */}
                    {(isCompleted || isPaid) && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-orange-800 mb-2">Lưu ý:</h4>
                            <ul className="text-sm text-orange-700 space-y-1">
                                {isPaid && <li>• Khách hàng đã thanh toán - cần xử lý hoàn tiền</li>}
                                {isCompleted && <li>• Đặt sân đã hoàn thành</li>}
                                <li>• Cần thông báo cho khách hàng về việc hủy</li>
                            </ul>
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="cancel-reason">Lý do hủy</Label>
                        <Textarea
                            id="cancel-reason"
                            placeholder="Nhập lý do hủy đặt sân..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="destructive" onClick={handleCancel}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xác nhận hủy
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Quick Actions for Booking
export function BookingQuickActions({ booking }: { booking: any }) {
    const canConfirm = booking.status === 'pending'
    const canComplete = booking.status === 'confirmed'
    const canEdit = ['pending', 'confirmed'].includes(booking.status)

    return (
        <div className="flex items-center space-x-2">
            {canConfirm && (
                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                    Xác nhận
                </Button>
            )}
            {canComplete && (
                <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                    Hoàn thành
                </Button>
            )}
            {canEdit && (
                <EditBookingDialog
                    booking={booking}
                    trigger={
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                        </Button>
                    }
                />
            )}
            <CancelBookingDialog
                booking={booking}
                trigger={
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                }
            />
        </div>
    )
}