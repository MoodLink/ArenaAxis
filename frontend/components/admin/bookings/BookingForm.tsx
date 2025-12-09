// Booking Form Component for editing booking status and payment
// Form chỉnh sửa trạng thái booking và thanh toán

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface BookingFormData {
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
}

interface BookingFormProps {
    initialData: BookingFormData
    onSubmit: (data: BookingFormData) => void
    onCancel: () => void
}

export default function BookingForm({ initialData, onSubmit, onCancel }: BookingFormProps) {
    const [formData, setFormData] = useState<BookingFormData>(initialData)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const statusOptions = [
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ]

    const paymentStatusOptions = [
        { value: 'pending', label: 'Chờ thanh toán' },
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'failed', label: 'Thất bại' },
        { value: 'refunded', label: 'Đã hoàn tiền' }
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trạng thái booking */}
            <div>
                <Label htmlFor="status">Trạng thái booking</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Trạng thái thanh toán */}
            <div>
                <Label htmlFor="paymentStatus">Trạng thái thanh toán</Label>
                <Select
                    value={formData.paymentStatus}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentStatus: value }))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {paymentStatusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit">
                    Cập nhật
                </Button>
            </div>
        </form>
    )
}