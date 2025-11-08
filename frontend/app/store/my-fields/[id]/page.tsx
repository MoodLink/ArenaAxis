"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Calendar, MapPin, Star, ChevronLeft, ChevronRight, Clock, Edit2, Trash2, MoreHorizontal, AlertCircle, Pause, X, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FieldService, Field as APIField } from '@/services/field.service'
import { FieldPricingService, FieldPricing } from '@/services/field-pricing.service'
import { StoreService } from '@/services/store.service'
import StoreLayout from '@/components/store/StoreLayout'
import { useToast } from '@/hooks/use-toast'

interface SubCourt {
    id: string
    name: string
    type: string
    color: string
    rating: number
    price: number
}

interface BookingInfo {
    id: string
    courtId: string
    timeSlot: string
    customerName: string
    customerPhone: string
    customerEmail: string
    customerAddress: string
    bookingTime: string
    price: number
}

interface BookingStatus {
    [key: string]: {
        [key: string]: "available" | "booked" | "locked" | "selected"
    }
}

export default function FieldDetailPage() {
    const router = useRouter()
    const params = useParams()
    const fieldId = params.id as string

    // State
    const [loading, setLoading] = useState(true)
    const [field, setField] = useState<APIField | null>(null)
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split('T')[0]
    })
    const [bookingData, setBookingData] = useState<BookingStatus>({})
    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const [selectedCourt, setSelectedCourt] = useState('subcourt-001')
    const [bookingDataWithCustomer, setBookingDataWithCustomer] = useState<Record<string, BookingInfo>>({})
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<BookingInfo | null>(null)
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
    const [maintenanceDate, setMaintenanceDate] = useState('')
    const [maintenanceTimeStart, setMaintenanceTimeStart] = useState('09:00')
    const [maintenanceTimeEnd, setMaintenanceTimeEnd] = useState('17:00')

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({
        name: '',
        sport_name: '',
        address: '',
        default_price: ''
    })

    // Delete state
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pricing state
    const [fieldPricings, setFieldPricings] = useState<FieldPricing[]>([])
    const [showPricingModal, setShowPricingModal] = useState(false)
    const [pricingForm, setPricingForm] = useState({
        day_of_weeks: [] as string[],
        start_at: '17:00',
        end_at: '19:30',
        price: ''
    })
    const [editingPricingId, setEditingPricingId] = useState<string | null>(null)

    // Toast notification
    const { toast } = useToast()

    // Fetch field details
    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                setLoading(true)

                if (!fieldId) {
                    throw new Error('Field ID not found')
                }

                // Fetch field details
                const response = await FieldService.getFieldById(fieldId)
                if (response.data) {
                    setField(response.data)
                }

                // Fetch field pricings
                try {
                    const pricingsResponse = await FieldPricingService.getFieldPricings(fieldId)
                    if (pricingsResponse.data) {
                        console.log('[DEBUG] Pricings fetched:', pricingsResponse.data)
                        setFieldPricings(pricingsResponse.data)
                    }
                } catch (error) {
                    console.warn('No pricing data available, using default price only:', error)
                    setFieldPricings([]) // Set empty array to use default prices
                }

                // Generate time slots (05:00 - 23:30, every 30 min)
                const slots: string[] = []
                for (let hour = 5; hour <= 23; hour++) {
                    slots.push(`${hour.toString().padStart(2, '0')}:00`)
                    if (hour < 23) {
                        slots.push(`${hour.toString().padStart(2, '0')}:30`)
                    }
                }
                setTimeSlots(slots)

                // Initialize empty booking data - will be populated from backend
                const bookingStatus: BookingStatus = {
                    'subcourt-001': {},
                    'subcourt-002': {},
                    'subcourt-003': {},
                }

                // Initialize all slots as available (default state)
                slots.forEach((slot) => {
                    Object.keys(bookingStatus).forEach((courtId) => {
                        bookingStatus[courtId][slot] = 'available'
                    })
                })

                setBookingData(bookingStatus)
                setBookingDataWithCustomer({}) // Empty, will be populated from booking API
            } catch (error) {
                console.error('Error fetching field:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFieldData()
    }, [fieldId])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin sân...</p>
                </div>
            </div>
        )
    }

    if (!field) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Không tìm thấy thông tin sân</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.back()}
                    >
                        ← Quay lại
                    </Button>
                </div>
            </div>
        )
    }

    const scrollLeft = () => {
        const container = document.getElementById('booking-grid')
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        const container = document.getElementById('booking-grid')
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    const getSlotColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-gradient-to-br from-emerald-100 to-blue-100 hover:from-emerald-200 hover:to-blue-200 border-2 border-emerald-200 text-emerald-700'
            case 'booked':
                return 'bg-gradient-to-br from-red-500 to-red-600 text-white border-2 border-red-400'
            case 'locked':
                return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white border-2 border-gray-300'
            default:
                return 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
        }
    }

    // Handle Edit Field
    const handleOpenEditModal = () => {
        if (field) {
            setEditForm({
                name: field.name || '',
                sport_name: field.sport_name || '',
                address: field.address || '',
                default_price: field.defaultPrice || ''
            })
            setShowEditModal(true)
        }
    }

    const handleUpdateField = async () => {
        if (!field) return

        try {
            await FieldService.updateField(field._id, {
                name: editForm.name,
                sport_name: editForm.sport_name,
                address: editForm.address,
                default_price: editForm.default_price
            })

            toast({
                title: 'Thành công ✅',
                description: 'Thông tin sân đã được cập nhật',
            })

            setShowEditModal(false)
            // Refresh field data
            const response = await FieldService.getFieldById(field._id)
            if (response.data) {
                setField(response.data)
            }
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể cập nhật sân',
                variant: 'destructive',
            })
        }
    }

    // Handle Delete Field
    const handleDeleteField = async () => {
        if (!field) return

        try {
            setIsDeleting(true)
            await FieldService.deleteField(field._id)

            toast({
                title: 'Thành công ✅',
                description: 'Sân đã được xóa',
            })

            setShowDeleteModal(false)
            // Redirect back to my-fields list
            router.push('/store/my-fields')
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể xóa sân',
                variant: 'destructive',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle Pricing Management
    const handleOpenPricingModal = () => {
        setPricingForm({
            day_of_weeks: [],
            start_at: '17:00',
            end_at: '19:30',
            price: field?.defaultPrice || ''
        })
        setEditingPricingId(null)
        setShowPricingModal(true)
    }

    const handleCreatePricing = async () => {
        if (!field) return

        try {
            await FieldPricingService.createFieldPricing({
                field_id: field._id,
                day_of_weeks: pricingForm.day_of_weeks,
                start_at: pricingForm.start_at,
                end_at: pricingForm.end_at,
                price: pricingForm.price
            })

            toast({
                title: 'Thành công ✅',
                description: 'Đã thêm giá đặc biệt',
            })

            setShowPricingModal(false)
            // Refresh pricings
            const pricingsResponse = await FieldPricingService.getFieldPricings(field._id)
            if (pricingsResponse.data) {
                setFieldPricings(pricingsResponse.data)
            }
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể thêm giá đặc biệt',
                variant: 'destructive',
            })
        }
    }

    const handleDeletePricing = async (pricingId: string) => {
        try {
            await FieldPricingService.deleteFieldPricing(pricingId)

            toast({
                title: 'Thành công ✅',
                description: 'Đã xóa giá đặc biệt',
            })

            // Refresh pricings
            if (field) {
                const pricingsResponse = await FieldPricingService.getFieldPricings(field._id)
                if (pricingsResponse.data) {
                    setFieldPricings(pricingsResponse.data)
                }
            }
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể xóa giá đặc biệt',
                variant: 'destructive',
            })
        }
    }

    const toggleDaySelection = (day: string) => {
        setPricingForm(prev => ({
            ...prev,
            day_of_weeks: prev.day_of_weeks.includes(day)
                ? prev.day_of_weeks.filter(d => d !== day)
                : [...prev.day_of_weeks, day]
        }))
    }

    const getSlotPrice = (timeSlot: string, selectedDate: string): number => {
        const date = new Date(selectedDate)
        const dayOfWeek = FieldPricingService.getDayOfWeek(date)
        const specialPrice = FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek)
        return specialPrice || parseInt(field?.defaultPrice || '0')
    }

    return (
        <StoreLayout>
            <div className="w-full max-w-full overflow-x-hidden">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.back()}
                                    className="mb-2"
                                >
                                    ← Quay lại
                                </Button>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{field.name}</h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý lịch đặt sân và thông tin chi tiết
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={handleOpenPricingModal}
                            >
                                <Calendar className="h-4 w-4" />
                                Giá đặc biệt
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={handleOpenEditModal}
                            >
                                <Edit2 className="h-4 w-4" />
                                Chỉnh sửa
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleOpenEditModal}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Chỉnh sửa thông tin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Xóa sân
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Field Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Giá mặc định</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {field.defaultPrice ? `${parseInt(field.defaultPrice).toLocaleString()}đ` : 'N/A'} / giờ
                                    </p>

                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                                    <Badge className={field.activeStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                        {field.activeStatus ? 'Hoạt động' : 'Tạm ngừng'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>



                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {field.createdAt ? new Date(field.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {field.updatedAt && new Date(field.updatedAt).toLocaleTimeString('vi-VN')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Grid */}
                    <Card className="shadow-xl border-0">
                        <CardContent className="p-0">
                            {/* Modern Header */}
                            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 md:p-6">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl md:text-2xl font-bold mb-2">Lịch đặt sân</h3>
                                        <p className="text-emerald-100 text-sm md:text-base">Chọn ngày: {selectedDate} • Chọn khung giờ phù hợp</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowMaintenanceModal(true)}
                                            className="bg-white/20 border-white/30 text-white hover:bg-white/30 gap-2"
                                        >
                                            <Pause className="w-4 h-4" />
                                            <span className="hidden sm:inline">Ngừng hoạt động</span>
                                        </Button>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                                        />
                                        <div className="hidden md:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">Cuộn để xem thêm</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={scrollLeft}
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={scrollRight}
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Layout - Responsive and contained */}
                            <div className="relative bg-white">
                                {/* Court Selector */}
                                <div className="border-b border-gray-200 px-4 md:px-6 py-4 bg-gray-50 flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Chọn sân:</label>
                                    <select
                                        value={selectedCourt}
                                        onChange={(e) => setSelectedCourt(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="subcourt-001">Sân A</option>
                                        <option value="subcourt-002">Sân B</option>
                                        <option value="subcourt-003">Sân C</option>
                                    </select>
                                </div>

                                {/* Scrollable Time Grid with proper container */}
                                <div className="w-full">
                                    <div
                                        id="booking-grid"
                                        className="overflow-x-auto pb-2"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#10b981 #f3f4f6',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        <div className="inline-block min-w-full">
                                            {/* Time Header */}
                                            <div className="flex bg-gradient-to-r from-emerald-100 to-blue-100 border-b-2 border-emerald-200">
                                                {timeSlots.map((slot, index) => (
                                                    <div
                                                        key={`time-header-${index}-${slot}`}
                                                        className={`flex-shrink-0 w-20 px-2 text-center border-r border-emerald-200/50 flex flex-col justify-center py-4 ${index % 2 === 0 ? 'bg-white/50' : 'bg-emerald-50/50'
                                                            }`}
                                                    >
                                                        <div className="text-sm font-bold text-gray-700">{slot}</div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {parseInt(slot.split(':')[0]) < 12
                                                                ? 'Sáng'
                                                                : parseInt(slot.split(':')[0]) < 18
                                                                    ? 'Chiều'
                                                                    : 'Tối'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Single Court Row */}
                                            {bookingData[selectedCourt] && (
                                                <div className="flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30 transition-all duration-300 bg-gray-50/30">
                                                    {/* Offset spacer */}
                                                    <div className="flex-shrink-0 w-10 border-r border-gray-100/50"></div>
                                                    {timeSlots.slice(0, -1).map((slot, slotIndex) => {
                                                        const status = (bookingData[selectedCourt][slot] || 'available') as string
                                                        const bookingId = `${selectedCourt}-${slot}`
                                                        const bookingInfo = bookingDataWithCustomer[bookingId]
                                                        const slotPrice = getSlotPrice(slot, selectedDate)
                                                        const isSpecialPrice = slotPrice !== parseInt(field?.defaultPrice || '0')

                                                        return (
                                                            <div
                                                                key={`booking-slot-${selectedCourt}-${slotIndex}-${slot}`}
                                                                className={`flex-shrink-0 w-20 border-r border-gray-100/50 flex items-center justify-center py-3 px-2 ${slotIndex % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'
                                                                    }`}
                                                            >
                                                                <div className="relative group">
                                                                    <button
                                                                        disabled={status === 'locked'}
                                                                        onClick={() => {
                                                                            if (status === 'booked' && bookingInfo) {
                                                                                setSelectedBooking(bookingInfo)
                                                                                setShowBookingModal(true)
                                                                            }
                                                                        }}
                                                                        className={`w-14 h-14 rounded-xl ${getSlotColor(status)} transition-all duration-300 transform ${status === 'available'
                                                                            ? 'cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95'
                                                                            : status === 'booked'
                                                                                ? 'cursor-pointer hover:scale-110 hover:shadow-lg'
                                                                                : 'cursor-not-allowed'
                                                                            } flex items-center justify-center text-sm font-bold relative ${isSpecialPrice ? 'ring-2 ring-yellow-400' : ''}`}
                                                                    >

                                                                    </button>
                                                                    {/* Price tooltip */}
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                                        <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg ${isSpecialPrice ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-white'
                                                                            }`}>
                                                                            {slotPrice.toLocaleString()}đ
                                                                            {isSpecialPrice && <span className="ml-1">⭐</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Tên sân</p>
                                    <p className="font-medium">{field.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                    <p className="font-medium">{field.address || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Loại sân</p>
                                    <p className="font-medium">{field.sport_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">ID</p>
                                    <p className="font-medium text-xs text-gray-500">{field._id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Info Modal */}
                    <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Thông tin người đặt sân</DialogTitle>
                                <DialogDescription>
                                    Chi tiết đặt sân tại khung giờ: {selectedBooking?.timeSlot}
                                </DialogDescription>
                            </DialogHeader>
                            {selectedBooking && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Họ tên</label>
                                        <p className="text-gray-900 font-semibold">{selectedBooking.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Số điện thoại
                                        </label>
                                        <p className="text-gray-900 font-semibold">{selectedBooking.customerPhone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </label>
                                        <p className="text-gray-900 font-semibold">{selectedBooking.customerEmail}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Địa chỉ
                                        </label>
                                        <p className="text-gray-900 font-semibold">{selectedBooking.customerAddress}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Thời gian đặt</label>
                                            <p className="text-gray-900 font-semibold">{selectedBooking.bookingTime}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Giá tiền</label>
                                            <p className="text-gray-900 font-semibold text-emerald-600">{selectedBooking.price.toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Maintenance Modal */}
                    <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Ngừng hoạt động (Bảo trì)</DialogTitle>
                                <DialogDescription>
                                    Khóa sân trong thời gian bảo trì và thông báo người đặt
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Ngày bảo trì</label>
                                    <Input
                                        type="date"
                                        value={maintenanceDate}
                                        onChange={(e) => setMaintenanceDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Từ giờ</label>
                                        <Input
                                            type="time"
                                            value={maintenanceTimeStart}
                                            onChange={(e) => setMaintenanceTimeStart(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Đến giờ</label>
                                        <Input
                                            type="time"
                                            value={maintenanceTimeEnd}
                                            onChange={(e) => setMaintenanceTimeEnd(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Các booking trong khoảng thời gian này sẽ được thông báo và chuyển sang sân khác
                                    </AlertDescription>
                                </Alert>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowMaintenanceModal(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => {
                                            // TODO: Call API to set maintenance
                                            alert(`Bảo trì từ ${maintenanceTimeStart} đến ${maintenanceTimeEnd} ngày ${maintenanceDate}`)
                                            setShowMaintenanceModal(false)
                                        }}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Field Dialog */}
                    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Chỉnh sửa thông tin sân</DialogTitle>
                                <DialogDescription>
                                    Cập nhật thông tin chi tiết của sân
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tên sân</label>
                                    <Input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Tên sân..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Loại sân</label>
                                    <Input
                                        value={editForm.sport_name}
                                        onChange={(e) => setEditForm({ ...editForm, sport_name: e.target.value })}
                                        placeholder="Loại sân..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <Input
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        placeholder="Địa chỉ..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Giá mặc định (đ)</label>
                                    <Input
                                        type="number"
                                        value={editForm.default_price}
                                        onChange={(e) => setEditForm({ ...editForm, default_price: e.target.value })}
                                        placeholder="Nhập giá..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={handleUpdateField}
                                    >
                                        Cập nhật
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                        <DialogContent className="max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Xóa sân</DialogTitle>
                                <DialogDescription>
                                    Bạn có chắc chắn muốn xóa sân "{field?.name}"? Hành động này không thể hoàn tác.
                                </DialogDescription>
                            </DialogHeader>
                            <Alert className="bg-red-50 border-red-200">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    Tất cả dữ liệu liên quan sẽ bị xóa
                                </AlertDescription>
                            </Alert>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={handleDeleteField}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Đang xóa...' : 'Xóa'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Pricing Management Dialog */}
                    <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Quản lý giá theo khung giờ</DialogTitle>
                                <DialogDescription>
                                    Thiết lập giá đặc biệt cho các khung giờ và ngày trong tuần
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Current Special Pricings for Selected Date */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Giá đặc biệt ngày {selectedDate}</h3>
                                    {(() => {
                                        const selectedDateObj = new Date(selectedDate)
                                        const selectedDayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)
                                        const todaysPricings = fieldPricings.filter(pricing => pricing.dayOfWeek === selectedDayOfWeek)

                                        return todaysPricings.length > 0 ? (
                                            <div className="space-y-2">
                                                {todaysPricings.map((pricing, idx) => (
                                                    <div
                                                        key={`pricing-item-${pricing._id}-${idx}`}
                                                        className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">
                                                                {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                            </div>
                                                            <div className="text-sm text-gray-600 capitalize">
                                                                {pricing.dayOfWeek}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <div className="font-bold text-emerald-600">
                                                                    {pricing.specialPrice.toLocaleString()}đ
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeletePricing(pricing._id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                                                Chưa có giá đặc biệt cho ngày này
                                            </div>
                                        )
                                    })()}
                                </div>

                                {/* Add New Pricing Form */}
                                <div className="border-t pt-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Thêm giá đặc biệt mới</h3>

                                    <div className="space-y-4">
                                        {/* Days Selection */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Chọn ngày trong tuần
                                            </label>
                                            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                    const dayNames: { [key: string]: string } = {
                                                        monday: 'T2',
                                                        tuesday: 'T3',
                                                        wednesday: 'T4',
                                                        thursday: 'T5',
                                                        friday: 'T6',
                                                        saturday: 'T7',
                                                        sunday: 'CN'
                                                    }
                                                    const isSelected = pricingForm.day_of_weeks.includes(day)
                                                    return (
                                                        <button
                                                            key={`day-button-${day}`}
                                                            type="button"
                                                            onClick={() => toggleDaySelection(day)}
                                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                                                ? 'bg-emerald-600 text-white shadow-lg'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {dayNames[day]}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Time Range */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Từ giờ</label>
                                                <Input
                                                    type="time"
                                                    value={pricingForm.start_at}
                                                    onChange={(e) => setPricingForm({ ...pricingForm, start_at: e.target.value })}
                                                    step="1800"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Đến giờ</label>
                                                <Input
                                                    type="time"
                                                    value={pricingForm.end_at}
                                                    onChange={(e) => setPricingForm({ ...pricingForm, end_at: e.target.value })}
                                                    step="1800"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Giá đặc biệt (đ)</label>
                                            <Input
                                                type="number"
                                                value={pricingForm.price}
                                                onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                                                placeholder="Nhập giá..."
                                                className="mt-1"
                                            />
                                        </div>

                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Giá đặc biệt sẽ được áp dụng cho các khung giờ đã chọn. Nếu không có giá đặc biệt, sẽ sử dụng giá mặc định ({field?.defaultPrice ? `${parseInt(field.defaultPrice).toLocaleString()}đ` : 'N/A'}).
                                            </AlertDescription>
                                        </Alert>

                                        <div className="flex gap-3 justify-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowPricingModal(false)}
                                            >
                                                Đóng
                                            </Button>
                                            <Button
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                onClick={handleCreatePricing}
                                                disabled={pricingForm.day_of_weeks.length === 0 || !pricingForm.price}
                                            >
                                                Thêm giá đặc biệt
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </StoreLayout>
    )
}