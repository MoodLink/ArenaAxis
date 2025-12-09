// Component header cho trang booking history
// Hiển thị tiêu đề và nút quay lại

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BookingHeaderProps {
    title?: string // Tiêu đề trang (optional)
    subtitle?: string // Phụ đề (optional)
    backUrl?: string // URL để quay lại (optional)
}

export default function BookingHeader({
    title = "Lịch sử đặt sân",
    subtitle = "Quản lý các lần đặt sân của bạn",
    backUrl = "/"
}: BookingHeaderProps) {
    return (
        <div className="bg-green-800 text-white">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4">
                    {/* Nút quay lại */}
                    <Link href={backUrl}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-green-700 p-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Tiêu đề và phụ đề */}
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-green-100 text-sm">{subtitle}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
