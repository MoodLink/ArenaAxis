// User Form Component
// Form tạo/chỉnh sửa thông tin người dùng

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface UserFormData {
    name: string
    email: string
    phone: string
    bio: string
    location: string
    favoriteSports: string[]
    status: 'active' | 'inactive' | 'banned'
}

interface UserFormProps {
    initialData?: UserFormData
    onSubmit: (data: UserFormData) => void
    onCancel: () => void
    isEdit?: boolean
}

const SPORTS_OPTIONS = ['Bóng đá', 'Tennis', 'Bóng rổ', 'Cầu lông', 'Golf', 'Bóng chuyền', 'Bơi lội']

export default function UserForm({ initialData, onSubmit, onCancel, isEdit = false }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>(initialData || {
        name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        favoriteSports: [],
        status: 'active'
    })

    const [newSport, setNewSport] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const addSport = (sport: string) => {
        if (sport && !formData.favoriteSports.includes(sport)) {
            setFormData(prev => ({
                ...prev,
                favoriteSports: [...prev.favoriteSports, sport]
            }))
            setNewSport('')
        }
    }

    const removeSport = (sport: string) => {
        setFormData(prev => ({
            ...prev,
            favoriteSports: prev.favoriteSports.filter(s => s !== sport)
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên */}
                <div>
                    <Label htmlFor="name">Họ tên *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                    />
                </div>

                {/* Điện thoại */}
                <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                    />
                </div>

                {/* Khu vực */}
                <div>
                    <Label htmlFor="location">Khu vực</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="VD: Quận 1, TP.HCM"
                    />
                </div>
            </div>

            {/* Bio */}
            <div>
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Mô tả ngắn về người dùng..."
                />
            </div>

            {/* Môn thể thao yêu thích */}
            <div>
                <Label>Môn thể thao yêu thích</Label>
                <div className="flex gap-2 mb-2">
                    <Select value={newSport} onValueChange={setNewSport}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn môn thể thao" />
                        </SelectTrigger>
                        <SelectContent>
                            {SPORTS_OPTIONS.filter(sport => !formData.favoriteSports.includes(sport)).map(sport => (
                                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" onClick={() => addSport(newSport)} disabled={!newSport}>
                        Thêm
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.favoriteSports.map(sport => (
                        <Badge key={sport} variant="secondary" className="pr-1">
                            {sport}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeSport(sport)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Trạng thái */}
            <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                        <SelectItem value="banned">Bị khóa</SelectItem>
                    </SelectContent>
                </Select>
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