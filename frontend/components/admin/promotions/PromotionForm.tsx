import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminPromotion } from "@/data/mockDataAdmin"

interface PromotionFormProps {
    promotion: Partial<AdminPromotion>
    onPromotionChange: (promotion: Partial<AdminPromotion>) => void
    onSubmit: () => void
    onCancel: () => void
}

export default function PromotionForm({
    promotion,
    onPromotionChange,
    onSubmit,
    onCancel
}: PromotionFormProps) {
    const paymentMethods = [
        { value: 'card', label: 'Thẻ tín dụng/ghi nợ' },
        { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
        { value: 'e_wallet', label: 'Ví điện tử' },
        { value: 'cash', label: 'Tiền mặt' }
    ]

    const sports = [
        { value: 'football', label: 'Bóng đá' },
        { value: 'tennis', label: 'Tennis' },
        { value: 'badminton', label: 'Cầu lông' },
        { value: 'basketball', label: 'Bóng rổ' },
        { value: 'swimming', label: 'Bơi lội' }
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên khuyến mãi *</Label>
                    <Input
                        id="name"
                        value={promotion.name || ''}
                        onChange={(e) => onPromotionChange({ ...promotion, name: e.target.value })}
                        placeholder="Nhập tên khuyến mãi"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Mã khuyến mãi *</Label>
                    <Input
                        id="code"
                        value={promotion.code || ''}
                        onChange={(e) => onPromotionChange({ ...promotion, code: e.target.value })}
                        placeholder="VD: SAVE20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                    id="description"
                    value={promotion.description || ''}
                    onChange={(e) => onPromotionChange({ ...promotion, description: e.target.value })}
                    placeholder="Mô tả chi tiết về khuyến mãi"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Loại khuyến mãi</Label>
                    <Select
                        value={promotion.type || 'percentage'}
                        onValueChange={(value: any) => onPromotionChange({ ...promotion, type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                            <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
                            <SelectItem value="free_hours">Giờ miễn phí</SelectItem>
                            <SelectItem value="package_deal">Gói combo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="value">Giá trị *</Label>
                    <Input
                        id="value"
                        type="number"
                        value={promotion.value || ''}
                        onChange={(e) => onPromotionChange({ ...promotion, value: Number(e.target.value) })}
                        placeholder={
                            promotion.type === 'percentage' ? '20' :
                                promotion.type === 'fixed_amount' ? '100000' :
                                    promotion.type === 'free_hours' ? '2' : '30'
                        }
                    />
                </div>
            </div>

            {(promotion.type === 'percentage' || promotion.type === 'fixed_amount') && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minOrderAmount">Đơn hàng tối thiểu</Label>
                        <Input
                            id="minOrderAmount"
                            type="number"
                            value={promotion.minOrderAmount || ''}
                            onChange={(e) => onPromotionChange({ ...promotion, minOrderAmount: Number(e.target.value) })}
                            placeholder="100000"
                        />
                    </div>
                    {promotion.type === 'percentage' && (
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscountAmount">Giảm tối đa</Label>
                            <Input
                                id="maxDiscountAmount"
                                type="number"
                                value={promotion.maxDiscountAmount || ''}
                                onChange={(e) => onPromotionChange({ ...promotion, maxDiscountAmount: Number(e.target.value) })}
                                placeholder="500000"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={promotion.startDate || ''}
                        onChange={(e) => onPromotionChange({ ...promotion, startDate: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={promotion.endDate || ''}
                        onChange={(e) => onPromotionChange({ ...promotion, endDate: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
                <Input
                    id="usageLimit"
                    type="number"
                    value={promotion.usageLimit || ''}
                    onChange={(e) => onPromotionChange({ ...promotion, usageLimit: Number(e.target.value) })}
                    placeholder="100"
                />
            </div>

            <div className="space-y-2">
                <Label>Áp dụng cho</Label>
                <Select
                    value={promotion.applicableFor || 'all'}
                    onValueChange={(value: any) => onPromotionChange({ ...promotion, applicableFor: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="new_users">Người dùng mới</SelectItem>
                        <SelectItem value="premium_users">Thành viên VIP</SelectItem>
                        <SelectItem value="specific_sports">Môn thể thao cụ thể</SelectItem>
                        <SelectItem value="specific_fields">Sân cụ thể</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {promotion.applicableFor === 'specific_sports' && (
                <div className="space-y-2">
                    <Label>Chọn môn thể thao</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {sports.map((sport) => (
                            <div key={sport.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={sport.value}
                                    checked={promotion.targetSports?.includes(sport.label) || false}
                                    onCheckedChange={(checked) => {
                                        const current = promotion.targetSports || []
                                        const updated = checked
                                            ? [...current, sport.label]
                                            : current.filter(s => s !== sport.label)
                                        onPromotionChange({ ...promotion, targetSports: updated })
                                    }}
                                />
                                <Label htmlFor={sport.value}>{sport.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button onClick={onSubmit}>
                    Tạo khuyến mãi
                </Button>
            </div>
        </div>
    )
}