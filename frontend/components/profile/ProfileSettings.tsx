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
                <CardContent className="space-y-3">
                    <div>
                        <Link href="/profile/edit">
                            <Button variant="outline" className="w-full justify-start h-12">
                                <Edit className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>Chỉnh sửa thông tin cá nhân</span>
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Button variant="outline" className="w-full justify-start h-12">
                            <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Đổi mật khẩu</span>
                        </Button>
                    </div>
                    <div>
                        <Button variant="outline" className="w-full justify-start h-12">
                            <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Cài đặt thông báo</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tùy chọn khác</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <Button variant="outline" className="w-full justify-start h-12">
                            <Bookmark className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Sân yêu thích</span>
                        </Button>
                    </div>
                    <div>
                        <Button variant="outline" className="w-full justify-start h-12">
                            <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Lịch sử hoạt động</span>
                        </Button>
                    </div>
                    <div>
                        <Button variant="outline" className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50">
                            <User className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Xóa tài khoản</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}