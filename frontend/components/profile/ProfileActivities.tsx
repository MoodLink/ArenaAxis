"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Calendar,
    Trophy,
    Star,
    MessageSquare,
    Activity
} from "lucide-react"
import { profileActivities } from "@/data/mockData"

export default function ProfileActivities() {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const getActivityIcon = (iconName: string) => {
        switch (iconName) {
            case "calendar": return Calendar
            case "trophy": return Trophy
            case "star": return Star
            case "users": return MessageSquare
            default: return Activity
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {profileActivities.map((activity) => {
                        const Icon = getActivityIcon(activity.icon)

                        return (
                            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                    <p className="text-gray-600 text-sm">{activity.description}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {formatDate(activity.date)}
                                    </p>
                                </div>
                                {activity.status && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === "completed" ? "bg-green-100 text-green-800" :
                                            activity.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-red-100 text-red-800"
                                        }`}>
                                        {activity.status === "completed" ? "Hoàn thành" :
                                            activity.status === "pending" ? "Đang chờ" : "Đã hủy"}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}