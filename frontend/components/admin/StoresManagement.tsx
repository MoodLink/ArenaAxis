'use client'

import React, { useState } from 'react'
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
import { useAllStores, useStoreSearch, adminQueryKeys, useApproveStore, useAdminStoreSearch } from '@/hooks/admin-queries'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import SuspendDialog from '@/components/store/SuspendDialog'
import SuspendConflictDialog from '@/components/store/SuspendConflictDialog'
import type { SuspendStoreRecord } from '@/services/suspend.service'

export default function StoresManagement() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)
    const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})
    const [approvingStoreId, setApprovingStoreId] = useState<string | null>(null)
    const [approvedFilter, setApprovedFilter] = useState<'all' | 'approved' | 'not-approved'>('all')
    const [approvableFilter, setApprovableFilter] = useState<'approvable' | 'not-approvable' | ''>('')
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
    const [suspendingStoreId, setSuspendingStoreId] = useState<string | null>(null)
    const [suspendingStoreName, setSuspendingStoreName] = useState<string>('')
    const [suspendConflicts, setSuspendConflicts] = useState<SuspendStoreRecord[]>([])
    const [isSuspendConflictOpen, setIsSuspendConflictOpen] = useState(false)

    // Fetch ALL stores with React Query for filtering (no pagination at API level)
    const adminFilters = {
        name: searchValue || undefined,
        wardId: (selectedFilters as any)?.wardId || undefined,
        provinceId: (selectedFilters as any)?.provinceId || undefined,
        sportId: (selectedFilters as any)?.sportId || undefined,
    }

    const { data: storesData = [], isLoading, error } = useAdminStoreSearch(adminFilters, 0, 1000)

    // Fetch all stores count
    const { data: allStores = [] } = useAllStores()
    const totalStores = allStores.length

    // Approve store mutation
    const approveMutation = useApproveStore(queryClient)

    // Client-side filtering based on both approved and approvable filters
    const filteredStores = storesData.filter((store) => {
        // Filter by approved status
        if (approvedFilter === 'approved' && !store.approved) return false
        if (approvedFilter === 'not-approved' && store.approved) return false

        // Filter by approvable status only when approvedFilter is 'not-approved'
        if (approvedFilter === 'not-approved') {
            if (approvableFilter === 'approvable' && !store.approvable) return false
            if (approvableFilter === 'not-approvable' && store.approvable) return false
        }

        return true
    })

    const totalPages = Math.ceil(filteredStores.length / itemsPerPage)

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilters, approvedFilter, approvableFilter])

    const handleStoreAction = async (storeId: string, action: 'view' | 'edit' | 'delete' | 'approve' | 'suspend') => {
        switch (action) {
            case 'view':
                router.push(`/admin/stores/${storeId}`)
                break
            case 'edit':
                router.push(`/admin/stores/${storeId}/edit`)
                break
            case 'approve':
                await handleApproveStore(storeId)
                break
            case 'suspend':
                handleSuspendClick(storeId)
                break
            case 'delete':
                console.log('Delete store:', storeId)
                // TODO: Implement delete functionality
                // On success: queryClient.invalidateQueries({ queryKey: adminQueryKeys.stores.all })
                break
        }
    }

    const handleApproveStore = async (storeId: string) => {
        setApprovingStoreId(storeId)
        try {
            console.log('[Admin] Approving store:', storeId)
            const result = await approveMutation.mutateAsync(storeId)
            console.log('[Admin] Approve result:', result)

            // Ensure we always show a toast for the result
            if (result?.success) {
                console.log('[Admin] Showing success toast')
                toast({
                    title: '✓ Phê duyệt thành công',
                    description: result.message || 'Trung tâm thể thao đã được phê duyệt',
                    variant: 'default'
                })
            } else {
                console.log('[Admin] Showing failure toast')
                toast({
                    title: '✕ Phê duyệt thất bại',
                    description: result?.message || 'Có lỗi xảy ra khi phê duyệt Trung tâm thể thao',
                    variant: 'destructive'
                })
            }
        } catch (error: any) {
            console.error('[Admin] Error approving store:', error)
            const errorMsg = error?.message || 'Có lỗi xảy ra khi phê duyệt Trung tâm thể thao';

            // Parse error message for better UX
            let displayMessage = errorMsg;
            if (errorMsg.includes('not eligible')) {
                displayMessage = 'Trung tâm thể thao này không đủ điều kiện để phê duyệt. Kiểm tra xem store đã hoàn thành hồ sơ đăng ký chưa (avatar, giấy phép kinh doanh, v.v.)'
            }

            toast({
                title: '✕ Lỗi',
                description: displayMessage,
                variant: 'destructive'
            })
        } finally {
            setApprovingStoreId(null)
        }
    }

    const handleSuspendClick = (storeId: string) => {
        const store = storesData.find(s => s.id === storeId)
        if (store) {
            setSuspendingStoreId(storeId)
            setSuspendingStoreName(store.name)
            setIsSuspendDialogOpen(true)
        }
    }

    const handleSuspendSuccess = (record: SuspendStoreRecord) => {
        console.log('[Admin] Store suspended successfully:', record)
        toast({
            title: '✓ Tạm dừng thành công',
            description: `${suspendingStoreName} đã bị tạm dừng`,
            variant: 'default'
        })
    }

    const handleSuspendConflict = (conflicts: SuspendStoreRecord[]) => {
        setSuspendConflicts(conflicts)
        setIsSuspendConflictOpen(true)
    }

    const handleForceRetry = () => {
        setIsSuspendConflictOpen(false)
        setIsSuspendDialogOpen(true)
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
                        {`Tìm thấy: ${filteredStores.length} Trung tâm thể thao`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[250px]">
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

                        {/* Approved Filter Dropdown */}
                        <select
                            value={approvedFilter}
                            onChange={(e) => {
                                setApprovedFilter(e.target.value as 'all' | 'approved' | 'not-approved')
                                setCurrentPage(1)
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="approved">Đã được phê duyệt</option>
                            <option value="not-approved">Chưa được phê duyệt</option>
                        </select>

                        {/* Approvable Filter Dropdown - Only show when "Chưa được phê duyệt" is selected */}
                        {approvedFilter === 'not-approved' && (
                            <select
                                value={approvableFilter}
                                onChange={(e) => {
                                    setApprovableFilter(e.target.value as 'approvable' | 'not-approvable' | '')
                                    setCurrentPage(1)
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="approvable">Có khả năng phê duyệt</option>
                                <option value="not-approvable">Không thể được phê duyệt</option>
                            </select>
                        )}
                    </div>

                    {/* Stores Table */}
                    <StoreTable
                        stores={filteredStores.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )}
                        onStoreAction={handleStoreAction}
                        approvingStoreId={approvingStoreId}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <StoresPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredStores.length}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Suspend Dialog */}
            {suspendingStoreId && (
                <SuspendDialog
                    isOpen={isSuspendDialogOpen}
                    onClose={() => setIsSuspendDialogOpen(false)}
                    storeId={suspendingStoreId}
                    storeName={suspendingStoreName}
                    onSuccess={handleSuspendSuccess}
                    onConflict={handleSuspendConflict}
                />
            )}

            {/* Suspend Conflict Dialog */}
            <SuspendConflictDialog
                isOpen={isSuspendConflictOpen}
                onClose={() => setIsSuspendConflictOpen(false)}
                conflicts={suspendConflicts}
                onForceRetry={handleForceRetry}
            />
        </div>
    )
}
