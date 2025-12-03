import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"
import type { StoreClientDetailResponse } from "@/types"

interface StoreDescriptionProps {
    store: StoreClientDetailResponse
}

export default function StoreDescription({ store }: StoreDescriptionProps) {
    const formatTime = (time?: string) => {
        if (!time) return '--:--'
        return time.substring(0, 5)
    }

    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Mô tả sân</h2>
                <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                    {store.introduction || 'Thông tin chi tiết sẽ được cập nhật sớm.'}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                            {formatTime(store.startTime)} - {formatTime(store.endTime)}
                        </div>
                        <div className="text-sm text-gray-600">Giờ hoạt động</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                            {store.orderCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Đơn đặt</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                            {store.viewCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Lượt xem</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-lg font-bold ${store.active ? 'text-emerald-600' : 'text-red-600'}`}>
                            {store.active ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-gray-600">
                            {store.active ? 'Đang hoạt động' : 'Tạm đóng'}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {store.address && (
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-3xl mr-3"></div>
                            <div>
                                <div className="text-sm text-gray-600">Địa chỉ</div>
                                <div className="font-semibold text-gray-800">{store.address}</div>
                            </div>
                        </div>
                    )}

                    {store.linkGoogleMap && (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                            <div className="text-3xl mr-3">🗺️</div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    <a
                                        href={store.linkGoogleMap}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:underline font-semibold"
                                    >
                                        Xem trên Google Maps
                                    </a>
                                </div>
                                <div className="text-xs text-gray-500">Nhấn để mở bản đồ</div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
