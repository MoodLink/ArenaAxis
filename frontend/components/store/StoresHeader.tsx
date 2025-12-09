// Component hiển thị header cho trang stores
import { Store, Users, Award } from "lucide-react"

interface StoresHeaderProps {
    totalStores: number
}

export default function StoresHeader({ totalStores }: StoresHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Content */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold">Khám phá Trung tâm thể thao</h1>
                                <p className="text-blue-100 text-lg mt-1">
                                    Tìm kiếm Trung tâm thể thao thể thao chất lượng cao gần bạn
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="bg-white/20 px-3 py-2 rounded-full">
                                <span>{totalStores} Trung tâm thể thao có sẵn</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <Users className="w-4 h-4" />
                                <span>1000+ người dùng</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <Award className="w-4 h-4" />
                                <span>Chất lượng đảm bảo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
