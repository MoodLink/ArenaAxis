import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Eye,
    Edit,
    Trash2,
    MapPin,
    Star,
    Clock,
    DollarSign,
    Camera,
    AlertTriangle
} from 'lucide-react'

// Icons for amenities
const amenityIcons = {
    wifi: Camera,
    parking: Camera,
    shower: Camera,
    lighting: Camera,
    security: Camera,
    restaurant: Camera
}

const amenityLabels = {
    wifi: 'Wi-Fi',
    parking: 'Bãi đỗ xe',
    shower: 'Phòng tắm',
    lighting: 'Đèn chiếu sáng',
    security: 'An ninh',
    restaurant: 'Nhà hàng'
}

// View Field Dialog
export function ViewFieldDialog({ field, trigger }: { field: any; trigger: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <span>Chi tiết {field.name}</span>
                        <Badge variant={field.status === 'active' ? 'default' : field.status === 'maintenance' ? 'secondary' : 'destructive'}>
                            {field.status === 'active' ? 'Hoạt động' : field.status === 'maintenance' ? 'Bảo trì' : 'Tạm ngừng'}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Field Images */}
                    {field.images && field.images.length > 0 && (
                        <div className="space-y-2">
                            <Label>Hình ảnh sân</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {field.images.map((image: string, index: number) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`${field.name} - ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Loại sân</Label>
                                <p className="text-base font-medium capitalize">{field.type}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Kích thước</Label>
                                <p className="text-base font-medium">{field.size}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Vị trí</Label>
                                <p className="text-base font-medium flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                    {field.location}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Giá thuê</Label>
                                <p className="text-base font-medium flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                                    {field.pricePerHour?.toLocaleString()}đ/giờ
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Giờ hoạt động</Label>
                                <p className="text-base font-medium flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                    {field.availableHours}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-600">Đánh giá</Label>
                                <p className="text-base font-medium flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                                    {field.rating}/5 ({field.totalBookings} đánh giá)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="text-sm font-medium text-gray-600">Mô tả</Label>
                        <p className="text-base mt-1">{field.description}</p>
                    </div>

                    {/* Amenities */}
                    {field.amenities && field.amenities.length > 0 && (
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Tiện nghi</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {field.amenities.map((amenity: string) => {
                                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                                    return (
                                        <div key={amenity} className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                            {Icon && <Icon className="h-4 w-4 mr-2 text-gray-600" />}
                                            <span className="text-sm">{amenityLabels[amenity as keyof typeof amenityLabels]}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <Label className="text-sm font-medium text-gray-600 mb-3 block">Thống kê</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tổng lượt đặt</p>
                                <p className="text-xl font-bold text-gray-900">{field.totalBookings}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Doanh thu tháng này</p>
                                <p className="text-xl font-bold text-green-600">{field.revenueThisMonth?.toLocaleString()}đ</p>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Info */}
                    <div>
                        <Label className="text-sm font-medium text-gray-600">Bảo trì lần cuối</Label>
                        <p className="text-base mt-1">{field.lastMaintenance}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Edit Field Dialog
export function EditFieldDialog({ field, trigger }: { field: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [fieldType, setFieldType] = useState(field.type || '')
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(field.amenities || [])

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        )
    }

    const handleSubmit = () => {
        // Handle form submission
        console.log('Updating field:', field.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa {field.name}</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin chi tiết về sân thể thao
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-field-name">Tên sân</Label>
                            <Input id="edit-field-name" defaultValue={field.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-field-type">Loại sân</Label>
                            <Select value={fieldType} onValueChange={setFieldType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại sân" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="football">Bóng đá</SelectItem>
                                    <SelectItem value="tennis">Tennis</SelectItem>
                                    <SelectItem value="badminton">Cầu lông</SelectItem>
                                    <SelectItem value="basketball">Bóng rổ</SelectItem>
                                    <SelectItem value="volleyball">Bóng chuyền</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-field-size">Kích thước/Số người</Label>
                            <Input id="edit-field-size" defaultValue={field.size} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-field-location">Vị trí</Label>
                            <Input id="edit-field-location" defaultValue={field.location} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-price-per-hour">Giá thuê/giờ (VNĐ)</Label>
                            <Input
                                id="edit-price-per-hour"
                                type="number"
                                defaultValue={field.pricePerHour}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-available-hours">Giờ hoạt động</Label>
                            <Input id="edit-available-hours" defaultValue={field.availableHours} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Mô tả</Label>
                        <Textarea
                            id="edit-description"
                            defaultValue={field.description}
                            rows={3}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Trạng thái</Label>
                        <Select defaultValue={field.status}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Tạm ngừng</SelectItem>
                                <SelectItem value="maintenance">Bảo trì</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-3">
                        <Label>Tiện nghi</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(amenityLabels).map(([key, label]) => {
                                const Icon = amenityIcons[key as keyof typeof amenityIcons]
                                const isSelected = selectedAmenities.includes(key)

                                return (
                                    <div key={key} className="flex items-center space-x-3">
                                        <Switch
                                            id={`edit-${key}`}
                                            checked={isSelected}
                                            onCheckedChange={() => toggleAmenity(key)}
                                        />
                                        <Label htmlFor={`edit-${key}`} className="flex items-center cursor-pointer">
                                            {Icon && <Icon className="h-4 w-4 mr-2 text-gray-600" />}
                                            {label}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
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

// Delete Field Dialog
export function DeleteFieldDialog({ field, trigger }: { field: any; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        // Handle delete operation
        console.log('Deleting field:', field.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span>Xác nhận xóa sân</span>
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa <strong>{field.name}</strong>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Lưu ý quan trọng:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                        <li>• Tất cả lịch đặt sân sẽ bị hủy</li>
                        <li>• Dữ liệu thống kê sẽ bị mất</li>
                        <li>• Không thể khôi phục sau khi xóa</li>
                    </ul>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa sân
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}