// Field Table Component
// Hiển thị bảng danh sách sân thể thao

import AdminTable, { TableColumn, TableAction, renderBadge, renderCurrency } from "../shared/AdminTable"
import { Eye, Edit, Play, Pause, Shield, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdminField } from "@/data/mockDataAdmin"

interface FieldTableProps {
    fields: AdminField[]
    onFieldAction: (fieldId: string, action: 'view' | 'edit' | 'activate' | 'deactivate' | 'verify' | 'delete') => void
}

export default function FieldTable({ fields, onFieldAction }: FieldTableProps) {
    const statusColorMap = {
        'available': 'bg-green-100 text-green-800',
        'unavailable': 'bg-red-100 text-red-800',
        'maintenance': 'bg-yellow-100 text-yellow-800'
    }

    const statusLabelMap = {
        'available': 'Hoạt động',
        'unavailable': 'Không khả dụng',
        'maintenance': 'Bảo trì'
    }

    const getVerificationBadge = (isVerified: boolean) => {
        return isVerified ? (
            <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Đã xác minh
            </Badge>
        ) : (
            <Badge className="bg-gray-100 text-gray-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Chưa xác minh
            </Badge>
        )
    }

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Tên sân',
            render: (name, field) => (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{field.sport}</div>
                </div>
            )
        },
        {
            key: 'location',
            label: 'Vị trí',
            render: (location) => <span className="text-sm text-gray-600">{location}</span>
        },
        {
            key: 'ownerName',
            label: 'Chủ sân',
            render: (ownerName, field) => (
                <div>
                    <div className="font-medium">{ownerName}</div>
                    <div className="text-sm text-gray-500">{field.ownerPhone}</div>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Giá/giờ',
            render: (price) => renderCurrency(price)
        },
        {
            key: 'rating',
            label: 'Đánh giá',
            render: (rating, field) => (
                <div className="text-center">
                    <div className="font-medium">⭐ {rating}</div>
                    <div className="text-sm text-gray-500">({field.reviewCount} đánh giá)</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => renderBadge(statusLabelMap[status as keyof typeof statusLabelMap], statusColorMap)
        },
        {
            key: 'isVerified',
            label: 'Xác minh',
            render: (isVerified) => getVerificationBadge(isVerified)
        },
        {
            key: 'bookingsThisMonth',
            label: 'Booking/tháng',
            render: (bookings, field) => (
                <div className="text-center">
                    <div className="font-medium">{bookings}</div>
                    <div className="text-sm text-gray-500">{renderCurrency(field.revenueThisMonth)}</div>
                </div>
            )
        }
    ]

    const actions: TableAction[] = [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'view')
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <Edit className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'edit')
        },
        {
            key: 'activate',
            label: 'Kích hoạt',
            icon: <Play className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'activate'),
            show: (field) => field.status !== 'available'
        },
        {
            key: 'deactivate',
            label: 'Tạm dừng',
            icon: <Pause className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'deactivate'),
            show: (field) => field.status === 'available',
            variant: 'destructive'
        },
        {
            key: 'verify',
            label: 'Xác minh',
            icon: <Shield className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'verify'),
            show: (field) => !field.isVerified
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (field) => onFieldAction(field.id, 'delete'),
            variant: 'destructive'
        }
    ]

    return (
        <AdminTable
            columns={columns}
            data={fields}
            actions={actions}
            emptyMessage="Không tìm thấy sân nào"
        />
    )
}