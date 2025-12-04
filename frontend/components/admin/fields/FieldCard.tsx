"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Play, Pause, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Field {
    _id: string
    name?: string
    sport_name?: string
    address?: string
    avatar?: string
    defaultPrice?: string
    default_price?: string
    activeStatus?: boolean
    active_status?: boolean
    rating?: number
}

interface FieldCardProps {
    field: Field
    onView: (fieldId: string) => void
    onEdit: (fieldId: string) => void
    onDelete: (fieldId: string) => void
    onToggleStatus: (fieldId: string, currentStatus: boolean) => void
    onVerify?: (fieldId: string) => void
}

export default function FieldCard({
    field,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
    onVerify
}: FieldCardProps) {
    // Handle both activeStatus and active_status
    const isActive = field.activeStatus ?? field.active_status ?? false
    const price = field.defaultPrice ?? field.default_price ?? "0"
    const fieldName = field.name ?? "Sân không tên"
    const sportName = field.sport_name ?? "Chưa xác định"
    const address = field.address ?? "Không có địa chỉ"
    const imageUrl = field.avatar ?? "/placeholder.svg"

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <div className="relative w-full h-40 bg-gray-200">
                <Image
                    src={imageUrl}
                    alt={fieldName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src = "/placeholder.svg"
                    }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <Badge
                        className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                        {isActive ? "Hoạt động" : "Tắt"}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <CardHeader className="pb-3">
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg line-clamp-2">{fieldName}</h3>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {sportName}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                        {address}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">Giá/giờ</span>
                        <p className="font-semibold text-lg">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(Number(price))}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Đánh giá</span>
                        <p className="font-semibold text-lg">
                            ⭐ {field.rating ? field.rating.toFixed(1) : "N/A"}
                        </p>
                    </div>
                </div>
            </CardContent>

            {/* Action Buttons */}
            <CardFooter className="flex gap-2 flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onView(field._id)}
                >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(field._id)}
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Sửa
                </Button>
                <Button
                    variant={isActive ? "default" : "secondary"}
                    size="sm"
                    className="flex-1"
                    onClick={() => onToggleStatus(field._id, isActive)}
                >
                    {isActive ? (
                        <>
                            <Pause className="w-4 h-4 mr-1" />
                            Tắt
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-1" />
                            Bật
                        </>
                    )}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDelete(field._id)}
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                </Button>
            </CardFooter>
        </Card>
    )
}
