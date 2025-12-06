"use client"

import React, { useState, useEffect, useCallback } from 'react'
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
import { OrderService } from '@/services/order.service'
import StoreLayout from '@/components/store/StoreLayout'
import { useToast } from '@/hooks/use-toast'
import { useFieldsWithStatusData } from '@/hooks/use-fields-with-status-data'
import { useFieldDetail } from '@/hooks/use-field-detail'
import { useStoreDetail } from '@/hooks/use-store-detail'

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

    // Use React Query hooks for automatic caching and deduplication
    const { data: field, isLoading: fieldLoading } = useFieldDetail(fieldId)
    const { data: storeData, isLoading: storeLoading } = useStoreDetail(field?.storeId || '')

    // State
    const [loading, setLoading] = useState(true)
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
    const [pricingMode, setPricingMode] = useState<'day-of-week' | 'specific-date'>('day-of-week')
    const [pricingForm, setPricingForm] = useState({
        day_of_weeks: [] as string[],
        start_at: '17:00',
        end_at: '19:30',
        price: ''
    })
    const [specialDatePricingForm, setSpecialDatePricingForm] = useState({
        date: '',
        start_at: '17:00',
        end_at: '19:30',
        price: ''
    })
    const [editingPricingId, setEditingPricingId] = useState<string | null>(null)

    // Toast notification
    const { toast } = useToast()

    //  Helper function to refresh booking data from statusField (giống store-booking page)
    const { data: fieldsResponse, isLoading: fieldsLoading } = useFieldsWithStatusData(
        field?.storeId || '',
        field?.sportId || '',
        selectedDate,
        { enabled: !!field?.storeId && !!field?.sportId && !fieldLoading }
    )

    // Process fieldsResponse when it changes
    useEffect(() => {
        if (!fieldsResponse) return

        console.log('🏟️ Processing fields response:', fieldsResponse)

        try {
            // Build bookingData from statusField array (PAID bookings only)
            const bookingMap: BookingStatus = {}
            const bookingWithCustomerMap: Record<string, BookingInfo> = {}

            // Initialize subcourts
            const subcourts = ['subcourt-001', 'subcourt-002', 'subcourt-003']
            subcourts.forEach(subcourt => {
                bookingMap[subcourt] = {}
            })

            // Process each field's statusField array
            const fieldsData = fieldsResponse.data || []
            console.log(`Processing ${fieldsData.length} fields for date ${selectedDate}`)

            fieldsData.forEach((fieldData: any) => {
                const fieldId = fieldData._id
                console.log(` Processing field ${fieldId}`)

                if (!fieldData.statusField || fieldData.statusField.length === 0) {
                    console.log(`   No statusField data for field ${fieldId}`)
                    return
                }

                console.log(`  Found ${fieldData.statusField.length} status entries`)

                // Filter PAID status only and extract booked slots
                const paidStatuses = fieldData.statusField.filter((status: any) => status.statusPayment === 'PAID')
                console.log(`   Found ${paidStatuses.length} PAID bookings`)

                paidStatuses.forEach((status: any) => {
                    const startTime = status.startTime
                    const endTime = status.endTime

                    console.log(`    🕐 Booking: ${startTime} to ${endTime}`)

                    // Parse ISO datetime to extract time part
                    const startTimeMatch = startTime.match(/T(\d{2}):(\d{2}):/)
                    const endTimeMatch = endTime.match(/T(\d{2}):(\d{2}):/)

                    if (!startTimeMatch || !endTimeMatch) {
                        console.warn(`     Could not parse time from: ${startTime} to ${endTime}`)
                        return
                    }

                    const startHours = startTimeMatch[1]
                    const startMins = startTimeMatch[2]
                    const endHours = endTimeMatch[1]
                    const endMins = endTimeMatch[2]

                    const startTimeStr = `${startHours}:${startMins}`
                    const endTimeStr = `${endHours}:${endMins}`

                    console.log(`     Parsed time: ${startTimeStr} to ${endTimeStr}`)

                    // Generate all 30-minute slots between start and end time
                    const startMinutes = parseInt(startHours) * 60 + parseInt(startMins)
                    const endMinutes = parseInt(endHours) * 60 + parseInt(endMins)

                    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
                        const hours = Math.floor(minutes / 60)
                        const mins = minutes % 60
                        const slotTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

                        const targetSubcourt = 'subcourt-001' // Default subcourt
                        if (!bookingMap[targetSubcourt]) {
                            bookingMap[targetSubcourt] = {}
                        }
                        bookingMap[targetSubcourt][slotTime] = 'booked'
                        console.log(`       Marked as booked: ${slotTime}`)
                    }
                })
            })

            setBookingData(bookingMap)
            setBookingDataWithCustomer(bookingWithCustomerMap)
            console.log(' Final booking data:', bookingMap)
        } catch (error) {
            console.error(' Error processing fields data:', error)
        }
    }, [fieldsResponse, selectedDate])

    // Update loading state when hooks finish loading
    useEffect(() => {
        if (!fieldLoading && !storeLoading) {
            setLoading(false)
        }
    }, [fieldLoading, storeLoading])

    // Generate time slots based on store opening hours
    useEffect(() => {
        if (!storeData) return

        try {
            const slots: string[] = []
            const startHour = storeData.startTime ? parseInt(storeData.startTime.split(':')[0]) : 5
            const endHour = storeData.endTime ? parseInt(storeData.endTime.split(':')[0]) : 24

            for (let hour = startHour; hour < endHour; hour++) {
                slots.push(`${hour.toString().padStart(2, '0')}:00`)
                slots.push(`${hour.toString().padStart(2, '0')}:30`)
            }
            // Add the final hour if it exists
            if (endHour > startHour) {
                slots.push(`${endHour.toString().padStart(2, '0')}:00`)
            }
            setTimeSlots(slots)
        } catch (error) {
            console.warn('Could not generate time slots, using defaults:', error)
            // Fallback to default time slots
            const slots: string[] = []
            for (let hour = 5; hour < 24; hour++) {
                slots.push(`${hour.toString().padStart(2, '0')}:00`)
                slots.push(`${hour.toString().padStart(2, '0')}:30`)
            }
            slots.push('24:00')
            setTimeSlots(slots)
        }
    }, [storeData])

    // Fetch field pricings
    useEffect(() => {
        if (!fieldId) return

        const fetchPricings = async () => {
            try {
                const pricingsResponse = await FieldPricingService.getAllFieldPricings(fieldId)
                if (pricingsResponse.data) {
                    console.log('[DEBUG] All pricings fetched:', pricingsResponse.data)
                    setFieldPricings(pricingsResponse.data)
                }
            } catch (error) {
                console.warn('No pricing data available, using default price only:', error)
                setFieldPricings([]) // Set empty array to use default prices
            }
        }

        fetchPricings()
    }, [fieldId])

    // Fetch field details
    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                setLoading(true)

                if (!fieldId) {
                    throw new Error('Field ID not found')
                }

                // Initialize empty booking data - will be populated from backend
                const bookingStatus: BookingStatus = {
                    'subcourt-001': {},
                    'subcourt-002': {},
                    'subcourt-003': {},
                }

                setBookingData(bookingStatus)

                // Set default booked slot for demo - 10:00 on subcourt-001
                const defaultBookedSlot = '10:00'
                bookingStatus['subcourt-001'][defaultBookedSlot] = 'booked'
                setBookingData(bookingStatus)

                // Set default customer booking info
                const defaultBookingInfo: BookingInfo = {
                    id: 'booking-001',
                    courtId: 'subcourt-001',
                    timeSlot: defaultBookedSlot,
                    customerName: 'Nguyễn Văn A',
                    customerPhone: '0909123456',
                    customerEmail: 'customer@example.com',
                    customerAddress: 'Hà Nội, Việt Nam',
                    bookingTime: new Date().toLocaleString('vi-VN'),
                    price: parseInt(field?.defaultPrice || '100000')
                }

                const bookingKey = `subcourt-001-${defaultBookedSlot}`
                setBookingDataWithCustomer({ [bookingKey]: defaultBookingInfo })
            } catch (error) {
                console.error('Error initializing field page:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFieldData()
    }, [fieldId, field])



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
                title: 'Thành công ',
                description: 'Thông tin sân đã được cập nhật',
            })

            setShowEditModal(false)
            // Note: field data will be refreshed automatically from React Query cache
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
                title: 'Thành công ',
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
        setPricingMode('day-of-week')
        setPricingForm({
            day_of_weeks: [],
            start_at: '17:00',
            end_at: '19:30',
            price: field?.defaultPrice || ''
        })
        setSpecialDatePricingForm({
            date: selectedDate,
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
            if (pricingMode === 'day-of-week') {
                // Old API - day of week pricing
                if (pricingForm.day_of_weeks.length === 0) {
                    toast({
                        title: 'Lỗi',
                        description: 'Vui lòng chọn ít nhất một ngày trong tuần',
                        variant: 'destructive',
                    })
                    return
                }

                await FieldPricingService.createFieldPricing({
                    field_id: field._id,
                    day_of_weeks: pricingForm.day_of_weeks,
                    start_at: pricingForm.start_at,
                    end_at: pricingForm.end_at,
                    price: pricingForm.price
                })
            } else {
                // New API - specific date pricing
                if (!specialDatePricingForm.date) {
                    toast({
                        title: 'Lỗi',
                        description: 'Vui lòng chọn ngày',
                        variant: 'destructive',
                    })
                    return
                }

                // Format date and time for API: "2025-12-01 20:00"
                const dateStr = specialDatePricingForm.date // YYYY-MM-DD
                const startDateTime = `${dateStr} ${specialDatePricingForm.start_at}`
                const endDateTime = `${dateStr} ${specialDatePricingForm.end_at}`

                await FieldPricingService.createSpecialDatePricing({
                    field_id: field._id,
                    start_at: startDateTime,
                    end_at: endDateTime,
                    price: specialDatePricingForm.price
                })
            }

            toast({
                title: 'Thành công ',
                description: `Đã thêm giá đặc biệt ${pricingMode === 'day-of-week' ? 'theo thứ trong tuần' : 'cho ngày cụ thể'}`,
            })

            setShowPricingModal(false)

            // Refresh pricings (both day-of-week and special date)
            const pricingsResponse = await FieldPricingService.getAllFieldPricings(field._id)
            if (pricingsResponse.data) {
                setFieldPricings(pricingsResponse.data)
            }

            // React Query hook will auto-refresh field data
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
                title: 'Thành công ',
                description: 'Đã xóa giá đặc biệt',
            })

            // Refresh pricings
            if (field) {
                const pricingsResponse = await FieldPricingService.getAllFieldPricings(field._id)
                if (pricingsResponse.data) {
                    setFieldPricings(pricingsResponse.data)
                }

                // React Query hook will auto-refresh field data
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

        console.log(`[getSlotPrice] Processing slot: ${timeSlot} on date: ${selectedDate} (${dayOfWeek})`)
        console.log(`[getSlotPrice] Total fieldPricings: ${fieldPricings?.length || 0}`)

        // First, check for special date pricing
        if (fieldPricings && fieldPricings.length > 0) {
            // Check if any pricing matches this specific date and time
            const specialDatePricing = fieldPricings.find(pricing => {
                // Check if this is a special date pricing (has datetime in startAt)
                if (!pricing.startAt || !pricing.endAt) return false

                const startAtStr = typeof pricing.startAt === 'string' ? pricing.startAt : ''
                const endAtStr = typeof pricing.endAt === 'string' ? pricing.endAt : ''

                if (!startAtStr || !endAtStr) {
                    console.log(`[getSlotPrice] Skipping pricing - missing startAt/endAt`)
                    return false
                }

                // Check if this has a date component (special date pricing)
                // Format: "2025-12-01 23:00" or "2025-12-01T23:00:00.000Z"
                const hasDateComponent = (startAtStr as string).includes('-') && ((startAtStr as string).includes('T') || (startAtStr as string).includes(' '))
                if (!hasDateComponent) {
                    console.log(`[getSlotPrice] Skipping day-of-week pricing: ${startAtStr}`)
                    return false // This is a day-of-week pricing (format: "17:00"), skip it
                }

                // Parse start datetime - handle both formats
                let startDateTime: Date
                if ((startAtStr as string).includes('T')) {
                    startDateTime = new Date(startAtStr as string)
                } else {
                    // Format: "2025-12-03 03:00" - replace space with T for Date parsing
                    startDateTime = new Date((startAtStr as string).replace(' ', 'T'))
                }

                // Parse end datetime
                let endDateTime: Date
                if ((endAtStr as string).includes('T')) {
                    endDateTime = new Date(endAtStr as string)
                } else {
                    endDateTime = new Date((endAtStr as string).replace(' ', 'T'))
                }

                // Parse the time slot (HH:MM)
                const [slotHour, slotMinute] = timeSlot.split(':').map(Number)

                // Create slot datetime string: "2025-12-02 21:00"
                const slotDateTimeStr = `${selectedDate} ${timeSlot}:00`

                // Compare as strings in format "YYYY-MM-DD HH:MM:SS"
                // This avoids timezone conversion issues
                const slotMinutes = slotHour * 60 + slotMinute

                // Extract time parts from pricing strings
                const startTimePart = (startAtStr as string).includes(' ') ? (startAtStr as string).split(' ')[1] : (startAtStr as string).split('T')[1]?.substring(0, 5) || ''
                const endTimePart = (endAtStr as string).includes(' ') ? (endAtStr as string).split(' ')[1] : (endAtStr as string).split('T')[1]?.substring(0, 5) || ''

                const startTimeHour = parseInt(startTimePart.split(':')[0] || '0')
                const startTimeMin = parseInt(startTimePart.split(':')[1] || '0')
                const startTimeTotal = startTimeHour * 60 + startTimeMin

                const endTimeHour = parseInt(endTimePart.split(':')[0] || '0')
                const endTimeMin = parseInt(endTimePart.split(':')[1] || '0')
                const endTimeTotal = endTimeHour * 60 + endTimeMin

                // Check if dates match or if it crosses midnight
                const startDateStr = (startAtStr as string).split(' ')[0] || (startAtStr as string).split('T')[0]
                const endDateStr = (endAtStr as string).split(' ')[0] || (endAtStr as string).split('T')[0]

                let isInRange = false

                if (startDateStr === selectedDate && endDateStr === selectedDate) {
                    // Both on same day: check if slot time is within range
                    isInRange = slotMinutes >= startTimeTotal && slotMinutes < endTimeTotal
                } else if (startDateStr === selectedDate && endDateStr > selectedDate) {
                    // Cross midnight: start date matches and end is next day
                    isInRange = slotMinutes >= startTimeTotal
                } else if (startDateStr < selectedDate && endDateStr === selectedDate) {
                    // Cross midnight: start is previous day and end date matches
                    isInRange = slotMinutes < endTimeTotal
                }

                console.log(`[getSlotPrice] Checking special date pricing:`, {
                    timeSlot,
                    selectedDate,
                    slotMinutes,
                    startDateStr,
                    endDateStr,
                    startTimeTotal,
                    endTimeTotal,
                    isInRange,
                    price: pricing.specialPrice
                })

                return isInRange
            })

            if (specialDatePricing) {
                console.log(`[getSlotPrice]  Found special date pricing: ${specialDatePricing.specialPrice}`)
                return specialDatePricing.specialPrice || parseInt(field?.defaultPrice || '0')
            }
        }

        // Fallback: check for day-of-week pricing
        const specialPrice = FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek)
        if (specialPrice) {
            console.log(`[getSlotPrice] Found day-of-week pricing: ${specialPrice}`)
            return specialPrice
        }

        const defaultPrice = parseInt(field?.defaultPrice || '0')
        console.log(`[getSlotPrice] Using default price: ${defaultPrice}`)
        return defaultPrice
    }

    return (
        <StoreLayout>
            <div className="w-full max-w-full overflow-x-hidden">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div>

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


                    {/* Two Column Layout: 75% Left Content + 25% Right Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Column - 75% */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Legend/Chú thích */}
                            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-6 justify-center flex-wrap">
                                        <h4 className="text-lg font-bold text-gray-800 mr-4">Chú thích:</h4>

                                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-emerald-100">
                                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-100 to-blue-100 border-2 border-emerald-200 rounded flex items-center justify-center">

                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Còn trống</span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-red-100">
                                            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center">
                                                <span className="text-white text-xs">✕</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Đã được đặt</span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100">
                                            <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded flex items-center justify-center">
                                                <span className="text-white text-xs">🔒</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Tạm khóa</span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-emerald-100">
                                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-100 to-blue-100 border-2 border-amber-400 rounded flex items-center justify-center">
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Giá đặc biệt</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Booking Grid */}
                            <Card className="shadow-xl border-0">
                                <CardContent className="p-0">
                                    {/* Modern Header */}
                                    <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 md:p-6">
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl md:text-2xl font-bold mb-2">Quản lý sân</h3>
                                                <p className="text-emerald-100 text-sm md:text-base">Chọn ngày: {selectedDate} • Chọn khung giờ phù hợp</p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowMaintenanceModal(true)}
                                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 gap-2"
                                                >
                                                    <Pause className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Ngừng hoạt động</span>
                                                </Button> */}
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
                                        {/* <div className="border-b border-gray-200 px-4 md:px-6 py-4 bg-gray-50 flex items-center gap-4">
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
                                        </div> */}

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
                                                                                title={bookingInfo ? `${bookingInfo.customerName}` : ''}
                                                                            >
                                                                                {status === 'booked' && (
                                                                                    <span className="text-white text-xs">✕</span>
                                                                                )}
                                                                            </button>
                                                                            {/* Price tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                                                <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg ${isSpecialPrice ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-white'
                                                                                    }`}>
                                                                                    {slotPrice.toLocaleString()}đ
                                                                                    {isSpecialPrice && <span className="ml-1">⭐</span>}
                                                                                </div>
                                                                            </div>

                                                                            {/* Customer info tooltip */}
                                                                            {status === 'booked' && bookingInfo && (
                                                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                                                                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-xl px-3 py-2 text-xs whitespace-nowrap border border-blue-400">
                                                                                        <div className="font-bold">{bookingInfo.customerName}</div>
                                                                                        <div className="text-blue-100 text-xs">{bookingInfo.customerPhone}</div>
                                                                                    </div>
                                                                                    {/* Arrow */}
                                                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-blue-800"></div>
                                                                                </div>
                                                                            )}
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
                        </div>

                        {/* Right Sidebar - 25% */}
                        <div className="lg:col-span-1">
                            {/* Special Pricing Overview Sidebar */}
                            <div className="sticky top-6">
                                <Card className="shadow-lg border-0 h-full">
                                    <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                                        <CardTitle className="flex items-center gap-2 text-yellow-900">
                                            <Calendar className="h-5 w-5" />
                                            Giá đặc biệt
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        {fieldPricings && fieldPricings.length > 0 ? (
                                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                                {(() => {
                                                    // Group pricings by day of week
                                                    const pricingsByDay: { [key: string]: FieldPricing[] } = {
                                                        'monday': [],
                                                        'tuesday': [],
                                                        'wednesday': [],
                                                        'thursday': [],
                                                        'friday': [],
                                                        'saturday': [],
                                                        'sunday': []
                                                    }

                                                    const specialDatePricings: FieldPricing[] = []

                                                    fieldPricings.forEach(pricing => {
                                                        if (pricing.dayOfWeek && pricingsByDay[pricing.dayOfWeek]) {
                                                            // Day-of-week pricing
                                                            pricingsByDay[pricing.dayOfWeek].push(pricing)
                                                        } else if (!pricing.dayOfWeek && pricing.startAt && typeof pricing.startAt === 'string') {
                                                            // Special date pricing (has format "2025-12-02 20:00")
                                                            specialDatePricings.push(pricing)
                                                        }
                                                    })

                                                    const dayNames: { [key: string]: string } = {
                                                        'monday': 'Thứ 2',
                                                        'tuesday': 'Thứ 3',
                                                        'wednesday': 'Thứ 4',
                                                        'thursday': 'Thứ 5',
                                                        'friday': 'Thứ 6',
                                                        'saturday': 'Thứ 7',
                                                        'sunday': 'Chủ nhật'
                                                    }

                                                    // Render day-of-week pricings
                                                    const dayOfWeekElements = Object.entries(pricingsByDay)
                                                        .filter(([_, pricings]) => pricings.length > 0)
                                                        .map(([day, pricings]) => (
                                                            <div
                                                                key={`day-pricing-${day}`}
                                                                className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="font-bold text-sm text-yellow-900 mb-2">
                                                                    {dayNames[day]}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {pricings.sort((a, b) => {
                                                                        const timeA = a.startAt.hour * 60 + a.startAt.minute
                                                                        const timeB = b.startAt.hour * 60 + b.startAt.minute
                                                                        return timeA - timeB
                                                                    }).map((pricing, idx) => (
                                                                        <div
                                                                            key={`pricing-detail-${pricing._id}-${idx}`}
                                                                            className="flex items-center justify-between bg-white p-2 rounded border border-yellow-100 text-xs"
                                                                        >
                                                                            <div className="text-gray-700">
                                                                                <span className="font-medium">
                                                                                    {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="font-bold text-emerald-600">
                                                                                {pricing.specialPrice.toLocaleString()}đ
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))

                                                    // Render special date pricings - grouped by date
                                                    const specialDatesByDate: { [key: string]: FieldPricing[] } = {}
                                                    specialDatePricings.forEach(pricing => {
                                                        const startAtStr = typeof pricing.startAt === 'string' ? pricing.startAt : ''
                                                        const dateStr = startAtStr.split(' ')[0]
                                                        if (!specialDatesByDate[dateStr]) {
                                                            specialDatesByDate[dateStr] = []
                                                        }
                                                        specialDatesByDate[dateStr].push(pricing)
                                                    })

                                                    const specialDateElements = Object.entries(specialDatesByDate)
                                                        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Sort by date descending (newest first)
                                                        .map(([date, pricings]) => (
                                                            <div
                                                                key={`special-date-pricing-${date}`}
                                                                className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="font-bold text-sm text-blue-900 mb-2">
                                                                    {new Date(date).toLocaleDateString('vi-VN')}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {pricings.sort((a, b) => {
                                                                        const aStartStr = typeof a.startAt === 'string' ? a.startAt : ''
                                                                        const bStartStr = typeof b.startAt === 'string' ? b.startAt : ''
                                                                        const timeA = parseInt(aStartStr.split(' ')[1]?.split(':')[0] || '0') * 60 + parseInt(aStartStr.split(' ')[1]?.split(':')[1] || '0')
                                                                        const timeB = parseInt(bStartStr.split(' ')[1]?.split(':')[0] || '0') * 60 + parseInt(bStartStr.split(' ')[1]?.split(':')[1] || '0')
                                                                        return timeA - timeB
                                                                    }).map((pricing, idx) => (
                                                                        <div
                                                                            key={`special-pricing-detail-${pricing._id}-${idx}`}
                                                                            className="flex items-center justify-between bg-white p-2 rounded border border-blue-100 text-xs"
                                                                        >
                                                                            <div className="text-gray-700">
                                                                                <span className="font-medium">
                                                                                    {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="font-bold text-emerald-600">
                                                                                {pricing.specialPrice.toLocaleString()}đ
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))

                                                    return [...dayOfWeekElements, ...specialDateElements]
                                                })()}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                                                <p className="text-gray-500 mb-3 text-sm">Chưa có giá đặc biệt nào được thiết lập</p>
                                                <Button
                                                    size="sm"
                                                    className="bg-yellow-600 hover:bg-yellow-700 w-full"
                                                    onClick={handleOpenPricingModal}
                                                >
                                                    Thêm giá đặc biệt
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

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
                                <DialogTitle>Quản lý giá đặc biệt</DialogTitle>
                                <DialogDescription>
                                    Thiết lập giá đặc biệt theo ngày trong tuần hoặc ngày cụ thể
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Pricing Mode Tabs */}
                                <div className="flex gap-2 border-b">
                                    <button
                                        onClick={() => {
                                            setPricingMode('day-of-week')
                                            // Reset form when switching to day-of-week mode
                                            setPricingForm({
                                                day_of_weeks: [],
                                                start_at: '17:00',
                                                end_at: '19:30',
                                                price: field?.defaultPrice || ''
                                            })
                                        }}
                                        className={`px-4 py-2 font-medium transition-colors ${pricingMode === 'day-of-week'
                                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Theo thứ trong tuần
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPricingMode('specific-date')
                                            // Reset form when switching to specific-date mode
                                            setSpecialDatePricingForm({
                                                date: selectedDate,
                                                start_at: '17:00',
                                                end_at: '19:30',
                                                price: field?.defaultPrice || ''
                                            })
                                        }}
                                        className={`px-4 py-2 font-medium transition-colors ${pricingMode === 'specific-date'
                                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Ngày cụ thể
                                    </button>
                                </div>

                                {/* Current Special Pricings for Selected Date */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Giá đặc biệt ngày {selectedDate}</h3>
                                    {(() => {
                                        const selectedDateObj = new Date(selectedDate)
                                        const selectedDayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)

                                        // Filter day-of-week pricings
                                        const dayOfWeekPricings = fieldPricings.filter(pricing => pricing.dayOfWeek === selectedDayOfWeek)

                                        // Filter special date pricings for the selected date
                                        const specialDatePricings = fieldPricings.filter(pricing => {
                                            // Special date pricing has startAt in format "2025-12-02 20:00"
                                            if (!pricing.startAt) return false
                                            const startAtStr = typeof pricing.startAt === 'string' ? pricing.startAt : ''
                                            if (startAtStr && (startAtStr as string).includes(':') && (startAtStr as string).includes('-')) {
                                                // This is a special date pricing
                                                const pricingDate = (startAtStr as string).split(' ')[0]
                                                return pricingDate === selectedDate
                                            }
                                            return false
                                        })

                                        const allPricingsForDate = [...dayOfWeekPricings, ...specialDatePricings]

                                        return allPricingsForDate.length > 0 ? (
                                            <div className="space-y-2">
                                                {allPricingsForDate.map((pricing, idx) => {
                                                    const pricingDateDisplay = typeof pricing.startAt === 'string' ? (pricing.startAt as string).split(' ')?.[0] : 'N/A'
                                                    return (
                                                        <div
                                                            key={`pricing-item-${pricing._id}-${idx}`}
                                                            className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900">
                                                                    {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                </div>
                                                                <div className="text-sm text-gray-600 capitalize">
                                                                    {pricing.dayOfWeek ? pricing.dayOfWeek : `Ngày cụ thể (${pricingDateDisplay})`}
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
                                                    )
                                                })}
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
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                        Thêm giá đặc biệt {pricingMode === 'day-of-week' ? 'theo thứ trong tuần' : 'cho ngày cụ thể'}
                                    </h3>

                                    <div className="space-y-4">
                                        {pricingMode === 'day-of-week' ? (
                                            // Day of Week Mode
                                            <>
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
                                                        <p className="text-xs text-gray-500 mt-1">Bắt buộc phải là hh:00 hoặc hh:30</p>
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
                                                        <p className="text-xs text-gray-500 mt-1">Bắt buộc phải là hh:00 hoặc hh:30</p>
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
                                            </>
                                        ) : (
                                            // Specific Date Mode
                                            <>
                                                {/* Date Selection */}
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Chọn ngày</label>
                                                    <Input
                                                        type="date"
                                                        value={specialDatePricingForm.date}
                                                        onChange={(e) => setSpecialDatePricingForm({ ...specialDatePricingForm, date: e.target.value })}
                                                        className="mt-1"
                                                    />
                                                </div>

                                                {/* Time Range */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Từ giờ</label>
                                                        <Input
                                                            type="time"
                                                            value={specialDatePricingForm.start_at}
                                                            onChange={(e) => setSpecialDatePricingForm({ ...specialDatePricingForm, start_at: e.target.value })}
                                                            step="1800"
                                                            className="mt-1"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">Bắt buộc phải là hh:00 hoặc hh:30</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Đến giờ</label>
                                                        <Input
                                                            type="time"
                                                            value={specialDatePricingForm.end_at}
                                                            onChange={(e) => setSpecialDatePricingForm({ ...specialDatePricingForm, end_at: e.target.value })}
                                                            step="1800"
                                                            className="mt-1"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">Bắt buộc phải là hh:00 hoặc hh:30</p>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Giá đặc biệt (đ)</label>
                                                    <Input
                                                        type="number"
                                                        value={specialDatePricingForm.price}
                                                        onChange={(e) => setSpecialDatePricingForm({ ...specialDatePricingForm, price: e.target.value })}
                                                        placeholder="Nhập giá..."
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </>
                                        )}

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
                                                disabled={
                                                    pricingMode === 'day-of-week'
                                                        ? (pricingForm.day_of_weeks.length === 0 || !pricingForm.price || !pricingForm.start_at || !pricingForm.end_at)
                                                        : (!specialDatePricingForm.date || !specialDatePricingForm.price || !specialDatePricingForm.start_at || !specialDatePricingForm.end_at)
                                                }
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