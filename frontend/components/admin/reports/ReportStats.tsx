"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
    FileText,
    Clock,
    Calendar,
    RefreshCw,
    BarChart3,
    TrendingUp
} from 'lucide-react'
import { AdminReport } from '@/data/mockDataAdmin'

interface ReportStatsProps {
    reports: AdminReport[];
}

export default function ReportStats({ reports }: ReportStatsProps) {
    const todayReports = reports.filter(report =>
        new Date(report.generatedAt).toDateString() === new Date().toDateString()
    ).length

    const scheduledReports = reports.filter(report =>
        report.scheduleType && report.scheduleType !== 'manual'
    ).length

    const failedReports = reports.filter(report =>
        report.status === 'failed'
    ).length

    const totalSizeGB = reports.reduce((total, report) => {
        if (report.size) {
            const size = parseFloat(report.size.replace(' MB', ''))
            return total + (size / 1024) // Convert MB to GB
        }
        return total
    }, 0)

    const avgProcessingTime = "2.5 phút" // Mock data

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Tổng báo cáo</p>
                            <p className="text-lg font-bold text-gray-900">{reports.length}</p>
                        </div>
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Hôm nay</p>
                            <p className="text-lg font-bold text-green-600">{todayReports}</p>
                        </div>
                        <Clock className="h-5 w-5 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Đã lên lịch</p>
                            <p className="text-lg font-bold text-purple-600">{scheduledReports}</p>
                        </div>
                        <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Lỗi</p>
                            <p className="text-lg font-bold text-red-600">{failedReports}</p>
                        </div>
                        <RefreshCw className="h-5 w-5 text-red-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Dung lượng</p>
                            <p className="text-lg font-bold text-orange-600">{totalSizeGB.toFixed(1)}GB</p>
                        </div>
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Thời gian TB</p>
                            <p className="text-lg font-bold text-indigo-600">{avgProcessingTime}</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}