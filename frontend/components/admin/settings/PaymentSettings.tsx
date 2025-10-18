"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
    CreditCard,
    Save,
    RefreshCw,
    Eye,
    EyeOff
} from 'lucide-react'
import { PaymentSettings } from '@/data/mockDataAdmin'
import { useState } from 'react'

interface PaymentSettingsProps {
    settings: PaymentSettings;
    onSettingsChange: (settings: PaymentSettings) => void;
    onSave: () => void;
    onReset: () => void;
}

export default function PaymentSettingsComponent({ settings, onSettingsChange, onSave, onReset }: PaymentSettingsProps) {
    const [showStripeKey, setShowStripeKey] = useState(false)
    const [showPaypalId, setShowPaypalId] = useState(false)

    const updateSettings = (updates: Partial<PaymentSettings>) => {
        onSettingsChange({ ...settings, ...updates })
    }

    const paymentMethods = [
        { value: 'card', label: 'Thẻ tín dụng/ghi nợ' },
        { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
        { value: 'e_wallet', label: 'Ví điện tử' },
        { value: 'cash', label: 'Tiền mặt' }
    ]

    const currencies = [
        { value: 'VND', label: 'Việt Nam Đồng (VND)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' }
    ]

    const handlePaymentMethodChange = (methodValue: string, checked: boolean) => {
        let newMethods = [...settings.acceptedMethods]
        if (checked) {
            if (!newMethods.includes(methodValue)) {
                newMethods.push(methodValue)
            }
        } else {
            newMethods = newMethods.filter(method => method !== methodValue)
        }
        updateSettings({ acceptedMethods: newMethods })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Cài đặt thanh toán</span>
                    </CardTitle>
                    <CardDescription>
                        Cấu hình phương thức và chính sách thanh toán
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="enableOnlinePayment">Thanh toán trực tuyến</Label>
                            <p className="text-sm text-gray-500">Cho phép thanh toán online</p>
                        </div>
                        <Switch
                            id="enableOnlinePayment"
                            checked={settings.enableOnlinePayment}
                            onCheckedChange={(checked) => updateSettings({ enableOnlinePayment: checked })}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Phương thức thanh toán được chấp nhận</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentMethods.map((method) => (
                                <div key={method.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={method.value}
                                        checked={settings.acceptedMethods.includes(method.value)}
                                        onCheckedChange={(checked) =>
                                            handlePaymentMethodChange(method.value, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={method.value}>{method.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                            <Select
                                value={settings.currency}
                                onValueChange={(value) => updateSettings({ currency: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency.value} value={currency.value}>
                                            {currency.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="commissionRate">Phí hoa hồng (%)</Label>
                            <Input
                                id="commissionRate"
                                type="number"
                                value={settings.commissionRate}
                                onChange={(e) => updateSettings({ commissionRate: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minimumBookingAmount">Số tiền booking tối thiểu</Label>
                            <Input
                                id="minimumBookingAmount"
                                type="number"
                                value={settings.minimumBookingAmount}
                                onChange={(e) => updateSettings({ minimumBookingAmount: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="refundPolicy">Chính sách hoàn tiền</Label>
                        <Textarea
                            id="refundPolicy"
                            rows={3}
                            value={settings.refundPolicy}
                            onChange={(e) => updateSettings({ refundPolicy: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cấu hình Gateway</CardTitle>
                    <CardDescription>
                        API keys và thông tin kết nối với các nhà cung cấp thanh toán
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="stripeKey">Stripe Public Key</Label>
                        <div className="relative">
                            <Input
                                id="stripeKey"
                                type={showStripeKey ? "text" : "password"}
                                value={settings.stripePublicKey || ''}
                                onChange={(e) => updateSettings({ stripePublicKey: e.target.value })}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                onClick={() => setShowStripeKey(!showStripeKey)}
                            >
                                {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paypalId">PayPal Client ID</Label>
                        <div className="relative">
                            <Input
                                id="paypalId"
                                type={showPaypalId ? "text" : "password"}
                                value={settings.paypalClientId || ''}
                                onChange={(e) => updateSettings({ paypalClientId: e.target.value })}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                onClick={() => setShowPaypalId(!showPaypalId)}
                            >
                                {showPaypalId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={onReset}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Đặt lại
                        </Button>
                        <Button onClick={onSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu cài đặt
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}