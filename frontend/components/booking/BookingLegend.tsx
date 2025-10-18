// Component legend cho booking grid
// Hiển thị chú thích các trạng thái slot

import { Card, CardContent } from "@/components/ui/card"

export default function BookingLegend() {
    return (
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
                <div className="flex items-center gap-6 justify-center flex-wrap">
                    <h4 className="text-lg font-bold text-gray-800 mr-4">Chú thích:</h4>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-emerald-100">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-100 to-blue-100 border-2 border-emerald-200 rounded"></div>
                        <span className="text-sm font-medium text-gray-700">Còn trống</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-red-100">
                        <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">✕</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Đã được đặt</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100">
                        <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs">🔒</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Tạm khóa</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-emerald-100">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Bạn đã chọn</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
