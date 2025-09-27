// Component hiển thị thông tin liên hệ
// Bao gồm địa chỉ, số điện thoại, email và giờ làm việc

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface ContactInfo {
    address: string
    phone: string
    email: string
    workingHours: string
}

interface ContactInfoProps {
    contactInfo?: ContactInfo // Thông tin liên hệ (optional, có default)
}

// Default contact info
const defaultContactInfo: ContactInfo = {
    address: "123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM",
    phone: "+84 123 456 789",
    email: "arenaaxis@gmail.com",
    workingHours: "Thứ 2 - Chủ nhật: 6:00 - 22:00"
}

export default function ContactInfo({ contactInfo = defaultContactInfo }: ContactInfoProps) {
    // Danh sách thông tin liên hệ với icon tương ứng
    const contactItems = [
        {
            icon: MapPin,
            title: "Địa chỉ",
            content: contactInfo.address,
            color: "text-green-600"
        },
        {
            icon: Phone,
            title: "Điện thoại",
            content: contactInfo.phone,
            color: "text-green-600"
        },
        {
            icon: Mail,
            title: "Email",
            content: contactInfo.email,
            color: "text-green-600"
        },
        {
            icon: Clock,
            title: "Giờ làm việc",
            content: contactInfo.workingHours,
            color: "text-green-600"
        }
    ]

    return (
        <Card>
            <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>

                <div className="space-y-6">
                    {contactItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            {/* Icon với background màu xanh */}
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>

                            {/* Thông tin chi tiết */}
                            <div>
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
