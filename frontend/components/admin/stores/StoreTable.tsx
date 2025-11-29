// Store Table Component
// Hiển thị bảng danh sách cửa hàng

import AdminTable, { TableColumn, TableAction } from "../shared/AdminTable"
import { Eye, Edit, Trash2, Star, Eye as EyeIcon, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { StoreSearchItemResponse } from "@/types"

interface StoreTableProps {
    stores: StoreSearchItemResponse[]
    onStoreAction: (storeId: string, action: 'view' | 'edit' | 'delete') => void
}

export default function StoreTable({ stores, onStoreAction }: StoreTableProps) {
    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Tên trung tâm thể thao',
            render: (name, store) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={store.avatarUrl} />
                        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500">{store.province?.name || 'N/A'}, {store.ward?.name || 'N/A'}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'startTime',
            label: 'Thời gian hoạt động',
            render: (_, store) => (
                <span className="text-sm text-gray-600">
                    {store.startTime} - {store.endTime || '---'}
                </span>
            )
        },
        {
            key: 'averageRating',
            label: 'Đánh giá',
            render: (rating) => (
                <div className="flex items-center gap-1">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Math.round(rating || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium ml-1">{rating?.toFixed(1) || '0.0'}</span>
                </div>
            )
        },
        {
            key: 'viewCount',
            label: 'Lượt xem',
            render: (viewCount) => (
                <div className="flex items-center gap-2">
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{viewCount || 0}</span>
                </div>
            )
        },
        {
            key: 'orderCount',
            label: 'Số đơn hàng',
            render: (orderCount) => (
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{orderCount || 0}</span>
                </div>
            )
        }
    ]

    const actions: TableAction[] = [
        {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (store) => onStoreAction(store.id, 'view')
        },
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <Edit className="mr-2 h-4 w-4" />,
            onClick: (store) => onStoreAction(store.id, 'edit')
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            onClick: (store) => onStoreAction(store.id, 'delete'),
            variant: 'destructive'
        }
    ]

    return (
        <AdminTable
            columns={columns}
            data={stores}
            actions={actions}
            emptyMessage="Không tìm thấy cửa hàng nào"
        />
    )
}
