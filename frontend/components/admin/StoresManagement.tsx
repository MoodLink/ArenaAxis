'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { StoreSearchItemResponse } from '@/types'
import { searchStores, getUserStores } from '@/services/api-new'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import StoreTable from '@/components/admin/stores/StoreTable'
import StoresPagination from '@/components/store/StoresPagination'
import { SearchFilters } from '@/components/store/SearchStoreForm'
import AdminHeader from '@/components/admin/shared/AdminHeader'

export default function StoresManagement() {
    const router = useRouter()
    const [searchValue, setSearchValue] = useState('')
    const [stores, setStores] = useState<StoreSearchItemResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [totalStores, setTotalStores] = useState(0)
    const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})

    // Fetch tất cả Trung tâm thể thao để lấy tổng số
    useEffect(() => {
        const fetchTotalStores = async () => {
            try {
                const allStores = await getUserStores(1, 1000)
                if (Array.isArray(allStores)) {
                    setTotalStores(allStores.length)
                    console.log(' Total stores:', allStores.length)
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
    const filteredStores = stores.filter(store => {
        if (!searchValue.trim()) return true

        const searchLower = searchValue.toLowerCase()
        return (
            store.name.toLowerCase().includes(searchLower) ||
            (store.ward?.name.toLowerCase().includes(searchLower)) ||
            (store.province?.name.toLowerCase().includes(searchLower))
        )
    })

    const totalPages = Math.ceil(totalStores / itemsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilters])

    const handleStoreAction = (storeId: string, action: 'view' | 'edit' | 'delete') => {
        switch (action) {
            case 'view':
                router.push(`/admin/stores/${storeId}`)
                break
            case 'edit':
                router.push(`/admin/stores/${storeId}/edit`)
                break
            case 'delete':
                console.log('Delete store:', storeId)
                // TODO: Implement delete functionality
                break
        }
    }

    if (loading) {
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
