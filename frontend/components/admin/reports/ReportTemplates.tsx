"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'
import {
    FileText,
    Calendar
} from 'lucide-react'
import { ReportTemplate } from '@/data/mockDataAdmin'

interface ReportTemplatesProps {
    templates: ReportTemplate[];
}

// Chart data
const reportGenerationData = [
    { date: '22/01', reports: 5, processing_time: 2.1 },
    { date: '23/01', reports: 8, processing_time: 3.2 },
    { date: '24/01', reports: 12, processing_time: 2.8 },
    { date: '25/01', reports: 6, processing_time: 2.5 },
    { date: '26/01', reports: 8, processing_time: 2.2 }
]

const reportTypeDistribution = [
    { type: 'Doanh thu', count: 45, percentage: 36 },
    { type: 'Booking', count: 38, percentage: 30 },
    { type: 'Người dùng', count: 25, percentage: 20 },
    { type: 'Sân', count: 12, percentage: 10 },
    { type: 'Audit', count: 5, percentage: 4 }
]

export default function ReportTemplates({ templates }: ReportTemplatesProps) {
    return (
        <div className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Generation Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Xu hướng tạo báo cáo</CardTitle>
                        <CardDescription>
                            Số lượng báo cáo được tạo theo ngày
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={reportGenerationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Report Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân loại báo cáo</CardTitle>
                        <CardDescription>
                            Phân bố theo loại báo cáo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={reportTypeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Report Templates */}
            <Card>
                <CardHeader>
                    <CardTitle>Mẫu báo cáo</CardTitle>
                    <CardDescription>
                        Quản lý các mẫu báo cáo tự động
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <Card key={template.id} className="border border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{template.name}</p>
                                            <p className="text-sm text-gray-500">{template.description}</p>
                                        </div>
                                        <Badge variant={template.isActive ? "default" : "secondary"}>
                                            {template.isActive ? "Hoạt động" : "Tạm dừng"}
                                        </Badge>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="outline">
                                            <FileText className="h-4 w-4 mr-1" />
                                            Tạo ngay
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Lên lịch
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}