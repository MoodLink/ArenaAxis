"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Star, ArrowLeft } from "lucide-react"
import { getStoreById, getSportById } from "@/services/api-new"
import { getFieldBookingGrid } from "@/services/api"
import { FieldService } from "@/services/field.service"
import { FieldPricingService } from "@/services/field-pricing.service"
import type { Field as FieldServiceType } from "@/services/field.service"
import type { StoreClientDetailResponse, Sport } from "@/types"
import PageHeader from "@/components/layout/PageHeader"
import BreadcrumbNav from "@/components/common/BreadcrumbNav"
import {
    BookingLoadingState,
    BookingDateSelector,
    BookingLegend,
} from "@/components/booking"
import { StoreBookingGrid, StoreBookingSummary } from "@/components/store"

export default function StoreBookingPage({
    params
}: {
    params: Promise<{ storeId: string; sportId: string }>
}) {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState(() => {
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
    const [storeId, setStoreId] = useState<string>("")
    const [sportId, setSportId] = useState<string>("")
    const [fieldPricings, setFieldPricings] = useState<{
        [fieldId: string]: any[]
    }>({})

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true)
                const resolvedParams = await params
                const { storeId: sid, sportId: spid } = resolvedParams
                setStoreId(sid)
                setSportId(spid)

                console.log('🔍 Fetching store booking data:', { storeId: sid, sportId: spid })

                // Fetch store, sport, and fields data in parallel
                const [storeData, sportData, fieldsResponse] = await Promise.all([
                    getStoreById(sid),
                    getSportById(spid),
                    FieldService.getFieldsBySport(spid, sid)
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
                const endHour = storeData?.endTime ? parseInt(storeData.endTime.split(':')[0]) : 22

                for (let hour = startHour; hour <= endHour; hour++) {
                    slots.push(`${hour.toString().padStart(2, "0")}:00`)
                    if (hour < endHour) {
                        slots.push(`${hour.toString().padStart(2, "0")}:30`)
                    }
                }
                setTimeSlots(slots)

                // Fetch booking data from API for each field
                const bookingMap: { [fieldId: string]: any } = {}
                await Promise.all(
                    activeFields.map(async (field: FieldServiceType) => {
                        try {
                            const fieldBookingData = await getFieldBookingGrid(field._id, selectedDate)
                            bookingMap[field._id] = fieldBookingData || {}
                            console.log(`📅 Booking data for field ${field._id}:`, fieldBookingData)
                        } catch (error) {
                            console.warn(`⚠️ Failed to fetch booking for field ${field._id}:`, error)
                            // Default all slots as available
                            bookingMap[field._id] = {}
                            slots.forEach((slot: string) => {
                                bookingMap[field._id][slot] = "available"
                            })
                        }
                    })
                )
                setBookingData(bookingMap)

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [params])

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
                            bookingMap[field._id] = fieldBookingData || {}
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

    const handleSlotClick = (fieldId: string, timeSlot: string) => {
        const status = bookingData[fieldId]?.[timeSlot]
        if (status === "available") {
            const slotKey = `${fieldId}:${timeSlot}`
            setSelectedSlots((prev) => {
                if (prev.includes(slotKey)) {
                    return prev.filter((s) => s !== slotKey)
                } else {
                    return [...prev, slotKey]
                }
            })
        }
    }

    const handleClearSlots = () => {
        setSelectedSlots([])
    }

    const handleBackToStore = () => {
        router.push(`/list-store/${storeId}`)
    }

    if (loading) {
        return <BookingLoadingState />
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


                {/* Page Header */}
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

                {/* Date Selector */}
                <BookingDateSelector
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                {/* Legend */}
                <BookingLegend />

                {/* Store Booking Grid */}
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

                {/* Selected Slots Summary */}
                <StoreBookingSummary
                    selectedSlots={selectedSlots}
                    selectedDate={selectedDate}
                    fields={fields}
                    onClearSlots={handleClearSlots}
                    storeName={store.name}
                    sportName={sport.name}
                    fieldPricings={fieldPricings}
                />
            </div>
        </div>
    )
}
