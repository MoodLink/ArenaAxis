"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Building2,
    Clock,
    Camera,
    Save
} from 'lucide-react'

interface StoreInfo {
    name: string
    description: string
    address: string
    phone: string
    email: string
    website: string
    avatar: string
    businessHours: {
        [key: string]: { open: string; close: string; closed: boolean }
    }
}

interface AccountSettingsProps {
    storeInfo: StoreInfo
}

export default function AccountSettings({ storeInfo }: AccountSettingsProps) {
    const [storeData, setStoreData] = useState(storeInfo)

    const handleSave = () => {
        console.log('Saving store information:', storeData)
        // Handle save logic
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Thông tin cơ sở</span>
                    </CardTitle>
                    <CardDescription>Cập nhật thông tin cơ bản của cơ sở thể thao</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={storeData.avatar} />
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                            <Button variant="outline" size="sm">
                                <Camera className="h-4 w-4 mr-2" />
                                Thay đổi ảnh
                            </Button>
                            <p className="text-sm text-gray-500 mt-1">Định dạng: JPG, PNG. Kích thước tối đa: 2MB</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="storeName">Tên cơ sở</Label>
                            <Input
                                id="storeName"
                                value={storeData.name}
                                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                value={storeData.phone}
                                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={storeData.email}
                                onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={storeData.website}
                                onChange={(e) => setStoreData({ ...storeData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Textarea
                            id="address"
                            value={storeData.address}
                            onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={storeData.description}
                            onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                    </Button>
                </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Giờ hoạt động</span>
                    </CardTitle>
                    <CardDescription>Thiết lập giờ mở cửa và đóng cửa cho từng ngày trong tuần</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(storeData.businessHours).map(([day, hours]) => {
                            const dayNames = {
                                monday: 'Thứ 2',
                                tuesday: 'Thứ 3',
                                wednesday: 'Thứ 4',
                                thursday: 'Thứ 5',
                                friday: 'Thứ 6',
                                saturday: 'Thứ 7',
                                sunday: 'Chủ nhật'
                            }

                            return (
                                <div key={day} className="flex items-center space-x-4">
                                    <div className="w-20 text-sm font-medium">
                                        {dayNames[day as keyof typeof dayNames]}
                                    </div>
                                    <Switch
                                        checked={!hours.closed}
                                        onCheckedChange={(checked) => {
                                            setStoreData({
                                                ...storeData,
                                                businessHours: {
                                                    ...storeData.businessHours,
                                                    [day]: { ...hours, closed: !checked }
                                                }
                                            })
                                        }}
                                    />
                                    {!hours.closed ? (
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="time"
                                                value={hours.open}
                                                onChange={(e) => {
                                                    setStoreData({
                                                        ...storeData,
                                                        businessHours: {
                                                            ...storeData.businessHours,
                                                            [day]: { ...hours, open: e.target.value }
                                                        }
                                                    })
                                                }}
                                                className="w-32"
                                            />
                                            <span className="text-gray-500">đến</span>
                                            <Input
                                                type="time"
                                                value={hours.close}
                                                onChange={(e) => {
                                                    setStoreData({
                                                        ...storeData,
                                                        businessHours: {
                                                            ...storeData.businessHours,
                                                            [day]: { ...hours, close: e.target.value }
                                                        }
                                                    })
                                                }}
                                                className="w-32"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Đóng cửa</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}