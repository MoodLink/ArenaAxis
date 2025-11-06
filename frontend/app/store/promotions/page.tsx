"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Plus,
    Search,
    Eye,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    AlertCircle,
    CheckCircle,
    Store as StoreIcon,
    Percent,
    Clock,
    Package
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Types
interface Promotion {
    id: string
    name: string
    description: string
    type: 'percentage' | 'fixed_amount' | 'free_hours' | 'package_deal'
    value: number
    code: string
    startDate: string
    endDate: string
    status: 'active' | 'paused' | 'scheduled' | 'expired'
    usageLimit: number
    usageCount: number
    minAmount: number
    maxDiscount: number
    createdAt: string
}

interface Store {
    id: string
    name: string
    address: string
    avatar?: string
}

interface AppliedPromotion {
    id: string
    store: Store
    promotion: Promotion
    appliedAt: string
    totalSavings: number
}

// Mock Data
const mockPromotions: Promotion[] = [
    {
        id: '1',
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
        createdAt: '2024-12-20T10:00:00'
    },
    {
        id: '2',
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
        createdAt: '2024-11-30T15:30:00'
    },
    {
        id: '3',
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
        createdAt: '2024-12-15T09:00:00'
    }
]

const mockStores: Store[] = [
    {
        id: '1',
        name: 'Sân Bóng Đá ABC',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        avatar: '🏟️'
    },
    {
        id: '2',
        name: 'Sân Tennis XYZ',
        address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
        avatar: '🎾'
    },
    {
        id: '3',
        name: 'Sân Cầu Lông DEF',
        address: '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
        avatar: '🏸'
    }
]

const mockAppliedPromotions: AppliedPromotion[] = [
    {
        id: '1',
        store: mockStores[0],
        promotion: mockPromotions[0],
        appliedAt: '2024-12-22T14:00:00',
        totalSavings: 450000
    },
    {
        id: '2',
        store: mockStores[1],
        promotion: mockPromotions[0],
        appliedAt: '2024-12-23T10:30:00',
        totalSavings: 380000
    },
    {
        id: '3',
        store: mockStores[0],
        promotion: mockPromotions[1],
        appliedAt: '2024-12-10T09:00:00',
        totalSavings: 1250000
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

// Component: PromotionCard
function PromotionCard({
    promotion,
    onViewStores,
    onApply,
    storesCount
}: {
    promotion: Promotion
    onViewStores: (promotion: Promotion) => void
    onApply: (promotion: Promotion) => void
    storesCount: number
}) {
    const typeConfig = promotionTypes[promotion.type]
    const Icon = typeConfig.icon

    return (
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Header with View Button */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{promotion.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{promotion.description}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewStores(promotion)}
                        className="ml-2 flex-shrink-0"
                        title="Xem danh sách store đã đăng kí"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Applied Stores Count Badge */}
                {storesCount > 0 && (
                    <Badge variant="outline" className="w-fit mb-4 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {storesCount} store đã áp dụng
                    </Badge>
                )}

                {/* Type and Status */}
                <div className="flex items-center space-x-2 mb-4">
                    <Badge className={statusColors[promotion.status]}>
                        {statusLabels[promotion.status]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {typeConfig.label}
                    </Badge>
                </div>

                {/* Value Section */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                        <p className="text-sm text-gray-600">Giá trị khuyến mãi</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                        {promotion.type === 'percentage' ? `${promotion.value}%` :
                            promotion.type === 'fixed_amount' ? `${promotion.value.toLocaleString()}đ` :
                                promotion.type === 'free_hours' ? `${promotion.value} giờ` :
                                    `${promotion.value}%`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Mã: {promotion.code}</p>
                </div>

                {/* Key Info */}
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="font-medium">
                            {format(new Date(promotion.startDate), 'dd/MM', { locale: vi })} - {format(new Date(promotion.endDate), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Đã sử dụng:</span>
                        <span className="font-medium">{promotion.usageCount}/{promotion.usageLimit}</span>
                    </div>
                </div>

                {/* Apply Button */}
                <Button
                    onClick={() => onApply(promotion)}
                    className="w-full mt-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Áp dụng cho store
                </Button>
            </CardContent>
        </Card>
    )
}

// Component: StoresAppliedDialog
function StoresAppliedDialog({
    promotion,
    onClose
}: {
    promotion: Promotion
    onClose: () => void
}) {
    const appliedStores = mockAppliedPromotions
        .filter(app => app.promotion.id === promotion.id)
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <StoreIcon className="h-5 w-5" />
                        <span>Danh sách Store - {promotion.name}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {appliedStores.length} store đã áp dụng khuyến mãi này
                    </DialogDescription>
                </DialogHeader>

                {appliedStores.length > 0 ? (
                    <div className="space-y-3">
                        {appliedStores.map((app) => (
                            <Card key={app.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Store Avatar */}
                                        <div className="text-3xl mt-1">
                                            {app.store.avatar}
                                        </div>

                                        {/* Store Info */}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{app.store.name}</h4>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {app.store.address}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Application Info */}
                                    <div className="text-right ml-4">
                                        <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {format(new Date(app.appliedAt), 'dd/MM/yyyy', { locale: vi })}
                                        </div>
                                        <div className="flex items-center justify-end space-x-2">
                                            <DollarSign className="h-3 w-3 text-green-600" />
                                            <span className="font-semibold text-green-600">
                                                Đã giảm: {app.totalSavings.toLocaleString()}đ
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="mt-2 text-xs">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Đang áp dụng
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">Chưa có store nào áp dụng khuyến mãi này</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

// Component: ApplyPromotionDialog
function ApplyPromotionDialog({
    promotion,
    onClose,
    onConfirm
}: {
    promotion: Promotion
    onClose: () => void
    onConfirm: (storeId: string) => void
}) {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async () => {
        if (!selectedStoreId) return

        setIsSubmitting(true)
        setTimeout(() => {
            onConfirm(selectedStoreId)
            setIsSubmitting(false)
            onClose()
        }, 500)
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Áp dụng khuyến mãi</DialogTitle>
                    <DialogDescription>
                        Chọn store của bạn để áp dụng khuyến mãi
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Promotion Info */}
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <h4 className="font-semibold text-gray-900">{promotion.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                            <span className="text-sm text-gray-700">Mã:</span>
                            <span className="font-mono font-bold text-blue-600">{promotion.code}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-700">Giá trị:</span>
                            <span className="font-bold text-blue-600">
                                {promotion.type === 'percentage' ? `${promotion.value}%` :
                                    promotion.type === 'fixed_amount' ? `${promotion.value.toLocaleString()}đ` :
                                        promotion.type === 'free_hours' ? `${promotion.value} giờ` :
                                            `${promotion.value}%`}
                            </span>
                        </div>
                    </Card>

                    {/* Store Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="store-select">Chọn store của bạn *</Label>
                        <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                            <SelectTrigger id="store-select">
                                <SelectValue placeholder="Chọn một store" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockStores.map((store) => (
                                    <SelectItem key={store.id} value={store.id}>
                                        <span>{store.avatar} {store.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Selected Store Details */}
                    {selectedStoreId && (
                        <Card className="p-3 border-green-200 bg-green-50">
                            {(() => {
                                const store = mockStores.find(s => s.id === selectedStoreId)
                                return store ? (
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-2xl">{store.avatar}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{store.name}</p>
                                                <div className="flex items-center text-xs text-gray-600 mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {store.address}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            })()}
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedStoreId || isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận áp dụng'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Main Page Component
export default function StorePromotions() {
    const [promotions] = useState<Promotion[]>(mockPromotions)
    const [appliedPromotions, setAppliedPromotions] = useState<AppliedPromotion[]>(mockAppliedPromotions)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPromotionForView, setSelectedPromotionForView] = useState<Promotion | null>(null)
    const [selectedPromotionForApply, setSelectedPromotionForApply] = useState<Promotion | null>(null)
    const [successMessage, setSuccessMessage] = useState('')

    // Filter promotions
    const filteredPromotions = promotions.filter(promotion =>
        promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get stores count for a promotion
    const getStoresCount = (promotionId: string) => {
        return appliedPromotions.filter(app => app.promotion.id === promotionId).length
    }

    // Handle apply confirmation
    const handleApplyConfirm = (storeId: string) => {
        if (!selectedPromotionForApply) return

        const newApplied: AppliedPromotion = {
            id: `${Math.random()}`,
            store: mockStores.find(s => s.id === storeId)!,
            promotion: selectedPromotionForApply,
            appliedAt: new Date().toISOString(),
            totalSavings: 0
        }

        setAppliedPromotions([...appliedPromotions, newApplied])
        setSuccessMessage(`Đã áp dụng khuyến mãi "${selectedPromotionForApply.name}" thành công! ✅`)

        setTimeout(() => {
            setSuccessMessage('')
        }, 3000)
    }

    const stats = {
        total: promotions.length,
        active: promotions.filter(p => p.status === 'active').length,
        totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
        totalStores: new Set(appliedPromotions.map(a => a.store.id)).size
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Khuyến mãi</h1>
                    <p className="text-gray-600 mt-1">Áp dụng khuyến mãi cho store của bạn</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <Card className="p-4 bg-green-50 border-green-200">
                        <p className="text-sm text-green-800 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {successMessage}
                        </p>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                <p className="text-2xl font-bold text-purple-600">{stats.totalStores}</p>
                                <p className="text-sm text-gray-600">Store tham gia</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                            <Input
                                placeholder="Tìm kiếm khuyến mãi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Promotions Grid */}
                {filteredPromotions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPromotions.map((promotion) => (
                            <PromotionCard
                                key={promotion.id}
                                promotion={promotion}
                                onViewStores={setSelectedPromotionForView}
                                onApply={setSelectedPromotionForApply}
                                storesCount={getStoresCount(promotion.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy khuyến mãi nào</h3>
                            <p className="text-gray-600 mt-2">Thử thay đổi từ khóa tìm kiếm</p>
                        </CardContent>
                    </Card>
                )}

                {/* View Stores Dialog */}
                {selectedPromotionForView && (
                    <StoresAppliedDialog
                        promotion={selectedPromotionForView}
                        onClose={() => setSelectedPromotionForView(null)}
                    />
                )}

                {/* Apply Promotion Dialog */}
                {selectedPromotionForApply && (
                    <ApplyPromotionDialog
                        promotion={selectedPromotionForApply}
                        onClose={() => setSelectedPromotionForApply(null)}
                        onConfirm={handleApplyConfirm}
                    />
                )}
            </div>
        </StoreLayout>
    )
}
