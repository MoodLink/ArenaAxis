// Component hiển thị các môn thể thao với carousel
// Hiển thị 5 môn thể thao và có thể slide qua các môn khác

import Link from "next/link"
import SportCard from "@/components/common/SportCard"
import HomeCarousel from "@/components/home/HomeCarousel"
import { Sport } from "@/types"

interface SportsCategoriesSectionProps {
    sports: Sport[] // Danh sách môn thể thao được truyền từ parent
}

export default function SportsCategoriesSection({ sports }: SportsCategoriesSectionProps) {
    // Gán cứng image cho từng sport nếu chưa có
    // Map theo id chuẩn hóa từ database
    const sportImages: Record<string, string> = {
        football: "/football-soccer-ball.png",
        basketball: "/outdoor-basketball-court.png",
        tennis: "/outdoor-tennis-court.png",
        volleyball: "/volleyball-court.png",
        badminton: "/badminton-court.png",
        pickleball: "/lush-golf-course.png",      // <-- mới
        pingpong: "/professional-football-field.png",
        swimming: "/swimming-pool.png",

    };
    const displaySports = sports.map(sport => ({
        ...sport,
        image: sport.image || sportImages[sport.id] || "/placeholder.svg"
    }));

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header với tiêu đề */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Thể loại</h2>
                </div>

                {/* Carousel hiển thị các môn thể thao */}
                {displaySports.length > 0 ? (
                    <HomeCarousel
                        itemsToShow={4}
                        showNavigation={displaySports.length > 4}
                        className="px-4"
                    >
                        {displaySports.map((sport) => (
                            <SportCard
                                key={sport.id}
                                sport={sport}
                            />
                        ))}
                    </HomeCarousel>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-gray-400">⚽</span>
                        </div>
                        <p className="text-gray-500 text-lg">Không có môn thể thao nào để hiển thị</p>
                    </div>
                )}
            </div>
        </section>
    )
}
