'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Loader2, Grid3x3, List } from 'lucide-react'
import type { StoreSearchItemResponse } from '@/types'
import { searchStores, getUserStores } from '@/services/api-new'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminStoresContent from '@/components/admin/AdminStoresContent'
import StoresPagination from '@/components/store/StoresPagination'
import { SearchFilters } from '@/components/store/SearchStoreForm'

export default function StoresManagement() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchValue, setSearchValue] = useState('')
    const [stores, setStores] = useState<StoreSearchItemResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [totalStores, setTotalStores] = useState(0)
    const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})

    // Fetch tất cả cửa hàng để lấy tổng số
    useEffect(() => {
        const fetchTotalStores = async () => {
            try {
                const allStores = await getUserStores(1, 1000)
                if (Array.isArray(allStores)) {
                    setTotalStores(allStores.length)
                    console.log('✅ Total stores:', allStores.length)
                }
            } catch (error) {
                console.error('Error fetching total stores:', error)
                setTotalStores(0)
            }
        }

        fetchTotalStores()
    }, [])

    // Fetch stores của trang hiện tại
    useEffect(() => {
        async function fetchStores() {
            setLoading(true)
            try {
                const apiStores = await searchStores(selectedFilters, currentPage - 1, itemsPerPage)
                setStores(apiStores)
            } catch (error) {
                console.error('Error fetching stores:', error)
                setStores([])
            } finally {
                setLoading(false)
            }
        }

        fetchStores()
    }, [selectedFilters, currentPage, itemsPerPage])

    // Filter stores theo search value (client-side)
    const filteredStores = useMemo(() => {
        if (!searchValue.trim()) return stores

        return stores.filter(store => {
            const searchLower = searchValue.toLowerCase()
            return (
                store.name.toLowerCase().includes(searchLower) ||
                (store.ward?.name.toLowerCase().includes(searchLower)) ||
                (store.province?.name.toLowerCase().includes(searchLower))
            )
        })
    }, [stores, searchValue])

    const totalPages = Math.ceil(totalStores / itemsPerPage)
    const paginatedStores = filteredStores

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilters])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải cửa hàng...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa hàng</h1>
                    <p className="text-sm text-gray-600">Tổng cộng: {totalStores} cửa hàng</p>
                </div>
            </div>

            {/* Search and View Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        placeholder="Tìm kiếm theo tên, địa điểm..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10 bg-gray-50 border-gray-200"
                    />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="gap-2"
                    >
                        <Grid3x3 className="h-4 w-4" />
                        Lưới
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="gap-2"
                    >
                        <List className="h-4 w-4" />
                        Danh sách
                    </Button>
                </div>
            </div>

            {/* Stores Display */}
            <AdminStoresContent
                stores={paginatedStores}
                viewMode={viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <StoresPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalStores}
                />
            )}
        </div>
    )
}
