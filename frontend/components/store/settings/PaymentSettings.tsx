"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    CreditCard,
    DollarSign,
    Settings as SettingsIcon,
    Plus,
    Save
} from 'lucide-react'

interface PaymentMethod {
    id: number
    type: string
    name: string
    details: any
    enabled: boolean
}

interface PaymentSettingsProps {
    paymentMethods: PaymentMethod[]
}

export default function PaymentSettings({ paymentMethods }: PaymentSettingsProps) {
    const [methods, setMethods] = useState(paymentMethods)

    const toggleMethod = (id: number) => {
        setMethods(prev => prev.map(method =>
            method.id === id ? { ...method, enabled: !method.enabled } : method
        ))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Phương thức thanh toán</span>
                    </CardTitle>
                    <CardDescription>Cấu hình các phương thức thanh toán cho khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {methods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Switch
                                        checked={method.enabled}
                                        onCheckedChange={() => toggleMethod(method.id)}
                                    />
                                    <div>
                                        <h4 className="font-medium">{method.name}</h4>
                                        <div className="text-sm text-gray-500">
                                            {method.type === 'bank_transfer' && method.details.bankName && (
                                                <span>{method.details.bankName} - {method.details.accountNumber}</span>
                                            )}
                                            {method.type === 'momo' && method.details.phone && (
                                                <span>SĐT: {method.details.phone}</span>
                                            )}
                                            {method.type === 'vnpay' && method.details.merchantId && (
                                                <span>Merchant ID: {method.details.merchantId}</span>
                                            )}
                                            {method.type === 'cash' && (
                                                <span>Thanh toán trực tiếp tại cơ sở</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <SettingsIcon className="h-4 w-4 mr-2" />
                                    Cấu hình
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm phương thức thanh toán
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Cài đặt giá</span>
                    </CardTitle>
                    <CardDescription>Thiết lập chính sách giá và phí</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cancellationFee">Phí hủy đặt sân (%)</Label>
                            <Input id="cancellationFee" type="number" defaultValue="10" />
                        </div>
                        <div>
                            <Label htmlFor="lateFee">Phí đến muộn (VNĐ/phút)</Label>
                            <Input id="lateFee" type="number" defaultValue="5000" />
                        </div>
                        <div>
                            <Label htmlFor="depositPercentage">Tỷ lệ đặt cọc (%)</Label>
                            <Input id="depositPercentage" type="number" defaultValue="30" />
                        </div>
                        <div>
                            <Label htmlFor="overtimeFee">Phí sử dụng quá giờ (VNĐ/phút)</Label>
                            <Input id="overtimeFee" type="number" defaultValue="10000" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="dynamicPricing">Định giá động</Label>
                                <p className="text-sm text-gray-500">Tự động điều chỉnh giá theo nhu cầu</p>
                            </div>
                            <Switch id="dynamicPricing" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="discountForRegular">Giảm giá khách quen</Label>
                                <p className="text-sm text-gray-500">Tự động áp dụng giảm giá cho khách quen</p>
                            </div>
                            <Switch id="discountForRegular" />
                        </div>
                    </div>

                    <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu cài đặt giá
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}