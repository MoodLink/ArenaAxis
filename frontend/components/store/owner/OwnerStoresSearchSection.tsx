import { Search, LayoutGrid, List, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SearchSectionProps {
    viewMode: "grid" | "list"
    onViewModeChange: (mode: "grid" | "list") => void
    searchValue: string
    onSearchChange: (value: string) => void
    statusFilter: 'all' | 'approved' | 'pending' | 'active' | 'inactive'
    onStatusFilterChange: (status: 'all' | 'approved' | 'pending' | 'active' | 'inactive') => void
    filteredCount: number
}

export default function OwnerStoresSearchSection({
    viewMode,
    onViewModeChange,
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    filteredCount
}: SearchSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            {/* Search Bar and View Mode */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm Trung tâm thể thao theo tên, địa chỉ..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-12"
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-[200px] h-12">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Tạm ngừng</SelectItem>
                    </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        onClick={() => onViewModeChange("grid")}
                        className="h-12 w-12"
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => onViewModeChange("list")}
                        className="h-12 w-12"
                    >
                        <List className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                    Hiển thị <span className="font-semibold text-gray-900">{filteredCount}</span> Trung tâm thể thao
                </p>
            </div>
        </div>
    )
}
