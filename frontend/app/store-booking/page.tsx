"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { getFieldBookingGrid } from "@/services/api"
import { FieldService } from "@/services/field.service"
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
    // ✅ Store selected slots per date: { "2025-11-24": ["fieldId:07:00", ...], "2025-11-25": [...] }
    const [selectedSlots, setSelectedSlots] = useState<{ [date: string]: string[] }>({})
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

    // 🔄 Helper function to refresh booking data from statusField - DEFINED FIRST before useEffects that use it
    const refreshBookingData = useCallback(async () => {
        console.log('🔄 refreshBookingData called with:', { storeId, fields: fields.length, selectedDate })

        if (!storeId || fields.length === 0) {
            console.log('⏭️ Skipping refresh - no storeId or fields yet')
            return
        }

        try {
            console.log('🔄 Fetching fields from API with date:', selectedDate)

            // 🎯 Call API to get fields with statusField data for selected date
            const fieldsResponse = await FieldService.getFieldsWithAllData(storeId, sportId || '', selectedDate)
            console.log('🏟️ Fields response:', fieldsResponse)

            // Build bookingData from statusField array (PAID bookings only)
            const bookingMap: { [fieldId: string]: { [timeSlot: string]: "available" | "booked" | "locked" | "selected" } } = {}

            // Initialize all fields with empty booking data
            fields.forEach(field => {
                bookingMap[field._id] = {}
            })

            // Process each field's statusField array
            const fieldsData = fieldsResponse.data || []
            console.log(`📊 Processing ${fieldsData.length} fields for date ${selectedDate}`)

            fieldsData.forEach(field => {
                const fieldId = field._id
                console.log(`🔍 Processing field ${fieldId}`)

                if (!field.statusField || field.statusField.length === 0) {
                    console.log(`  ℹ️ No statusField data for field ${fieldId}`)
                    return
                }

                console.log(`  📋 Found ${field.statusField.length} status entries`)

                // Filter PAID status only and extract booked slots
                const paidStatuses = field.statusField.filter((status: any) => status.statusPayment === 'PAID')
                console.log(`  ✅ Found ${paidStatuses.length} PAID bookings`)

                paidStatuses.forEach((status: any) => {
                    const startTime = status.startTime  // ISO format: "2025-12-01T06:30:00.000Z"
                    const endTime = status.endTime      // ISO format: "2025-12-01T07:00:00.000Z"

                    console.log(`    🕐 Booking: ${startTime} to ${endTime}`)

                    // Parse ISO datetime to extract time part WITHOUT timezone conversion
                    // Extract HH:MM directly from ISO string to avoid timezone issues
                    const startTimeMatch = startTime.match(/T(\d{2}):(\d{2}):/)
                    const endTimeMatch = endTime.match(/T(\d{2}):(\d{2}):/)

                    if (!startTimeMatch || !endTimeMatch) {
                        console.warn(`    ⚠️ Could not parse time from: ${startTime} to ${endTime}`)
                        return
                    }

                    const startHours = startTimeMatch[1]
                    const startMins = startTimeMatch[2]
                    const endHours = endTimeMatch[1]
                    const endMins = endTimeMatch[2]

                    const startTimeStr = `${startHours}:${startMins}`
                    const endTimeStr = `${endHours}:${endMins}`

                    console.log(`    ⏱️ Parsed time: ${startTimeStr} to ${endTimeStr}`)

                    // Generate all 30-minute slots between start and end time
                    const startMinutes = parseInt(startHours) * 60 + parseInt(startMins)
                    const endMinutes = parseInt(endHours) * 60 + parseInt(endMins)

                    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
                        const hours = Math.floor(minutes / 60)
                        const mins = minutes % 60
                        const slotTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

                        if (!bookingMap[fieldId]) {
                            bookingMap[fieldId] = {}
                        }
                        bookingMap[fieldId][slotTime] = 'booked'
                        console.log(`      ✅ Marked as booked: ${slotTime}`)
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
                        // Field will still have booked slots from statusField, which is fine
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
    }, [storeId, sportId, fields, selectedDate])

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!storeId || !sportId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                console.log('🔍 Fetching all data with single API call:', { storeId, sportId, selectedDate })

                // 🎯 Gọi 1 API duy nhất - lấy tất cả thông tin (sân, giá, store, sport, status)
                const fieldsResponse = await FieldService.getFieldsWithAllData(storeId, sportId, selectedDate)

                console.log('🏟️ Fields response:', fieldsResponse)

                // Filter only active fields
                const activeFields = (fieldsResponse.data || []).filter((f: FieldServiceType) => f.activeStatus)
                setFields(activeFields)

                // Lấy store info từ field đầu tiên (tất cả field trong cùng 1 store)
                const storeData = activeFields.length > 0 ? {
                    _id: activeFields[0].storeId,
                    name: activeFields[0].name?.split(' ').slice(0, -1).join(' ') || 'Store',
                    address: activeFields[0].address || 'Address',
                    startTime: '05:00', // Default, sẽ lấy từ BE nếu có
                    endTime: '24:00',
                    avatarUrl: activeFields[0].avatar,
                    coverImageUrl: activeFields[0].cover_image,
                } : null

                // Lấy sport info từ field đầu tiên
                const sportData = activeFields.length > 0 ? {
                    _id: sportId,
                    name: activeFields[0].sport_name || 'Sport',
                } : null

                console.log('📦 Extracted Store data:', storeData)
                console.log('⚽ Extracted Sport data:', sportData)

                if (!storeData || !sportData) {
                    console.error('❌ Missing store or sport data')
                    setLoading(false)
                    return
                }

                setStore(storeData as any)
                setSport(sportData as any)

                // Extract pricing from field response
                const pricingMap: { [fieldId: string]: any[] } = {}
                activeFields.forEach((field: FieldServiceType) => {
                    pricingMap[field._id] = field.pricings || []
                    console.log(`💰 Pricing for field ${field._id}:`, pricingMap[field._id])
                })
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
        console.log('🎯 handleSlotClick called:', { fieldId, timeSlot, status, selectedDate, currentSelectedSlots: selectedSlots })
        if (status === "available") {
            const slotKey = `${fieldId}:${timeSlot}`
            console.log('✅ Slot is available, adding to selected:', slotKey)
            setSelectedSlots((prev) => {
                const currentDateSlots = prev[selectedDate] || []
                const isSelected = currentDateSlots.includes(slotKey)

                return {
                    ...prev,
                    [selectedDate]: isSelected
                        ? currentDateSlots.filter((s) => s !== slotKey)
                        : [...currentDateSlots, slotKey]
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
        // Clear slots for current date only
        setSelectedSlots((prev) => {
            const newSlots = { ...prev }
            delete newSlots[selectedDate]
            return newSlots
        })
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
                        { label: 'Danh sách Trung tâm thể thao', href: '/list-store' },
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
                    selectedSlots={selectedSlots[selectedDate] || []}
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
                    setSelectedSlots={setSelectedSlots}
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
