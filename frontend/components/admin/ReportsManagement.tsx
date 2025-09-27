"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar } from 'lucide-react'
import AdminHeader from '@/components/admin/shared/AdminHeader'
import AdminFilters from '@/components/admin/shared/AdminFilters'
import ReportStats from '@/components/admin/reports/ReportStats'
import ReportTable from '@/components/admin/reports/ReportTable'
import ReportTemplates from '@/components/admin/reports/ReportTemplates'
import {
    mockReports,
    mockReportTemplates,
    AdminReport
} from '@/data/mockDataAdmin'

export default function ReportsManagement() {
    const [reports, setReports] = useState<AdminReport[]>(mockReports)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === 'all' || report.type === typeFilter
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const handleReportAction = (reportId: string, action: 'download' | 'regenerate' | 'delete' | 'schedule') => {
        console.log(`${action} report ${reportId}`)
        // Implement action logic here
    }

    const filters = [
        {
            key: 'type',
            placeholder: 'Loại báo cáo',
            value: typeFilter,
            onValueChange: setTypeFilter,
            options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'revenue', label: 'Doanh thu' },
                { value: 'booking', label: 'Booking' },
                { value: 'user', label: 'Người dùng' },
                { value: 'field', label: 'Sân' },
                { value: 'audit', label: 'Kiểm toán' }
            ]
        },
        {
            key: 'status',
            placeholder: 'Trạng thái',
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'completed', label: 'Hoàn thành' },
                { value: 'processing', label: 'Đang xử lý' },
                { value: 'failed', label: 'Lỗi' },
                { value: 'scheduled', label: 'Đã lên lịch' }
            ]
        }
    ]

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Quản lý báo cáo"
                description="Tạo và quản lý các báo cáo hệ thống"
                actionButton={
                    <div className="flex space-x-3">
                        <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            Tạo báo cáo mới
                        </Button>
                        <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Lên lịch
                        </Button>
                    </div>
                }
            />

            <ReportStats reports={reports} />

            <ReportTemplates templates={mockReportTemplates} />

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách báo cáo</CardTitle>
                    <CardDescription>
                        Quản lý {filteredReports.length} báo cáo hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminFilters
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        filters={filters}
                    />

                    <div className="mt-6">
                        <ReportTable
                            reports={filteredReports}
                            onReportAction={handleReportAction}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}