"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

// Import shared components
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import PromotionStats from "./promotions/PromotionStats"
import PromotionTable from "./promotions/PromotionTable"
import PromotionForm from "./promotions/PromotionForm"

// Import mock data
import { mockPromotions, mockPromotionStats, AdminPromotion } from "@/data/mockDataAdmin"

export default function PromotionsManagement() {
    const [promotions, setPromotions] = useState<AdminPromotion[]>(mockPromotions)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newPromotion, setNewPromotion] = useState<Partial<AdminPromotion>>({
        type: 'percentage',
        applicableFor: 'all',
        status: 'active'
    })

    // Filter promotions
    const filteredPromotions = promotions.filter(promotion => {
        const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promotion.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter
        const matchesType = typeFilter === 'all' || promotion.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    const handlePromotionAction = (promotionId: string, action: 'activate' | 'deactivate' | 'duplicate' | 'delete') => {
        switch (action) {
            case 'activate':
                setPromotions(promotions.map(promo =>
                    promo.id === promotionId ? { ...promo, status: 'active' as const } : promo
                ))
                break
            case 'deactivate':
                setPromotions(promotions.map(promo =>
                    promo.id === promotionId ? { ...promo, status: 'inactive' as const } : promo
                ))
                break
            case 'duplicate':
                const originalPromo = promotions.find(p => p.id === promotionId)
                if (originalPromo) {
                    const duplicatedPromo: AdminPromotion = {
                        ...originalPromo,
                        id: Date.now().toString(),
                        name: `${originalPromo.name} (Copy)`,
                        code: `${originalPromo.code}_COPY`,
                        usedCount: 0
                    }
                    setPromotions([...promotions, duplicatedPromo])
                }
                break
            case 'delete':
                setPromotions(promotions.filter(promo => promo.id !== promotionId))
                break
        }
    }

    const handleCreatePromotion = () => {
        const promotion: AdminPromotion = {
            ...newPromotion as AdminPromotion,
            id: Date.now().toString(),
            usedCount: 0,
            createdBy: 'Admin',
            createdAt: new Date().toISOString().split('T')[0]
        }
        setPromotions([...promotions, promotion])
        setNewPromotion({
            type: 'percentage',
            applicableFor: 'all',
            status: 'active'
        })
        setIsCreateDialogOpen(false)
    }

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Tạm dừng' },
        { value: 'expired', label: 'Hết hạn' },
        { value: 'scheduled', label: 'Đã lên lịch' }
    ]

    const typeOptions = [
        { value: 'all', label: 'Tất cả loại' },
        { value: 'percentage', label: 'Phần trăm' },
        { value: 'fixed_amount', label: 'Số tiền cố định' },
        { value: 'free_hours', label: 'Giờ miễn phí' },
        { value: 'package_deal', label: 'Gói combo' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Quản lý khuyến mãi"
                description="Tạo và quản lý các chương trình khuyến mãi"
                actionButton={
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo khuyến mãi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                                <DialogDescription>
                                    Điền thông tin để tạo chương trình khuyến mãi mới
                                </DialogDescription>
                            </DialogHeader>
                            <PromotionForm
                                promotion={newPromotion}
                                onPromotionChange={setNewPromotion}
                                onSubmit={handleCreatePromotion}
                                onCancel={() => setIsCreateDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                }
            />

            {/* Stats Cards */}
            <PromotionStats stats={mockPromotionStats} />

            {/* Promotions Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khuyến mãi</CardTitle>
                    <CardDescription>Quản lý tất cả chương trình khuyến mãi</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminFilters
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={[
                            {
                                key: "status",
                                placeholder: "Trạng thái",
                                value: statusFilter,
                                onValueChange: setStatusFilter,
                                options: statusOptions
                            },
                            {
                                key: "type",
                                placeholder: "Loại",
                                value: typeFilter,
                                onValueChange: setTypeFilter,
                                options: typeOptions
                            }
                        ]}
                    />

                    <PromotionTable
                        promotions={filteredPromotions}
                        onPromotionAction={handlePromotionAction}
                    />

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                            Hiển thị {filteredPromotions.length} trong tổng số {promotions.length} khuyến mãi
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}