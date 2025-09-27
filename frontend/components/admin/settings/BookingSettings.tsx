"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Calendar,
    Clock,
    Save,
    RefreshCw
} from 'lucide-react'
import { BookingSettings } from '@/data/mockDataAdmin'

interface BookingSettingsProps {
    settings: BookingSettings;
    onSettingsChange: (settings: BookingSettings) => void;
    onSave: () => void;
    onReset: () => void;
}

export default function BookingSettingsComponent({ settings, onSettingsChange, onSave, onReset }: BookingSettingsProps) {
    const updateSettings = (updates: Partial<BookingSettings>) => {
        onSettingsChange({ ...settings, ...updates })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Cài đặt booking</span>
                    </CardTitle>
                    <CardDescription>
                        Cấu hình quy tắc và chính sách booking
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="advanceBookingDays">Đặt trước tối đa (ngày)</Label>
                            <Input
                                id="advanceBookingDays"
                                type="number"
                                value={settings.advanceBookingDays}
                                onChange={(e) => updateSettings({ advanceBookingDays: parseInt(e.target.value) || 30 })}
                            />
                            <p className="text-sm text-gray-500">Khách hàng có thể đặt sân trước tối đa bao nhiêu ngày</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minimumBookingHours">Đặt trước tối thiểu (giờ)</Label>
                            <Input
                                id="minimumBookingHours"
                                type="number"
                                value={settings.minimumBookingHours}
                                onChange={(e) => updateSettings({ minimumBookingHours: parseInt(e.target.value) || 2 })}
                            />
                            <p className="text-sm text-gray-500">Thời gian tối thiểu cần đặt trước</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cancellationHours">Hủy trước (giờ)</Label>
                            <Input
                                id="cancellationHours"
                                type="number"
                                value={settings.cancellationHours}
                                onChange={(e) => updateSettings({ cancellationHours: parseInt(e.target.value) || 24 })}
                            />
                            <p className="text-sm text-gray-500">Thời gian tối thiểu để hủy booking miễn phí</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defaultBookingDuration">Thời lượng mặc định (phút)</Label>
                            <Input
                                id="defaultBookingDuration"
                                type="number"
                                value={settings.defaultBookingDuration}
                                onChange={(e) => updateSettings({ defaultBookingDuration: parseInt(e.target.value) || 90 })}
                            />
                            <p className="text-sm text-gray-500">Thời lượng booking mặc định</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="depositPercentage">Phần trăm đặt cọc (%)</Label>
                            <Input
                                id="depositPercentage"
                                type="number"
                                min="0"
                                max="100"
                                value={settings.depositPercentage}
                                onChange={(e) => updateSettings({ depositPercentage: parseInt(e.target.value) || 30 })}
                            />
                            <p className="text-sm text-gray-500">Tỷ lệ phần trăm cần đặt cọc khi booking</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="autoApproval">Tự động duyệt</Label>
                                <p className="text-sm text-gray-500">Tự động duyệt booking mà không cần xác nhận</p>
                            </div>
                            <Switch
                                id="autoApproval"
                                checked={settings.autoApproval}
                                onCheckedChange={(checked) => updateSettings({ autoApproval: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="requireDeposit">Yêu cầu đặt cọc</Label>
                                <p className="text-sm text-gray-500">Bắt buộc khách hàng đặt cọc khi booking</p>
                            </div>
                            <Switch
                                id="requireDeposit"
                                checked={settings.requireDeposit}
                                onCheckedChange={(checked) => updateSettings({ requireDeposit: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="overbookingAllowed">Cho phép overbooking</Label>
                                <p className="text-sm text-gray-500">Cho phép đặt quá số lượng sân có sẵn</p>
                            </div>
                            <Switch
                                id="overbookingAllowed"
                                checked={settings.overbookingAllowed}
                                onCheckedChange={(checked) => updateSettings({ overbookingAllowed: checked })}
                            />
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