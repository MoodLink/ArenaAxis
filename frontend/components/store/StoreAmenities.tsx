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
import type { StoreClientDetailResponse, Utility } from "@/types"

interface StoreAmenitiesProps {
    store: StoreClientDetailResponse
}

// Mapping utility type to display name and icon
const utilityMap: Record<string, { name: string; icon: any }> = {
    'WC': { name: 'Nhà vệ sinh', icon: Droplets },
    'CAMERA': { name: 'Camera an ninh', icon: Shield },
    'CANTEEN': { name: 'Căn tin ', icon: Utensils },
    'WIFI': { name: 'Wifi miễn phí', icon: Wifi },
    'WATER': { name: 'Nước uống miễn phí', icon: Droplets },
    'PARKING': { name: 'Bãi đỗ xe', icon: Car },
}

const getAmenityIcon = (utilityType: string) => {
    return utilityMap[utilityType]?.icon || Shield
}

const getAmenityName = (utilityType: string) => {
    return utilityMap[utilityType]?.name || utilityType
}

export default function StoreAmenities({ store }: StoreAmenitiesProps) {
    // Use utilities from store data, fallback to empty array
    const amenities: Utility[] = store.utilities || []

    // Show message if no utilities
    if (amenities.length === 0) {
        return (
            <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiện ích & Cơ sở vật chất</h2>
                    <div className="text-center py-8 text-gray-500">
                        <p>Chưa có thông tin tiện ích</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiện ích & Cơ sở vật chất</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenities.map((utility, index) => {
                        const IconComponent = getAmenityIcon(utility.type)
                        const displayName = getAmenityName(utility.type)
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
                                        {displayName}
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
