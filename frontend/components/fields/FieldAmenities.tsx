// Component hiển thị tiện ích và cơ sở vật chất
// Hiển thị danh sách các tiện ích có sẵn từ field.amenities

import { Card, CardContent } from "@/components/ui/card"
import {
    Wifi,
    Car,
    Users,
    Utensils,
    Shield,
    Wind,
    Lock,
    Lightbulb,
    Volume2,
    Droplets,
    Trophy,
    Home,
    Stethoscope,
    Zap
} from "lucide-react"
import { Field } from "@/types"

interface FieldAmenitiesProps {
    field: Field
}

// Map amenity names to appropriate icons
const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase()
    if (name.includes('wifi')) return Wifi
    if (name.includes('parking')) return Car
    if (name.includes('ball') || name.includes('equipment')) return Users
    if (name.includes('canteen') || name.includes('food') || name.includes('drinks')) return Utensils
    if (name.includes('shower')) return Droplets
    if (name.includes('locker')) return Lock
    if (name.includes('security')) return Shield
    if (name.includes('air conditioning') || name.includes('indoor')) return Wind
    if (name.includes('lighting') || name.includes('led')) return Lightbulb
    if (name.includes('sound')) return Volume2
    if (name.includes('turf') || name.includes('professional')) return Trophy
    if (name.includes('changing') || name.includes('vip')) return Home
    if (name.includes('medical')) return Stethoscope
    if (name.includes('court') || name.includes('multiple')) return Zap
    return Shield // Default icon
}

export default function FieldAmenities({ field }: FieldAmenitiesProps) {
    // Default amenities if not provided
    const amenities = field.amenities || [
        'Wifi miễn phí',
        'Bãi đỗ xe rộng rãi',
        'Phòng thay đồ',
        'Nhà vệ sinh',
        'Đèn chiếu sáng',
        'Căng tin',
        'Camera an ninh',
        'Nước uống miễn phí'
    ]

    return (
        <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiện ích & Cơ sở vật chất</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenities.map((amenityName, index) => {
                        const IconComponent = getAmenityIcon(amenityName)
                        return (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all hover:shadow-md bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200 hover:border-emerald-300">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500">
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-medium text-gray-900">
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
