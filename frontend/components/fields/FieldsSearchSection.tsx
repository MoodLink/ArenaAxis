// Component section tìm kiếm và bộ lọc cho trang fields  
// Bao gồm search bar, advanced filters, quick filters, view mode toggle

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid3X3, List, X } from "lucide-react"
import { sports } from "@/data/mockData"

interface FilterState {
    sports: string[]
    priceRange: string
    location: string
    amenities: string[]
}

interface FieldsSearchSectionProps {
    searchValue: string
    onSearchChange: (value: string) => void
    viewMode: "grid" | "list"
    onViewModeChange: (mode: "grid" | "list") => void
    selectedFilters: FilterState
    onFiltersChange: (filters: FilterState) => void
    onFilterClick: () => void
    filteredCount: number
}

export default function FieldsSearchSection({
    searchValue,
    onSearchChange,
    viewMode,
    onViewModeChange,
    selectedFilters,
    onFiltersChange,
    onFilterClick,
    filteredCount
}: FieldsSearchSectionProps) {
    const quickSports = ["Bóng đá", "Tennis", "Bóng rổ", "Cầu lông", "Golf"]
    const priceRanges = [
        { value: "all", label: "Tất cả giá" },
        { value: "under-200k", label: "Dưới 200k" },
        { value: "200k-400k", label: "200k - 400k" },
        { value: "400k-600k", label: "400k - 600k" },
        { value: "over-600k", label: "Trên 600k" }
    ]
    const locations = [
        { value: "all", label: "Tất cả khu vực" },
        { value: "quận 1", label: "Quận 1" },
        { value: "quận 3", label: "Quận 3" },
        { value: "quận 7", label: "Quận 7" },
        { value: "bình thạnh", label: "Bình Thạnh" },
        { value: "thủ đức", label: "Thủ Đức" }
    ]

    const toggleQuickSport = (sport: string) => {
        const newSports = selectedFilters.sports.includes(sport)
            ? selectedFilters.sports.filter(s => s !== sport)
            : [...selectedFilters.sports, sport]
        onFiltersChange({
            ...selectedFilters,
            sports: newSports
        })
    }

    const handlePriceRangeChange = (value: string) => {
        onFiltersChange({
            ...selectedFilters,
            priceRange: value
        })
    }

    const handleLocationChange = (value: string) => {
        onFiltersChange({
            ...selectedFilters,
            location: value
        })
    }

    const clearFilters = () => {
        onFiltersChange({
            sports: [],
            priceRange: "all",
            location: "all",
            amenities: []
        })
    }

    const hasActiveFilters = selectedFilters.sports.length > 0 ||
        selectedFilters.priceRange !== "all" ||
        selectedFilters.location !== "all" ||
        selectedFilters.amenities.length > 0

    return (
        <Card className="mb-8 shadow-lg border-0 bg-white">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Tìm kiếm tên sân, địa điểm, môn thể thao..."
                                className="pl-12 h-12 text-base border-2 focus:border-emerald-500 rounded-xl"
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="h-12 px-6 border-2 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl whitespace-nowrap"
                            onClick={onFilterClick}
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Bộ lọc chi tiết
                        </Button>
                    </div>

                    {/* Advanced Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">Khoảng giá:</label>
                            <Select value={selectedFilters.priceRange} onValueChange={handlePriceRangeChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {priceRanges.map(range => (
                                        <SelectItem key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-2 block">Khu vực:</label>
                            <Select value={selectedFilters.location} onValueChange={handleLocationChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(location => (
                                        <SelectItem key={location.value} value={location.value}>
                                            {location.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Quick Sports Filter */}
                    <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-600 block">Môn thể thao phổ biến:</span>
                        <div className="flex flex-wrap gap-2">
                            {quickSports.map((sport) => (
                                <Button
                                    key={sport}
                                    variant="outline"
                                    size="sm"
                                    className={`rounded-full transition-all ${selectedFilters.sports.includes(sport)
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : "hover:bg-emerald-50 hover:border-emerald-300"
                                        }`}
                                    onClick={() => toggleQuickSport(sport)}
                                >
                                    {sport}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filter Badges */}
                    {hasActiveFilters && (
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-600 block">Bộ lọc đang áp dụng:</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedFilters.sports.map(sport => (
                                    <Badge key={sport} variant="secondary" className="bg-emerald-100 text-emerald-700">
                                        {sport}
                                        <X
                                            className="w-3 h-3 ml-1 cursor-pointer"
                                            onClick={() => toggleQuickSport(sport)}
                                        />
                                    </Badge>
                                ))}
                                {selectedFilters.priceRange !== "all" && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        {priceRanges.find(r => r.value === selectedFilters.priceRange)?.label}
                                        <X
                                            className="w-3 h-3 ml-1 cursor-pointer"
                                            onClick={() => handlePriceRangeChange("all")}
                                        />
                                    </Badge>
                                )}
                                {selectedFilters.location !== "all" && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                        {locations.find(l => l.value === selectedFilters.location)?.label}
                                        <X
                                            className="w-3 h-3 ml-1 cursor-pointer"
                                            onClick={() => handleLocationChange("all")}
                                        />
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results and View Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            {searchValue && (
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Tìm thấy <span className="font-bold text-emerald-600">{filteredCount}</span> kết quả cho "{searchValue}"
                                </p>
                            )}
                            {!searchValue && (
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Hiển thị <span className="font-bold text-emerald-600">{filteredCount}</span> sân thể thao
                                    {hasActiveFilters && " (đã lọc)"}
                                </p>
                            )}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onViewModeChange("grid")}
                                className={`rounded-md px-4 py-2 transition-all ${viewMode === "grid"
                                    ? "bg-white shadow-sm text-emerald-600 font-medium"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4 mr-2" />
                                Lưới
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onViewModeChange("list")}
                                className={`rounded-md px-4 py-2 transition-all ${viewMode === "list"
                                    ? "bg-white shadow-sm text-emerald-600 font-medium"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                <List className="w-4 h-4 mr-2" />
                                Danh sách
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
