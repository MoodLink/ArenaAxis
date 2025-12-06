'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { StoreSearchItemResponse } from '@/types'
import { searchStores } from '@/services/api-new'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import StoreTable from '@/components/admin/stores/StoreTable'
import StoresPagination from '@/components/store/StoresPagination'
import { SearchFilters } from '@/components/store/SearchStoreForm'
import AdminHeader from '@/components/admin/shared/AdminHeader'
import { useAllStores, useStoreSearch, adminQueryKeys } from '@/hooks/admin-queries'
import { useQueryClient } from '@tanstack/react-query'

export default function StoresManagement() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})

    // Fetch stores with React Query (handles pagination and caching)
    const { data: storesData = [], isLoading, error } = useStoreSearch(selectedFilters, currentPage - 1, itemsPerPage)

    // Fetch all stores count
    const { data: allStores = [] } = useAllStores()
    const totalStores = allStores.length

    // Filter stores by search value (client-side)
    const filteredStores = useMemo(() => {
        return storesData.filter((store: StoreSearchItemResponse) => {
            if (!searchValue.trim()) return true
            const searchLower = searchValue.toLowerCase()
            return (
                store.name.toLowerCase().includes(searchLower) ||
                (store.ward?.name.toLowerCase().includes(searchLower)) ||
                (store.province?.name.toLowerCase().includes(searchLower))
            )
        })
    }, [storesData, searchValue])

    const totalPages = Math.ceil(totalStores / itemsPerPage)

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilters])

    const handleStoreAction = (storeId: string, action: 'view' | 'edit' | 'delete' | 'approve') => {
        switch (action) {
            case 'view':
                router.push(`/admin/stores/${storeId}`)
                break
            case 'edit':
                router.push(`/admin/stores/${storeId}/edit`)
                break
            case 'approve':
                console.log('Approve store:', storeId)
                // TODO: Implement approve functionality with API call
                // On success: queryClient.invalidateQueries({ queryKey: adminQueryKeys.stores.all })
                break
            case 'delete':
                console.log('Delete store:', storeId)
                // TODO: Implement delete functionality
                // On success: queryClient.invalidateQueries({ queryKey: adminQueryKeys.stores.all })
                break
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Đang tải Trung tâm thể thao...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Trung tâm thể thao"
                description="Quản lý thông tin và hoạt động của các Trung tâm thể thao"
            />

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Trung tâm thể thao</CardTitle>
                    <CardDescription>
                        {`Tổng cộng: ${totalStores} Trung tâm thể thao`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                    {/* Stores Table */}
                    <StoreTable
                        stores={filteredStores}
                        onStoreAction={handleStoreAction}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <StoresPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalStores}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
