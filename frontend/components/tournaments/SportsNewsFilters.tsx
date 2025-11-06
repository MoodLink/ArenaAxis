"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SportsNewsFiltersProps {
    filters: {
        search: string
        sport: string
        timeRange: string
        source: string
    }
    onFiltersChange: (filters: any) => void
    onClearFilters: () => void
}

export default function SportsNewsFilters({
    filters,
    onFiltersChange,
    onClearFilters
}: SportsNewsFiltersProps) {
    return (
        <div className="mb-8">
            <div className="relative max-w-md">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <Input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    className="pl-10 py-2 text-base"
                />
            </div>
        </div>
    )
}
