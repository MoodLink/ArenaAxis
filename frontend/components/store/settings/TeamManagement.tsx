"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Users,
    Plus,
    Settings as SettingsIcon,
    User,
    CheckCircle,
    XCircle
} from 'lucide-react'

interface TeamMember {
    id: number
    name: string
    email: string
    role: string
    avatar: string
    status: string
    permissions: string[]
}

interface TeamManagementProps {
    teamMembers: TeamMember[]
}

export default function TeamManagement({ teamMembers }: TeamManagementProps) {
    const [members, setMembers] = useState(teamMembers)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Quản lý nhân viên</span>
                            </CardTitle>
                            <CardDescription>Thêm, chỉnh sửa và phân quyền cho nhân viên</CardDescription>
                        </div>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm nhân viên
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{member.name}</h4>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant={member.role === 'Manager' ? 'default' : 'outline'}>
                                                {member.role}
                                            </Badge>
                                            <Badge variant={member.status === 'active' ? 'outline' : 'secondary'}
                                                className={member.status === 'active' ? 'text-green-600 border-green-300' : ''}>
                                                {member.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <SettingsIcon className="h-4 w-4 mr-2" />
                                        Phân quyền
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <User className="h-4 w-4 mr-2" />
                                        Chỉnh sửa
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Vai trò và quyền hạn</CardTitle>
                    <CardDescription>Định nghĩa các vai trò và quyền truy cập</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Manager</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Quản lý đặt sân
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Quản lý sân bãi
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Xem báo cáo
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Quản lý nhân viên
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Staff</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Quản lý đặt sân
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Xem báo cáo
                                </div>
                                <div className="flex items-center">
                                    <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                    Quản lý sân bãi
                                </div>
                                <div className="flex items-center">
                                    <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                    Quản lý nhân viên
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}