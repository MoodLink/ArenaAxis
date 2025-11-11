// Component hiển thị quy tắc và điều khoản sử dụng sân
// Danh sách các quy định người dùng cần tuân thủ

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Rule {
    id: string // ID quy tắc
    text: string // Nội dung quy tắc
    isImportant?: boolean // Có phải quy tắc quan trọng không
}

interface PaymentRulesProps {
    rules?: Rule[] // Danh sách quy tắc custom (optional)
    title?: string // Tiêu đề custom (optional)
}

// Quy tắc mặc định
const defaultRules: Rule[] = [
    {
        id: "1",
        text: "Vui lòng có mặt trước 15 phút so với giờ đặt sân.",
        isImportant: true
    },
    {
        id: "2",
        text: "Thời gian được tính chính xác. Khi hết giờ bạn phải rời sân để nhường cho đội tiếp theo.",
        isImportant: true
    },
    {
        id: "3",
        text: "Khuyến khích sử dụng giày đá bóng chuyên dụng để đảm bảo an toàn."
    },
    {
        id: "4",
        text: "Tự bảo quản đồ đạc cá nhân. Chúng tôi không chịu trách nhiệm về mất mát."
    },
    {
        id: "5",
        text: "Nghiêm cấm hút thuốc và sử dụng đồ uống có cồn trong khu vực sân bóng.",
        isImportant: true
    },
    {
        id: "6",
        text: "Giữ gìn vệ sinh chung và không gây ồn ào ảnh hưởng đến các sân khác."
    },
    {
        id: "7",
        text: "Trong trường hợp thời tiết xấu, chúng tôi sẽ liên hệ để thảo luận về việc hoãn/hủy."
    }
]

export default function PaymentRules({
    rules = defaultRules,
    title = "Quy tắc cần tuân thủ"
}: PaymentRulesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {rules.map((rule) => (
                        <li
                            key={rule.id}
                            className={`text-sm flex items-start gap-2 ${rule.isImportant
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-600"
                                }`}
                        >
                            {/* Bullet point */}
                            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${rule.isImportant
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                                }`} />

                            {/* Nội dung quy tắc */}
                            <span>{rule.text}</span>
                        </li>
                    ))}
                </ul>

                {/* Lưu ý bổ sung */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-blue-900 mb-1">Lưu ý quan trọng:</p>
                            <p className="text-blue-700">
                                Việc đặt sân đồng nghĩa với việc bạn đồng ý tuân thủ tất cả các quy tắc trên.
                                Vi phạm có thể dẫn đến việc chấm dứt dịch vụ và không hoàn tiền.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
