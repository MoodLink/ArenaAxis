"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Activity } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    change: string
    icon: any
    trend: 'up' | 'down'
}

function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                        <div className="flex items-center mt-2">
                            {trend === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {change}
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function StatsOverview() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Doanh thu tháng"
                value="25.000.000đ"
                change="+15.2%"
                icon={DollarSign}
                trend="up"
            />
            <StatCard
                title="Lượt đặt sân"
                value="150"
                change="+12.5%"
                icon={Calendar}
                trend="up"
            />
            <StatCard
                title="Khách hàng mới"
                value="23"
                change="+8.1%"
                icon={Users}
                trend="up"
            />
            <StatCard
                title="Tỷ lệ sử dụng"
                value="87.5%"
                change="-2.1%"
                icon={Activity}
                trend="down"
            />
        </div>
    )
}