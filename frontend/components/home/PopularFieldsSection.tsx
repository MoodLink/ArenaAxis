// Component hiển thị danh sách sân phổ biến với carousel
// Hiển thị 4 sân đầu và có thể slide qua các sân khác

import Link from "next/link"
import FieldCard from "@/components/common/FieldCard"
import HomeCarousel from "@/components/home/HomeCarousel"
import { Field } from "@/types"

interface PopularFieldsSectionProps {
    fields: Field[] // Danh sách sân được truyền từ parent component
}

export default function PopularFieldsSection({ fields }: PopularFieldsSectionProps) {
    // Chỉ hiển thị tối đa 8 sân để slide
    const displayFields = fields.slice(0, 8)

    return (
        <section className="py-16 container mx-auto px-4">
            {/* Header với tiêu đề và link "Xem tất cả" */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Các sân phổ biến</h2>

              
            </div>

            {/* Carousel hiển thị các sân */}
            {displayFields.length > 0 ? (
                <HomeCarousel
                    itemsToShow={4}
                    showNavigation={displayFields.length > 4}
                    className="px-4"
                >
                    {displayFields.map((field) => (
                        <FieldCard
                            key={field.id} // Key unique cho React
                            field={field} // Truyền thông tin sân vào component con
                        />
                    ))}
                </HomeCarousel>
            ) : (
                /* Hiển thị message nếu không có sân nào */
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">🏟️</span>
                    </div>
                    <p className="text-gray-500 text-lg">Không có sân phổ biến nào để hiển thị</p>
                </div>
            )}
        </section>
    )
}
