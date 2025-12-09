// Component form liên hệ
// Cho phép người dùng gửi tin nhắn đến admin

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface ContactFormProps {
    onSubmit?: (formData: ContactFormData) => void // Callback khi submit form
}

export interface ContactFormData {
    name: string
    email: string
    phone: string
    subject: string
    message: string
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
    // State quản lý form data
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Xử lý thay đổi input
    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setIsSubmitting(true)
        try {
            // Gọi callback hoặc xử lý submit
            if (onSubmit) {
                await onSubmit(formData)
            } else {
                // Mock submit - trong thực tế sẽ gọi API
                await new Promise(resolve => setTimeout(resolve, 1000))
                alert("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.")

                // Reset form sau khi gửi thành công
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            }
        } catch (error) {
            console.error('Error submitting contact form:', error)
            alert("Có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Họ tên và Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Nhập họ tên của bạn"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                        <Input
                            type="tel"
                            placeholder="Nhập số điện thoại của bạn"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Chủ đề */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Chủ đề</label>
                        <Input
                            placeholder="Chủ đề tin nhắn"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Nội dung */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            placeholder="Nhập nội dung tin nhắn của bạn..."
                            rows={6}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Nút gửi */}
                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
