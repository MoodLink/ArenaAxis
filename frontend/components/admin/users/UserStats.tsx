// User Management Stats Component
// Hiển thị thống kê về người dùng

import { User } from "@/types"
import AdminStats from "../shared/AdminStats"
import { Users, UserCheck, UserX, Shield } from "lucide-react"

interface UserStatsProps {
    users: Array<User & { status: 'active' | 'inactive' | 'banned' }>
}

export default function UserStats({ users }: UserStatsProps) {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const inactiveUsers = users.filter(u => u.status === 'inactive').length
    const bannedUsers = users.filter(u => u.status === 'banned').length

    const stats = [
        {
            title: "Tổng người dùng",
            value: totalUsers,
            icon: Users,
            iconColor: "text-blue-600"
        },
        {
            title: "Đang hoạt động",
            value: activeUsers,
            icon: UserCheck,
            iconColor: "text-green-600"
        },
        {
            title: "Không hoạt động",
            value: inactiveUsers,
            icon: UserX,
            iconColor: "text-yellow-600"
        },
        {
            title: "Bị khóa",
            value: bannedUsers,
            icon: Shield,
            iconColor: "text-red-600"
        }
    ]

    return <AdminStats stats={stats} />
}