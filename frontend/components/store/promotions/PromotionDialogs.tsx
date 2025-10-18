import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Eye,
    Edit,
    Trash2,
    Calendar as CalendarIcon,
    Percent,
    DollarSign,
    Clock,
    Package,
    TrendingUp,
    Users,
    Target,
    Copy,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'

// View Promotion Dialog
export function ViewPromotionDialog({ promotion, trigger }: { promotion: any; trigger: React.ReactNode }) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'percentage': return Percent
            case 'fixed_amount': return DollarSign
            case 'free_hours': return Clock
            default: return Package
        }
    }

    const TypeIcon = getTypeIcon(promotion.type)

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3">
                        <TypeIcon className="h-6 w-6 text-blue-600" />
                        <span>{promotion.name}</span>
                        <Badge variant={promotion.status === 'active' ? 'default' : 'secondary'}>
                            {promotion.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Promotion Code */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-blue-800">Mã khuyến mãi</Label>
                                <p className="text-2xl font-bold text-blue-900 font-mono">{promotion.code}</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-2" />
                                Sao chép
                            </Button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Loại khuyến mãi</Label>
                                <p className="text-base font-medium">
                                    {promotion.type === 'percentage' && 'Giảm theo phần trăm'}
                                    {promotion.type === 'fixed_amount' && 'Giảm số tiền cố định'}
                                    {promotion.type === 'free_hours' && 'Tặng giờ miễn phí'}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Giá trị khuyến mãi</Label>
                                <p className="text-base font-medium">
                                    {promotion.type === 'percentage' && `${promotion.value}%`}
                                    {promotion.type === 'fixed_amount' && `${promotion.value.toLocaleString()}đ`}
                                    {promotion.type === 'free_hours' && `${promotion.value} giờ`}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Thời gian áp dụng</Label>
                                <p className="text-base font-medium">
                                    {promotion.startDate} - {promotion.endDate}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Giới hạn sử dụng</Label>
                                <p className="text-base font-medium">{promotion.usageLimit} lượt</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Đã sử dụng</Label>
                                <p className="text-base font-medium text-green-600">{promotion.usageCount} lượt</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Còn lại</Label>
                                <p className="text-base font-medium text-blue-600">
                                    {promotion.usageLimit - promotion.usageCount} lượt
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="text-sm font-medium text-gray-600">Mô tả</Label>
                        <p className="text-base mt-1 bg-gray-50 p-3 rounded-lg">{promotion.description}</p>
                    </div>

                    {/* Conditions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Đơn hàng tối thiểu</Label>
                            <p className="text-base font-medium">{promotion.minAmount?.toLocaleString()}đ</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Giảm tối đa</Label>
                            <p className="text-base font-medium">{promotion.maxDiscount?.toLocaleString()}đ</p>
                        </div>
                    </div>

                    {/* Applicable Fields */}
                    <div>
                        <Label className="text-sm font-medium text-gray-600">Sân áp dụng</Label>
                        {promotion.applicableFields === 'all' ? (
                            <p className="text-base font-medium text-green-600">Tất cả sân</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {promotion.applicableFields?.map((field: string, index: number) => (
                                    <Badge key={index} variant="outline">{field}</Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <Label className="text-sm font-medium text-gray-600 mb-3 block">Thống kê hiệu quả</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Doanh thu tạo ra</p>
                                <p className="text-xl font-bold text-green-600">{promotion.totalRevenue?.toLocaleString()}đ</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Tổng tiền giảm</p>
                                <p className="text-xl font-bold text-orange-600">{promotion.totalSavings?.toLocaleString()}đ</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Tỷ lệ sử dụng</p>
                                <p className="text-xl font-bold text-blue-600">
                                    {((promotion.usageCount / promotion.usageLimit) * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Creation Date */}
                    <div>
                        <Label className="text-sm font-medium text-gray-600">Ngày tạo</Label>
                        <p className="text-base mt-1">{format(new Date(promotion.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Edit Promotion Dialog
export function EditPromotionDialog({ promotion, trigger }: { promotion: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [promotionType, setPromotionType] = useState(promotion.type || 'percentage')
    const [status, setStatus] = useState(promotion.status || 'active')
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(promotion.startDate))
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(promotion.endDate))

    const handleSubmit = () => {
        console.log('Updating promotion:', promotion.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin chi tiết về chương trình khuyến mãi
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-promotion-name">Tên chương trình</Label>
                            <Input id="edit-promotion-name" defaultValue={promotion.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-promotion-code">Mã khuyến mãi</Label>
                            <Input id="edit-promotion-code" defaultValue={promotion.code} className="font-mono" />
                        </div>
                    </div>

                    {/* Type and Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Loại khuyến mãi</Label>
                            <Select value={promotionType} onValueChange={setPromotionType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Giảm theo %</SelectItem>
                                    <SelectItem value="fixed_amount">Giảm số tiền</SelectItem>
                                    <SelectItem value="free_hours">Tặng giờ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-promotion-value">
                                Giá trị
                                {promotionType === 'percentage' && ' (%)'}
                                {promotionType === 'fixed_amount' && ' (VNĐ)'}
                                {promotionType === 'free_hours' && ' (giờ)'}
                            </Label>
                            <Input
                                id="edit-promotion-value"
                                type="number"
                                defaultValue={promotion.value}
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày kết thúc</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-usage-limit">Giới hạn sử dụng</Label>
                            <Input
                                id="edit-usage-limit"
                                type="number"
                                defaultValue={promotion.usageLimit}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-min-amount">Đơn hàng tối thiểu (VNĐ)</Label>
                            <Input
                                id="edit-min-amount"
                                type="number"
                                defaultValue={promotion.minAmount}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-max-discount">Giảm tối đa (VNĐ)</Label>
                        <Input
                            id="edit-max-discount"
                            type="number"
                            defaultValue={promotion.maxDiscount}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-promotion-description">Mô tả</Label>
                        <Textarea
                            id="edit-promotion-description"
                            defaultValue={promotion.description}
                            rows={3}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Đang hoạt động</SelectItem>
                                <SelectItem value="paused">Tạm dừng</SelectItem>
                                <SelectItem value="expired">Đã hết hạn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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

// Delete Promotion Dialog
export function DeletePromotionDialog({ promotion, trigger }: { promotion: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        console.log('Deleting promotion:', promotion.id)
        setOpen(false)
    }

    const hasActiveUsage = promotion.usageCount > 0
    const isActive = promotion.status === 'active'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Xác nhận xóa khuyến mãi</span>
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa <strong>{promotion.name}</strong>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                {(hasActiveUsage || isActive) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            {isActive && <li>• Khuyến mãi đang hoạt động</li>}
                            {hasActiveUsage && <li>• Đã có {promotion.usageCount} lượt sử dụng</li>}
                            <li>• Dữ liệu thống kê sẽ bị mất</li>
                            <li>• Khách hàng có thể bị ảnh hưởng</li>
                        </ul>
                    </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p><strong>Mã:</strong> {promotion.code}</p>
                    <p><strong>Loại:</strong> {promotion.type}</p>
                    <p><strong>Đã sử dụng:</strong> {promotion.usageCount}/{promotion.usageLimit}</p>
                    <p><strong>Doanh thu tạo ra:</strong> {promotion.totalRevenue?.toLocaleString()}đ</p>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa khuyến mãi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}