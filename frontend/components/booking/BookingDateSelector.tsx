// Component selector ngày cho booking
// Cho phép người dùng chọn ngày đặt sân

import { Clock } from "lucide-react"

interface BookingDateSelectorProps {
    selectedDate: string
    onDateChange: (date: string) => void
}

export default function BookingDateSelector({
    selectedDate,
    onDateChange
}: BookingDateSelectorProps) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">Chọn ngày:</span>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="ml-auto">
                    <span className="text-sm text-gray-600">
                        Ngày đã chọn: <span className="font-medium text-gray-800">
                            {new Date(selectedDate).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}
