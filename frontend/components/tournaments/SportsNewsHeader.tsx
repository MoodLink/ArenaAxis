"use client"

import { Newspaper, TrendingUp, Clock } from "lucide-react"

interface SportsNewsHeaderProps {
    totalNews: number
    todayNews: number
    trendingNews: number
}

export default function SportsNewsHeader({
    totalNews,
    todayNews,
    trendingNews
}: SportsNewsHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 p-3 rounded-lg">
                    <Newspaper className="text-white" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tin Tức Thể Thao
                    </h1>
                    <p className="text-gray-600">
                        Cập nhật tin tức thể thao mới nhất mỗi ngày
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Newspaper className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng tin tức</p>
                            <p className="text-2xl font-bold text-gray-800">{totalNews}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Clock className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tin hôm nay</p>
                            <p className="text-2xl font-bold text-gray-800">{todayNews}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tin nổi bật</p>
                            <p className="text-2xl font-bold text-gray-800">{trendingNews}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
