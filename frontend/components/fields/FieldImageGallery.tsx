// Component hiển thị gallery hình ảnh của sân
// Bao gồm hình ảnh chính và thông tin cơ bản

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import { Field } from "@/types"

interface FieldImageGalleryProps {
    field: Field
}

export default function FieldImageGallery({ field }: FieldImageGalleryProps) {
    const imageUrl = field.cover_image || field.avatar || field.image || '/placeholder-field.png'

    return (
        <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={field.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium text-gray-800">{field.address || field.location || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-semibold text-gray-800">{field.rating || 4}/5</span>
                                <span className="text-gray-600">({field.reviewCount || 0} đánh giá)</span>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {field.sport_name || (typeof field.sport === 'string' ? field.sport : field.sport?.name) || 'Sport'}
                        </Badge>
                    </div>

                    {field.description && (
                        <p className="text-gray-700 leading-relaxed">
                            {field.description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
