"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
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
    CheckCircle
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ViewPromotionDialog, EditPromotionDialog, DeletePromotionDialog } from '@/components/store/promotions/PromotionDialogs'

// Mock data
const promotions = [
    {
        id: 1,
        name: 'Giảm giá cuối tuần',
        description: 'Giảm 20% cho tất cả sân vào cuối tuần',
        type: 'percentage',
        value: 20,
        code: 'WEEKEND20',
        startDate: '2024-12-28',
        endDate: '2025-01-15',
        status: 'active',
        usageLimit: 100,
        usageCount: 34,
        minAmount: 200000,
        maxDiscount: 100000,
        applicableFields: ['Sân bóng đá 1', 'Sân bóng đá 2'],
        timeRestriction: 'weekend',
        createdAt: '2024-12-20T10:00:00',
        totalRevenue: 6800000,
        totalSavings: 1360000
    },
    {
        id: 2,
        name: 'Khuyến mãi khách hàng mới',
        description: 'Giảm 50,000đ cho lần đặt sân đầu tiên',
        type: 'fixed_amount',
        value: 50000,
        code: 'NEWCUSTOMER',
        startDate: '2024-12-01',
        endDate: '2025-03-31',
        status: 'active',
        usageLimit: 500,
        usageCount: 127,
        minAmount: 100000,
        maxDiscount: 50000,
        applicableFields: 'all',
        timeRestriction: 'none',
        createdAt: '2024-11-30T15:30:00',
        totalRevenue: 7620000,
        totalSavings: 6350000
    },
    {
        id: 3,
        name: 'Giờ vàng giảm sâu',
        description: 'Miễn phí 1 giờ khi đặt 3 giờ liên tục',
        type: 'free_hours',
        value: 1,
        code: 'GOLDEN3',
        startDate: '2024-12-15',
        endDate: '2025-01-31',
        status: 'active',
        usageLimit: 50,
        usageCount: 18,
        minAmount: 300000,
        maxDiscount: 200000,
        applicableFields: ['Sân tennis 1', 'Sân cầu lông 1'],
        timeRestriction: 'morning',
        createdAt: '2024-12-15T09:00:00',
        totalRevenue: 5400000,
        totalSavings: 3600000
    },
    {
        id: 4,
        name: 'Gói ưu đãi tháng',
        description: 'Đặt 10 giờ chỉ với giá 8 giờ',
        type: 'package_deal',
        value: 20,
        code: 'MONTHLY10',
        startDate: '2024-12-01',
        endDate: '2025-02-28',
        status: 'paused',
        usageLimit: 30,
        usageCount: 8,
        minAmount: 1600000,
        maxDiscount: 400000,
        applicableFields: 'all',
        timeRestriction: 'none',
        createdAt: '2024-12-01T14:20:00',
        totalRevenue: 12800000,
        totalSavings: 3200000
    },
    {
        id: 5,
        name: 'Flash Sale Tết',
        description: 'Giảm 30% trong 3 ngày Tết',
        type: 'percentage',
        value: 30,
        code: 'TET2025',
        startDate: '2025-01-29',
        endDate: '2025-01-31',
        status: 'scheduled',
        usageLimit: 200,
        usageCount: 0,
        minAmount: 150000,
        maxDiscount: 150000,
        applicableFields: 'all',
        timeRestriction: 'none',
        createdAt: '2024-12-27T16:45:00',
        totalRevenue: 0,
        totalSavings: 0
    }
]

const promotionTypes = {
    percentage: { label: 'Phần trăm (%)', icon: Percent, color: 'text-blue-600' },
    fixed_amount: { label: 'Số tiền cố định (đ)', icon: DollarSign, color: 'text-green-600' },
    free_hours: { label: 'Giờ miễn phí', icon: Clock, color: 'text-purple-600' },
    package_deal: { label: 'Gói ưu đãi', icon: Package, color: 'text-orange-600' }
}

const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800'
}

const statusLabels = {
    active: 'Đang hoạt động',
    paused: 'Tạm dừng',
    expired: 'Hết hạn',
    scheduled: 'Đã lên lịch'
}

function PromotionCard({ promotion }: { promotion: any }) {
    const typeConfig = promotionTypes[promotion.type as keyof typeof promotionTypes]
    const Icon = typeConfig.icon
    const usagePercentage = (promotion.usageCount / promotion.usageLimit) * 100

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-50`}>
                            <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">{promotion.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Badge className={statusColors[promotion.status as keyof typeof statusColors]}>
                                    {statusLabels[promotion.status as keyof typeof statusLabels]}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {typeConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <ViewPromotionDialog
                                promotion={promotion}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Xem chi tiết
                                    </DropdownMenuItem>
                                }
                            />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(promotion.code)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Sao chép mã
                            </DropdownMenuItem>
                            <EditPromotionDialog
                                promotion={promotion}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                }
                            />
                            <DeletePromotionDialog
                                promotion={promotion}
                                trigger={
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Xóa
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Promotion Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Mã khuyến mãi</p>
                        <p className="font-mono text-lg font-semibold text-gray-900">{promotion.code}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Giá trị</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {promotion.type === 'percentage' ? `${promotion.value}%` :
                                promotion.type === 'fixed_amount' ? `${promotion.value.toLocaleString()}đ` :
                                    promotion.type === 'free_hours' ? `${promotion.value} giờ` :
                                        `${promotion.value}% off`}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Thời gian</p>
                        <p className="text-sm font-medium text-gray-900">
                            {format(new Date(promotion.startDate), 'dd/MM', { locale: vi })} - {format(new Date(promotion.endDate), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Đã sử dụng</p>
                        <p className="text-sm font-medium text-gray-900">
                            {promotion.usageCount}/{promotion.usageLimit}
                        </p>
                    </div>
                </div>

                {/* Usage Progress */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Tỷ lệ sử dụng</span>
                        <span>{usagePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Revenue Impact */}
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-green-700">Doanh thu tạo ra</p>
                            <p className="font-semibold text-green-900">{promotion.totalRevenue.toLocaleString()}đ</p>
                        </div>
                        <div>
                            <p className="text-green-700">Giá trị giảm</p>
                            <p className="font-semibold text-green-900">{promotion.totalSavings.toLocaleString()}đ</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                    {promotion.status === 'active' && (
                        <Button variant="outline" size="sm" className="flex-1">
                            Tạm dừng
                        </Button>
                    )}
                    {promotion.status === 'paused' && (
                        <Button size="sm" className="flex-1">
                            Kích hoạt
                        </Button>
                    )}
                    {promotion.status === 'scheduled' && (
                        <Button variant="outline" size="sm" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Sẵn sàng
                        </Button>
                    )}
                    <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function CreatePromotionDialog() {
    const [open, setOpen] = useState(false)
    const [promotionType, setPromotionType] = useState('')
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo khuyến mãi
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                    <DialogDescription>
                        Tạo chương trình khuyến mãi cho sân thể thao của bạn
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="promotion-name">Tên khuyến mãi *</Label>
                            <Input id="promotion-name" placeholder="VD: Giảm giá cuối tuần" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="promotion-code">Mã khuyến mãi *</Label>
                            <Input id="promotion-code" placeholder="VD: WEEKEND20" className="font-mono" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
                            rows={3}
                        />
                    </div>

                    {/* Promotion Type */}
                    <div className="space-y-3">
                        <Label>Loại khuyến mãi *</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(promotionTypes).map(([key, config]) => {
                                const Icon = config.icon
                                const isSelected = promotionType === key

                                return (
                                    <div
                                        key={key}
                                        onClick={() => setPromotionType(key)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Value Configuration */}
                    {promotionType && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900">Cấu hình giá trị</h4>

                            {promotionType === 'percentage' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="percentage">Phần trăm giảm (%)</Label>
                                        <Input id="percentage" type="number" min="1" max="100" placeholder="20" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max-discount">Giảm tối đa (đ)</Label>
                                        <Input id="max-discount" type="number" placeholder="100000" />
                                    </div>
                                </div>
                            )}

                            {promotionType === 'fixed_amount' && (
                                <div className="space-y-2">
                                    <Label htmlFor="fixed-amount">Số tiền giảm (đ)</Label>
                                    <Input id="fixed-amount" type="number" placeholder="50000" />
                                </div>
                            )}

                            {promotionType === 'free_hours' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="free-hours">Số giờ miễn phí</Label>
                                        <Input id="free-hours" type="number" min="1" placeholder="1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="min-hours">Đặt tối thiểu (giờ)</Label>
                                        <Input id="min-hours" type="number" min="2" placeholder="3" />
                                    </div>
                                </div>
                            )}

                            {promotionType === 'package_deal' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="package-hours">Số giờ trong gói</Label>
                                        <Input id="package-hours" type="number" min="5" placeholder="10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount-percent">Giảm giá (%)</Label>
                                        <Input id="discount-percent" type="number" min="1" max="50" placeholder="20" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="min-amount">Giá trị đơn tối thiểu (đ)</Label>
                                <Input id="min-amount" type="number" placeholder="200000" />
                            </div>
                        </div>
                    )}

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ngày bắt đầu *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                        locale={vi}
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày kết thúc *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                        locale={vi}
                                        disabled={(date) => !startDate || date < startDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Usage Limits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="usage-limit">Giới hạn sử dụng</Label>
                            <Input id="usage-limit" type="number" min="1" placeholder="100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time-restriction">Giới hạn thời gian</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới hạn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Không giới hạn</SelectItem>
                                    <SelectItem value="morning">Chỉ buổi sáng (6:00-12:00)</SelectItem>
                                    <SelectItem value="afternoon">Chỉ buổi chiều (12:00-18:00)</SelectItem>
                                    <SelectItem value="evening">Chỉ buổi tối (18:00-22:00)</SelectItem>
                                    <SelectItem value="weekend">Chỉ cuối tuần</SelectItem>
                                    <SelectItem value="weekday">Chỉ ngày thường</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Applicable Fields */}
                    <div className="space-y-2">
                        <Label>Áp dụng cho sân</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="all-fields" className="rounded" />
                                <Label htmlFor="all-fields" className="font-medium">Tất cả sân</Label>
                            </div>
                            {['Sân bóng đá 1', 'Sân bóng đá 2', 'Sân tennis 1', 'Sân cầu lông 1', 'Sân bóng rổ 1'].map((field, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" id={`field-${index}`} className="rounded" />
                                    <Label htmlFor={`field-${index}`}>{field}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auto-activate */}
                    <div className="flex items-center space-x-3">
                        <Switch id="auto-activate" defaultChecked />
                        <Label htmlFor="auto-activate">Kích hoạt ngay sau khi tạo</Label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setOpen(false)}>
                            Tạo khuyến mãi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function StorePromotions() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')

    const filteredPromotions = promotions.filter(promotion => {
        const matchesSearch =
            promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promotion.code.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter
        const matchesType = typeFilter === 'all' || promotion.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    const stats = {
        total: promotions.length,
        active: promotions.filter(p => p.status === 'active').length,
        totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
        totalRevenue: promotions.reduce((sum, p) => sum + p.totalRevenue, 0),
        totalSavings: promotions.reduce((sum, p) => sum + p.totalSavings, 0)
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Khuyến mãi</h1>
                        <p className="text-gray-600 mt-1">Quản lý chương trình khuyến mãi và mã giảm giá</p>
                    </div>
                    <CreatePromotionDialog />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-600">Tổng khuyến mãi</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                <p className="text-sm text-gray-600">Đang hoạt động</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{stats.totalUsage}</p>
                                <p className="text-sm text-gray-600">Lượt sử dụng</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{stats.totalRevenue.toLocaleString()}đ</p>
                                <p className="text-sm text-gray-600">Doanh thu tạo ra</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-lg font-bold text-orange-600">{stats.totalSavings.toLocaleString()}đ</p>
                                <p className="text-sm text-gray-600">Giá trị giảm</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                    <Input
                                        placeholder="Tìm kiếm khuyến mãi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Đang hoạt động</SelectItem>
                                        <SelectItem value="paused">Tạm dừng</SelectItem>
                                        <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                                        <SelectItem value="expired">Hết hạn</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả loại</SelectItem>
                                        <SelectItem value="percentage">Phần trăm</SelectItem>
                                        <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
                                        <SelectItem value="free_hours">Giờ miễn phí</SelectItem>
                                        <SelectItem value="package_deal">Gói ưu đãi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Promotions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredPromotions.map((promotion) => (
                        <PromotionCard key={promotion.id} promotion={promotion} />
                    ))}
                </div>

                {filteredPromotions.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khuyến mãi nào</h3>
                            <p className="text-gray-600 mb-6">
                                Thử thay đổi bộ lọc hoặc tạo chương trình khuyến mãi mới
                            </p>
                            <div className="flex justify-center space-x-3">
                                <Button variant="outline" onClick={() => {
                                    setSearchQuery('')
                                    setStatusFilter('all')
                                    setTypeFilter('all')
                                }}>
                                    Xóa bộ lọc
                                </Button>
                                <CreatePromotionDialog />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </StoreLayout>
    )
}