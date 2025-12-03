// Component hiển thị stores theo grid hoặc list
'use client';

import { StoreSearchItemResponse } from "@/types"
import { StoreCard } from "./StoreCard"
import StoreListItem from "./StoreListItem"
import { useFavourites, isFavouriteStore } from "@/hooks/use-favourites"

interface StoresContentProps {
    stores: StoreSearchItemResponse[]
    viewMode: "grid" | "list"
    selectedSportId?: string
}

export default function StoresContent({ stores, viewMode, selectedSportId }: StoresContentProps) {
    // Fetch favourites once for all store cards
    const { data: favourites = [] } = useFavourites()
    if (stores.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Không tìm thấy Trung tâm thể thao
                    </h3>
                    <p className="text-gray-600">
                        Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                </div>
            </div>
        )
    }

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {stores.map((store) => (
                    <StoreCard
                        key={store.id}
                        store={store}
                        selectedSportId={selectedSportId}
                        isFav={isFavouriteStore(store.id, favourites)}
                    />
                ))}
            </div>
        )
    }

    // List view
    return (
        <div className="space-y-4 mb-8">
            {stores.map((store) => (
                <StoreListItem key={store.id} store={store} />
            ))}
        </div>
    )
}
