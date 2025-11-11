// Booking Table Component
// Hiển thị bảng danh sách bookings

import AdminTable, { TableColumn, TableAction, renderAvatar, renderBadge, renderCurrency } from "../shared/AdminTable"
import { Eye, Edit, Check, X, RefreshCw, Trash2 } from "lucide-react"
import { AdminBooking } from "@/data/mockDataAdmin"

interface BookingTableProps {
    bookings: AdminBooking[]
    onBookingAction: (bookingId: string, action: 'confirm' | 'cancel' | 'complete' | 'refund' | 'view' | 'edit' | 'delete') => void
}

export default function BookingTable({ bookings, onBookingAction }: BookingTableProps) {
    const statusColorMap = {
        'confirmed': 'bg-blue-100 text-blue-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    }

    const statusLabelMap = {
        'confirmed': 'Đã xác nhận',
        'pending': 'Chờ xác nhận',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    }

    const paymentStatusColorMap = {
        'paid': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800',
        'refunded': 'bg-purple-100 text-purple-800'
    }

    const paymentStatusLabelMap = {
        'paid': 'Đã thanh toán',
        'pending': 'Chờ thanh toán',
        'failed': 'Thất bại',
        'refunded': 'Đã hoàn tiền'
    }

    const columns: TableColumn[] = [
        {
            key: 'id',
            label: 'Booking ID',
            render: (id) => <span className="font-mono text-sm">#{id}</span>
        },
        {
            key: 'userName',
            label: 'Khách hàng',
            render: (_, booking) => renderAvatar(booking.userName, booking.userAvatar)
        },
        {
            key: 'fieldName',
            label: 'Sân thể thao',
            render: (fieldName, booking) => (
                <div>
                    <div className="font-medium">{fieldName}</div>
                    <div className="text-sm text-gray-500">{booking.fieldLocation}</div>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Ngày & Giờ',
            render: (date, booking) => (
                <div>
                    <div className="font-medium">{new Date(date).toLocaleDateString('vi-VN')}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => renderBadge(statusLabelMap[status as keyof typeof statusLabelMap], statusColorMap)
        },
        {
            key: 'paymentStatus',
            label: 'Thanh toán',
            render: (paymentStatus) => renderBadge(paymentStatusLabelMap[paymentStatus as keyof typeof paymentStatusLabelMap], paymentStatusColorMap)
        },
        {
            key: 'totalPrice',
            label: 'Tổng tiền',
            render: (totalPrice) => renderCurrency(totalPrice)
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (createdAt) => (
                <span className="text-sm text-gray-600">
                    {new Date(createdAt).toLocaleDateString('vi-VN')}
                </span>
            )
        }
    ]

    const actions: TableAction[] = [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'view')
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <Edit className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'edit')
        },
        {
            key: 'confirm',
            label: 'Xác nhận',
            icon: <Check className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'confirm'),
            show: (booking) => booking.status === 'pending'
        },
        {
            key: 'complete',
            label: 'Hoàn thành',
            icon: <Check className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'complete'),
            show: (booking) => booking.status === 'confirmed'
        },
        {
            key: 'refund',
            label: 'Hoàn tiền',
            icon: <RefreshCw className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'refund'),
            show: (booking) => booking.paymentStatus === 'paid' && booking.status !== 'completed',
            variant: 'destructive'
        },
        {
            key: 'cancel',
            label: 'Hủy booking',
            icon: <X className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'cancel'),
            show: (booking) => booking.status !== 'cancelled' && booking.status !== 'completed',
            variant: 'destructive'
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (booking) => onBookingAction(booking.id, 'delete'),
            variant: 'destructive'
        }
    ]

    return (
        <AdminTable
            columns={columns}
            data={bookings}
            actions={actions}
            emptyMessage="Không tìm thấy booking nào"
        />
    )
}