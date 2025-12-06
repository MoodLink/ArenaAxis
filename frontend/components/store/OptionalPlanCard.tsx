"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Crown, Star, Users, Zap, Clock } from "lucide-react"
import { OptionalPlan } from "@/types"

interface OptionalPlanCardProps {
    plan: OptionalPlan
    isActive?: boolean
    isPopular?: boolean
    onPurchase?: (plan: OptionalPlan) => void
    purchasing?: boolean
}

export default function OptionalPlanCard({
    plan,
    isActive = false,
    isPopular = false,
    onPurchase,
    purchasing = false
}: OptionalPlanCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const getPlanIcon = () => {
        if (plan.name.includes('Cơ bản')) return <Users className="w-8 h-8" />
        if (plan.name.includes('Tiêu chuẩn')) return <Star className="w-8 h-8" />
        if (plan.name.includes('Cao cấp')) return <Crown className="w-8 h-8" />
        return <Zap className="w-8 h-8" />
    }

    const getPlanColor = () => {
        if (plan.name.includes('Cơ bản')) return 'border-blue-200 bg-blue-50'
        if (plan.name.includes('Tiêu chuẩn')) return 'border-green-200 bg-green-50'
        if (plan.name.includes('Cao cấp')) return 'border-purple-200 bg-purple-50'
        return 'border-gray-200 bg-gray-50'
    }

    return (
        <Card className={`relative ${getPlanColor()} ${(isPopular || plan.isPopular) ? 'ring-2 ring-green-500' : ''}`}>
            {(isPopular || plan.isPopular) && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Phổ biến nhất
                </Badge>
            )}

            <CardHeader className="text-center pb-4">
                <div className="flex justify-center text-green-600 mb-4">
                    {getPlanIcon()}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-lg">
                    {plan.description}
                </CardDescription>
                <div className="text-3xl font-bold text-green-600">
                    {formatPrice(plan.price)}
                    <span className="text-lg font-normal text-gray-500">/tháng</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                    {plan.features?.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Plan Details */}
                <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                    <div className="flex justify-between">
                        <span>Số sân tối đa:</span>
                        <span className="font-medium">
                            {plan.maxFields === -1 ? 'Không giới hạn' : plan.maxFields}
                        </span>
                    </div>
                    {plan.commission && (
                        <div className="flex justify-between">
                            <span>Phí hoa hồng:</span>
                            <span className="font-medium">{plan.commission}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Thời hạn:</span>
                        <span className="font-medium">{plan.duration} tháng</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    {isActive ? (
                        <Button
                            className="w-full"
                            disabled
                            variant="outline"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Đang sử dụng
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={() => onPurchase?.(plan)}
                            disabled={purchasing}
                            variant={plan.isPopular ? "default" : "outline"}
                        >
                            {purchasing ? (
                                <>
                                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Chọn gói này'
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}