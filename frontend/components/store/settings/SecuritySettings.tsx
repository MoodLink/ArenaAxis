"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Key,
    Shield,
    Globe,
    Smartphone,
    Save,
    RefreshCw
} from 'lucide-react'

export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Key className="h-5 w-5" />
                        <span>Đổi mật khẩu</span>
                    </CardTitle>
                    <CardDescription>Cập nhật mật khẩu để đảm bảo bảo mật tài khoản</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Cập nhật mật khẩu
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Bảo mật hai lớp</span>
                    </CardTitle>
                    <CardDescription>Tăng cường bảo mật với xác thực hai yếu tố</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Xác thực qua SMS</h4>
                            <p className="text-sm text-gray-500">Nhận mã xác thực qua tin nhắn</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-medium">Ứng dụng xác thực</h4>
                            <p className="text-sm text-gray-500">Sử dụng Google Authenticator hoặc tương tự</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>Phiên đăng nhập</span>
                    </CardTitle>
                    <CardDescription>Quản lý các phiên đăng nhập hiện tại</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-50 rounded-full">
                                    <Smartphone className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Chrome trên Windows</p>
                                    <p className="text-sm text-gray-500">IP: 192.168.1.100 • Hiện tại</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-300">Hoạt động</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-50 rounded-full">
                                    <Smartphone className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Safari trên iPhone</p>
                                    <p className="text-sm text-gray-500">IP: 192.168.1.101 • 2 giờ trước</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Đăng xuất</Button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Đăng xuất tất cả thiết bị khác
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}