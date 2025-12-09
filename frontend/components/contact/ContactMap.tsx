// Component hiển thị bản đồ
// Tạm thời hiển thị placeholder, có thể tích hợp Google Maps sau

import { Card, CardContent } from "@/components/ui/card"

interface ContactMapProps {
    title?: string // Tiêu đề (optional)
    address?: string // Địa chỉ để hiển thị (optional)
    mapUrl?: string // URL embed map (optional)
}

export default function ContactMap({
    title = "Vị trí",
    address = "123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM",
    mapUrl
}: ContactMapProps) {
    return (
        <Card>
            <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>

                {/* Map container */}
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                    {mapUrl ? (
                        // Hiển thị iframe Google Maps nếu có URL
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                        />
                    ) : (
                        // Placeholder khi chưa có map
                        <div className="text-center text-gray-500">
                            <div className="text-6xl mb-4"></div>
                            <span className="text-lg font-medium">Bản đồ Google Maps</span>
                            <p className="text-sm mt-2 max-w-xs">
                                Bản đồ sẽ hiển thị vị trí chính xác của chúng tôi
                            </p>

                            {/* Hiển thị địa chỉ */}
                            {address && (
                                <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-gray-700 text-sm">{address}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Instructions để tích hợp map thực */}
                {!mapUrl && (
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        Để tích hợp Google Maps: thêm Google Maps API key và embed URL
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
