"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Crown, Star, Users, Zap, Shield, Clock, Phone, Mail, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getOptionalPlans, purchaseOptionalPlan, getMyStore, getMyOptionalPlans } from "@/services/api-new"
import { OptionalPlan, ApplyOptionalPlan, StoreClientDetailResponse } from "@/types"
import { useRouter } from "next/navigation"

export default function OptionalPlansPage() {
    const router = useRouter()
    const [plans, setPlans] = useState<OptionalPlan[]>([])
    const [myStore, setMyStore] = useState<StoreClientDetailResponse | null>(null)
    const [myPlans, setMyPlans] = useState<ApplyOptionalPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<OptionalPlan | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)

                // Load store info
                const storeData = await getMyStore()
                setMyStore(storeData)

                // Load plans regardless of store status
                const plansData = await getOptionalPlans()
                setPlans(plansData)

                // Load current subscriptions if store exists
                if (storeData) {
                    const myPlansData = await getMyOptionalPlans(storeData.id)
                    setMyPlans(myPlansData)
                }
            } catch (error) {
                console.error('Error loading data:', error)
                setError('Có lỗi xảy ra khi tải dữ liệu')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    const isPlanActive = (planId: string) => {
        return myStore && myStore.approved && myPlans.some(mp =>
            mp.optionalPlan?.id === planId &&
            (!mp.deletedAt || new Date(mp.deletedAt) > new Date()) // Kiểm tra deletedAt thay vì status
        )
    }

    const handlePurchase = (plan: OptionalPlan) => {
        if (!myStore) {
            setError('Bạn cần đăng ký cửa hàng trước khi mua gói dịch vụ.')
            return
        }

        if (myStore && !myStore.approved) {
            setError('Cửa hàng của bạn đang chờ duyệt. Vui lòng chờ admin phê duyệt.')
            return
        }

        setSelectedPlan(plan)
        setShowConfirmDialog(true)
    }

    const confirmPurchase = async () => {
        if (!selectedPlan || !myStore) return

        setPurchasing(selectedPlan.id)
        setError(null)

        try {
            const response = await purchaseOptionalPlan({
                optionalPlanId: selectedPlan.id,
                storeId: myStore.id,
                // Bỏ duration vì entity không hỗ trợ
            })

            if (response.success) {
                // Reload my plans
                const updatedPlans = await getMyOptionalPlans(myStore.id)
                setMyPlans(updatedPlans)
                setShowConfirmDialog(false)
                setSelectedPlan(null)
            } else {
                setError(response.message)
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi mua gói')
        } finally {
            setPurchasing(null)
        }
    }

    const getPlanIcon = (planName: string) => {
        if (planName.includes('Cơ bản')) return <Users className="w-8 h-8" />
        if (planName.includes('Tiêu chuẩn')) return <Star className="w-8 h-8" />
        if (planName.includes('Cao cấp')) return <Crown className="w-8 h-8" />
        return <Zap className="w-8 h-8" />
    }

    const getPlanColor = (planName: string) => {
        if (planName.includes('Cơ bản')) return 'border-blue-200 bg-blue-50'
        if (planName.includes('Tiêu chuẩn')) return 'border-green-200 bg-green-50'
        if (planName.includes('Cao cấp')) return 'border-purple-200 bg-purple-50'
        return 'border-gray-200 bg-gray-50'
    }

    const getPlanFeatures = (planName: string) => {
        if (planName.includes('Cơ bản')) {
            return ['Quảng cáo cơ bản', 'Hỗ trợ 24/7', 'Báo cáo đơn giản']
        }
        if (planName.includes('Tiêu chuẩn')) {
            return ['Quảng cáo ưu tiên', 'Hỗ trợ ưu tiên', 'Báo cáo chi tiết', 'API tích hợp']
        }
        if (planName.includes('Cao cấp')) {
            return ['Quảng cáo tối ưu', 'Hỗ trợ VIP', 'Báo cáo nâng cao', 'API đầy đủ', 'Tư vấn chuyên nghiệp']
        }
        return ['Tính năng cơ bản']
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
                        <p>Đang tải gói dịch vụ...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Gói Dịch Vụ Optional</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Nâng cấp cửa hàng của bạn với các gói dịch vụ chuyên nghiệp
                    </p>
                    {myStore && myStore.approved && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span>Cửa hàng: {myStore.name}</span>
                        </div>
                    )}
                    {myStore && !myStore.approved && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                            <Clock className="w-5 h-5" />
                            <span>Cửa hàng đang chờ duyệt: {myStore.name}</span>
                        </div>
                    )}
                    {!myStore && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Bạn chưa đăng ký cửa hàng</span>
                        </div>
                    )}
                </div>

                {/* Status Alert */}
                {(!myStore || (myStore && !myStore.approved)) && (
                    <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {!myStore ? (
                                <div className="space-y-2">
                                    <p>Bạn cần đăng ký cửa hàng trước khi mua gói dịch vụ.</p>
                                    <Button onClick={() => router.push('/store-registration')} size="sm">
                                        Đăng ký cửa hàng
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p>Cửa hàng của bạn đang chờ admin phê duyệt. Bạn có thể xem các gói dịch vụ nhưng chưa thể mua.</p>
                                    <Button onClick={() => router.push('/profile')} size="sm" variant="outline">
                                        Xem hồ sơ cửa hàng
                                    </Button>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert className="mb-6" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => {
                        const isActive = isPlanActive(plan.id)
                        const isPurchasing = purchasing === plan.id

                        return (
                            <Card
                                key={plan.id}
                                className={`relative ${getPlanColor(plan.name)}`}
                            >
                                <CardHeader className="text-center pb-4">
                                    <div className="flex justify-center text-green-600 mb-4">
                                        {getPlanIcon(plan.name)}
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
                                        {getPlanFeatures(plan.name).map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Plan Details */}
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Số sân tối đa:</span>
                                            <span className="font-medium">Không giới hạn</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí hoa hồng:</span>
                                            <span className="font-medium">5%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Thời hạn:</span>
                                            <span className="font-medium">1 tháng</span>
                                        </div>
                                    </div>

                                    <Separator />

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
                                                onClick={() => handlePurchase(plan)}
                                                disabled={isPurchasing || !myStore || (myStore && !myStore.approved)}
                                                variant="outline"
                                            >
                                                {isPurchasing ? (
                                                    <>
                                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : !myStore ? (
                                                    'Cần đăng ký cửa hàng'
                                                ) : myStore && !myStore.approved ? (
                                                    'Cửa hàng chờ duyệt'
                                                ) : (
                                                    'Chọn gói này'
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Current Subscriptions */}
                {myStore && myStore.approved && myPlans.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Gói đã đăng ký</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myPlans.map((appliedPlan) => (
                                <Card key={appliedPlan.id} className="border-green-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {appliedPlan.optionalPlan?.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {appliedPlan.optionalPlan?.description}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={!appliedPlan.deletedAt || new Date(appliedPlan.deletedAt) > new Date() ? 'default' : 'secondary'}
                                            >
                                                {!appliedPlan.deletedAt || new Date(appliedPlan.deletedAt) > new Date() ? 'Đang hoạt động' : 'Hết hạn'}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Giá:</span>
                                                <div className="font-medium">
                                                    {appliedPlan.price ? formatPrice(appliedPlan.price) : 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày mua:</span>
                                                <div className="font-medium">
                                                    {appliedPlan.createdAt ? new Date(appliedPlan.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Trạng thái:</span>
                                                <div className="font-medium">
                                                    {!appliedPlan.deletedAt || new Date(appliedPlan.deletedAt) > new Date() ? 'Hoạt động' : 'Hết hạn'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Ngày hết hạn:</span>
                                                <div className="font-medium">
                                                    {appliedPlan.deletedAt ? new Date(appliedPlan.deletedAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benefits Section */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn gói dịch vụ của chúng tôi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Tăng doanh thu</h3>
                            <p className="text-gray-600">Tiếp cận nhiều khách hàng hơn với các tính năng quảng cáo ưu tiên</p>
                        </div>
                        <div className="text-center">
                            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Hỗ trợ chuyên nghiệp</h3>
                            <p className="text-gray-600">Đội ngũ hỗ trợ 24/7 giúp bạn giải quyết mọi vấn đề</p>
                        </div>
                        <div className="text-center">
                            <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Tính năng nâng cao</h3>
                            <p className="text-gray-600">Báo cáo chi tiết, tích hợp API và nhiều tính năng độc quyền</p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="text-center mt-12">
                    <h3 className="text-xl font-semibold mb-4">Cần tư vấn thêm?</h3>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline">
                            <Phone className="w-4 h-4 mr-2" />
                            Gọi: 1900-xxx-xxx
                        </Button>
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Email: support@arenaaxis.com
                        </Button>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xác nhận mua gói</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn mua gói "{selectedPlan?.name}" với giá {selectedPlan ? formatPrice(selectedPlan.price) : ''}?
                            </DialogDescription>
                        </DialogHeader>

                        {selectedPlan && (
                            <div className="py-4">
                                <h4 className="font-medium mb-2">Chi tiết gói:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {getPlanFeatures(selectedPlan.name).map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                Hủy
                            </Button>
                            <Button onClick={confirmPurchase} disabled={!!purchasing}>
                                {purchasing ? 'Đang xử lý...' : 'Xác nhận mua'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}