// Component thanh tìm kiếm và bộ lọc cho trang fields
// Bao gồm ô search, nút filter và toggle view mode

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Grid3X3, List } from "lucide-react"

interface FieldsSearchBarProps {
    searchValue: string // Giá trị tìm kiếm hiện tại
    onSearchChange: (value: string) => void // Callback khi thay đổi search
    viewMode: "grid" | "list" // Chế độ hiển thị hiện tại
    onViewModeChange: (mode: "grid" | "list") => void // Callback khi thay đổi view mode
    onFilterClick?: () => void // Callback khi click nút filter
}

export default function FieldsSearchBar({
    searchValue,
    onSearchChange,
    viewMode,
    onViewModeChange,
    onFilterClick
}: FieldsSearchBarProps) {
    return (
        <div className="mb-8">
            {/* Thanh tìm kiếm và nút filter */}
            <div className="flex gap-4 mb-4">
                {/* Ô tìm kiếm với icon */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm sân thể thao..."
                        className="pl-10"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Nút mở bộ lọc */}
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                    onClick={onFilterClick}
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </Button>
            </div>

            {/* Toggle view mode - Grid vs List */}
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => onViewModeChange("grid")}
                    className={viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Lưới
                </Button>

                <Button
                    size="sm"
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => onViewModeChange("list")}
                    className={viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                    <List className="w-4 h-4 mr-2" />
                    Danh sách
                </Button>
            </div>
        </div>
    )
}
