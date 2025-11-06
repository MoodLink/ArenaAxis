// Component hiển thị thống kê cho stores
import { Store, Star, Eye, ShoppingCart } from "lucide-react"
import { StoreSearchItemResponse } from "@/types"

interface StoresStatsProps {
    stores: StoreSearchItemResponse[]
}

export default function StoresStats({ stores }: StoresStatsProps) {
    const totalStores = stores.length
    const avgRating = stores.reduce((sum, store) => sum + (store.averageRating || 0), 0) / totalStores
    const totalViews = stores.reduce((sum, store) => sum + (store.viewCount || 0), 0)
    const totalOrders = stores.reduce((sum, store) => sum + (store.orderCount || 0), 0)

    const stats = [
        {
            icon: Store,
            label: "Tổng cửa hàng",
            value: totalStores,
            color: "bg-blue-500",
            iconColor: "text-blue-500"
        },
        {
            icon: Star,
            label: "Đánh giá TB",
            value: avgRating.toFixed(1),
            color: "bg-yellow-500",
            iconColor: "text-yellow-500"
        },
        {
            icon: Eye,
            label: "Lượt xem",
            value: totalViews.toLocaleString(),
            color: "bg-purple-500",
            iconColor: "text-purple-500"
        },
        {
            icon: ShoppingCart,
            label: "Đơn hàng",
            value: totalOrders.toLocaleString(),
            color: "bg-green-500",
            iconColor: "text-green-500"
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`w-10 h-10 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                )
            })}
        </div>
    )
}
