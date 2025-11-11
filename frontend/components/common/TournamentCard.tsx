// Component hiển thị một giải đấu
// Có thể mở rộng để thêm thông tin chi tiết và đăng ký tham gia

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Tournament } from "@/types"

interface TournamentCardProps {
    tournament: Tournament // Props nhận thông tin giải đấu
    className?: string // CSS class tùy chỉnh (optional)
}

export default function TournamentCard({ tournament, className = "" }: TournamentCardProps) {
    return (
        <Link href="/tournaments" className="block">
            <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full ${className}`}>
                {/* Poster giải đấu với tỷ lệ 3:4 (portrait) */}
                <div className="aspect-[3/4] relative">
                    <img
                        src={tournament.image || "/placeholder.svg"} // Fallback image
                        alt={tournament.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay với thông tin giải đấu */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <h3 className="text-white font-semibold text-sm leading-tight truncate mb-1">
                            {tournament.name}
                        </h3>
                        {tournament.description && (
                            <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
                                {tournament.description}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    )
}
