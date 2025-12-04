// Field Table Component
// Hiển thị bảng danh sách sân thể thao

import AdminTable, { TableColumn, TableAction, renderBadge, renderCurrency } from "../shared/AdminTable"
import { Eye, Edit, Play, Pause, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdminField } from "@/data/mockDataAdmin"

interface FieldTableProps {
    fields: AdminField[]
    onFieldAction: (fieldId: string, action: 'view' | 'edit' | 'activate' | 'deactivate' | 'delete') => void
}

export default function FieldTable({ fields, onFieldAction }: FieldTableProps) {
    const statusColorMap = {
        'available': 'bg-green-100 text-green-800',
        'unavailable': 'bg-red-100 text-red-800'
    }

    const statusLabelMap = {
        'available': 'Hoạt động',
        'unavailable': 'Tạm ngưng'
    }

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Tên sân',
            render: (name) => (
                <div className="font-medium">{name}</div>
            )
        },
        {
            key: 'sport_name',
            label: 'Môn thể thao',
            render: (sport) => <span className="text-sm text-gray-600">{sport}</span>
        },
        {
            key: 'price',
            label: 'Giá/giờ',
            render: (price) => renderCurrency(Number(price) || 0)
        },

        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => renderBadge(statusLabelMap[status as keyof typeof statusLabelMap], statusColorMap)
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