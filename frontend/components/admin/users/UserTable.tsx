// User Table Component
// Hiển thị bảng danh sách người dùng

import { User } from "@/types"
import AdminTable, { TableColumn, TableAction, renderAvatar, renderBadge } from "../shared/AdminTable"
import { Eye, Edit, Shield, ShieldCheck, Trash2 } from "lucide-react"

interface UserTableProps {
    users: Array<User & { status: 'active' | 'inactive' | 'banned'; joinDate: string; lastActive: string }>
    onUserAction: (userId: string, action: 'view' | 'edit' | 'ban' | 'activate' | 'delete') => void
}

export default function UserTable({ users, onUserAction }: UserTableProps) {
    const statusColorMap = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-yellow-100 text-yellow-800',
        'banned': 'bg-red-100 text-red-800'
    }

    const statusLabelMap = {
        'active': 'Hoạt động',
        'inactive': 'Không hoạt động',
        'banned': 'Bị khóa'
    }

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Người dùng',
            render: (_, user) => renderAvatar(user.name, user.avatar)
        },
        {
            key: 'email',
            label: 'Email',
            render: (email) => <span className="text-sm text-gray-600">{email}</span>
        },
        {
            key: 'phone',
            label: 'Điện thoại',
            render: (phone) => <span className="text-sm text-gray-600">{phone}</span>
        },
        {
            key: 'location',
            label: 'Khu vực',
            render: (location) => <span className="text-sm text-gray-600">{location || 'Chưa cập nhật'}</span>
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => renderBadge(statusLabelMap[status as keyof typeof statusLabelMap], statusColorMap)
        },
        {
            key: 'totalBookings',
            label: 'Tổng booking',
            render: (_, user) => <span className="font-medium">{user.stats.totalBookings}</span>
        },
        {
            key: 'joinDate',
            label: 'Ngày tham gia',
            render: (joinDate) => <span className="text-sm text-gray-600">{new Date(joinDate).toLocaleDateString('vi-VN')}</span>
        }
    ]

    const actions: TableAction[] = [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (user) => onUserAction(user.id, 'view')
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <Edit className="mr-2 h-4 w-4" />,
            onClick: (user) => onUserAction(user.id, 'edit')
        },
        {
            key: 'ban',
            label: 'Khóa tài khoản',
            icon: <Shield className="mr-2 h-4 w-4" />,
            onClick: (user) => onUserAction(user.id, 'ban'),
            show: (user) => user.status !== 'banned',
            variant: 'destructive'
        },
        {
            key: 'activate',
            label: 'Kích hoạt',
            icon: <ShieldCheck className="mr-2 h-4 w-4" />,
            onClick: (user) => onUserAction(user.id, 'activate'),
            show: (user) => user.status === 'banned' || user.status === 'inactive'
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (user) => onUserAction(user.id, 'delete'),
            variant: 'destructive'
        }
    ]

    return (
        <AdminTable
            columns={columns}
            data={users}
            actions={actions}
            emptyMessage="Không tìm thấy người dùng nào"
        />
    )
}