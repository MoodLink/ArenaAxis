"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Bell,
    Mail,
    Smartphone,
    Save
} from 'lucide-react'

interface NotificationSettings {
    email: { [key: string]: boolean }
    sms: { [key: string]: boolean }
    push: { [key: string]: boolean }
}

interface NotificationSettingsProps {
    notificationSettings: NotificationSettings
}

export default function NotificationSettings({ notificationSettings }: NotificationSettingsProps) {
    const [settings, setSettings] = useState(notificationSettings)

    const handleToggle = (category: string, setting: string) => {
        setSettings(prev => {
            const currentCategory = prev[category as keyof typeof prev] as any
            return {
                ...prev,
                [category]: {
                    ...currentCategory,
                    [setting]: !currentCategory[setting]
                }
            }
        })
    }

    const notificationTypes = [
        { key: 'newBooking', label: 'Đặt sân mới', description: 'Thông báo khi có đặt sân mới' },
        { key: 'cancelBooking', label: 'Hủy đặt sân', description: 'Thông báo khi khách hàng hủy đặt sân' },
        { key: 'paymentReceived', label: 'Thanh toán', description: 'Thông báo khi nhận được thanh toán' },
        { key: 'customerReview', label: 'Đánh giá khách hàng', description: 'Thông báo khi có đánh giá mới' },
        { key: 'maintenanceReminder', label: 'Nhắc nhở bảo trì', description: 'Thông báo lịch bảo trì sân' },
        { key: 'promotionExpiry', label: 'Khuyến mãi hết hạn', description: 'Thông báo khi khuyến mãi sắp hết hạn' },
        { key: 'systemUpdates', label: 'Cập nhật hệ thống', description: 'Thông báo về các cập nhật hệ thống' }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Cài đặt thông báo</span>
                    </CardTitle>
                    <CardDescription>Chọn cách thức nhận thông báo cho các sự kiện khác nhau</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2">Loại thông báo</th>
                                    <th className="text-center py-3 px-2">
                                        <div className="flex items-center justify-center space-x-1">
                                            <Mail className="h-4 w-4" />
                                            <span>Email</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2">
                                        <div className="flex items-center justify-center space-x-1">
                                            <Smartphone className="h-4 w-4" />
                                            <span>SMS</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-3 px-2">
                                        <div className="flex items-center justify-center space-x-1">
                                            <Bell className="h-4 w-4" />
                                            <span>Push</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {notificationTypes.map((type) => (
                                    <tr key={type.key} className="border-b">
                                        <td className="py-4 px-2">
                                            <div>
                                                <div className="font-medium text-gray-900">{type.label}</div>
                                                <div className="text-sm text-gray-500">{type.description}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <Switch
                                                checked={settings.email[type.key]}
                                                onCheckedChange={() => handleToggle('email', type.key)}
                                            />
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <Switch
                                                checked={settings.sms[type.key]}
                                                onCheckedChange={() => handleToggle('sms', type.key)}
                                            />
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <Switch
                                                checked={settings.push[type.key]}
                                                onCheckedChange={() => handleToggle('push', type.key)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6">
                        <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu cài đặt thông báo
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}