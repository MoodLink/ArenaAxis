"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { getStoreById, getSportById } from "@/services/api-new"
import { getFieldBookingGrid } from "@/services/api"
import { FieldService } from "@/services/field.service"
import { FieldPricingService } from "@/services/field-pricing.service"
import { OrderService } from "@/services/order.service"
import type { Field as FieldServiceType } from "@/services/field.service"
import type { StoreClientDetailResponse, Sport } from "@/types"
import PageHeader from "@/components/layout/PageHeader"

import {
    BookingLoadingState,
    BookingDateSelector,
    BookingLegend,
} from "@/components/booking"
import { StoreBookingGrid, StoreBookingSummary } from "@/components/store"

export default function StoreBookingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const storeId = searchParams.get('store_id')
    const sportId = searchParams.get('sport_id')

    const [selectedDate, setSelectedDate] = useState(() => {
        // Check if user just returned from payment with a booking date
        if (typeof window !== 'undefined') {
            // ✅ Ưu tiên khôi phục từ pending booking (sau khi login)
            const pendingBooking = sessionStorage.getItem('pendingBooking')
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking)
                    console.log('📋 Restoring pending booking date:', bookingData.selectedDate)
                    return bookingData.selectedDate
                } catch (e) {
                    console.error('❌ Error parsing pendingBooking:', e)
                }
            }

            // Kiểm tra lastBookingDate (sau khi thanh toán)
            const lastBookingDate = sessionStorage.getItem('lastBookingDate')
            if (lastBookingDate) {
                console.log('📅 Using last booking date:', lastBookingDate)
                sessionStorage.removeItem('lastBookingDate')
                return lastBookingDate
            }
        }
        return new Date().toISOString().split('T')[0]
    })
    const [selectedSlots, setSelectedSlots] = useState<string[]>([])
    const [store, setStore] = useState<StoreClientDetailResponse | null>(null)
    const [sport, setSport] = useState<Sport | null>(null)
    const [fields, setFields] = useState<FieldServiceType[]>([])
    const [bookingData, setBookingData] = useState<{
        [fieldId: string]: {
            [timeSlot: string]: "available" | "booked" | "locked" | "selected"
        }
    }>({})
    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [fieldPricings, setFieldPricings] = useState<{
        [fieldId: string]: any[]
    }>({})

    // 🔄 Helper function to refresh booking data from store orders - DEFINED FIRST before useEffects that use it
    const refreshBookingData = useCallback(async () => {
        console.log('🔄 refreshBookingData called with:', { storeId, fields: fields.length, selectedDate })

        if (!storeId || fields.length === 0) {
            console.log('⏭️ Skipping refresh - no storeId or fields yet')
            return
        }

        try {
            console.log('🔄 Fetching orders from store for date:', selectedDate)
            console.log('🔍 Type of selectedDate:', typeof selectedDate)
            console.log('🔍 selectedDate value:', JSON.stringify(selectedDate))

            // ✅ IMPORTANT: Get ALL orders from store (not filtered by date)
            // Because orders are created on one date but can be booked for future dates
            // We'll filter based on orderDetails.startTime instead
            const farFutureDate = new Date(selectedDate)
            farFutureDate.setFullYear(farFutureDate.getFullYear() + 1)
            const startDateStr = '2000-01-01'  // Far past
            const endDateStr = farFutureDate.toISOString().split('T')[0]  // Far future

            console.log(`📅 Fetching orders for store: ${startDateStr} to ${endDateStr}`)
            console.log(`✅ This gets ALL orders so we can filter by booking date (not payment date)`)

            // Fetch all orders for the store
            const orders = await OrderService.getOrdersByStore(
                storeId,
                startDateStr,
                endDateStr
            )

            console.log('📦 Orders received:', { count: orders.length, orders })

            // Build bookingData from paid orders
            const bookingMap: { [fieldId: string]: { [timeSlot: string]: "available" | "booked" | "locked" | "selected" } } = {}

            // Initialize all fields with empty booking data
            fields.forEach(field => {
                bookingMap[field._id] = {}
            })

            // Filter PAID orders only and extract booked slots
            const paidOrders = orders.filter(order => order.statusPayment === 'PAID')
            console.log(`✅ Found ${paidOrders.length} PAID orders out of ${orders.length} total`)
            console.log('🔍 All orders:', orders.map(o => ({ code: o.orderCode, status: o.statusPayment, details: o.orderDetails.map(d => ({ startTime: d.startTime, endTime: d.endTime })) })))

            // For each paid order, mark the booked slots
            paidOrders.forEach(order => {
                console.log(`🔍 Processing order ${order.orderCode} with ${order.orderDetails.length} details`)
                order.orderDetails.forEach((detail, idx) => {
                    const fieldId = detail.fieldId
                    console.log(`  Detail ${idx}: fieldId=${fieldId}, startTime="${detail.startTime}", endTime="${detail.endTime}", type: ${typeof detail.startTime}`)

                    // Parse start and end times
                    // Support both formats:
                    // 1. "2025-11-13 05:00" (YYYY-MM-DD HH:MM)
                    // 2. "05:00" (HH:MM)
                    let startTimeStr = ""
                    let endTimeStr = ""
                    let orderDate = ""  // Extract date from startTime if available

                    if (detail.startTime.includes(" ")) {
                        // Format: "2025-11-13 05:00"
                        const dateMatch = detail.startTime.match(/(\d{4}-\d{2}-\d{2})/)
                        const timeMatch = detail.startTime.match(/(\d{2}):(\d{2})$/)

                        if (dateMatch) {
                            orderDate = dateMatch[1]  // e.g., "2025-11-13"
                        }

                        if (timeMatch) {
                            const endTimeMatch = detail.endTime.match(/(\d{2}):(\d{2})$/)
                            startTimeStr = `${timeMatch[1]}:${timeMatch[2]}`
                            endTimeStr = endTimeMatch ? `${endTimeMatch[1]}:${endTimeMatch[2]}` : ""
                        }
                    } else {
                        // Format: "05:00"
                        startTimeStr = detail.startTime
                        endTimeStr = detail.endTime
                    }

                    // ⚠️ IMPORTANT: Only process orderDetails that match the selected date
                    const formattedSelectedDate = selectedDate  // e.g., "2025-11-14"
                    if (orderDate && orderDate !== formattedSelectedDate) {
                        console.log(`  ⏭️ Skipping - order date "${orderDate}" doesn't match selected date "${formattedSelectedDate}"`)
                        return  // Skip this detail
                    }

                    if (startTimeStr && endTimeStr && fieldId) {
                        if (!bookingMap[fieldId]) {
                            bookingMap[fieldId] = {}
                        }

                        // Generate all 30-minute slots between start and end time
                        const startMinutes = parseInt(startTimeStr.split(':')[0]) * 60 + parseInt(startTimeStr.split(':')[1])
                        const endMinutes = parseInt(endTimeStr.split(':')[0]) * 60 + parseInt(endTimeStr.split(':')[1])

                        console.log(`  🔢 Start: ${startMinutes} min, End: ${endMinutes} min`)

                        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
                            const hours = Math.floor(minutes / 60)
                            const mins = minutes % 60
                            const slotTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

                            bookingMap[fieldId][slotTime] = 'booked'
                            console.log(`    ✅ Marked as booked: Field ${fieldId} @ ${slotTime}`)
                        }
                    } else {
                        console.warn(`  ⚠️ Could not parse time from: ${detail.startTime} - ${detail.endTime}`)
                    }
                })
            })

            // For all fields, get their available slots from API and merge with booked slots
            await Promise.all(
                fields.map(async (field: FieldServiceType) => {
                    try {
                        const fieldBookingData = await getFieldBookingGrid(field._id, selectedDate)
                        const flatBookingData: { [timeSlot: string]: string } = {}
                        Object.values(fieldBookingData).forEach((courtData: any) => {
                            Object.assign(flatBookingData, courtData)
                        })
                        // Merge with existing booking data (booked slots take precedence over available)
                        bookingMap[field._id] = { ...flatBookingData as any, ...bookingMap[field._id] }

                        const bookedCount = Object.values(bookingMap[field._id]).filter(s => s === 'booked').length
                        const availableCount = Object.values(bookingMap[field._id]).filter(s => s === 'available').length
                        const totalSlots = Object.keys(bookingMap[field._id]).length
                        console.log(`✅ Merged booking grid for field ${field._id}: ${totalSlots} total slots (${bookedCount} booked, ${availableCount} available)`)
                    } catch (error) {
                        console.warn(`⚠️ Failed to get booking grid for field ${field._id}:`, error)
                        // Field will still have booked slots from orders, which is fine
                    }
                })
            )

            setBookingData(bookingMap)
            console.log('📊 Final booking data:', bookingMap)
            Object.entries(bookingMap).forEach(([fieldId, slots]) => {
                const booked = Object.entries(slots).filter(([_, status]) => status === 'booked').map(([time, _]) => time)
                const available = Object.entries(slots).filter(([_, status]) => status === 'available').map(([time, _]) => time)
                console.log(`   Field ${fieldId}: Booked [${booked.join(', ')}], Available [${available.length} slots]`)
            })
        } catch (error) {
            console.error('❌ Error refreshing booking data:', error)
        }
    }, [storeId, fields, selectedDate])

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!storeId || !sportId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                console.log('🔍 Fetching store booking data:', { storeId, sportId })

                // Fetch store, sport, and fields data in parallel
                const [storeData, sportData, fieldsResponse] = await Promise.all([
                    getStoreById(storeId),
                    getSportById(sportId),
                    FieldService.getFieldsBySport(sportId, storeId)
                ])

                console.log('📦 Store data:', storeData)
                console.log('⚽ Sport data:', sportData)
                console.log('🏟️ Fields response:', fieldsResponse)

                setStore(storeData)
                setSport(sportData)

                // Filter only active fields
                const activeFields = (fieldsResponse.data || []).filter(f => f.activeStatus)
                setFields(activeFields)

                // Fetch pricing for each field
                const pricingMap: { [fieldId: string]: any[] } = {}
                await Promise.all(
                    activeFields.map(async (field) => {
                        try {
                            const pricingResponse = await FieldPricingService.getFieldPricings(field._id)
                            pricingMap[field._id] = pricingResponse.data || []
                            console.log(`💰 Pricing for field ${field._id}:`, pricingMap[field._id])
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch pricing for field ${field._id}:`, error)
                            pricingMap[field._id] = []
                        }
                    })
                )
                setFieldPricings(pricingMap)

                // Generate time slots based on store opening hours
                const slots: string[] = []
                const startHour = storeData?.startTime ? parseInt(storeData.startTime.split(':')[0]) : 5
                const endHour = storeData?.endTime ? parseInt(storeData.endTime.split(':')[0]) : 24

                for (let hour = startHour; hour < endHour; hour++) {
                    slots.push(`${hour.toString().padStart(2, "0")}:00`)
                    slots.push(`${hour.toString().padStart(2, "0")}:30`)
                }
                if (endHour > startHour) {
                    slots.push(`${endHour.toString().padStart(2, "0")}:00`)
                }
                setTimeSlots(slots)

                // ✅ Initial booking data fetch for selectedDate
                console.log('📅 Fetching initial booking data for date:', selectedDate)
                const bookingMap: { [fieldId: string]: any } = {}
                await Promise.all(
                    activeFields.map(async (field: FieldServiceType) => {
                        try {
                            const fieldBookingData = await getFieldBookingGrid(field._id, selectedDate)
                            console.log(`📅 Raw booking data for field ${field._id}:`, fieldBookingData)

                            const flatBookingData: { [timeSlot: string]: string } = {}
                            Object.values(fieldBookingData).forEach((courtData: any) => {
                                Object.assign(flatBookingData, courtData)
                            })

                            bookingMap[field._id] = flatBookingData
                            console.log(`✅ Flattened booking data for field ${field._id}:`, bookingMap[field._id])
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch booking for field ${field._id}:`, error)
                            bookingMap[field._id] = {}
                            slots.forEach((slot: string) => {
                                bookingMap[field._id][slot] = "available"
                            })
                        }
                    })
                )
                console.log('📊 Final bookingMap:', bookingMap)
                setBookingData(bookingMap)

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [storeId, sportId, selectedDate])

    // Update booking data when date changes
    useEffect(() => {
        if (fields.length > 0 && selectedDate) {
            const fetchBookingData = async () => {
                console.log('📅 Fetching booking for date:', selectedDate)
                const bookingMap: { [fieldId: string]: any } = {}

                await Promise.all(
                    fields.map(async (field: FieldServiceType) => {
                        try {
                            const fieldBookingData = await getFieldBookingGrid(field._id, selectedDate)
                            const flatBookingData: { [timeSlot: string]: string } = {}
                            Object.values(fieldBookingData).forEach((courtData: any) => {
                                Object.assign(flatBookingData, courtData)
                            })
                            bookingMap[field._id] = flatBookingData
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch booking for field ${field._id}:`, error)
                            bookingMap[field._id] = {}
                        }
                    })
                )

                setBookingData(bookingMap)
            }

            fetchBookingData()
        }
    }, [selectedDate, fields])

    // 🔄 Trigger refresh when fields are first loaded
    useEffect(() => {
        if (fields.length > 0 && storeId && selectedDate) {
            console.log('✅ Fields loaded - refreshing booking data immediately')
            refreshBookingData()
        }
    }, [fields.length, storeId, selectedDate, refreshBookingData])

    // 🔄 Re-fetch booking data when page is focused or payment completed
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('👁️ Page focused again - re-fetching booking data')
                if (fields.length > 0 && storeId) {
                    refreshBookingData()
                }
            }
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'paymentCompleted' && e.newValue === 'true') {
                console.log('💳 Payment completed (storage event) - refreshing booking data')
                if (fields.length > 0 && storeId) {
                    // Refresh immediately and repeatedly for first 3 seconds
                    refreshBookingData()
                    const refreshInterval = setInterval(() => {
                        if (fields.length > 0 && storeId) {
                            refreshBookingData()
                        }
                    }, 1000)
                    setTimeout(() => clearInterval(refreshInterval), 3000)
                }
                sessionStorage.removeItem('paymentCompleted')
            }
        }

        // ✅ Listen to custom event for same-tab payment completion
        const handlePaymentCompleted = (e: any) => {
            console.log('💳 Payment completed (custom event) - refreshing booking data', e.detail)
            if (fields.length > 0 && storeId) {
                // Refresh immediately and repeatedly for first 3 seconds
                refreshBookingData()
                const refreshInterval = setInterval(() => {
                    if (fields.length > 0 && storeId) {
                        refreshBookingData()
                    }
                }, 1000)
                setTimeout(() => clearInterval(refreshInterval), 3000)
            }
        }

        const handlePopState = () => {
            console.log('🔙 Back button - refreshing booking data')
            if (fields.length > 0 && storeId) {
                refreshBookingData()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('paymentCompleted', handlePaymentCompleted)
        window.addEventListener('popstate', handlePopState)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('paymentCompleted', handlePaymentCompleted)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [refreshBookingData, fields.length, storeId])

    // 🔄 Auto-refresh every 30 seconds
    useEffect(() => {
        console.log('⏰ Setting up auto-refresh interval')
        const interval = setInterval(() => {
            console.log('⏰ Auto-refresh...')
            refreshBookingData()
        }, 30000)

        return () => clearInterval(interval)
    }, [refreshBookingData])

    const handleSlotClick = (fieldId: string, timeSlot: string) => {
        const status = bookingData[fieldId]?.[timeSlot]
        console.log('🎯 handleSlotClick called:', { fieldId, timeSlot, status, currentSelectedSlots: selectedSlots })
        if (status === "available") {
            const slotKey = `${fieldId}:${timeSlot}`
            console.log('✅ Slot is available, adding to selected:', slotKey)
            setSelectedSlots((prev) => {
                if (prev.includes(slotKey)) {
                    console.log('❌ Removing slot:', slotKey)
                    return prev.filter((s) => s !== slotKey)
                } else {
                    console.log('✅ Adding slot:', slotKey)
                    return [...prev, slotKey]
                }
            })
        } else {
            console.log('⚠️ Slot status is not available:', status)
        }
    }

    // ✅ Khôi phục slots đã chọn sau khi đăng nhập
    useEffect(() => {
        if (typeof window !== 'undefined' && fields.length > 0) {
            const pendingBooking = sessionStorage.getItem('pendingBooking')
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking)
                    console.log('📋 Restoring pending booking slots:', bookingData.selectedSlots)

                    // Chỉ khôi phục nếu đúng store và sport
                    if (bookingData.storeId === storeId) {
                        setSelectedSlots(bookingData.selectedSlots || [])

                        // Xóa pending booking sau khi khôi phục
                        sessionStorage.removeItem('pendingBooking')
                    }
                } catch (e) {
                    console.error('❌ Error parsing pendingBooking:', e)
                }
            }
        }
    }, [fields.length, storeId])

    const handleClearSlots = () => {
        setSelectedSlots([])
    }

    const handleBackToStore = () => {
        if (storeId) {
            router.push(`/list-store/${storeId}`)
        } else {
            router.back()
        }
    }

    if (loading) {
        return <BookingLoadingState />
    }

    if (!storeId || !sportId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Thiếu thông tin store hoặc sport</p>
                    <button
                        onClick={() => router.push('/list-store')}
                        className="text-blue-600 hover:underline"
                    >
                        ← Về danh sách store
                    </button>
                </div>
            </div>
        )
    }

    if (!store || !sport) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Không tìm thấy thông tin</p>
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:underline"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        )
    }

    if (fields.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">
                        Không có sân {sport.name} nào tại {store.name}
                    </p>
                    <button
                        onClick={handleBackToStore}
                        className="text-blue-600 hover:underline"
                    >
                        ← Quay lại trang store
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title={`Đặt sân ${sport.name}`}
                    subtitle={`Chọn thời gian phù hợp tại ${store.name}`}
                    breadcrumbs={[
                        { label: 'Danh sách cửa hàng', href: '/list-store' },
                        { label: store.name, href: `/list-store/${storeId}` },
                        { label: `Đặt sân ${sport.name}`, isActive: true }
                    ]}
                    gradientFrom="emerald-500"
                    gradientTo="blue-600"
                    icon={<Calendar className="w-6 h-6" />}
                    badge={`${fields.length} sân`}
                    actions={
                        <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                                <MapPin className="w-4 h-4" />
                                <span>{store.address}</span>
                            </div>
                        </div>
                    }
                />

                <BookingDateSelector
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                <BookingLegend />

                <StoreBookingGrid
                    selectedDate={selectedDate}
                    selectedSlots={selectedSlots}
                    onSlotClick={handleSlotClick}
                    fields={fields}
                    timeSlots={timeSlots}
                    bookingData={bookingData}
                    storeName={store.name}
                    sportName={sport.name}
                    fieldPricings={fieldPricings}
                />

                <StoreBookingSummary
                    selectedSlots={selectedSlots}
                    selectedDate={selectedDate}
                    fields={fields}
                    onClearSlots={handleClearSlots}
                    storeName={store.name}
                    sportName={sport.name}
                    storeId={storeId || '0'}
                    fieldPricings={fieldPricings}
                />
            </div>
        </div>
    )
}
