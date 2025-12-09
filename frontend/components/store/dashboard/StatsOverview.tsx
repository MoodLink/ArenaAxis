"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, Star } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    color?: 'blue' | 'green' | 'orange' | 'purple'
}

interface StatsOverviewProps {
    storeCount?: number
}

function StatCard({ title, value, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default function StatsOverview({ storeCount = 0 }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Doanh thu tháng 11"
                value="25.000.000đ"
            />
            <StatCard
                title="Tổng số Trung tâm thể thao"
                value={storeCount.toString()}
            />
            <StatCard
                title="Tổng số lượt xem Trung tâm thể thao"
                value="1.520"

            />
            <StatCard
                title="Đánh giá trung bình"
                value="4.7"

            />
        </div>
    )
}