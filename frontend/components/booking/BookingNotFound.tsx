// Component hiển thị khi không tìm thấy sân trong booking
// Fallback UI với nút quay lại

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BookingNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-gray-400">📅</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Sân không tìm thấy</h1>
                <p className="text-gray-600 mb-6 max-w-md">
                    Sân bóng bạn muốn đặt có thể đã bị xóa hoặc không tồn tại.
                </p>
                <Link href="/fields">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3">
                        Quay lại danh sách sân
                    </Button>
                </Link>
            </div>
        </div>
    )
}
