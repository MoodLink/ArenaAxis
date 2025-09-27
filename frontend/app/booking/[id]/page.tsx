"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Star } from "lucide-react"
import { getFieldById, getFieldSubCourts, getFieldBookingGrid } from "@/services/api"
import { Field } from "@/types"
import PageHeader from "@/components/layout/PageHeader"
import {
  BookingLoadingState,
  BookingNotFound,
  BookingDateSelector,
  BookingLegend,
  BookingGrid,
  BookingSummary
} from "@/components/booking"

interface SubCourt {
  id: string
  name: string
  type: string
  color: string
  rating: number
  price: number
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Set to today's date by default
    return new Date().toISOString().split('T')[0]
  })
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [field, setField] = useState<Field | null>(null)
  const [subCourts, setSubCourts] = useState<SubCourt[]>([])
  const [bookingData, setBookingData] = useState<{ [key: string]: { [key: string]: "available" | "booked" | "locked" | "selected" } }>({})
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [fieldId, setFieldId] = useState<string>("")

  // Fetch field data and initial booking data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const id = resolvedParams.id
        setFieldId(id)

        // Fetch field data and sub-courts
        const [fieldData, subCourtsData] = await Promise.all([
          getFieldById(id),
          getFieldSubCourts(id)
        ])

        setField(fieldData)
        setSubCourts(subCourtsData)

        // Generate time slots
        const slots: string[] = []
        for (let hour = 5; hour <= 22; hour++) {
          slots.push(`${hour.toString().padStart(2, "0")}:00`)
          if (hour < 22) {
            slots.push(`${hour.toString().padStart(2, "0")}:30`)
          }
        }
        setTimeSlots(slots)

        // Fetch booking grid for selected date
        const bookingGridData = await getFieldBookingGrid(id, selectedDate)
        setBookingData(bookingGridData)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [params, selectedDate])

  // Update booking data when date changes
  useEffect(() => {
    const updateBookingData = async () => {
      if (fieldId && selectedDate) {
        try {
          const bookingGridData = await getFieldBookingGrid(fieldId, selectedDate)
          setBookingData(bookingGridData)
        } catch (error) {
          console.error('Error updating booking data:', error)
        }
      }
    }

    if (fieldId) {
      updateBookingData()
    }
  }, [fieldId, selectedDate])

  if (loading) {
    return <BookingLoadingState />
  }

  if (!field) {
    return <BookingNotFound />
  }

  const handleSlotClick = (courtId: string, timeSlot: string) => {
    const status = bookingData[courtId]?.[timeSlot]
    if (status === "available") {
      const slotKey = `${courtId}:${timeSlot}`
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <PageHeader
          title="Đặt lịch sân bóng"
          subtitle={`Chọn thời gian phù hợp để đặt sân tại ${field.name}`}
          breadcrumbs={[
            { label: "Sân bóng", href: "/fields" },
            { label: field.name, href: `/fields/${fieldId}` },
            { label: "Đặt lịch", isActive: true }
          ]}
          gradientFrom="emerald-500"
          gradientTo="blue-600"
          icon={<Calendar className="w-6 h-6" />}
          badge={`${field.location} • ⭐ ${field.rating}/5`}
          actions={
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span>{field.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                <Star className="w-4 h-4" />
                <span>{field.rating}/5</span>
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

        {/* Booking Grid */}
        <BookingGrid
          selectedDate={selectedDate}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          subCourts={subCourts}
          timeSlots={timeSlots}
          bookingData={bookingData}
        />

        {/* Selected Slots Summary */}
        <BookingSummary
          selectedSlots={selectedSlots}
          selectedDate={selectedDate}
          subCourts={subCourts}
          onClearSlots={handleClearSlots}
        />
      </div>
    </div>
  )
}
