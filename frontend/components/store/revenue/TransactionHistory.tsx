"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    Search,
    Filter,
    Download,
    Eye,
    CreditCard,
    Calendar,
    DollarSign,
    Clock,
    User,
    MapPin,
    Receipt,
    ChevronLeft,
    ChevronRight,
    FileText
} from 'lucide-react'

// Mock data
const transactions = [
    {
        id: 'TXN001',
        bookingId: 'BK001',
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@email.com',
        fieldName: 'Sân bóng đá 1',
        date: '2024-12-28',
        timeSlot: '18:00-20:00',
        amount: 400000,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        createdAt: '2024-12-25T10:30:00',
        completedAt: '2024-12-25T10:32:15',
        commission: 20000,
        netAmount: 380000
    },
    {
        id: 'TXN002',
        bookingId: 'BK002',
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@email.com',
        fieldName: 'Sân tennis 1',
        date: '2024-12-28',
        timeSlot: '16:00-17:00',
        amount: 120000,
        paymentMethod: 'momo',
        status: 'completed',
        createdAt: '2024-12-27T14:20:00',
        completedAt: '2024-12-27T14:21:45',
        commission: 6000,
        netAmount: 114000
    },
    {
        id: 'TXN003',
        bookingId: 'BK003',
        customerName: 'Lê Văn C',
        customerEmail: 'levanc@email.com',
        fieldName: 'Sân cầu lông 1',
        date: '2024-12-29',
        timeSlot: '20:00-22:00',
        amount: 160000,
        paymentMethod: 'vnpay',
        status: 'pending',
        createdAt: '2024-12-26T16:45:00',
        completedAt: null,
        commission: 8000,
        netAmount: 152000
    },
    {
        id: 'TXN004',
        bookingId: 'BK004',
        customerName: 'Phạm Thị D',
        customerEmail: 'phamthid@email.com',
        fieldName: 'Sân bóng đá 2',
        date: '2024-12-29',
        timeSlot: '08:00-10:00',
        amount: 300000,
        paymentMethod: 'bank_transfer',
        status: 'failed',
        createdAt: '2024-12-24T09:15:00',
        completedAt: null,
        commission: 0,
        netAmount: 0
    }
]

const paymentMethods = [
    { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: CreditCard },
    { id: 'momo', name: 'MoMo', icon: CreditCard },
    { id: 'vnpay', name: 'VNPay', icon: CreditCard },
    { id: 'cash', name: 'Tiền mặt', icon: DollarSign }
]

const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
}

const statusLabels = {
    completed: 'Hoàn thành',
    pending: 'Đang xử lý',
    failed: 'Thất bại',
    refunded: 'Đã hoàn tiền'
}

function TransactionCard({ transaction }: { transaction: any }) {
    const paymentMethod = paymentMethods.find(pm => pm.id === transaction.paymentMethod)
    const PaymentIcon = paymentMethod?.icon || CreditCard

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{transaction.id}</h3>
                            <Badge className={statusColors[transaction.status as keyof typeof statusColors]}>
                                {statusLabels[transaction.status as keyof typeof statusLabels]}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{transaction.customerName}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{transaction.fieldName}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{transaction.date} • {transaction.timeSlot}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{transaction.amount.toLocaleString()}đ</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <PaymentIcon className="h-4 w-4 mr-1" />
                            <span>{paymentMethod?.name}</span>
                        </div>
                        {transaction.status === 'completed' && (
                            <p className="text-sm text-gray-500 mt-1">
                                Thực nhận: <span className="font-medium text-gray-900">{transaction.netAmount.toLocaleString()}đ</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Chi tiết
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Chi tiết giao dịch #{transaction.id}</DialogTitle>
                                <DialogDescription>
                                    Thông tin chi tiết về giao dịch thanh toán
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Transaction Info */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Thông tin giao dịch</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Mã giao dịch:</span>
                                            <p className="font-medium">{transaction.id}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Mã booking:</span>
                                            <p className="font-medium">{transaction.bookingId}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Trạng thái:</span>
                                            <Badge className={statusColors[transaction.status as keyof typeof statusColors]}>
                                                {statusLabels[transaction.status as keyof typeof statusLabels]}
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Phương thức:</span>
                                            <p className="font-medium">{paymentMethod?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Họ tên:</span>
                                            <p className="font-medium">{transaction.customerName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Email:</span>
                                            <p className="font-medium">{transaction.customerEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Info */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Thông tin đặt sân</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Sân:</span>
                                            <p className="font-medium">{transaction.fieldName}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Ngày giờ:</span>
                                            <p className="font-medium">{transaction.date} • {transaction.timeSlot}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Chi tiết thanh toán</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tổng tiền:</span>
                                            <span>{transaction.amount.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Phí dịch vụ:</span>
                                            <span>-{transaction.commission.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between font-medium border-t pt-2">
                                            <span>Thực nhận:</span>
                                            <span className="text-green-600">{transaction.netAmount.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Lịch sử giao dịch</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Khởi tạo:</span>
                                            <span>{new Date(transaction.createdAt).toLocaleString('vi-VN')}</span>
                                        </div>
                                        {transaction.completedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Hoàn thành:</span>
                                                <span>{new Date(transaction.completedAt).toLocaleString('vi-VN')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default function TransactionHistory() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.bookingId.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
        const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter

        return matchesSearch && matchesStatus && matchesPaymentMethod
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

    const stats = {
        total: transactions.length,
        completed: transactions.filter(t => t.status === 'completed').length,
        pending: transactions.filter(t => t.status === 'pending').length,
        totalAmount: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.netAmount, 0)
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng giao dịch</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Receipt className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">✓</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Đang xử lý</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">⏳</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Thực nhận</p>
                                <p className="text-xl font-bold text-green-600">{stats.totalAmount.toLocaleString()}đ</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                                <Input
                                    placeholder="Tìm kiếm theo mã giao dịch, mã booking, tên khách hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="pending">Đang xử lý</SelectItem>
                                    <SelectItem value="failed">Thất bại</SelectItem>
                                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Phương thức" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                                    <SelectItem value="momo">MoMo</SelectItem>
                                    <SelectItem value="vnpay">VNPay</SelectItem>
                                    <SelectItem value="cash">Tiền mặt</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Xuất Excel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions List */}
            <div className="space-y-4">
                {currentTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
            </div>

            {filteredTransactions.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy giao dịch nào</h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trước
                    </Button>
                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}