// Component hiển thị thống kê cho Community
// Bao gồm số thành viên, hoạt động, môn thể thao

import { Users, MapPin, Award } from "lucide-react"

interface CommunityStatsProps {
    totalMembers?: string
    totalActivities?: string
    totalSports?: string
}

export default function CommunityStats({
    totalMembers = "12.5K+",
    totalActivities = "850+",
    totalSports = "45+"
}: CommunityStatsProps) {
    return (
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Cộng đồng thể thao <span className="text-yellow-300">ArenaAxis</span>
                    </h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Kết nối với những người cùng đam mê thể thao. Tham gia các hoạt động, tìm đối thủ, và xây dựng cộng đồng mạnh mẽ.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Users className="w-6 h-6 text-green-200" />
                            {totalMembers}
                        </div>
                        <div className="text-sm text-green-200">Thành viên</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                            <MapPin className="w-6 h-6 text-blue-200" />
                            {totalActivities}
                        </div>
                        <div className="text-sm text-green-200">Hoạt động</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Award className="w-6 h-6 text-purple-200" />
                            {totalSports}
                        </div>
                        <div className="text-sm text-green-200">Môn thể thao</div>
                    </div>
                </div>
            </div>
        </div>
    )
}