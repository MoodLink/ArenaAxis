import React from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, RefreshCw, Wallet, DollarSign } from "lucide-react"
import { AdminRevenueRecord } from "@/data/mockDataAdmin"

interface RevenueTableProps {
    records: AdminRevenueRecord[]
}

export default function RevenueTable({ records }: RevenueTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
            case 'failed':
                return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>
            case 'refunded':
                return <Badge className="bg-gray-100 text-gray-800">Đã hoàn</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
        }
    }

    const getSourceBadge = (source: string) => {
        switch (source) {
            case 'booking':
                return <Badge variant="outline" className="bg-blue-50">Đặt sân</Badge>
            case 'tournament':
                return <Badge variant="outline" className="bg-purple-50">Giải đấu</Badge>
            case 'membership':
                return <Badge variant="outline" className="bg-orange-50">Thành viên</Badge>
            case 'other':
                return <Badge variant="outline" className="bg-gray-50">Khác</Badge>
            default:
                return <Badge variant="outline">{source}</Badge>
        }
    }

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'card':
                return <CreditCard className="h-4 w-4" />
            case 'bank_transfer':
                return <RefreshCw className="h-4 w-4" />
            case 'e_wallet':
                return <Wallet className="h-4 w-4" />
            case 'cash':
                return <DollarSign className="h-4 w-4" />
            default:
                return <DollarSign className="h-4 w-4" />
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Mã GD</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Nguồn</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Hoa hồng</TableHead>
                    <TableHead>Thực nhận</TableHead>
                    <TableHead>Trạng thái</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map((record) => (
                    <TableRow key={record.id}>
                        <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {record.transactionId}
                            </code>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{formatDate(record.date)}</span>
                        </TableCell>
                        <TableCell>
                            <div>
                                <p className="font-medium text-sm">{record.userName}</p>
                                <p className="text-xs text-gray-500">ID: {record.userId}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="max-w-xs">
                                <p className="text-sm">{record.description}</p>
                                {record.fieldName && (
                                    <p className="text-xs text-gray-500">{record.fieldName}</p>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{getSourceBadge(record.source)}</TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                {getPaymentMethodIcon(record.paymentMethod)}
                                <span className="text-sm capitalize">
                                    {record.paymentMethod === 'card' ? 'Thẻ' :
                                        record.paymentMethod === 'bank_transfer' ? 'CK ngân hàng' :
                                            record.paymentMethod === 'e_wallet' ? 'Ví điện tử' :
                                                record.paymentMethod === 'cash' ? 'Tiền mặt' : record.paymentMethod}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="font-medium">{formatCurrency(record.amount)}</span>
                        </TableCell>
                        <TableCell>
                            <span className="text-orange-600">{formatCurrency(record.commission)}</span>
                        </TableCell>
                        <TableCell>
                            <span className="text-green-600 font-medium">{formatCurrency(record.netRevenue)}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}