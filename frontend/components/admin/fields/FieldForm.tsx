// Field Form Component
// Form tạo/chỉnh sửa thông tin sân thể thao

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FieldFormData {
    name: string
    location: string
    price: number
    sport: string
    description: string
    status: 'available' | 'unavailable' | 'maintenance'
    openingHours: string
    closingHours: string
    surfaceType: string
    capacity: string
    phone: string
    email: string
    ownerName: string
    ownerPhone: string
    amenities: string[]
}

interface FieldFormProps {
    initialData?: FieldFormData
    onSubmit: (data: FieldFormData) => void
    onCancel: () => void
    isEdit?: boolean
}

const SPORTS_OPTIONS = ['Bóng đá', 'Tennis', 'Bóng rổ', 'Cầu lông', 'Golf', 'Bóng chuyền', 'Bơi lội']
const AMENITIES_OPTIONS = [
    'Free WiFi', 'Parking', 'Air Conditioning', 'Locker Room', 'Shower', 'Equipment Rental',
    'Ball Rental', 'Canteen', 'Security', 'Sound System', 'LED Lighting', 'Professional Court',
    'VIP Changing Room', 'Medical Room'
]

export default function FieldForm({ initialData, onSubmit, onCancel, isEdit = false }: FieldFormProps) {
    const [formData, setFormData] = useState<FieldFormData>(initialData || {
        name: '',
        location: '',
        price: 0,
        sport: '',
        description: '',
        status: 'available',
        openingHours: '',
        closingHours: '',
        surfaceType: '',
        capacity: '',
        phone: '',
        email: '',
        ownerName: '',
        ownerPhone: '',
        amenities: []
    })

    const [newAmenity, setNewAmenity] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const addAmenity = (amenity: string) => {
        if (amenity && !formData.amenities.includes(amenity)) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenity]
            }))
            setNewAmenity('')
        }
    }

    const removeAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên sân */}
                <div>
                    <Label htmlFor="name">Tên sân *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>

                {/* Vị trí */}
                <div>
                    <Label htmlFor="location">Vị trí *</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        required
                    />
                </div>

                {/* Môn thể thao */}
                <div>
                    <Label htmlFor="sport">Môn thể thao *</Label>
                    <Select value={formData.sport} onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn môn thể thao" />
                        </SelectTrigger>
                        <SelectContent>
                            {SPORTS_OPTIONS.map(sport => (
                                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Giá */}
                <div>
                    <Label htmlFor="price">Giá/giờ (VNĐ) *</Label>
                    <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        required
                    />
                </div>

                {/* Trạng thái */}
                <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Hoạt động</SelectItem>
                            <SelectItem value="unavailable">Không khả dụng</SelectItem>
                            <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Loại bề mặt */}
                <div>
                    <Label htmlFor="surfaceType">Loại bề mặt</Label>
                    <Input
                        id="surfaceType"
                        value={formData.surfaceType}
                        onChange={(e) => setFormData(prev => ({ ...prev, surfaceType: e.target.value }))}
                        placeholder="VD: Cỏ nhân tạo, Hard Court"
                    />
                </div>

                {/* Sức chứa */}
                <div>
                    <Label htmlFor="capacity">Sức chứa</Label>
                    <Input
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                        placeholder="VD: 11vs11, 2vs2"
                    />
                </div>

                {/* Giờ mở cửa */}
                <div>
                    <Label htmlFor="openingHours">Giờ mở cửa</Label>
                    <Input
                        id="openingHours"
                        type="time"
                        value={formData.openingHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                    />
                </div>

                {/* Giờ đóng cửa */}
                <div>
                    <Label htmlFor="closingHours">Giờ đóng cửa</Label>
                    <Input
                        id="closingHours"
                        type="time"
                        value={formData.closingHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, closingHours: e.target.value }))}
                    />
                </div>

                {/* SĐT liên hệ */}
                <div>
                    <Label htmlFor="phone">Số điện thoại liên hệ</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email">Email liên hệ</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                {/* Tên chủ sân */}
                <div>
                    <Label htmlFor="ownerName">Tên chủ sân</Label>
                    <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    />
                </div>

                {/* SĐT chủ sân */}
                <div>
                    <Label htmlFor="ownerPhone">SĐT chủ sân</Label>
                    <Input
                        id="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    />
                </div>
            </div>

            {/* Mô tả */}
            <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả chi tiết về sân thể thao..."
                />
            </div>

            {/* Tiện ích */}
            <div>
                <Label>Tiện ích</Label>
                <div className="flex gap-2 mb-2">
                    <Select value={newAmenity} onValueChange={setNewAmenity}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn tiện ích" />
                        </SelectTrigger>
                        <SelectContent>
                            {AMENITIES_OPTIONS.filter(amenity => !formData.amenities.includes(amenity)).map(amenity => (
                                <SelectItem key={amenity} value={amenity}>{amenity}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={() => addAmenity(newAmenity)} disabled={!newAmenity}>
                        Thêm
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="pr-1">
                            {amenity}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeAmenity(amenity)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit">
                    {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </div>
        </form>
    )
}