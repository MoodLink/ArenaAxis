// Component hiển thị thông tin header của trang tournaments
// Bao gồm tiêu đề, mô tả và có thể thêm stats tổng quan

interface TournamentsHeaderProps {
    title?: string // Tiêu đề trang (optional)
    description?: string // Mô tả (optional)
    totalTournaments?: number // Tổng số giải đấu (optional)
    ongoingTournaments?: number // Số giải đang diễn ra (optional)
    upcomingTournaments?: number // Số giải sắp tới (optional)
}

export default function TournamentsHeader({
    title = "Giải đấu",
    description = "Tham gia các giải đấu thể thao hấp dẫn",
    totalTournaments,
    ongoingTournaments,
    upcomingTournaments
}: TournamentsHeaderProps) {
    return (
        <div className="text-center mb-12">
            {/* Tiêu đề chính */}
            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            {/* Mô tả */}
            <p className="text-gray-600 text-lg mb-6">{description}</p>

            {/* Stats nếu có */}
            {(totalTournaments !== undefined || ongoingTournaments !== undefined || upcomingTournaments !== undefined) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    {/* Tổng số giải đấu */}
                    {totalTournaments !== undefined && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{totalTournaments}</div>
                            <div className="text-sm text-blue-700">Tổng giải đấu</div>
                        </div>
                    )}

                    {/* Giải đang diễn ra */}
                    {ongoingTournaments !== undefined && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{ongoingTournaments}</div>
                            <div className="text-sm text-green-700">Đang diễn ra</div>
                        </div>
                    )}

                    {/* Giải sắp tới */}
                    {upcomingTournaments !== undefined && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{upcomingTournaments}</div>
                            <div className="text-sm text-orange-700">Sắp diễn ra</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
