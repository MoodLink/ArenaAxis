"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"

// Import shared components
import AdminHeader from "./shared/AdminHeader"
import AdminFilters from "./shared/AdminFilters"
import RevenueStats from "./revenue/RevenueStats"
import RevenueTable from "./revenue/RevenueTable"
import RevenueCharts from "./revenue/RevenueCharts"

// Import mock data
import { mockRevenueRecords, mockRevenueStats, AdminRevenueRecord } from "@/data/mockDataAdmin"

export default function RevenueManagement() {
    const [records, setRecords] = useState<AdminRevenueRecord[]>(mockRevenueRecords)
    const [searchTerm, setSearchTerm] = useState('')
    const [sourceFilter, setSourceFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [dateRange, setDateRange] = useState<string>('all')

    // Filter records
    const filteredRecords = records.filter(record => {
        const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSource = sourceFilter === 'all' || record.source === sourceFilter
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter

        return matchesSearch && matchesSource && matchesStatus
    })

    const sourceOptions = [
        { value: 'all', label: 'Tất cả nguồn' },
        { value: 'booking', label: 'Đặt sân' },
        { value: 'tournament', label: 'Giải đấu' },
        { value: 'membership', label: 'Thành viên' },
        { value: 'other', label: 'Khác' }
    ]

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'failed', label: 'Thất bại' },
        { value: 'refunded', label: 'Đã hoàn' }
    ]

    const dateRangeOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
        { value: 'quarter', label: 'Quý này' }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminHeader
                title="Quản lý doanh thu"
                description="Theo dõi và phân tích doanh thu chi tiết"
                actionButton={
                    <div className="flex space-x-3">
                        <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Xuất báo cáo
                        </Button>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                        </Button>
                    </div>
                }
            />

            {/* Revenue Stats */}
            <RevenueStats stats={mockRevenueStats} />

            {/* Revenue Charts */}
            <RevenueCharts />

            {/* Revenue Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử giao dịch</CardTitle>
                    <CardDescription>Chi tiết tất cả giao dịch và doanh thu</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminFilters
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={[
                            {
                                key: "source",
                                placeholder: "Nguồn",
                                value: sourceFilter,
                                onValueChange: setSourceFilter,
                                options: sourceOptions
                            },
                            {
                                key: "status",
                                placeholder: "Trạng thái",
                                value: statusFilter,
                                onValueChange: setStatusFilter,
                                options: statusOptions
                            },
                            {
                                key: "dateRange",
                                placeholder: "Thời gian",
                                value: dateRange,
                                onValueChange: setDateRange,
                                options: dateRangeOptions
                            }
                        ]}
                    />

                    <RevenueTable records={filteredRecords} />

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                            Hiển thị {filteredRecords.length} trong tổng số {records.length} giao dịch
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}