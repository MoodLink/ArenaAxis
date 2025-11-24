"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, LogIn, UserX } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FieldPricingService } from "@/services/field-pricing.service"
import type { Field as FieldServiceType } from "@/services/field.service"
import { OrderService } from "@/services/order.service"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { validatePaymentOrderRequest, logValidationResult } from "@/utils/request-validator"
import { useUserId } from "@/hooks/use-user-id"
import { formatVNDWithSymbol, formatDateVN } from "@/utils/data-formatter"

interface StoreBookingSummaryProps {
    selectedSlots: string[]
    selectedDate: string
    fields: FieldServiceType[]
    onClearSlots: () => void
    storeName: string
    sportName: string
    storeId?: string
    fieldPricings?: {
        [fieldId: string]: any[]
    }
}

export default function StoreBookingSummary({
    selectedSlots,
    selectedDate,
    fields,
    onClearSlots,
    storeName,
    sportName,
    storeId = '0',
    fieldPricings = {},
}: StoreBookingSummaryProps) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const userId = useUserId()  // ✅ Sử dụng hook để lấy user ID

    // ✅ Kiểm tra trạng thái đăng nhập khi component mount và khi userId thay đổi
    useEffect(() => {
        const checkAuth = () => {
            if (typeof window === 'undefined') return

            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')

            // Kiểm tra có token và user data
            const authenticated = !!(token && user && userId && userId !== '0')
            setIsAuthenticated(authenticated)

            console.log('🔐 Auth status:', {
                hasToken: !!token,
                hasUser: !!user,
                userId,
                authenticated
            })
        }

        checkAuth()

        // Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất ở tab khác
        window.addEventListener('storage', checkAuth)
        return () => window.removeEventListener('storage', checkAuth)
    }, [userId])

    if (selectedSlots.length === 0) {
        return null
    }

    // Calculate total price and group slots by field
    const groupedSlots: { [fieldId: string]: string[] } = {}
    let totalPrice = 0

    console.log('🔍 StoreBookingSummary - Processing selectedSlots:', selectedSlots)

    selectedSlots.forEach((slotKey) => {
        // slotKey format: "fieldId:HH:MM"
        const colonIndex = slotKey.indexOf(':')
        const fieldId = slotKey.substring(0, colonIndex)
        const timeSlot = slotKey.substring(colonIndex + 1) // "HH:MM"

        console.log(`  📌 Parsing slot: "${slotKey}" -> fieldId="${fieldId}", timeSlot="${timeSlot}"`)

        if (!groupedSlots[fieldId]) {
            groupedSlots[fieldId] = []
        }
        groupedSlots[fieldId].push(timeSlot)

        const field = fields.find((f) => f._id === fieldId)
        if (field) {
            // Get special price for this slot if available
            const pricings = fieldPricings[fieldId] || []
            const defaultPrice = parseFloat(field.defaultPrice || "0")

            let slotPrice = defaultPrice
            if (pricings.length > 0) {
                const selectedDateObj = new Date(selectedDate)
                const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)
                const specialPrice = FieldPricingService.getSpecialPriceForSlot(
                    pricings,
                    timeSlot,
                    dayOfWeek
                )
                slotPrice = specialPrice || defaultPrice
            }
            totalPrice += slotPrice
            console.log(`    💰 Field: ${field.name}, TimeSlot: ${timeSlot}, Price: ${slotPrice}, Running Total: ${totalPrice}`)
        } else {
            console.warn(`    ⚠️ Field not found for fieldId: ${fieldId}`)
        }
    })

    console.log('✅ Final groupedSlots:', groupedSlots)
    console.log('✅ Final totalPrice:', totalPrice)

    const handleCheckout = async () => {
        if (isProcessing) return

        // ✅ Kiểm tra đăng nhập trước khi thanh toán
        if (!isAuthenticated) {
            console.log('⚠️ User not authenticated - showing login dialog')

            // Lưu thông tin đặt sân để quay lại sau khi đăng nhập
            const bookingData = {
                storeId,
                sportName,
                selectedDate,
                selectedSlots,
                returnUrl: window.location.pathname + window.location.search
            }
            sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData))

            // Hiển thị dialog yêu cầu đăng nhập
            setShowLoginDialog(true)
            return
        }

        try {
            setIsProcessing(true)

            console.log('🔍 DEBUG - selectedSlots:', selectedSlots)
            console.log('🔍 DEBUG - groupedSlots:', groupedSlots)
            console.log('🔍 DEBUG - totalPrice:', totalPrice)
            console.log('👤 Using user_id:', userId)

            // Build items array with new format - each time slot is 30 minutes
            const items = Object.entries(groupedSlots).flatMap(([fieldId, timeSlots]) => {
                const field = fields.find((f) => f._id === fieldId)
                const fieldIndex = fields.findIndex((f) => f._id === fieldId)
                const fieldLetter = String.fromCharCode(65 + fieldIndex)

                return timeSlots.map((timeSlot) => {
                    const price = getPriceForSlot(fieldId, timeSlot)
                    // Calculate end time (30 minutes after start)
                    const [hours, minutes] = timeSlot.split(':').map(Number)
                    const endMinutes = hours * 60 + minutes + 30
                    const endHours = Math.floor(endMinutes / 60)
                    const endMins = endMinutes % 60
                    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

                    return {
                        field_id: fieldId,
                        start_time: timeSlot,
                        end_time: endTime,
                        name: field?.name || `Sân ${fieldLetter}`,
                        quantity: 1,
                        price: price,
                    }
                })
            })

            console.log('🔍 DEBUG - items:', items)

            if (items.length === 0) {
                throw new Error('Vui lòng chọn ít nhất một khung giờ')
            }

            if (totalPrice <= 0) {
                throw new Error('Tổng tiền không hợp lệ')
            }

            // Format date as YYYY-MM-DD (for backend)
            const formattedDate = selectedDate

            // Create payment order request with new format
            const orderRequest = {
                store_id: storeId,
                user_id: userId,
                amount: totalPrice,
                description: `Ngày: ${formattedDate}`,
                date: formattedDate,
                items: items,
            }

            console.log('🎯 Creating payment order:', JSON.stringify(orderRequest, null, 2))

            // ✅ Validate request format before sending
            const validation = validatePaymentOrderRequest(orderRequest)
            logValidationResult(validation)

            if (!validation.isValid) {
                const errorMessage = validation.errors.join('\n')
                throw new Error(`Request validation failed:\n${errorMessage}`)
            }

            console.log('✅ Request validation passed!')

            // Call API to create payment order
            const response = await OrderService.createPaymentOrder(orderRequest)

            console.log('✅ Payment order response:', response)

            // Save order data to sessionStorage for success page
            sessionStorage.setItem('pendingOrderData', JSON.stringify({
                orderCode: response.data?.orderCode,
                amount: totalPrice,
                description: `Ngày: ${formattedDate}`,
                date: formattedDate,
                items: items,
            }))

            // Redirect to checkout URL
            if (response.data?.checkoutUrl) {
                // Save order code to sessionStorage for later reference
                sessionStorage.setItem('pendingOrderCode', String(response.data.orderCode))

                // Redirect to payment gateway
                window.location.href = response.data.checkoutUrl
            } else {
                throw new Error('Không nhận được URL thanh toán')
            }
        } catch (error: any) {
            console.error('❌ Error creating payment order:', error)
            toast({
                title: "Lỗi thanh toán",
                description: error.message || "Không thể tạo đơn hàng. Vui lòng thử lại.",
                variant: "destructive",
            })
            setIsProcessing(false)
        }
    }

    const getPriceForSlot = (fieldId: string, timeSlot: string): number => {
        const pricings = fieldPricings[fieldId] || []
        const field = fields.find(f => f._id === fieldId)
        const defaultPrice = field ? parseFloat(field.defaultPrice || "0") : 0

        if (pricings.length === 0) {
            return defaultPrice
        }

        const selectedDateObj = new Date(selectedDate)
        const dayOfWeek = FieldPricingService.getDayOfWeek(selectedDateObj)

        const specialPrice = FieldPricingService.getSpecialPriceForSlot(
            pricings,
            timeSlot,
            dayOfWeek
        )

        return specialPrice || defaultPrice
    }

    /**
     * Convert time string "HH:MM" to minutes for comparison
     */
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    /**
     * Convert minutes back to "HH:MM" format
     */
    const minutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    }

    /**
     * Group consecutive time slots into ranges
     * Example: ["07:30", "08:00", "08:30"] -> [{ start: "07:30", end: "09:00" }]
     * Assuming each slot is 30 minutes
     */
    const groupTimeSlotsByRange = (timeSlots: string[]): Array<{ start: string; end: string; count: number }> => {
        if (timeSlots.length === 0) return []

        // Sort time slots
        const sortedSlots = [...timeSlots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b))

        const ranges: Array<{ start: string; end: string; count: number }> = []
        let currentStart = sortedSlots[0]
        let currentEnd = timeToMinutes(sortedSlots[0]) + 30 // Assume 30-min slots
        let slotCount = 1

        for (let i = 1; i < sortedSlots.length; i++) {
            const slotMinutes = timeToMinutes(sortedSlots[i])

            // If this slot is consecutive (30 mins after current end), extend the range
            if (slotMinutes === currentEnd) {
                currentEnd += 30
                slotCount++
            } else {
                // Not consecutive, save current range and start a new one
                ranges.push({
                    start: currentStart,
                    end: minutesToTime(currentEnd),
                    count: slotCount
                })
                currentStart = sortedSlots[i]
                currentEnd = slotMinutes + 30
                slotCount = 1
            }
        }

        // Add the last range
        ranges.push({
            start: currentStart,
            end: minutesToTime(currentEnd),
            count: slotCount
        })

        return ranges
    }

    return (
        <Card className="mb-6 shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                <CardTitle className="relative z-10 flex items-center gap-4 text-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                            <span className="bg-white text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black">
                                {selectedSlots.length}
                            </span>
                        </div>
                        <div>
                            <div className="font-black">Khung giờ đã chọn</div>
                            <div className="text-emerald-100 text-sm font-normal">
                                Xem lại lịch đặt của bạn
                            </div>
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
                {/* Selected slots list */}
                <div className="space-y-4 mb-8">
                    {Object.entries(groupedSlots).map(([fieldId, timeSlots], index) => {
                        const field = fields.find((f) => f._id === fieldId)
                        const fieldIndex = fields.findIndex((f) => f._id === fieldId)
                        const fieldColors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-rose-500", "bg-indigo-500"]
                        const fieldColor = fieldColors[fieldIndex % fieldColors.length]
                        const fieldLetter = String.fromCharCode(65 + fieldIndex)

                        return (
                            <div
                                key={fieldId}
                                className="group relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Enhanced Field Icon */}
                                            <div className="relative">
                                                <div
                                                    className={`w-16 h-16 ${fieldColor} rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    {fieldLetter}
                                                </div>
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                            </div>

                                            {/* Field Details */}
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xl font-bold text-gray-800">
                                                    {field?.name || `Sân ${fieldLetter}`}
                                                </div>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    {groupTimeSlotsByRange(timeSlots).map((range) => {
                                                        // Calculate total price for this range
                                                        const rangePrice = timeSlots
                                                            .filter(t => {
                                                                const tMin = timeToMinutes(t)
                                                                const startMin = timeToMinutes(range.start)
                                                                return tMin >= startMin && tMin < timeToMinutes(range.end)
                                                            })
                                                            .reduce((sum, time) => sum + getPriceForSlot(fieldId, time), 0)

                                                        return (
                                                            <Badge
                                                                key={`${fieldId}:${range.start}-${range.end}`}
                                                                variant="outline"
                                                                className="bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-300 text-emerald-700 px-4 py-1.5 text-sm font-semibold"
                                                                title={`${formatVNDWithSymbol(rangePrice)}`}
                                                            >
                                                                🕐 {range.start} - {range.end}
                                                            </Badge>
                                                        )
                                                    })}
                                                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                        <span className="text-sm font-bold text-yellow-700">{field?.rating || 4.5}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Display */}
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600">
                                                {formatVNDWithSymbol(timeSlots.reduce((sum, time) => sum + getPriceForSlot(fieldId, time), 0))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Total và Actions */}
                <div className="border-t-2 border-emerald-100 pt-8">
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold text-gray-700 mb-1">Tổng thanh toán</div>
                                <div className="text-sm text-gray-500">
                                    {selectedSlots.length} khung giờ • Ngày {formatDateVN(selectedDate)}
                                </div>
                            </div>
                            <div className="text-3xl font-black text-emerald-600">
                                {formatVNDWithSymbol(totalPrice)}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClearSlots}
                            className="flex-1 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-medium py-3"
                        >
                            🗑️ Xóa tất cả
                        </Button>
                        <Button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isProcessing ? '⏳ Đang xử lý...' : '💳 Thanh toán ngay →'}
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* ✅ Login Required Dialog */}
            <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                            <UserX className="h-8 w-8 text-amber-600" />
                        </div>
                        <AlertDialogTitle className="text-center text-2xl">
                            Yêu cầu đăng nhập
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            Bạn cần đăng nhập để tiếp tục đặt sân. Thông tin đặt sân của bạn sẽ được lưu lại.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel
                            onClick={() => setShowLoginDialog(false)}
                            className="border-2"
                        >
                            Để sau
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                const redirectUrl = window.location.pathname + window.location.search
                                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Đăng nhập ngay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
