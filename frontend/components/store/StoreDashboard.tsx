"use client"

import React, { useState, useEffect } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import StatsOverview from '@/components/store/dashboard/StatsOverview'
import ChartsSection from '@/components/store/dashboard/ChartsSection'
import DataSection from '@/components/store/dashboard/DataSection'
import QuickActions from '@/components/store/dashboard/QuickActions'
import OwnerStoresList from '@/components/store/OwnerStoresList'
import { StoreAdminDetailResponse } from '@/types'
import { getStoresByOwnerId } from '@/services/api-new'
import { getMyProfile } from '@/services/get-my-profile'

export default function StoreDashboard() {
    const [stores, setStores] = useState<StoreAdminDetailResponse[]>([])
    const [storeCount, setStoreCount] = useState(0)

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const currentUser = getMyProfile()
                if (currentUser?.id) {
                    const data = await getStoresByOwnerId(currentUser.id)
                    setStores(data)
                    setStoreCount(data.length)
                }
            } catch (err) {
                console.error('Error fetching stores:', err)
            }
        }

        fetchStores()
    }, [])

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