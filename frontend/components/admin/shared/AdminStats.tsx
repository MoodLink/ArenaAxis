// Shared Admin Stats Cards Component
// Hiển thị thống kê với các card layout thống nhất

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCard {
    title: string
    value: string | number
    icon: LucideIcon
    iconColor: string
}

interface AdminStatsProps {
    stats: StatCard[]
}

export default function AdminStats({ stats }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}