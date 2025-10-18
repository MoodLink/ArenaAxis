// Tournament Form Component
// Form tạo/chỉnh sửa thông tin giải đấu

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TournamentFormData {
    name: string
    sport: string
    startDate: string
    endDate: string
    location: string
    prizePool: number
    maxTeams: number
    registrationFee: number
    description: string
    organizerName: string
    organizerEmail: string
    organizerPhone: string
    registrationDeadline: string
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface TournamentFormProps {
    initialData?: Partial<TournamentFormData>
    onSubmit: (data: TournamentFormData) => void
    onCancel: () => void
    isEdit?: boolean
}

export default function TournamentForm({ initialData, onSubmit, onCancel, isEdit = false }: TournamentFormProps) {
    const [formData, setFormData] = useState<TournamentFormData>({
        name: initialData?.name || '',
        sport: initialData?.sport || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        location: initialData?.location || '',
        prizePool: initialData?.prizePool || 0,
        maxTeams: initialData?.maxTeams || 0,
        registrationFee: initialData?.registrationFee || 0,
        description: initialData?.description || '',
        organizerName: initialData?.organizerName || '',
        organizerEmail: initialData?.organizerEmail || '',
        organizerPhone: initialData?.organizerPhone || '',
        registrationDeadline: initialData?.registrationDeadline || '',
        status: initialData?.status || 'upcoming'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field: keyof TournamentFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="name">Tên giải đấu *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Nhập tên giải đấu"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sport">Môn thể thao *</Label>
                    <Select value={formData.sport} onValueChange={(value) => handleChange('sport', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn môn thể thao" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bóng đá">Bóng đá</SelectItem>
                            <SelectItem value="Tennis">Tennis</SelectItem>
                            <SelectItem value="Cầu lông">Cầu lông</SelectItem>
                            <SelectItem value="Bóng rổ">Bóng rổ</SelectItem>
                            <SelectItem value="Bóng chuyền">Bóng chuyền</SelectItem>
                            <SelectItem value="Bơi lội">Bơi lội</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Hạn đăng ký *</Label>
                    <Input
                        id="registrationDeadline"
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm *</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Nhập địa điểm tổ chức"
                        required
                    />
                </div>

                {/* Numbers */}
                <div className="space-y-2">
                    <Label htmlFor="prizePool">Giải thưởng (VNĐ) *</Label>
                    <Input
                        id="prizePool"
                        type="number"
                        value={formData.prizePool}
                        onChange={(e) => handleChange('prizePool', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="maxTeams">Số đội tối đa *</Label>
                    <Input
                        id="maxTeams"
                        type="number"
                        value={formData.maxTeams}
                        onChange={(e) => handleChange('maxTeams', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="1"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="registrationFee">Phí đăng ký (VNĐ)</Label>
                    <Input
                        id="registrationFee"
                        type="number"
                        value={formData.registrationFee}
                        onChange={(e) => handleChange('registrationFee', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                    />
                </div>

                {isEdit && (
                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select value={formData.status} onValueChange={(value) => handleChange('status', value as any)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                                <SelectItem value="completed">Đã kết thúc</SelectItem>
                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Organizer Info */}
            <div className="space-y-4">
                <h4 className="font-semibold">Thông tin ban tổ chức</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="organizerName">Tên tổ chức *</Label>
                        <Input
                            id="organizerName"
                            value={formData.organizerName}
                            onChange={(e) => handleChange('organizerName', e.target.value)}
                            placeholder="Nhập tên tổ chức"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="organizerEmail">Email *</Label>
                        <Input
                            id="organizerEmail"
                            type="email"
                            value={formData.organizerEmail}
                            onChange={(e) => handleChange('organizerEmail', e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="organizerPhone">Số điện thoại *</Label>
                        <Input
                            id="organizerPhone"
                            value={formData.organizerPhone}
                            onChange={(e) => handleChange('organizerPhone', e.target.value)}
                            placeholder="0xx-xxx-xxxx"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Mô tả giải đấu</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Nhập mô tả chi tiết về giải đấu..."
                    className="min-h-[100px]"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit">
                    {isEdit ? 'Cập nhật' : 'Tạo giải đấu'}
                </Button>
            </div>
        </form>
    )
}