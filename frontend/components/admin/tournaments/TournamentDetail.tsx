// Tournament Detail View Component
// Hiển thị chi tiết giải đấu

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Users, Trophy, Phone, Mail, DollarSign, Clock } from "lucide-react"
import { AdminTournament } from "@/data/mockDataAdmin"

interface TournamentDetailProps {
    tournament: AdminTournament
}

export default function TournamentDetail({ tournament }: TournamentDetailProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <Badge className="bg-blue-100 text-blue-800">Sắp diễn ra</Badge>
            case 'ongoing':
                return <Badge className="bg-green-100 text-green-800">Đang diễn ra</Badge>
            case 'completed':
                return <Badge className="bg-gray-100 text-gray-800">Đã kết thúc</Badge>
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-4">
            {/* Tournament Image and Basic Info */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={tournament.image}
                                alt={tournament.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{tournament.name}</h3>
                                {getStatusBadge(tournament.status)}
                            </div>
                            <p className="text-gray-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {tournament.location}
                            </p>
                            <p className="text-gray-600 flex items-center">
                                <Trophy className="w-4 h-4 mr-1" />
                                {tournament.sport}
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-semibold text-green-600">
                                    {formatCurrency(tournament.prizePool)}
                                </span>
                                <span className="text-gray-500">Giải thưởng</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tournament Schedule & Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Lịch trình giải đấu</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">Thời gian thi đấu</p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">Hạn đăng ký</p>
                                    <p className="text-sm text-gray-600">{formatDate(tournament.registrationDeadline)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-gray-500 mr-3" />
                                <div>
                                    <p className="font-medium">Phí đăng ký</p>
                                    <p className="text-sm text-gray-600">{formatCurrency(tournament.registrationFee)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Thông tin tham gia</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số đội tham gia:</span>
                                <span className="font-medium">{tournament.currentTeams}/{tournament.maxTeams}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số người tham gia:</span>
                                <span className="font-medium">{tournament.participants}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(tournament.currentTeams / tournament.maxTeams) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                {Math.round((tournament.currentTeams / tournament.maxTeams) * 100)}% đã đăng ký
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Organizer Info */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Thông tin ban tổ chức</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <p className="font-medium">{tournament.organizerName}</p>
                                <p className="text-sm text-gray-600">Ban tổ chức</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <p className="font-medium">{tournament.organizerPhone}</p>
                                <p className="text-sm text-gray-600">Số điện thoại</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <p className="font-medium">{tournament.organizerEmail}</p>
                                <p className="text-sm text-gray-600">Email</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tournament Stats */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h4 className="font-semibold text-gray-900">Thống kê</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{tournament.currentTeams}</p>
                            <p className="text-sm text-gray-600">Đội đã đăng ký</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{tournament.participants}</p>
                            <p className="text-sm text-gray-600">Người tham gia</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{formatCurrency(tournament.prizePool)}</p>
                            <p className="text-sm text-gray-600">Tổng giải thưởng</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            {tournament.description && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900">Mô tả giải đấu</h4>
                        <p className="text-gray-600 leading-relaxed">{tournament.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Creation Info */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Ngày tạo: {formatDate(tournament.createdAt)}</span>
                        <span>ID: {tournament.id}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}