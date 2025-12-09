import { StoreAdminDetailResponse } from "@/types"
import OwnerStoreCard from "./OwnerStoreCard"
import OwnerStoreListItem from "./OwnerStoreListItem"

interface StoresContentProps {
    stores: StoreAdminDetailResponse[]
    viewMode: "grid" | "list"
}

export default function OwnerStoresContent({ stores, viewMode }: StoresContentProps) {
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
                        Chưa có Trung tâm thể thao nào
                    </h3>
                    <p className="text-gray-600">
                        Tạo Trung tâm thể thao mới để bắt đầu kinh doanh
                    </p>
                </div>
            </div>
        )
    }

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stores.map((store) => (
                    <OwnerStoreCard key={store.id} store={store} />
                ))}
            </div>
        )
    }

    // List view
    return (
        <div className="space-y-4">
            {stores.map((store) => (
                <OwnerStoreListItem key={store.id} store={store} />
            ))}
        </div>
    )
}
