// Component empty state cho booking history
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BookingEmptyStateProps {
    activeTab: string
}

export default function BookingEmptyState({ activeTab }: BookingEmptyStateProps) {
    const getEmptyMessage = () => {
        switch (activeTab) {
            case "Sắp diễn ra":
                return {
                    title: "Chưa có lịch đặt sân sắp diễn ra",
                    description: "Hãy đặt sân để có những trận đấu sắp tới!",
                    showButton: true
                }
            case "Đang diễn ra":
                return {
                    title: "Không có lịch đặt sân đang diễn ra",
                    description: "Hiện tại bạn không có trận đấu nào đang diễn ra.",
                    showButton: false
                }
            case "Đã diễn ra":
                return {
                    title: "Chưa có lịch sử đặt sân",
                    description: "Các lần đặt sân đã hoàn thành sẽ hiển thị ở đây.",
                    showButton: true
                }
            default:
                return {
                    title: "Chưa có lịch đặt sân nào",
                    description: "Hãy đặt sân đầu tiên của bạn để bắt đầu chơi thể thao!",
                    showButton: true
                }
        }
    }

    const message = getEmptyMessage()

    return (
        <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm border">
                <div className="text-gray-400 text-6xl mb-6">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {message.title}
                </h3>
                <p className="text-gray-600 mb-8">
                    {message.description}
                </p>
                {message.showButton && (
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