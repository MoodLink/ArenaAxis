"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
    Shield,
    Key,
    Server,
    Save,
    RefreshCw,
    Plus,
    X
} from 'lucide-react'
import { SecuritySettings } from '@/data/mockDataAdmin'

interface SecuritySettingsProps {
    settings: SecuritySettings;
    onSettingsChange: (settings: SecuritySettings) => void;
    onSave: () => void;
    onReset: () => void;
}

export default function SecuritySettingsComponent({ settings, onSettingsChange, onSave, onReset }: SecuritySettingsProps) {
    const [newIp, setNewIp] = useState('')

    const updateSettings = (updates: Partial<SecuritySettings>) => {
        onSettingsChange({ ...settings, ...updates })
    }

    const addIpToWhitelist = () => {
        if (newIp && !settings.adminIpWhitelist.includes(newIp)) {
            updateSettings({
                adminIpWhitelist: [...settings.adminIpWhitelist, newIp]
            })
            setNewIp('')
        }
    }

    const removeIpFromWhitelist = (ip: string) => {
        updateSettings({
            adminIpWhitelist: settings.adminIpWhitelist.filter(item => item !== ip)
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Xác thực và bảo mật</span>
                    </CardTitle>
                    <CardDescription>
                        Cấu hình các tùy chọn bảo mật cho hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="twoFactorAuth">Xác thực hai yếu tố</Label>
                            <p className="text-sm text-gray-500">Bật xác thực 2FA cho admin</p>
                        </div>
                        <Switch
                            id="twoFactorAuth"
                            checked={settings.twoFactorAuth}
                            onCheckedChange={(checked) => updateSettings({ twoFactorAuth: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="auditLog">Nhật ký kiểm toán</Label>
                            <p className="text-sm text-gray-500">Ghi lại tất cả hoạt động trong hệ thống</p>
                        </div>
                        <Switch
                            id="auditLog"
                            checked={settings.enableAuditLog}
                            onCheckedChange={(checked) => updateSettings({ enableAuditLog: checked })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="sessionTimeout">Timeout session (phút)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => updateSettings({ sessionTimeout: parseInt(e.target.value) || 30 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</Label>
                            <Input
                                id="passwordMinLength"
                                type="number"
                                value={settings.passwordMinLength}
                                onChange={(e) => updateSettings({ passwordMinLength: parseInt(e.target.value) || 8 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                            <Input
                                id="maxLoginAttempts"
                                type="number"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => updateSettings({ maxLoginAttempts: parseInt(e.target.value) || 5 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lockoutDuration">Thời gian khóa (phút)</Label>
                            <Input
                                id="lockoutDuration"
                                type="number"
                                value={settings.lockoutDuration}
                                onChange={(e) => updateSettings({ lockoutDuration: parseInt(e.target.value) || 15 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apiRateLimit">API Rate limit (requests/hour)</Label>
                            <Input
                                id="apiRateLimit"
                                type="number"
                                value={settings.apiRateLimit}
                                onChange={(e) => updateSettings({ apiRateLimit: parseInt(e.target.value) || 1000 })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Server className="h-5 w-5" />
                        <span>IP Whitelist Admin</span>
                    </CardTitle>
                    <CardDescription>
                        Chỉ cho phép admin đăng nhập từ các IP này
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="192.168.1.100"
                            value={newIp}
                            onChange={(e) => setNewIp(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addIpToWhitelist()
                                }
                            }}
                        />
                        <Button onClick={addIpToWhitelist}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {settings.adminIpWhitelist.map((ip, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                <span>{ip}</span>
                                <button
                                    onClick={() => removeIpFromWhitelist(ip)}
                                    className="ml-1 hover:text-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    {settings.adminIpWhitelist.length === 0 && (
                        <p className="text-sm text-gray-500">Chưa có IP nào trong whitelist</p>
                    )}

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