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
    // Hiển thị tất cả sports nếu có
    const displaySports = sports

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
                        itemsToShow={5}
                        showNavigation={displaySports.length > 5}
                        className="px-4"
                    >
                        {displaySports.map((sport) => (
                            <SportCard
                                key={sport.id} // Dùng sport.id làm key
                                sport={sport} // Truyền thông tin môn thể thao
                            />
                        ))}
                    </HomeCarousel>
                ) : (
                    /* Hiển thị message nếu không có môn thể thao nào */
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
