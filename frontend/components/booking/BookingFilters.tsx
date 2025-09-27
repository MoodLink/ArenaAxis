// Component bộ lọc và search cho booking
"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BookingFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    dateFilter: string
    setDateFilter: (date: string) => void
    sportFilter: string
    setSportFilter: (sport: string) => void
    sportOptions: Array<{ value: string; label: string }>
}

export default function BookingFilters({
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    sportFilter,
    setSportFilter,
    sportOptions
}: BookingFiltersProps) {
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Tìm kiếm theo tên sân, địa điểm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                </div>
                <Button
                    variant={showFilters ? "default" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-6"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Bộ lọc
                </Button>
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lọc theo ngày
                            </label>
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lọc theo môn thể thao
                            </label>
                            <select
                                value={sportFilter}
                                onChange={(e) => setSportFilter(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {sportOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}