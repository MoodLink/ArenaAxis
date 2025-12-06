import { Card, CardContent } from "@/components/ui/card"
import {
    Wifi,
    Car,
    Shield,
    Droplets,
    Lock,
    Lightbulb,
    Users,
    Utensils,
} from "lucide-react"
import type { StoreClientDetailResponse } from "@/types"

interface StoreAmenitiesProps {
    store: StoreClientDetailResponse
}

const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase()
    if (name.includes('wifi')) return Wifi
    if (name.includes('parking') || name.includes('bãi đỗ')) return Car
    if (name.includes('security') || name.includes('camera')) return Shield
    if (name.includes('shower') || name.includes('water')) return Droplets
    if (name.includes('locker') || name.includes('tủ')) return Lock
    if (name.includes('lighting') || name.includes('đèn')) return Lightbulb
    if (name.includes('seat') || name.includes('capacity')) return Users
    if (name.includes('food') || name.includes('drink') || name.includes('canteen')) return Utensils
    return Shield
}

export default function StoreAmenities({ store }: StoreAmenitiesProps) {
    // Default amenities if not provided
    const amenities = [
        'Wifi miễn phí',
        'Bãi đỗ xe rộng rãi',
        'Phòng thay đồ',
        'Nhà vệ sinh',
        'Đèn chiếu sáng',
        'Căng tin',
        'Camera an ninh',
        'Nước uống miễn phí',
    ]

    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiện ích & Cơ sở vật chất</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenities.map((amenityName, index) => {
                        const IconComponent = getAmenityIcon(amenityName)
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200 hover:border-emerald-300"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500 flex-shrink-0">
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-medium text-gray-900 block truncate">
                                        {amenityName}
                                    </span>
                                    <div className="text-xs text-emerald-600 font-medium">Có sẵn</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
