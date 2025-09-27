"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Edit,
    Shield,
    Bell,
    Bookmark,
    Activity,
    User
} from "lucide-react"
import Link from "next/link"

export default function ProfileSettings() {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Link href="/profile/edit">
                        <Button variant="outline" className="w-full justify-start">
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa thông tin cá nhân
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Cài đặt thông báo
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tùy chọn khác</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button variant="outline" className="w-full justify-start">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Sân yêu thích
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        Lịch sử hoạt động
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                        <User className="w-4 h-4 mr-2" />
                        Xóa tài khoản
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}