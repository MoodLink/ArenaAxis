"use client"

import React, { useEffect, useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import StatsOverview from '@/components/store/dashboard/StatsOverview'
import ChartsSection from '@/components/store/dashboard/ChartsSection'
import DataSection from '@/components/store/dashboard/DataSection'
import QuickActions from '@/components/store/dashboard/QuickActions'
import OwnerStoresList from '@/components/store/OwnerStoresList'
import { StoreAdminDetailResponse } from '@/types'
import { getMyProfile } from '@/services/get-my-profile'
import { useStoresByOwner } from '@/hooks/use-store-by-owner'
import { Loader2 } from 'lucide-react'

export default function StoreDashboard() {
    const [ownerId, setOwnerId] = useState<string | null>(null)

    // Get owner ID from profile
    useEffect(() => {
        try {
            const currentUser = getMyProfile()
            if (currentUser?.id) {
                setOwnerId(currentUser.id)
            }
        } catch (err) {
            console.error('Error fetching user profile:', err)
        }
    }, [])

    // Fetch stores using React Query hook (with automatic caching & deduplication)
    const { data: stores = [], isLoading, isError } = useStoresByOwner(ownerId || '')

    const storeCount = stores?.length || 0

    if (isLoading && !stores.length) {
        return (
            <StoreLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải Trung tâm thể thao...</p>
                    </div>
                </div>
            </StoreLayout>
        )
    }

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trung tâm thể thao</h1>
                    <p className="text-gray-600">Tổng quan hoạt động kinh doanh sân thể thao</p>
                </div>

                {/* Stats Overview */}
                <StatsOverview storeCount={storeCount} />

                {/* Charts */}
                {/* <ChartsSection /> */}

                {/* Data Section */}
                {/* <DataSection /> */}

                {/* Owner Stores List */}
                <OwnerStoresList />

                {/* Quick Actions */}
                <QuickActions />
            </div>
        </StoreLayout>
    )
}