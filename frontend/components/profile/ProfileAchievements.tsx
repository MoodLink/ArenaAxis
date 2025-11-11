"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Star, Shield } from "lucide-react"
import { userAchievements } from "@/data/mockData"

export default function ProfileAchievements() {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {userAchievements.map((achievement) => (
                <Card key={achievement.id} className={`relative overflow-hidden ${achievement.progress >= achievement.maxProgress ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${achievement.progress >= achievement.maxProgress
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                <Award className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">
                                    {achievement.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {achievement.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Tiến độ</span>
                                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${achievement.progress >= achievement.maxProgress
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {achievement.unlockedAt && (
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                        <Shield className="w-3 h-3" />
                                        <span>Mở khóa ngày {formatDate(achievement.unlockedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {achievement.progress >= achievement.maxProgress && (
                            <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}