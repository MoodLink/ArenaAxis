// Component hiển thị danh sách người tham gia hoạt động
// Bao gồm thông tin chi tiết từng thành viên

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Users,
    Star,
    CheckCircle,
    MessageCircle
} from "lucide-react"
import { JoinedUser, CommunityPostDetail } from "@/data/mockData"

interface ParticipantsListProps {
    participants: string
    joinedUsers: JoinedUser[]
    hostInfo: CommunityPostDetail['hostInfo']
}

export default function ParticipantsList({
    participants,
    joinedUsers,
    hostInfo
}: ParticipantsListProps) {
    return (
        <Card className="shadow-lg border-0">
            <CardContent className="p-8">
                <h4 className="font-bold text-2xl mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                    </div>
                    Thành viên tham gia ({participants})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {joinedUsers.map((member, index) => (
                        <Card key={index} className="border-2 hover:border-green-300 transition-all duration-200 hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14 ring-2 ring-gray-200">
                                            <AvatarFallback className={`${member.isHost
                                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                                                    : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                                                } font-bold text-lg`}>
                                                {member.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-bold text-lg text-gray-900">{member.name}</h5>
                                                {member.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                                {member.isHost && (
                                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1">
                                                        👑 Host
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">
                                                Level: <span className="text-gray-800">{member.level}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="font-bold text-sm">{member.rating}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {member.activities} hoạt động
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{member.timeJoined}</span>
                                    <Button variant="outline" size="sm" className="px-4 py-2">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Nhắn tin
                                    </Button>
                                </div>

                                {member.isHost && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="font-bold text-green-600 text-lg">{hostInfo.totalActivities}</div>
                                                <div className="text-xs text-gray-500">Hoạt động</div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-yellow-600 text-lg">{hostInfo.rating}⭐</div>
                                                <div className="text-xs text-gray-500">Đánh giá</div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-blue-600 text-lg">{hostInfo.responseRate}</div>
                                                <div className="text-xs text-gray-500">Phản hồi</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {hostInfo.badges.map((badge, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border-green-200">
                                                    {badge}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}