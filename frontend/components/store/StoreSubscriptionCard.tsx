"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, AlertCircle, Calendar, DollarSign } from "lucide-react"
import { ApplyOptionalPlan } from "@/types"

interface StoreSubscriptionCardProps {
    subscription: ApplyOptionalPlan
    onRenew?: (subscription: ApplyOptionalPlan) => void
    onCancel?: (subscription: ApplyOptionalPlan) => void
}

export default function StoreSubscriptionCard({
    subscription,
    onRenew,
    onCancel
}: StoreSubscriptionCardProps) {
    const [loading, setLoading] = useState(false)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đang hoạt động
                    </Badge>
                )
            case 'expired':
                return (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Hết hạn
                    </Badge>
                )
            case 'cancelled':
                return (
                    <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Đã hủy
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Không xác định
                    </Badge>
                )
        }
    }

    const isExpiringSoon = (endDate?: string) => {
        if (!endDate) return false
        const end = new Date(endDate)
        const now = new Date()
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 7 && diffDays >= 0
    }

    const handleRenew = async () => {
        if (!onRenew) return
        setLoading(true)
        try {
            await onRenew(subscription)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!onCancel) return
        setLoading(true)
        try {
            await onCancel(subscription)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`${subscription.status === 'active' ? 'border-green-200' : 'border-gray-200'}`}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            {subscription.optionalPlan?.name || 'Gói không xác định'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            {subscription.optionalPlan?.description}
                        </p>
                    </div>
                    {getStatusBadge(subscription.status)}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Subscription Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <div>
                                <span className="text-gray-500">Giá:</span>
                                <div className="font-medium">
                                    {subscription.price ? formatPrice(subscription.price) : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                                <span className="text-gray-500">Bắt đầu:</span>
                                <div className="font-medium">
                                    {subscription.startDate
                                        ? new Date(subscription.startDate).toLocaleDateString('vi-VN')
                                        : 'N/A'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                                <span className="text-gray-500">Kết thúc:</span>
                                <div className="font-medium">
                                    {subscription.endDate
                                        ? new Date(subscription.endDate).toLocaleDateString('vi-VN')
                                        : 'N/A'
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-500" />
                            <div>
                                <span className="text-gray-500">Trạng thái:</span>
                                <div className="font-medium">
                                    {subscription.status === 'active' ? 'Hoạt động' :
                                        subscription.status === 'expired' ? 'Hết hạn' :
                                            subscription.status === 'cancelled' ? 'Đã hủy' : 'Không xác định'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning for expiring subscriptions */}
                {subscription.status === 'active' && isExpiringSoon(subscription.endDate) && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-800">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Gói sắp hết hạn trong vài ngày tới!
                            </span>
                        </div>
                    </div>
                )}

                {/* Features */}
                {subscription.optionalPlan?.features && subscription.optionalPlan.features.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="text-sm font-medium mb-2">Tính năng gói:</h4>
                            <div className="space-y-1">
                                {subscription.optionalPlan.features.slice(0, 3).map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {feature}
                                    </div>
                                ))}
                                {subscription.optionalPlan.features.length > 3 && (
                                    <div className="text-sm text-gray-500">
                                        +{subscription.optionalPlan.features.length - 3} tính năng khác
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <Separator />
                <div className="flex gap-2">
                    {subscription.status === 'active' && onCancel && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1"
                        >
                            Hủy gói
                        </Button>
                    )}

                    {(subscription.status === 'expired' || isExpiringSoon(subscription.endDate)) && onRenew && (
                        <Button
                            size="sm"
                            onClick={handleRenew}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Đang xử lý...' : 'Gia hạn'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}