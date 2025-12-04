"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, DollarSign, Star } from 'lucide-react'

export default function QuickActions() {
    const actions = [
        {
            title: 'Thêm Store Mới',
            icon: Plus,
            href: '/store-registration'
        },
        {
            title: 'Xem lịch đặt',
            icon: Calendar,
            href: '/store/bookings'
        },
        {
            title: 'Báo cáo doanh thu',
            icon: DollarSign,
            href: '/store/revenue'
        },
        {
            title: 'Quản lý đánh giá',
            icon: Star,
            href: '/store/reviews'
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
                <CardDescription>Các chức năng thường dùng</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {actions.map((action) => (
                        <Button
                            key={action.title}
                            className="h-20 flex-col space-y-2"
                            variant="outline"
                            asChild
                        >
                            <a href={action.href}>
                                <action.icon className="h-6 w-6" />
                                <span className="text-sm">{action.title}</span>
                            </a>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}