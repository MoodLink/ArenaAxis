import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, DollarSign, Clock, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getTournamentById } from "@/services/api"
import { Tournament } from "@/types"

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
    // Await params to fix NextJS warning
    const { id } = await params

    // Fetch tournament data from API service
    const tournament = await getTournamentById(id)

    // Fallback if tournament not found
    if (!tournament) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Giải đấu không tìm thấy</h1>
                    <Link href="/tournaments">
                        <Button>Quay lại danh sách giải đấu</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Helper function để lấy màu status dựa trên ngày
    const getStatusColor = () => {
        const currentDate = new Date()
        const startDate = new Date(tournament.startDate)
        const endDate = new Date(tournament.endDate)

        if (currentDate > endDate) {
            return "bg-gray-100 text-gray-800" // Completed
        } else if (currentDate >= startDate && currentDate <= endDate) {
            return "bg-blue-100 text-blue-800" // Ongoing
        } else if (tournament.currentTeams >= tournament.maxTeams) {
            return "bg-red-100 text-red-800" // Registration Closed
        } else {
            return "bg-green-100 text-green-800" // Open Registration
        }
    }

    // Helper function để lấy text status
    const getStatusText = () => {
        const currentDate = new Date()
        const startDate = new Date(tournament.startDate)
        const endDate = new Date(tournament.endDate)

        if (currentDate > endDate) {
            return "Đã kết thúc"
        } else if (currentDate >= startDate && currentDate <= endDate) {
            return "Đang diễn ra"
        } else if (tournament.currentTeams >= tournament.maxTeams) {
            return "Hết chỗ"
        } else {
            return "Đang mở đăng ký"
        }
    }

    // Helper function để format ngày
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch (error) {
            return dateString // Fallback to original string
        }
    }

    const canRegister = tournament.currentTeams < tournament.maxTeams && new Date() < new Date(tournament.startDate)
    const progressPercentage = (tournament.currentTeams / tournament.maxTeams) * 100

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/tournaments" className="text-gray-600 hover:text-green-600">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="text-sm text-gray-600">
                            <Link href="/" className="hover:text-green-600">Trang chủ</Link> &gt;
                            <Link href="/tournaments" className="hover:text-green-600"> Giải đấu</Link> &gt;
                            <span> Chi tiết giải đấu</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tournament Hero */}
                        <Card className="mb-8">
                            <CardContent className="p-0">
                                <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                                    <img
                                        src={tournament.image || "/placeholder.svg"}
                                        alt={tournament.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                                            {getStatusText()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{tournament.name}</h1>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <div>
                                                <div className="text-xs text-gray-500">Ngày thi đấu</div>
                                                <div className="text-sm font-medium">{formatDate(tournament.startDate)}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <div>
                                                <div className="text-xs text-gray-500">Địa điểm</div>
                                                <div className="text-sm font-medium">{tournament.location}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Trophy className="w-4 h-4" />
                                            <div>
                                                <div className="text-xs text-gray-500">Giải thưởng</div>
                                                <div className="text-sm font-medium">₫{tournament.prizePool.toLocaleString('vi-VN')}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <div>
                                                <div className="text-xs text-gray-500">Đội tham gia</div>
                                                <div className="text-sm font-medium">{tournament.currentTeams}/{tournament.maxTeams}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Tiến độ đăng ký</span>
                                            <span>{Math.round(progressPercentage)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed">
                                        {tournament.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tournament Details */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Thông tin chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Môn thi đấu</h3>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        {tournament.sport}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Thời gian thi đấu</h3>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Từ {formatDate(tournament.startDate)} đến {formatDate(tournament.endDate)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Quy mô giải đấu</h3>
                                    <p className="text-gray-600">
                                        Giải đấu dành cho tối đa {tournament.maxTeams} đội tham gia,
                                        hiện tại đã có {tournament.currentTeams} đội đăng ký.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Giải thưởng</h3>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-lg font-bold text-green-600">
                                            ₫{tournament.prizePool.toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tổng giải thưởng sẽ được chia cho các đội đoạt giải
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Thể lệ thi đấu</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Mỗi đội tối đa 11 cầu thủ (bao gồm thủ môn)</li>
                                        <li>• Thi đấu theo thể thức vòng tròn và loại trực tiếp</li>
                                        <li>• Thời gian thi đấu: 2 hiệp, mỗi hiệp 30 phút</li>
                                        <li>• Các đội cần có đồng phục riêng</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Đăng ký tham gia</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        ₫{tournament.prizePool.toLocaleString('vi-VN')}
                                    </div>
                                    <p className="text-sm text-gray-600">Tổng giải thưởng</p>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Đội đã đăng ký:</span>
                                        <span className="font-medium">{tournament.currentTeams}/{tournament.maxTeams}</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-600">Còn lại:</span>
                                        <span className="font-medium text-green-600">
                                            {tournament.maxTeams - tournament.currentTeams} chỗ
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {canRegister ? (
                                        <Link href={`/tournaments/register/${tournament.id}`}>
                                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                                Đăng ký ngay
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="w-full">
                                            {tournament.currentTeams >= tournament.maxTeams ? "Đã hết chỗ" : "Đã kết thúc đăng ký"}
                                        </Button>
                                    )}

                                    <Button variant="outline" className="w-full">
                                        Chia sẻ giải đấu
                                    </Button>
                                </div>

                                <div className="border-t pt-4 text-xs text-gray-500">
                                    <p>Bằng cách đăng ký, bạn đồng ý với các điều khoản và điều kiện của giải đấu.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tournament Stats */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Thống kê</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Môn thể thao:</span>
                                    <span className="font-medium">{tournament.sport}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Địa điểm:</span>
                                    <span className="font-medium">{tournament.location}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày bắt đầu:</span>
                                    <span className="font-medium">{formatDate(tournament.startDate)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày kết thúc:</span>
                                    <span className="font-medium">{formatDate(tournament.endDate)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
