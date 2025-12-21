"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import RevenueOverview from '@/components/store/revenue/RevenueOverview'

export default function StoreRevenue() {
    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý doanh thu</h1>
                    <p className="text-gray-600 mt-1">Theo dõi và phân tích doanh thu từ các sân thể thao</p>
                </div>

                {/* Revenue Overview */}
                <RevenueOverview />
            </div>
        </StoreLayout>
    )
}