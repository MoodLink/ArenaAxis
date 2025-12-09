// Component bộ lọc và tìm kiếm cho trang tournaments
// Bao gồm search bar, filter theo sport, status, prize range

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface TournamentFilters {
    search: string // Từ khóa tìm kiếm
    sport: string // Môn thể thao
    status: string // Trạng thái giải đấu
    prizeRange: string // Khoảng giải thưởng
}

interface TournamentsFiltersProps {
    filters: TournamentFilters // Filters hiện tại
    onFiltersChange: (filters: TournamentFilters) => void // Callback khi thay đổi filter
    onClearFilters?: () => void // Callback xóa tất cả filter
}

// Danh sách options cho filters
const sportOptions = [
    { value: "all", label: "Tất cả môn thể thao" },
    { value: "football", label: "Bóng đá" },
    { value: "basketball", label: "Bóng rổ" },
    { value: "tennis", label: "Tennis" },
    { value: "badminton", label: "Cầu lông" },
    { value: "volleyball", label: "Bóng chuyền" }
]

const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "open", label: "Đang mở đăng ký" },
    { value: "closed", label: "Đã đóng đăng ký" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" }
]

const prizeRangeOptions = [
    { value: "all", label: "Tất cả giải thưởng" },
    { value: "under-20m", label: "Dưới 20 triệu" },
    { value: "20m-50m", label: "20 - 50 triệu" },
    { value: "50m-100m", label: "50 - 100 triệu" },
    { value: "over-100m", label: "Trên 100 triệu" }
]

export default function TournamentsFilters({
    filters,
    onFiltersChange,
    onClearFilters
}: TournamentsFiltersProps) {
    // State quản lý việc hiển thị advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    // Kiểm tra có filter nào đang active không
    const hasActiveFilters = filters.search ||
        (filters.sport && filters.sport !== "all") ||
        (filters.status && filters.status !== "all") ||
        (filters.prizeRange && filters.prizeRange !== "all")

    // Xử lý thay đổi search
    const handleSearchChange = (value: string) => {
        onFiltersChange({
            ...filters,
            search: value
        })
    }

    // Xử lý thay đổi filter
    const handleFilterChange = (key: keyof TournamentFilters, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value
        })
    }

    // Xử lý xóa tất cả filters
    const handleClearAll = () => {
        onFiltersChange({
            search: "",
            sport: "all",
            status: "all",
            prizeRange: "all"
        })
        onClearFilters?.()
    }

    return (
        <div className="mb-8 space-y-4">
            {/* Search bar và toggle advanced filters */}
            <div className="flex gap-4">
                {/* Search input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm giải đấu..."
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* Toggle advanced filters */}
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                    {hasActiveFilters && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {[filters.sport !== "all", filters.status !== "all", filters.prizeRange !== "all"].filter(Boolean).length}
                        </span>
                    )}
                </Button>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Xóa bộ lọc
                    </Button>
                )}
            </div>

            {/* Advanced filters */}
            {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Filter theo môn thể thao */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Môn thể thao
                        </label>
                        <Select
                            value={filters.sport}
                            onValueChange={(value) => handleFilterChange("sport", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn môn thể thao" />
                            </SelectTrigger>
                            <SelectContent>
                                {sportOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter theo trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter theo giải thưởng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giải thưởng
                        </label>
                        <Select
                            value={filters.prizeRange}
                            onValueChange={(value) => handleFilterChange("prizeRange", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn khoảng giải thưởng" />
                            </SelectTrigger>
                            <SelectContent>
                                {prizeRangeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Hiển thị số kết quả nếu có filter */}
            {hasActiveFilters && (
                <div className="text-sm text-gray-600">
                    Đang lọc giải đấu
                    {filters.search && ` có từ khóa "${filters.search}"`}
                    {filters.sport !== "all" && ` thuộc môn ${sportOptions.find(s => s.value === filters.sport)?.label}`}
                    {filters.status !== "all" && ` với trạng thái ${statusOptions.find(s => s.value === filters.status)?.label}`}
                    {filters.prizeRange !== "all" && ` có giải thưởng ${prizeRangeOptions.find(p => p.value === filters.prizeRange)?.label}`}
                </div>
            )}
        </div>
    )
}
