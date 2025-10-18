// Shared Admin Table Component với action buttons
// Component table tái sử dụng cho tất cả các trang admin

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

export interface TableColumn {
    key: string
    label: string
    render?: (value: any, item: any) => React.ReactNode
    className?: string
}

export interface TableAction {
    key: string
    label: string
    icon: React.ReactNode
    onClick: (item: any) => void
    variant?: 'default' | 'destructive'
    show?: (item: any) => boolean
}

interface AdminTableProps {
    columns: TableColumn[]
    data: any[]
    actions?: TableAction[]
    emptyMessage?: string
}

export default function AdminTable({ columns, data, actions, emptyMessage = "Không có dữ liệu" }: AdminTableProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="border rounded-lg">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}>
                                    {column.label}
                                </th>
                            ))}
                            {actions && actions.length > 0 && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                                    </td>
                                ))}
                                {actions && actions.length > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {actions.map((action, actionIndex) => {
                                                    if (action.show && !action.show(item)) return null

                                                    return (
                                                        <div key={action.key}>
                                                            <DropdownMenuItem
                                                                onClick={() => action.onClick(item)}
                                                                className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                                            >
                                                                {action.icon}
                                                                {action.label}
                                                            </DropdownMenuItem>
                                                            {actionIndex < actions.length - 1 && action.variant === 'destructive' && (
                                                                <DropdownMenuSeparator />
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Helper components để render các loại dữ liệu thông dụng
export const renderAvatar = (name: string, avatar?: string) => (
    <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback className="text-sm">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{name}</span>
    </div>
)

export const renderBadge = (status: string, colorMap: Record<string, string>) => (
    <Badge className={colorMap[status] || 'bg-gray-100 text-gray-800'}>
        {status}
    </Badge>
)

export const renderCurrency = (amount: number) => (
    <span className="font-medium">
        {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)}
    </span>
)