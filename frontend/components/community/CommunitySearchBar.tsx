// Component search bar và filters cho Community
// Bao gồm search input, sort dropdown, sport filter, distance filter

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { CommunityFilterState } from "@/hooks/use-community-search-filter"

interface CommunitySearchBarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    selectedFilters: CommunityFilterState
    onFiltersChange: (filters: Partial<CommunityFilterState>) => void
    totalResults: number
    hasActiveFilters: boolean
}

export default function CommunitySearchBar({
    searchQuery,
    onSearchChange,
    selectedFilters,
    onFiltersChange,
    totalResults,
    hasActiveFilters
}: CommunitySearchBarProps) {
    const activeFiltersCount = [
        searchQuery,
        selectedFilters.sport !== "Tất cả" ? selectedFilters.sport : "",
        selectedFilters.distance !== "Tất cả" ? selectedFilters.distance : ""
    ].filter(Boolean).length

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Main search bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hoạt động thể thao..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Sort dropdown */}
                        <select
                            value={selectedFilters.sortBy}
                            onChange={(e) => onFiltersChange({ sortBy: e.target.value as "newest" | "popular" | "trending" })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="popular">Phổ biến</option>
                            <option value="trending">Xu hướng</option>
                        </select>

                        {/* Sport filter */}
                        <select
                            value={selectedFilters.sport}
                            onChange={(e) => onFiltersChange({ sport: e.target.value })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="Tất cả">Tất cả môn thể thao</option>
                            <option value="Tennis">🎾 Tennis</option>
                            <option value="Bóng đá">⚽ Bóng đá</option>
                            <option value="Cầu lông">🏸 Cầu lông</option>
                            <option value="Bóng rổ">🏀 Bóng rổ</option>
                            <option value="Bơi lội">🏊 Bơi lội</option>
                            <option value="Golf">⛳ Golf</option>
                            <option value="Bóng chuyền">🏐 Bóng chuyền</option>
                        </select>

                        {/* Distance filter */}
                        <select
                            value={selectedFilters.distance}
                            onChange={(e) => onFiltersChange({ distance: e.target.value })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="Tất cả">Mọi khoảng cách</option>
                            <option value="< 1km">📍 Dưới 1km</option>
                            <option value="1-5km">📍 1-5km</option>
                            <option value="5-10km">📍 5-10km</option>
                            <option value="> 10km">📍 Trên 10km</option>
                        </select>

                        {/* Active filters count */}
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <Filter className="w-3 h-3 mr-1" />
                                {activeFiltersCount} bộ lọc
                            </Badge>
                        )}
                    </div>

                    {/* Results summary */}
                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            {totalResults > 0 ? (
                                <>
                                    Tìm thấy <span className="font-semibold text-green-600">{totalResults}</span> hoạt động
                                    {searchQuery && ` cho "${searchQuery}"`}
                                    {hasActiveFilters && " (đã lọc)"}
                                </>
                            ) : (
                                "Không tìm thấy hoạt động phù hợp"
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}