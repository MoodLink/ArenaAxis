"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    TrendingUp
} from "lucide-react"
import { User } from "@/types"

interface ProfileStatsProps {
    user: User
}

export default function ProfileStats({ user }: ProfileStatsProps) {
    const stats = []

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Thống kê
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {stats.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Không có thống kê nào</p>
                ) : (
                    stats.map((stat, index) => {
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
                    })
                )}
            </CardContent>
        </Card>
    )
}