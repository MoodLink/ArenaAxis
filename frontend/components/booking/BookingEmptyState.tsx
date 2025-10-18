// Component empty state cho booking history
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BookingEmptyStateProps {
    activeTab: string
}

export default function BookingEmptyState({ activeTab }: BookingEmptyStateProps) {
    return (
        <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm border">
                <div className="text-gray-400 text-6xl mb-6">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {activeTab === "Tất cả"
                        ? "Chưa có lịch đặt sân nào"
                        : `Không có booking nào ở trạng thái "${activeTab}"`
                    }
                </h3>
                <p className="text-gray-600 mb-8">
                    {activeTab === "Tất cả"
                        ? "Hãy đặt sân đầu tiên của bạn để bắt đầu chơi thể thao!"
                        : "Thử chuyển sang tab khác để xem các booking khác."
                    }
                </p>
                {activeTab === "Tất cả" && (
                    <Link href="/fields">
                        <Button className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg">
                            Đặt sân ngay
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}