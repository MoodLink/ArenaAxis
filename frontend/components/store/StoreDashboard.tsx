"use client"

import React from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import StatsOverview from '@/components/store/dashboard/StatsOverview'
import ChartsSection from '@/components/store/dashboard/ChartsSection'
import DataSection from '@/components/store/dashboard/DataSection'
import QuickActions from '@/components/store/dashboard/QuickActions'

export default function StoreDashboard() {
    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Tổng quan hoạt động kinh doanh sân thể thao</p>
                </div>

                {/* Stats Overview */}
                <StatsOverview />

                {/* Charts */}
                <ChartsSection />

                {/* Data Section */}
                <DataSection />

                {/* Quick Actions */}
                <QuickActions />
            </div>
        </StoreLayout>
    )
}