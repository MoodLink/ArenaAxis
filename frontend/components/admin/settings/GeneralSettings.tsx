"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Globe,
    Save,
    RefreshCw,
    MapPin,
    Clock
} from 'lucide-react'
import { SystemSettings } from '@/data/mockDataAdmin'

interface GeneralSettingsProps {
    settings: SystemSettings;
    onSettingsChange: (settings: SystemSettings) => void;
    onSave: () => void;
    onReset: () => void;
}

export default function GeneralSettings({ settings, onSettingsChange, onSave, onReset }: GeneralSettingsProps) {
    const updateSettings = (updates: Partial<SystemSettings>) => {
        onSettingsChange({ ...settings, ...updates })
    }

    const updateBusinessHours = (updates: Partial<SystemSettings['businessHours']>) => {
        onSettingsChange({
            ...settings,
            businessHours: { ...settings.businessHours, ...updates }
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Thông tin website</span>
                    </CardTitle>
                    <CardDescription>
                        Cấu hình thông tin cơ bản của website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Tên website</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => updateSettings({ siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email liên hệ</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Số điện thoại</Label>
                            <Input
                                id="phoneNumber"
                                value={settings.phoneNumber}
                                onChange={(e) => updateSettings({ phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Múi giờ</Label>
                            <Select
                                value={settings.businessHours.timezone}
                                onValueChange={(value) => updateBusinessHours({ timezone: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                                    <SelectItem value="Asia/Bangkok">Thailand (UTC+7)</SelectItem>
                                    <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteDescription">Mô tả website</Label>
                        <Textarea
                            id="siteDescription"
                            rows={3}
                            value={settings.siteDescription}
                            onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                            <Input
                                id="address"
                                className="pl-10"
                                value={settings.address}
                                onChange={(e) => updateSettings({ address: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Giờ hoạt động</span>
                    </CardTitle>
                    <CardDescription>
                        Thiết lập thời gian hoạt động của hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="openTime">Giờ mở cửa</Label>
                            <Input
                                id="openTime"
                                type="time"
                                value={settings.businessHours.open}
                                onChange={(e) => updateBusinessHours({ open: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                            <Input
                                id="closeTime"
                                type="time"
                                value={settings.businessHours.close}
                                onChange={(e) => updateBusinessHours({ close: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt hệ thống</CardTitle>
                    <CardDescription>
                        Các tùy chọn chung của hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="maintenance">Chế độ bảo trì</Label>
                            <p className="text-sm text-gray-500">Tạm dừng hoạt động để bảo trì hệ thống</p>
                        </div>
                        <Switch
                            id="maintenance"
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => updateSettings({ maintenanceMode: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="registration">Cho phép đăng ký</Label>
                            <p className="text-sm text-gray-500">Người dùng có thể tự đăng ký tài khoản</p>
                        </div>
                        <Switch
                            id="registration"
                            checked={settings.allowRegistration}
                            onCheckedChange={(checked) => updateSettings({ allowRegistration: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="emailVerification">Xác thực email</Label>
                            <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                        </div>
                        <Switch
                            id="emailVerification"
                            checked={settings.requireEmailVerification}
                            onCheckedChange={(checked) => updateSettings({ requireEmailVerification: checked })}
                        />
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