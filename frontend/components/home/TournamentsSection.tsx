// Component hiển thị tin tức thể thao với carousel
// Hiển thị 4 tin tức và có thể slide qua các tin khác

import Link from "next/link"
import SportsNewsCard from "@/components/tournaments/SportsNewsCard"
import HomeCarousel from "@/components/home/HomeCarousel"
import { SportsNews } from "@/types"

interface TournamentsSectionProps {
    sportsNews: SportsNews[] // Danh sách tin tức thể thao được truyền từ parent
}

export default function TournamentsSection({ sportsNews }: TournamentsSectionProps) {
    // Hiển thị tối đa 8 tin tức để slide
    const displayNews = sportsNews.slice(0, 8)

    // Handler để mở link tin tức
    const handleReadMore = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="py-16 container mx-auto px-4">
            {/* Header với tiêu đề và link xem tất cả */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl font-bold">Tin Tức Thể Thao</h2>
                    <p className="text-gray-600 mt-2">Cập nhật tin tức thể thao mới nhất</p>
                </div>
                <Link
                    href="/tournaments"
                    className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                >
                    Xem tất cả
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>

            {/* Carousel hiển thị tin tức */}
            {displayNews.length > 0 ? (
                <HomeCarousel
                    itemsToShow={4}
                    showNavigation={displayNews.length > 4}
                    className="px-4"
                >
                    {displayNews.map((news) => (
                        <SportsNewsCard
                            key={news.id}
                            news={news}
                            onReadMore={handleReadMore}
                        />
                    ))}
                </HomeCarousel>
            ) : (
                /* Hiển thị message nếu không có tin tức nào */
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">📰</span>
                    </div>
                    <p className="text-gray-500 text-lg">Không có tin tức thể thao</p>
                </div>
            )}
        </section>
    )
}
