"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface PostSearchFiltersProps {
    onSearch: (filters: SearchFilters) => void
    onClear?: () => void
    isLoading?: boolean
}

export interface SearchFilters {
    storeName?: string
    fromDate?: string
    toDate?: string
    provinceId?: string
    wardId?: string
    sportId?: string
}

interface Province {
    id: string
    name: string
}

interface Ward {
    id: string
    name: string
}

interface Sport {
    id: string
    name: string
    nameEn?: string
}

export default function PostSearchFilters({ onSearch, onClear, isLoading = false }: PostSearchFiltersProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        storeName: "",
        fromDate: "",
        toDate: "",
        provinceId: "",
        wardId: "",
        sportId: "",
    })

    const [provinces, setProvinces] = useState<Province[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const [sports, setSports] = useState<Sport[]>([])
    const [hasActiveFilters, setHasActiveFilters] = useState(false)
    const [loadingProvinces, setLoadingProvinces] = useState(true)
    const [loadingSports, setLoadingSports] = useState(true)
    const searchTimeoutRef = React.useRef<NodeJS.Timeout>()

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setLoadingProvinces(true)
                const response = await fetch('/api/locations/provinces')
                if (response.ok) {
                    const data = await response.json()
                    setProvinces(Array.isArray(data) ? data : [])
                } else {
                    console.error('Failed to fetch provinces')
                }
            } catch (error) {
                console.error('Error fetching provinces:', error)
            } finally {
                setLoadingProvinces(false)
            }
        }

        fetchProvinces()
    }, [])

    // Fetch sports on mount
    useEffect(() => {
        const fetchSports = async () => {
            try {
                setLoadingSports(true)
                const response = await fetch('/api/sport')
                if (response.ok) {
                    const data = await response.json()
                    setSports(Array.isArray(data) ? data : (data.data ? data.data : []))
                } else {
                    console.error('Failed to fetch sports')
                }
            } catch (error) {
                console.error('Error fetching sports:', error)
            } finally {
                setLoadingSports(false)
            }
        }

        fetchSports()
    }, [])

    // Update wards when province changes
    useEffect(() => {
        const fetchWards = async () => {
            if (filters.provinceId) {
                try {
                    const response = await fetch(`/api/locations/provinces/${filters.provinceId}/wards`)
                    if (response.ok) {
                        const data = await response.json()
                        setWards(Array.isArray(data) ? data : [])
                    } else {
                        setWards([])
                    }
                } catch (error) {
                    console.error('Error fetching wards:', error)
                    setWards([])
                }
                // Reset ward selection when province changes
                setFilters(prev => ({ ...prev, wardId: "" }))
            } else {
                setWards([])
            }
        }

        fetchWards()
    }, [filters.provinceId])

    // Auto-search when filters change (with debounce)
    useEffect(() => {
        const hasFilters =
            !!filters.storeName ||
            !!filters.fromDate ||
            !!filters.toDate ||
            !!filters.provinceId ||
            !!filters.wardId ||
            !!filters.sportId

        setHasActiveFilters(hasFilters)

        // Debounce search: wait 500ms after user stops typing before searching
        // Luôn gọi onSearch ngay cả khi không có filter (để hiển thị tất cả bài posts)
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            // Luôn trigger search, chứ không kiểm tra hasFilters
            // Component cha sẽ xử lý logic clean filters
            onSearch(filters)
        }, 500)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [filters, onSearch])

    const handleInputChange = (field: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    const handleClear = () => {
        setFilters({
            storeName: "",
            fromDate: "",
            toDate: "",
            provinceId: "",
            wardId: "",
            sportId: "",
        })
        onClear?.()
    }

    return (
        <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Store Name Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên cửa hàng
                            </label>
                            <Input
                                placeholder="Nhập tên cửa hàng... (tìm kiếm tự động)"
                                value={filters.storeName || ""}
                                onChange={e => handleInputChange("storeName", e.target.value)}
                                className="h-10"
                            />
                        </div>

                        {/* Province Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tỉnh / Thành phố
                            </label>
                            <select
                                value={filters.provinceId || ""}
                                onChange={e => handleInputChange("provinceId", e.target.value)}
                                disabled={loadingProvinces}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">{loadingProvinces ? "Đang tải..." : "-- Chọn tỉnh --"}</option>
                                {provinces.map(province => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ward Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quận / Huyện
                            </label>
                            <select
                                value={filters.wardId || ""}
                                onChange={e => handleInputChange("wardId", e.target.value)}
                                disabled={!filters.provinceId}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                            >
                                <option value="">-- Chọn quận --</option>
                                {wards.map(ward => (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sport and Date Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Sport Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Môn thể thao
                            </label>
                            <select
                                value={filters.sportId || ""}
                                onChange={e => handleInputChange("sportId", e.target.value)}
                                disabled={loadingSports}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">{loadingSports ? "Đang tải..." : "-- Tất cả môn --"}</option>
                                {sports.map(sport => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* From Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày
                            </label>
                            <Input
                                type="date"
                                value={filters.fromDate || ""}
                                onChange={e => handleInputChange("fromDate", e.target.value)}
                                className="h-10"
                            />
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày
                            </label>
                            <Input
                                type="date"
                                value={filters.toDate || ""}
                                onChange={e => handleInputChange("toDate", e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        {hasActiveFilters && (
                            <Button
                                onClick={handleClear}
                                variant="outline"
                                className="px-4"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>

                    {/* Active Filters Info */}
                    {hasActiveFilters && (
                        <div className="text-xs text-gray-500 pt-2">
                            Đang áp dụng bộ lọc: {[
                                filters.storeName && `Cơ sở: ${filters.storeName}`,
                                filters.provinceId && `Tỉnh: ${provinces.find(p => p.id === filters.provinceId)?.name}`,
                                filters.wardId && `Quận: ${wards.find(w => w.id === filters.wardId)?.name}`,
                                filters.sportId && `Môn: ${sports.find(s => s.id === filters.sportId)?.name}`,
                                filters.fromDate && `Từ: ${filters.fromDate}`,
                                filters.toDate && `Đến: ${filters.toDate}`,
                            ].filter(Boolean).join(" • ")}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
