"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MoreHorizontal,
    Download,
    FileText,
    BarChart3,
    Calendar,
    RefreshCw,
    Mail,
    Share
} from 'lucide-react'
import { AdminReport } from '@/data/mockDataAdmin'

interface ReportTableProps {
    reports: AdminReport[];
    onReportAction: (reportId: string, action: 'download' | 'regenerate' | 'delete' | 'schedule') => void;
}

export default function ReportTable({ reports, onReportAction }: ReportTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
            case 'processing':
                return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>
            case 'failed':
                return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>
            case 'scheduled':
                return <Badge className="bg-purple-100 text-purple-800">Đã lên lịch</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getTypeBadge = (type: string) => {
        const typeMap = {
            revenue: { label: 'Doanh thu', color: 'bg-green-50 text-green-700' },
            booking: { label: 'Booking', color: 'bg-blue-50 text-blue-700' },
            user: { label: 'Người dùng', color: 'bg-purple-50 text-purple-700' },
            field: { label: 'Sân', color: 'bg-orange-50 text-orange-700' },
            performance: { label: 'Hiệu suất', color: 'bg-indigo-50 text-indigo-700' },
            audit: { label: 'Kiểm toán', color: 'bg-gray-50 text-gray-700' }
        }

        const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-50 text-gray-700' }

        return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
    }

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'pdf':
                return <FileText className="h-4 w-4 text-red-500" />
            case 'excel':
                return <BarChart3 className="h-4 w-4 text-green-500" />
            case 'csv':
                return <FileText className="h-4 w-4 text-blue-500" />
            default:
                return <FileText className="h-4 w-4 text-gray-500" />
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN')
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Báo cáo</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Người tạo</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Kích thước</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        {getFormatIcon(report.format)}
                                        <p className="font-medium text-gray-900">{report.title}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{report.description}</p>
                                    {report.scheduleType !== 'manual' && (
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {report.scheduleType === 'daily' ? 'Hàng ngày' :
                                                    report.scheduleType === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                                            </Badge>
                                            {report.nextSchedule && (
                                                <span className="text-xs text-gray-500">
                                                    Tiếp theo: {formatDate(report.nextSchedule)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(report.type)}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium text-sm text-gray-900">{report.generatedBy}</p>
                                    {report.recipients && (
                                        <p className="text-xs text-gray-500">
                                            Gửi tới {report.recipients.length} người
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-gray-900">{formatDate(report.generatedAt)}</p>
                            </TableCell>
                            <TableCell>
                                <div>
                                    {report.size && (
                                        <p className="text-sm text-gray-900">{report.size}</p>
                                    )}
                                    <p className="text-xs text-gray-500">{report.downloadCount} lượt tải</p>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                        {report.status === 'completed' && (
                                            <>
                                                <DropdownMenuItem onClick={() => onReportAction(report.id, 'download')}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Tải xuống
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Gửi email
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share className="mr-2 h-4 w-4" />
                                                    Chia sẻ
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem onClick={() => onReportAction(report.id, 'regenerate')}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Tạo lại
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onReportAction(report.id, 'schedule')}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Lên lịch
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onReportAction(report.id, 'delete')}
                                            className="text-red-600"
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Xóa báo cáo
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {reports.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Không tìm thấy báo cáo nào phù hợp</p>
                </div>
            )}
        </div>
    )
}