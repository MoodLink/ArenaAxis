import { Suspense } from "react"
import StoreBookingContent from "./store-booking-content"

export default function StoreBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đặt sân...</p>
                </div>
            </div>
        }>
            <StoreBookingContent />
        </Suspense>
    )
}
