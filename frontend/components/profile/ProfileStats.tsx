"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    TrendingUp,
    Calendar,
    Trophy,
    MessageSquare
} from "lucide-react"
import { User } from "@/types"

interface ProfileStatsProps {
    user: User
}

export default function ProfileStats({ user }: ProfileStatsProps) {
    const stats = [
        {
            label: "Lượt đặt sân",
            value: user.stats.totalBookings,
            icon: Calendar,
            color: "blue",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            valueColor: "text-blue-600"
        },
        {
            label: "Giải đấu",
            value: user.stats.totalTournaments,
            icon: Trophy,
            color: "purple",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            valueColor: "text-purple-600"
        },
        {
            label: "Bài viết",
            value: user.stats.totalPosts,
            icon: MessageSquare,
            color: "orange",
            bgColor: "bg-orange-50",
            iconColor: "text-orange-600",
            valueColor: "text-orange-600"
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Thống kê
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className={`flex items-center justify-between p-3 ${stat.bgColor} rounded-lg`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${stat.bgColor.replace('50', '100')} rounded-full flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}