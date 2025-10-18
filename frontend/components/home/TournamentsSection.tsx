// Component hiển thị các giải đấu với carousel
// Hiển thị 4 giải đấu và có thể slide qua các giải khác

import Link from "next/link"
import TournamentCard from "@/components/common/TournamentCard"
import HomeCarousel from "@/components/home/HomeCarousel"
import { Tournament } from "@/types"

interface TournamentsSectionProps {
    tournaments: Tournament[] // Danh sách giải đấu được truyền từ parent
}

export default function TournamentsSection({ tournaments }: TournamentsSectionProps) {
    // Hiển thị tối đa 8 giải đấu để slide
    const displayTournaments = tournaments.slice(0, 8)

    return (
        <section className="py-16 container mx-auto px-4">
            {/* Header với tiêu đề và link xem tất cả */}
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold">Giải đấu</h2>

            </div>

            {/* Carousel hiển thị các giải đấu */}
            {displayTournaments.length > 0 ? (
                <HomeCarousel
                    itemsToShow={4}
                    showNavigation={displayTournaments.length > 4}
                    className="px-4"
                >
                    {displayTournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.id} // Dùng ID làm key
                            tournament={tournament} // Truyền thông tin giải đấu
                        />
                    ))}
                </HomeCarousel>
            ) : (
                /* Hiển thị message nếu không có giải đấu nào */
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">🏆</span>
                    </div>
                    <p className="text-gray-500 text-lg">Không có giải đấu nào đang diễn ra</p>
                </div>
            )}
        </section>
    )
}
