"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Wrench,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    Filter,
    Search,
    FileText,
    DollarSign,
    Settings,
    Zap,
    Droplets,
    TreePine,
    Shield
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'
import { MaintenanceQuickActions } from '@/components/store/maintenance/MaintenanceDialogs'

// Mock data
const maintenanceRecords = [
    {
        id: 'MT001',
        field: {
            name: 'Sân bóng đá mini số 1',
            type: 'football',
            location: 'Khu A'
        },
        type: 'scheduled',
        priority: 'medium',
        status: 'pending',
        title: 'Thay cỏ nhân tạo',
        description: 'Thay thế cỏ nhân tạo khu vực khung thành do bị mòn',
        scheduledDate: '2024-01-20',
        estimatedDuration: '4 giờ',
        assignedTo: {
            name: 'Nguyễn Văn Thành',
            avatar: '/placeholder-user.jpg'
        },
        cost: 2500000,
        equipment: ['Cỏ nhân tạo', 'Keo dán', 'Dụng cụ cắt'],
        photos: [],
        notes: []
    },
    {
        id: 'MT002',
        field: {
            name: 'Sân tennis số 2',
            type: 'tennis',
            location: 'Khu B'
        },
        type: 'emergency',
        priority: 'high',
        status: 'in-progress',
        title: 'Sửa chữa hệ thống chiếu sáng',
        description: 'Thay thế bóng đèn LED bị hỏng và kiểm tra hệ thống điện',
        scheduledDate: '2024-01-18',
        estimatedDuration: '2 giờ',
        assignedTo: {
            name: 'Trần Văn Điện',
            avatar: '/placeholder-user.jpg'
        },
        cost: 800000,
        equipment: ['Bóng đèn LED', 'Dây điện', 'Công tắc'],
        photos: ['/placeholder.jpg'],
        notes: [
            {
                time: '2024-01-18 09:00',
                author: 'Trần Văn Điện',
                content: 'Đã kiểm tra, cần thay 3 bóng đèn LED'
            }
        ]
    },
    {
        id: 'MT003',
        field: {
            name: 'Sân bóng rổ số 1',
            type: 'basketball',
            location: 'Khu A'
        },
        type: 'preventive',
        priority: 'low',
        status: 'completed',
        title: 'Bảo dưỡng định kỳ',
        description: 'Vệ sinh sân, kiểm tra rổ bóng và sơn lại vạch kẻ',
        scheduledDate: '2024-01-15',
        completedDate: '2024-01-15',
        estimatedDuration: '3 giờ',
        actualDuration: '2.5 giờ',
        assignedTo: {
            name: 'Lê Thị Mai',
            avatar: '/placeholder-user.jpg'
        },
        cost: 450000,
        equipment: ['Sơn vạch', 'Cọ sơn', 'Chất tẩy rửa'],
        photos: ['/placeholder.jpg', '/placeholder.jpg'],
        notes: [
            {
                time: '2024-01-15 14:30',
                author: 'Lê Thị Mai',
                content: 'Hoàn thành bảo dưỡng. Sân đã sạch sẽ và vạch kẻ rõ ràng.'
            }
        ]
    },
    {
        id: 'MT004',
        field: {
            name: 'Sân cầu lông số 3',
            type: 'badminton',
            location: 'Khu C'
        },
        type: 'scheduled',
        priority: 'medium',
        status: 'scheduled',
        title: 'Thay lưới cầu lông',
        description: 'Thay lưới cầu lông mới và điều chỉnh độ căng',
        scheduledDate: '2024-01-25',
        estimatedDuration: '1 giờ',
        assignedTo: {
            name: 'Phạm Văn Long',
            avatar: '/placeholder-user.jpg'
        },
        cost: 200000,
        equipment: ['Lưới cầu lông', 'Dây căng'],
        photos: [],
        notes: []
    }
]

const maintenanceStats = [
    { month: 'T7', scheduled: 12, emergency: 3, preventive: 8, cost: 15000000 },
    { month: 'T8', scheduled: 15, emergency: 2, preventive: 10, cost: 18500000 },
    { month: 'T9', scheduled: 10, emergency: 5, preventive: 12, cost: 22000000 },
    { month: 'T10', scheduled: 18, emergency: 1, preventive: 9, cost: 16800000 },
    { month: 'T11', scheduled: 14, emergency: 4, preventive: 11, cost: 19200000 },
    { month: 'T12', scheduled: 16, emergency: 2, preventive: 13, cost: 17500000 }
]

const equipmentInventory = [
    { name: 'Cỏ nhân tạo', quantity: 50, unit: 'm²', minStock: 20, cost: 150000 },
    { name: 'Bóng đèn LED', quantity: 25, unit: 'chiếc', minStock: 10, cost: 80000 },
    { name: 'Sơn vạch sân', quantity: 8, unit: 'thùng', minStock: 5, cost: 120000 },
    { name: 'Lưới tennis', quantity: 3, unit: 'bộ', minStock: 2, cost: 800000 },
    { name: 'Lưới cầu lông', quantity: 12, unit: 'bộ', minStock: 5, cost: 45000 }
]

function getStatusBadge(status: string) {
    switch (status) {
        case 'pending':
            return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Chờ xử lý</Badge>
        case 'scheduled':
            return <Badge variant="outline" className="text-blue-600 border-blue-300">Đã lên lịch</Badge>
        case 'in-progress':
            return <Badge variant="outline" className="text-purple-600 border-purple-300">Đang thực hiện</Badge>
        case 'completed':
            return <Badge variant="outline" className="text-green-600 border-green-300">Hoàn thành</Badge>
        case 'cancelled':
            return <Badge variant="outline" className="text-red-600 border-red-300">Đã hủy</Badge>
        default:
            return <Badge variant="outline">Không xác định</Badge>
    }
}

function getPriorityBadge(priority: string) {
    switch (priority) {
        case 'high':
            return <Badge variant="destructive">Cao</Badge>
        case 'medium':
            return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Trung bình</Badge>
        case 'low':
            return <Badge variant="outline" className="text-green-600 border-green-300">Thấp</Badge>
        default:
            return <Badge variant="outline">Không xác định</Badge>
    }
}

function getTypeIcon(type: string) {
    switch (type) {
        case 'emergency':
            return <AlertTriangle className="h-4 w-4 text-red-600" />
        case 'scheduled':
            return <CalendarIcon className="h-4 w-4 text-blue-600" />
        case 'preventive':
            return <Shield className="h-4 w-4 text-green-600" />
        default:
            return <Wrench className="h-4 w-4 text-gray-600" />
    }
}

function MaintenanceCard({ record }: { record: any }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                            {getTypeIcon(record.type)}
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{record.title}</h3>
                                    {getPriorityBadge(record.priority)}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                                    <span className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {record.field.name}
                                    </span>
                                    <span className="flex items-center">
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        {record.scheduledDate}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {record.estimatedDuration}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {getStatusBadge(record.status)}
                            <p className="text-sm text-gray-500 mt-1">#{record.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={record.assignedTo.avatar} />
                                    <AvatarFallback className="text-xs">{record.assignedTo.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">{record.assignedTo.name}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>{record.cost.toLocaleString()}đ</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowDetailsDialog(true)}>
                            Chi tiết
                        </Button>
                        <MaintenanceQuickActions maintenance={record} />
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            {getTypeIcon(record.type)}
                            <span>{record.title}</span>
                            <span className="text-sm text-gray-500">#{record.id}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Sân</label>
                                <p className="text-sm text-gray-900">{record.field.name} ({record.field.location})</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                                <div className="mt-1">{getStatusBadge(record.status)}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ưu tiên</label>
                                <div className="mt-1">{getPriorityBadge(record.priority)}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Người thực hiện</label>
                                <p className="text-sm text-gray-900">{record.assignedTo.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ngày thực hiện</label>
                                <p className="text-sm text-gray-900">{record.scheduledDate}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Thời gian dự kiến</label>
                                <p className="text-sm text-gray-900">{record.estimatedDuration}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Mô tả</label>
                            <p className="text-sm text-gray-900 mt-1">{record.description}</p>
                        </div>

                        {/* Equipment */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Thiết bị cần thiết</label>
                            <div className="mt-2 space-y-1">
                                {record.equipment.map((item: string, index: number) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                        <Wrench className="h-3 w-3 mr-2" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Photos */}
                        {record.photos && record.photos.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Hình ảnh</label>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {record.photos.map((photo: string, index: number) => (
                                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                            <FileText className="h-8 w-8 text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {record.notes && record.notes.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                                <div className="mt-2 space-y-2">
                                    {record.notes.map((note: { time: string; author: string; content: string; }, index: number) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{note.author}</span>
                                                <span className="text-xs text-gray-500">{note.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{note.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cost */}
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Chi phí dự kiến</span>
                                <span className="text-lg font-bold text-gray-900">{record.cost.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function CreateMaintenanceDialog() {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date>()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo công việc bảo trì
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tạo công việc bảo trì mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                            <Input placeholder="Nhập tiêu đề công việc" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Loại bảo trì</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Theo lịch</SelectItem>
                                    <SelectItem value="preventive">Phòng ngừa</SelectItem>
                                    <SelectItem value="emergency">Khẩn cấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Sân</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn sân" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="field1">Sân bóng đá mini số 1</SelectItem>
                                    <SelectItem value="field2">Sân tennis số 2</SelectItem>
                                    <SelectItem value="field3">Sân bóng rổ số 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Ưu tiên</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn mức ưu tiên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">Cao</SelectItem>
                                    <SelectItem value="medium">Trung bình</SelectItem>
                                    <SelectItem value="low">Thấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Ngày thực hiện</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'dd/MM/yyyy') : 'Chọn ngày'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Người thực hiện</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn người thực hiện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="staff1">Nguyễn Văn Thành</SelectItem>
                                    <SelectItem value="staff2">Trần Văn Điện</SelectItem>
                                    <SelectItem value="staff3">Lê Thị Mai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Mô tả</label>
                        <Textarea placeholder="Mô tả chi tiết công việc cần thực hiện" rows={3} />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Chi phí dự kiến (VNĐ)</label>
                        <Input placeholder="0" type="number" />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setOpen(false)}>
                            Tạo công việc
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function MaintenanceStats() {
    const totalCost = maintenanceStats.reduce((sum, stat) => sum + stat.cost, 0)
    const totalJobs = maintenanceStats.reduce((sum, stat) => sum + stat.scheduled + stat.emergency + stat.preventive, 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Chi phí bảo trì theo tháng</CardTitle>
                    <CardDescription>Theo dõi chi phí bảo trì trong 6 tháng gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={maintenanceStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, 'Chi phí']} />
                            <Bar dataKey="cost" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Phân loại công việc</CardTitle>
                    <CardDescription>Số lượng công việc theo từng loại</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={maintenanceStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" strokeWidth={2} name="Theo lịch" />
                            <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} name="Khẩn cấp" />
                            <Line type="monotone" dataKey="preventive" stroke="#10b981" strokeWidth={2} name="Phòng ngừa" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

function EquipmentInventory() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kho thiết bị</CardTitle>
                <CardDescription>Theo dõi tồn kho thiết bị bảo trì</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {equipmentInventory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <span>Đơn giá: {item.cost.toLocaleString()}đ/{item.unit}</span>
                                    <span>Tồn kho tối thiểu: {item.minStock} {item.unit}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                    {item.quantity} {item.unit}
                                </p>
                                {item.quantity <= item.minStock && (
                                    <Badge variant="destructive" className="mt-1">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Sắp hết
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function StoreMaintenance() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPriority, setFilterPriority] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [activeTab, setActiveTab] = useState('all')

    const filteredRecords = maintenanceRecords.filter(record => {
        const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = filterStatus === 'all' || record.status === filterStatus
        const matchesPriority = filterPriority === 'all' || record.priority === filterPriority
        const matchesType = filterType === 'all' || record.type === filterType

        return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    const pendingRecords = filteredRecords.filter(record => ['pending', 'scheduled'].includes(record.status))
    const activeRecords = filteredRecords.filter(record => record.status === 'in-progress')
    const completedRecords = filteredRecords.filter(record => record.status === 'completed')

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý bảo trì</h1>
                        <p className="text-gray-600 mt-1">Theo dõi và lên lịch bảo trì sân thể thao</p>
                    </div>
                    <CreateMaintenanceDialog />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Công việc chờ xử lý</p>
                                    <p className="text-2xl font-bold text-yellow-600">{pendingRecords.length}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
                                    <p className="text-2xl font-bold text-blue-600">{activeRecords.length}</p>
                                </div>
                                <Settings className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                                    <p className="text-2xl font-bold text-green-600">{completedRecords.length}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Chi phí tháng này</p>
                                    <p className="text-2xl font-bold text-gray-900">17.5M</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <MaintenanceStats />

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Tìm kiếm công việc, sân, hoặc mô tả..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="scheduled">Theo lịch</SelectItem>
                                    <SelectItem value="preventive">Phòng ngừa</SelectItem>
                                    <SelectItem value="emergency">Khẩn cấp</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                                    <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Ưu tiên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="high">Cao</SelectItem>
                                    <SelectItem value="medium">Trung bình</SelectItem>
                                    <SelectItem value="low">Thấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">
                            Tất cả ({filteredRecords.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Chờ xử lý ({pendingRecords.length})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Đang thực hiện ({activeRecords.length})
                        </TabsTrigger>
                        <TabsTrigger value="inventory">
                            Kho thiết bị
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <div className="space-y-4">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <MaintenanceCard key={record.id} record={record} />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy công việc bảo trì</h3>
                                        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending" className="mt-6">
                        <div className="space-y-4">
                            {pendingRecords.length > 0 ? (
                                pendingRecords.map((record) => (
                                    <MaintenanceCard key={record.id} record={record} />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có công việc chờ xử lý</h3>
                                        <p className="text-gray-500">Tất cả công việc đã được xử lý</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="active" className="mt-6">
                        <div className="space-y-4">
                            {activeRecords.length > 0 ? (
                                activeRecords.map((record) => (
                                    <MaintenanceCard key={record.id} record={record} />
                                ))
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có công việc đang thực hiện</h3>
                                        <p className="text-gray-500">Hiện tại không có công việc bảo trì nào đang được thực hiện</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="inventory" className="mt-6">
                        <EquipmentInventory />
                    </TabsContent>
                </Tabs>
            </div>
        </StoreLayout>
    )
}