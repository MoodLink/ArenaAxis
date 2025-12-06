import { Store, ShoppingCart, Eye, Award } from "lucide-react"

interface OwnerStoresHeaderProps {
    totalStores: number
}

export default function OwnerStoresHeader({ totalStores }: OwnerStoresHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
            <div className="p-6">
                {/* Header Content */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold">Trung tâm thể thao của tôi</h1>
                                <p className="text-blue-100 text-lg mt-1">
                                    Quản lý và theo dõi các trung tâm thể thao của bạn
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="bg-white/20 px-3 py-2 rounded-full">
                                <span>{totalStores} trung tâm thể thao</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Quản lý đơn hàng</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <Eye className="w-4 h-4" />
                                <span>Theo dõi thống kê</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
