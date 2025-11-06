"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, Star } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    color?: 'blue' | 'green' | 'orange' | 'purple'
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

export default function StatsOverview() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Doanh thu tháng"
                value="25.000.000đ"
            />
            <StatCard
                title="Tổng số Store"
                value="5"
            />
            <StatCard
                title="Tổng số View"
                value="1.520"

            />
            <StatCard
                title="Rating Trung Bình"
                value="4.7"

            />
        </div>
    )
}