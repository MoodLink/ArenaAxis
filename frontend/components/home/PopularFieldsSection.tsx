// Component hiển thị danh sách sân phổ biến với carousel
// Hiển thị 4 sân đầu và có thể slide qua các sân khác
// Hoặc hiển thị các Trung tâm thể thao gần vị trí người dùng nếu được chỉ định

"use client"

import { useEffect, useState } from "react"
import { StoreCard } from "@/components/store/StoreCard"
import HomeCarousel from "@/components/home/HomeCarousel"
import { StoreSearchItemResponse } from "@/types"

interface PopularFieldsSectionProps {
    fields?: StoreSearchItemResponse[] // Danh sách Trung tâm thể thao từ prop
    showNearby?: boolean // Nếu true, sẽ hiển thị nhãn "Trung tâm thể thao gần đây"
    nearbyDistance?: number // Khoảng cách tìm kiếm (meters), mặc định 10km
}

export default function PopularFieldsSection({
    fields = [],
    showNearby = false,
    nearbyDistance = 10000
}: PopularFieldsSectionProps) {
    const [displayItems, setDisplayItems] = useState<StoreSearchItemResponse[]>([])

    useEffect(() => {
        // Lấy tối đa 8 items để hiển thị
        setDisplayItems(fields.slice(0, 8))
    }, [fields])

    // Xác định tiêu đề và message
    const title = showNearby ? "Trung tâm thể thao gần đây" : "Các sân phổ biến"
    const emptyMessage = showNearby ? "Không tìm thấy Trung tâm thể thao gần bạn" : "Không có sân phổ biến nào để hiển thị"

    return (
        <section className="py-16 container mx-auto px-4">
            {/* Header với tiêu đề */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{title}</h2>
            </div>

            {/* Carousel hiển thị các sân/Trung tâm thể thao */}
            {displayItems.length > 0 ? (
                <HomeCarousel
                    itemsToShow={4}
                    showNavigation={displayItems.length > 4}
                    className="px-4"
                >
                    {displayItems.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                        />
                    ))}
                </HomeCarousel>
            ) : (
                /* Hiển thị message nếu không có item nào */
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">🏟️</span>
                    </div>
                    <p className="text-gray-500 text-lg">{emptyMessage}</p>
                </div>
            )}
        </section>
    )
}
