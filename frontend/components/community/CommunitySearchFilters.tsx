// Component bộ lọc tìm kiếm cho trang cộng đồng
// Cho phép tìm kiếm theo từ khóa, môn thể thao và khoảng cách

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, MapPin, Trophy, Clock, X } from "lucide-react"

interface CommunitySearchFiltersProps {
    searchQuery: string // Từ khóa tìm kiếm hiện tại
    selectedSport: string // Môn thể thao được chọn
    selectedDistance: string // Khoảng cách được chọn
    onSearchQueryChange: (query: string) => void // Callback khi thay đổi từ khóa
    onSportChange: (sport: string) => void // Callback khi thay đổi môn thể thao
    onDistanceChange: (distance: string) => void // Callback khi thay đổi khoảng cách
}

export default function CommunitySearchFilters({
    searchQuery,
    selectedSport,
    selectedDistance,
    onSearchQueryChange,
    onSportChange,
    onDistanceChange
}: CommunitySearchFiltersProps) {
    // Danh sách các môn thể thao có sẵn với emoji
    const sports = [
        { value: "Tất cả", label: "🏆 Tất cả", color: "gray" },
        { value: "Tennis", label: "🎾 Tennis", color: "blue" },
        { value: "Bóng đá", label: "⚽ Bóng đá", color: "green" },
        { value: "Cầu lông", label: "🏸 Cầu lông", color: "purple" },
        { value: "Bóng rổ", label: "🏀 Bóng rổ", color: "orange" },
        { value: "Bơi lội", label: "🏊‍♂️ Bơi lội", color: "cyan" },
        { value: "Chạy bộ", label: "🏃‍♂️ Chạy bộ", color: "red" }
    ]

    // Danh sách các khoảng cách có sẵn
    const distances = [
        { value: "Tất cả", label: "📍 Mọi khoảng cách" },
        { value: "< 1km", label: "📍 Dưới 1km" },
        { value: "1-5km", label: "📍 1-5km" },
        { value: "5-10km", label: "📍 5-10km" },
        { value: "> 10km", label: "📍 Trên 10km" }
    ]

    const activeFiltersCount = [
        searchQuery.trim() && "Từ khóa",
        selectedSport !== "Tất cả" && selectedSport,
        selectedDistance !== "Tất cả" && selectedDistance
    ].filter(Boolean).length

    const clearAllFilters = () => {
        onSearchQueryChange("")
        onSportChange("Tất cả")
        onDistanceChange("Tất cả")
    }

    return (
        <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Main search bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Tìm kiếm theo tên hoạt động, môn thể thao, địa điểm..."
                            value={searchQuery}
                            onChange={(e) => onSearchQueryChange(e.target.value)}
                            className="pl-12 pr-4 h-12 text-base border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchQueryChange("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Quick filter chips */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Bộ lọc nhanh
                            </h4>
                            {activeFiltersCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-700">
                                        {activeFiltersCount} bộ lọc
                                    </Badge>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sport chips */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">Môn thể thao:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sports.map((sport) => (
                                    <button
                                        key={sport.value}
                                        onClick={() => onSportChange(sport.value)}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${selectedSport === sport.value
                                                ? "bg-green-100 text-green-700 border-green-300 font-medium"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                            }`}
                                    >
                                        {sport.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Distance chips */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-gray-700">Khoảng cách:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {distances.map((distance) => (
                                    <button
                                        key={distance.value}
                                        onClick={() => onDistanceChange(distance.value)}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${selectedDistance === distance.value
                                                ? "bg-blue-100 text-blue-700 border-blue-300 font-medium"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                            }`}
                                    >
                                        {distance.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active filters summary */}
                    {activeFiltersCount > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Đang lọc:</span>
                                <div className="flex flex-wrap gap-2">
                                    {searchQuery && (
                                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                                            "{searchQuery}"
                                        </Badge>
                                    )}
                                    {selectedSport !== "Tất cả" && (
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                            {selectedSport}
                                        </Badge>
                                    )}
                                    {selectedDistance !== "Tất cả" && (
                                        <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                                            {selectedDistance}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
