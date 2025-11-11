import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Edit, Trash2, Copy, Play, Pause, Percent, DollarSign, Clock, Gift } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminPromotion } from "@/data/mockDataAdmin"

interface PromotionTableProps {
    promotions: AdminPromotion[]
    onPromotionAction: (promotionId: string, action: 'activate' | 'deactivate' | 'duplicate' | 'delete') => void
}

export default function PromotionTable({ promotions, onPromotionAction }: PromotionTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800">Tạm dừng</Badge>
            case 'expired':
                return <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>
            case 'scheduled':
                return <Badge className="bg-blue-100 text-blue-800">Đã lên lịch</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getTypeBadge = (type: string) => {
        const typeMap = {
            percentage: { label: 'Phần trăm', color: 'bg-purple-50 text-purple-700', icon: Percent },
            fixed_amount: { label: 'Số tiền cố định', color: 'bg-green-50 text-green-700', icon: DollarSign },
            free_hours: { label: 'Giờ miễn phí', color: 'bg-blue-50 text-blue-700', icon: Clock },
            package_deal: { label: 'Gói combo', color: 'bg-orange-50 text-orange-700', icon: Gift }
        }

        const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-50 text-gray-700', icon: Gift }
        const IconComponent = typeInfo.icon

        return (
            <Badge className={`${typeInfo.color} flex items-center space-x-1`}>
                <IconComponent className="h-3 w-3" />
                <span>{typeInfo.label}</span>
            </Badge>
        )
    }

    const getUsagePercentage = (used: number, limit: number) => {
        return Math.round((used / limit) * 100)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tên khuyến mãi</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Mã code</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Sử dụng</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                        <TableCell>
                            <div>
                                <p className="font-medium">{promotion.name}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{promotion.description}</p>
                            </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                        <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{promotion.code}</code>
                        </TableCell>
                        <TableCell>
                            {promotion.type === 'percentage' && `${promotion.value}%`}
                            {promotion.type === 'fixed_amount' && formatCurrency(promotion.value)}
                            {promotion.type === 'free_hours' && `${promotion.value} giờ`}
                            {promotion.type === 'package_deal' && `${promotion.value}% off`}
                        </TableCell>
                        <TableCell>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>{promotion.usedCount}/{promotion.usageLimit}</span>
                                    <span>{getUsagePercentage(promotion.usedCount, promotion.usageLimit)}%</span>
                                </div>
                                <Progress
                                    value={getUsagePercentage(promotion.usedCount, promotion.usageLimit)}
                                    className="h-2"
                                />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm">
                                <p>{formatDate(promotion.startDate)} -</p>
                                <p>{formatDate(promotion.endDate)}</p>
                            </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => { }}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onPromotionAction(promotion.id, 'duplicate')}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Sao chép
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {promotion.status === 'active' ? (
                                        <DropdownMenuItem onClick={() => onPromotionAction(promotion.id, 'deactivate')}>
                                            <Pause className="h-4 w-4 mr-2" />
                                            Tạm dừng
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() => onPromotionAction(promotion.id, 'activate')}>
                                            <Play className="h-4 w-4 mr-2" />
                                            Kích hoạt
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => onPromotionAction(promotion.id, 'delete')}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}