"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Bell,
    Mail,
    Smartphone,
    Save,
    RefreshCw
} from 'lucide-react'
import { NotificationSettings } from '@/data/mockDataAdmin'

interface NotificationSettingsProps {
    settings: NotificationSettings;
    onSettingsChange: (settings: NotificationSettings) => void;
    onSave: () => void;
    onReset: () => void;
}

export default function NotificationSettingsComponent({ settings, onSettingsChange, onSave, onReset }: NotificationSettingsProps) {
    const updateSettings = (updates: Partial<NotificationSettings>) => {
        onSettingsChange({ ...settings, ...updates })
    }

    const notificationOptions = [
        {
            key: 'emailNotifications' as keyof NotificationSettings,
            icon: Mail,
            title: 'Thông báo Email',
            description: 'Gửi thông báo qua email'
        },
        {
            key: 'smsNotifications' as keyof NotificationSettings,
            icon: Smartphone,
            title: 'Thông báo SMS',
            description: 'Gửi thông báo qua tin nhắn'
        },
        {
            key: 'pushNotifications' as keyof NotificationSettings,
            icon: Bell,
            title: 'Push Notifications',
            description: 'Thông báo đẩy trên trình duyệt'
        },
        {
            key: 'bookingConfirmations' as keyof NotificationSettings,
            icon: Bell,
            title: 'Xác nhận booking',
            description: 'Thông báo khi có booking mới'
        },
        {
            key: 'paymentAlerts' as keyof NotificationSettings,
            icon: Bell,
            title: 'Cảnh báo thanh toán',
            description: 'Thông báo về các giao dịch thanh toán'
        },
        {
            key: 'systemAlerts' as keyof NotificationSettings,
            icon: Bell,
            title: 'Cảnh báo hệ thống',
            description: 'Thông báo lỗi và cảnh báo hệ thống'
        },
        {
            key: 'marketingEmails' as keyof NotificationSettings,
            icon: Mail,
            title: 'Email marketing',
            description: 'Gửi email khuyến mãi và tin tức'
        },
        {
            key: 'weeklyReports' as keyof NotificationSettings,
            icon: Mail,
            title: 'Báo cáo hàng tuần',
            description: 'Gửi báo cáo tổng kết hàng tuần'
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>Cài đặt thông báo</span>
                    </CardTitle>
                    <CardDescription>
                        Quản lý các loại thông báo của hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {notificationOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                            <div key={option.key} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <IconComponent className="h-5 w-5 text-gray-600" />
                                    <div>
                                        <Label htmlFor={option.key}>{option.title}</Label>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                </div>
                                <Switch
                                    id={option.key}
                                    checked={settings[option.key] as boolean}
                                    onCheckedChange={(checked) => updateSettings({ [option.key]: checked })}
                                />
                            </div>
                        )
                    })}

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