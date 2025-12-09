// Shared Admin Filters Component
// Component filter chung cho tất cả các trang admin

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FilterOption {
    value: string
    label: string
}

interface AdminFiltersProps {
    searchValue: string
    onSearchChange: (value: string) => void
    filters: Array<{
        key: string
        placeholder: string
        value: string
        onValueChange: (value: string) => void
        options: FilterOption[]
    }>
}

export default function AdminFilters({ searchValue, onSearchChange, filters }: AdminFiltersProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                    placeholder="Tìm kiếm..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Dynamic Filters */}
            {filters.map((filter) => (
                <Select
                    key={filter.key}
                    value={filter.value}
                    onValueChange={filter.onValueChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}
        </div>
    )
}