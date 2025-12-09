"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import RevenueOverview from '@/components/store/revenue/RevenueOverview'
import TransactionHistory from '@/components/store/revenue/TransactionHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StoreRevenue() {
    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý doanh thu</h1>
                    <p className="text-gray-600 mt-1">Theo dõi và phân tích doanh thu từ các sân thể thao</p>
                </div>

                {/* Revenue Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <RevenueOverview />
                    </TabsContent>

                    <TabsContent value="transactions" className="mt-6">
                        <TransactionHistory />
                    </TabsContent>
                </Tabs>
            </div>
        </StoreLayout>
    )
}