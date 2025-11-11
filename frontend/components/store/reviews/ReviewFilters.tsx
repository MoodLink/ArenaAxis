import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface ReviewFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    filterRating: string
    onRatingChange: (value: string) => void
    filterStatus: string
    onStatusChange: (value: string) => void
    filterField?: string
    onFieldChange?: (value: string) => void
    availableFields?: string[]
}

export default function ReviewFilters({
    searchTerm,
    onSearchChange,
    filterRating,
    onRatingChange,
    filterStatus,
    onStatusChange,
    filterField,
    onFieldChange,
    availableFields = []
}: ReviewFiltersProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên khách hàng, sân, hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <Select value={filterRating} onValueChange={onRatingChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Lọc theo sao" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả sao</SelectItem>
                            <SelectItem value="5">5 sao</SelectItem>
                            <SelectItem value="4">4 sao</SelectItem>
                            <SelectItem value="3">3 sao</SelectItem>
                            <SelectItem value="2">2 sao</SelectItem>
                            <SelectItem value="1">1 sao</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={filterStatus} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="pending">Chờ phản hồi</SelectItem>
                            <SelectItem value="responded">Đã phản hồi</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Field Filter (Optional) */}
                    {availableFields.length > 0 && onFieldChange && (
                        <Select value={filterField || "all"} onValueChange={onFieldChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Loại sân" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả sân</SelectItem>
                                {availableFields.map((field) => (
                                    <SelectItem key={field} value={field}>
                                        {field}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}