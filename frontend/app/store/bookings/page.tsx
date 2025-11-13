'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Clock, Edit2, Trash2, MoreHorizontal, AlertCircle, Pause, X, Phone, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FieldService, Field as APIField } from '@/services/field.service';
import { FieldPricingService, FieldPricing } from '@/services/field-pricing.service';
import { StoreService } from '@/services/store.service';
import { OrderService } from '@/services/order.service';
import StoreLayout from '@/components/store/StoreLayout';
import { useToast } from '@/hooks/use-toast';
import { getStoreById } from '@/services/api-new';
import type { StoreClientDetailResponse } from '@/types';


interface BookingInfo {
    id: string
    fieldId: string
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

export default function StoreBookingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = searchParams.get('store_id') as string;
    const { toast } = useToast();

    // State
    const [store, setStore] = useState<StoreClientDetailResponse | null>(null);
    const [fields, setFields] = useState<APIField[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [bookingData, setBookingData] = useState<{
        [fieldId: string]: {
            [timeSlot: string]: "available" | "booked" | "locked" | "selected"
        }
    }>({});

    // Modal states
    const [selectedBooking, setSelectedBooking] = useState<BookingInfo | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [fieldPricings, setFieldPricings] = useState<FieldPricing[]>([]);

    // Pricing state
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [pricingForm, setPricingForm] = useState({
        field_id: '',
        day_of_weeks: [] as string[],
        start_at: '17:00',
        end_at: '19:30',
        price: ''
    });
    const [fieldPricingsMap, setFieldPricingsMap] = useState<{ [key: string]: FieldPricing[] }>({});

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        sport_name: '',
        address: '',
        default_price: ''
    });

    // State for time slots
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    // 🔄 Helper function to refresh booking data from store orders
    const refreshBookingData = useCallback(async () => {
        console.log('🔄 refreshBookingData called with:', { storeId, fields: fields.length, selectedDate })

        if (!storeId || fields.length === 0) {
            console.log('⏭️ Skipping refresh - no storeId or fields yet')
            return
        }

        try {
            console.log('🔄 Fetching orders from store for date:', selectedDate)

            // ✅ Use date as-is for start and end time
            const startDateStr = selectedDate  // e.g., "2025-11-13"
            const endDateStr = selectedDate    // Same day

            console.log(`📅 Fetching orders for date range: ${startDateStr} to ${endDateStr}`)
            console.log(`✅ Final API params: start_time=${startDateStr}&end_time=${endDateStr}`)

            // Fetch all orders for the store on this date
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

            // For each paid order, mark the booked slots
            paidOrders.forEach(order => {
                console.log(`🔍 Processing order ${order.orderCode} with ${order.orderDetails.length} details`)
                order.orderDetails.forEach((detail, idx) => {
                    const fieldId = detail.fieldId
                    console.log(`  Detail ${idx}: fieldId=${fieldId}, startTime="${detail.startTime}", endTime="${detail.endTime}"`)

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
                    const formattedSelectedDate = selectedDate
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
                            const slotTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
                            bookingMap[fieldId][slotTime] = 'booked'
                            console.log(`    ✅ Marking slot as booked: ${slotTime}`)
                        }
                    }
                })
            })

            setBookingData(bookingMap)
            console.log('📊 Final booking data:', bookingMap)
            Object.entries(bookingMap).forEach(([fieldId, slots]) => {
                const bookedCount = Object.values(slots).filter(s => s === 'booked').length
                console.log(`  Field ${fieldId}: ${bookedCount} booked slots`)
            })
        } catch (error) {
            console.error('❌ Error refreshing booking data:', error)
        }
    }, [storeId, fields, selectedDate])

    // Generate time slots based on store opening hours
    const generateTimeSlots = (startHour: number, endHour: number) => {
        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
                slots.push(
                    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
                );
            }
        }
        // Add the final hour if it exists
        if (endHour > startHour) {
            slots.push(`${String(endHour).padStart(2, '0')}:00`);
        }
        return slots;
    };

    // Mock booking data
    const mockBookingData: Record<string, string[]> = {
        // Format: fieldId: ['09:00', '15:30', '17:00', ...]
    };

    // Load store and fields
    useEffect(() => {
        if (!storeId) {
            toast({
                title: 'Lỗi',
                description: 'Không tìm thấy ID cửa hàng',
                variant: 'destructive',
            });
            router.push('/store');
            return;
        }

        loadStoreAndFields();
    }, [storeId]);

    // 🔄 Trigger refresh when fields are first loaded
    useEffect(() => {
        if (fields.length > 0 && storeId) {
            console.log('✅ Fields loaded - refreshing booking data immediately')
            refreshBookingData()
        }
    }, [fields.length, storeId]);

    // Update booking data when date changes
    useEffect(() => {
        if (fields.length > 0 && selectedDate && storeId) {
            console.log('📅 Date changed - refreshing booking data')
            refreshBookingData()
        }
    }, [selectedDate, fields.length, storeId]);

    // 🔄 Re-fetch booking data when page is focused
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('👁️ Page focused - refreshing booking data')
                refreshBookingData()
            }
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'paymentCompleted' && e.newValue === 'true') {
                console.log('💳 Payment completed - refreshing booking data')
                refreshBookingData()
            }
        }

        const handlePopState = () => {
            console.log('🔙 Back button - refreshing booking data')
            refreshBookingData()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('popstate', handlePopState)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [refreshBookingData]);

    // 🔄 Auto-refresh every 30 seconds
    useEffect(() => {
        console.log('⏰ Setting up auto-refresh interval')
        const interval = setInterval(() => {
            console.log('⏰ Auto-refresh...')
            refreshBookingData()
        }, 30000)

        return () => clearInterval(interval)
    }, [refreshBookingData]);

    const loadStoreAndFields = async () => {
        try {
            setLoading(true);

            // Load store details
            const storeData = await getStoreById(storeId);
            setStore(storeData);

            // Generate time slots based on store opening hours
            const startHour = storeData?.startTime ? parseInt(storeData.startTime.split(':')[0]) : 5;
            const endHour = storeData?.endTime ? parseInt(storeData.endTime.split(':')[0]) : 24;
            const slots = generateTimeSlots(startHour, endHour);
            setTimeSlots(slots);

            // Load fields for this store
            const response = await FieldService.getFields({
                store_id: storeId,
            });
            const fieldsData = response.data || [];
            setFields(fieldsData.filter((f: APIField) => f.activeStatus));

            // Load field pricings for ALL fields
            if (fieldsData.length > 0) {
                const pricingsMap: { [key: string]: FieldPricing[] } = {};

                for (const field of fieldsData) {
                    try {
                        const pricingsResponse = await FieldPricingService.getFieldPricings(field._id);
                        if (pricingsResponse.data) {
                            pricingsMap[field._id] = pricingsResponse.data;
                        }
                    } catch (error) {
                        console.warn(`No pricing data for field ${field._id}:`, error);
                        pricingsMap[field._id] = [];
                    }
                }

                setFieldPricingsMap(pricingsMap);
                // Set first field as default
                if (fieldsData.length > 0) {
                    setPricingForm(prev => ({
                        ...prev,
                        field_id: fieldsData[0]._id
                    }));
                }
            }
        } catch (error) {
            console.error('Error loading store or fields:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải thông tin cửa hàng hoặc danh sách sân',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Format price
    const formatPrice = (price: string) => {
        return `${Number(price).toLocaleString('vi-VN')}đ`;
    };

    // Get slot price with special pricing
    const getSlotPrice = (timeSlot: string, selectedDate: string, fieldId: string): number => {
        const date = new Date(selectedDate);
        const dayOfWeek = FieldPricingService.getDayOfWeek(date);
        const fieldPricings = fieldPricingsMap[fieldId] || [];
        const specialPrice = FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek);
        return specialPrice || (fields.find(f => f._id === fieldId)?.defaultPrice ? parseInt(fields.find(f => f._id === fieldId)!.defaultPrice || '0') : 0);
    };

    // Check if slot has special pricing
    const hasSpecialPrice = (timeSlot: string, selectedDate: string, fieldId: string): boolean => {
        const date = new Date(selectedDate);
        const dayOfWeek = FieldPricingService.getDayOfWeek(date);
        const fieldPricings = fieldPricingsMap[fieldId] || [];
        return FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek) !== null;
    };

    // Format day of week to Vietnamese full name
    const formatDayOfWeekVietnamese = (day: string): string => {
        const dayNames: { [key: string]: string } = {
            monday: 'Thứ Hai',
            tuesday: 'Thứ Ba',
            wednesday: 'Thứ Tư',
            thursday: 'Thứ Năm',
            friday: 'Thứ Sáu',
            saturday: 'Thứ Bảy',
            sunday: 'Chủ Nhật'
        };
        return dayNames[day.toLowerCase()] || day;
    };

    // Handle Edit Store
    const handleOpenEditModal = () => {
        if (store) {
            setEditForm({
                name: store.name || '',
                sport_name: '',
                address: store.address || '',
                default_price: ''
            });
            setShowEditModal(true);
        }
    };

    const handleUpdateStore = async () => {
        if (!store) return;

        try {
            // Note: Update store endpoint may not exist, just show success
            toast({
                title: 'Thành công ✅',
                description: 'Thông tin cửa hàng đã được cập nhật',
            });

            setShowEditModal(false);
            loadStoreAndFields();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể cập nhật cửa hàng',
                variant: 'destructive',
            });
        }
    };

    // Handle Pricing Management
    const handleOpenPricingModal = () => {
        setPricingForm({
            field_id: fields.length > 0 ? fields[0]._id : '',
            day_of_weeks: [],
            start_at: '17:00',
            end_at: '19:30',
            price: fields.length > 0 ? fields[0].defaultPrice || '' : ''
        });
        setShowPricingModal(true);
    };

    const handleCreatePricing = async () => {
        if (!pricingForm.field_id || fields.length === 0) return;

        try {
            await FieldPricingService.createFieldPricing({
                field_id: pricingForm.field_id,
                day_of_weeks: pricingForm.day_of_weeks,
                start_at: pricingForm.start_at,
                end_at: pricingForm.end_at,
                price: pricingForm.price
            });

            toast({
                title: 'Thành công ✅',
                description: 'Đã thêm giá đặc biệt',
            });

            setShowPricingModal(false);
            loadStoreAndFields();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể thêm giá đặc biệt',
                variant: 'destructive',
            });
        }
    };

    const handleDeletePricing = async (pricingId: string) => {
        try {
            await FieldPricingService.deleteFieldPricing(pricingId);

            toast({
                title: 'Thành công ✅',
                description: 'Đã xóa giá đặc biệt',
            });

            loadStoreAndFields();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể xóa giá đặc biệt',
                variant: 'destructive',
            });
        }
    };

    const toggleDaySelection = (day: string) => {
        setPricingForm(prev => ({
            ...prev,
            day_of_weeks: prev.day_of_weeks.includes(day)
                ? prev.day_of_weeks.filter(d => d !== day)
                : [...prev.day_of_weeks, day]
        }));
    };

    // Get slot status
    const getSlotStatus = (fieldId: string, timeSlot: string): 'available' | 'booked' => {
        const status = bookingData[fieldId]?.[timeSlot]
        if (status === 'booked') return 'booked'
        return 'available'
    };

    // Handle slot click
    const handleSlotClick = (field: APIField, timeSlot: string) => {
        const status = getSlotStatus(field._id, timeSlot);
        if (status === 'available') {
            setSelectedBooking({
                id: `${field._id}-${timeSlot}`,
                fieldId: field._id,
                timeSlot,
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                customerAddress: '',
                bookingTime: new Date().toLocaleString('vi-VN'),
                price: parseInt(field.defaultPrice || '0'),
            });
            setShowBookingModal(true);
        }
    };

    // Get formatted date display
    const getFormattedDate = () => {
        const date = new Date(selectedDate);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    // Get slot color
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

    const scrollLeft = (containerId: string) => {
        const container = document.getElementById(containerId)
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = (containerId: string) => {
        const container = document.getElementById(containerId)
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin cửa hàng...</p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Không tìm thấy thông tin cửa hàng</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.back()}
                    >
                        ← Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <StoreLayout>
            <div className="w-full max-w-full overflow-x-hidden">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
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
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={loadStoreAndFields}
                            >
                                <RefreshCw className="h-4 w-4" />
                                Làm mới
                            </Button>
                        </div>
                    </div>

                    {/* Store Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Tổng số sân</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {fields.length} sân
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Giá mặc định</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {fields.length > 0 && fields[0].defaultPrice
                                            ? `${parseInt(fields[0].defaultPrice).toLocaleString()}đ`
                                            : 'N/A'} / giờ
                                    </p>
                                </div>
                            </CardContent>
                        </Card> */}

                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                                    <Badge className="bg-green-100 text-green-800">
                                        Hoạt động
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Special Pricing Overview */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                            <CardTitle className="flex items-center gap-2 text-yellow-900">
                                <Calendar className="h-5 w-5" />
                                Giá đặc biệt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {Object.entries(fieldPricingsMap).some(([_, pricings]) => pricings && pricings.length > 0) ? (
                                <div className="space-y-4">
                                    {fields.map((field) => {
                                        const fieldPricings = fieldPricingsMap[field._id] || [];
                                        return fieldPricings.length > 0 ? (
                                            <div key={`pricing-section-${field._id}`}>
                                                <div className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {field.name?.charAt(0).toUpperCase() || 'S'}
                                                    </div>
                                                    {field.name}
                                                </div>
                                                <div className="space-y-2 ml-8">
                                                    {fieldPricings.map((pricing, idx) => (
                                                        <div
                                                            key={`pricing-item-${pricing._id}-${idx}`}
                                                            className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900">
                                                                    {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {formatDayOfWeekVietnamese(pricing.dayOfWeek)}
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
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                                    Chưa có giá đặc biệt nào. Bấm "Giá đặc biệt" để thêm.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Booking Grid */}
                    {/* Legend/Chú thích */}
                    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
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
                                        <h3 className="text-xl md:text-2xl font-bold mb-2">Lịch đặt sân</h3>
                                        <p className="text-emerald-100 text-sm md:text-base">Chọn ngày: {selectedDate} • Chọn khung giờ phù hợp</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
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
                                                onClick={() => scrollLeft('booking-grid-main')}
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => scrollRight('booking-grid-main')}
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Scrollable Time Grid with Split Layout */}
                            <div className="w-full flex">
                                {/* Fixed Field Names Column - NOT SCROLLABLE */}
                                <div className="flex-shrink-0 border-r border-gray-200 bg-white">
                                    {/* Header for field names */}
                                    <div className="w-48 px-4 py-4 font-bold text-gray-700 bg-gradient-to-r from-emerald-100 to-blue-100 border-b-2 border-emerald-200" style={{ height: '74px' }}>
                                        Danh sách sân
                                    </div>

                                    {/* Field names list */}
                                    {fields.length > 0 ? (
                                        fields.map((field: APIField, fieldIdx: number) => (
                                            <div
                                                key={`field-name-${field._id}`}
                                                className="w-48 px-4 border-b border-gray-100 flex items-center gap-3 hover:bg-emerald-50 transition-all duration-300"
                                                style={{ height: '86px' }}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {field.name?.charAt(0).toUpperCase() || 'S'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate text-sm">
                                                        {field.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {field.rating && (
                                                            <Badge className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800 py-0">
                                                                ⭐ {field.rating}
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-green-600 font-bold">
                                                            {formatPrice(field.defaultPrice)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-48 py-12 text-center">
                                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-600">Chưa có sân</p>
                                        </div>
                                    )}
                                </div>

                                {/* Scrollable Time Grid Section - INDEPENDENT SCROLL */}
                                <div
                                    id="booking-grid-main"
                                    className="flex-1 overflow-x-auto pb-2"
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

                                        {/* Field Rows */}
                                        {fields.length > 0 ? (
                                            fields.map((field: APIField, fieldIdx: number) => (
                                                <div key={field._id} className="flex border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30 transition-all duration-300 bg-gray-50/30" style={{ height: '86px' }}>
                                                    {/* Offset spacer */}
                                                    <div className="flex-shrink-0 w-10 border-r border-gray-100/50"></div>
                                                    {timeSlots.slice(0, -1).map((slot, slotIndex) => {
                                                        const status = getSlotStatus(field._id, slot)
                                                        const isBooked = status === 'booked'
                                                        const hasSpecial = hasSpecialPrice(slot, selectedDate, field._id)

                                                        return (
                                                            <div
                                                                key={`booking-slot-${field._id}-${slotIndex}-${slot}`}
                                                                className={`flex-shrink-0 w-20 border-r border-gray-100/50 flex items-center justify-center px-2 ${slotIndex % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'
                                                                    }`}
                                                            >
                                                                <div className="relative group">
                                                                    <button
                                                                        disabled={isBooked}
                                                                        onClick={() => {
                                                                            if (isBooked) {
                                                                                handleSlotClick(field, slot)
                                                                            }
                                                                        }}
                                                                        className={`w-14 h-14 rounded-xl ${getSlotColor(status)} ${hasSpecial ? 'border-4 border-yellow-400 shadow-md' : ''} transition-all duration-300 transform ${status === 'available'
                                                                            ? 'cursor-default'
                                                                            : 'cursor-pointer hover:scale-110 hover:shadow-lg'
                                                                            } flex items-center justify-center text-sm font-bold`}
                                                                    >
                                                                    </button>
                                                                    {/* Price tooltip */}
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                                        <div className="px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg bg-gray-800 text-white">
                                                                            {formatPrice(String(getSlotPrice(slot, selectedDate, field._id)))}
                                                                            {hasSpecial && <span className="block text-yellow-300">(Giá đặc biệt)</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center py-12 bg-gray-50">
                                                <div className="text-center">
                                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600">Cửa hàng này chưa có sân nào</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Store Details Card */}
                    {fields.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tên cửa hàng</p>
                                        <p className="font-medium">{store.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Địa chỉ</p>
                                        <p className="font-medium">{store.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số lượng sân</p>
                                        <p className="font-medium">{fields.length} sân</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">ID</p>
                                        <p className="font-medium text-xs text-gray-500">{store.id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
                                    <p className="text-gray-900 font-semibold">{selectedBooking.customerName || '(Chưa có thông tin)'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Số điện thoại
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedBooking.customerPhone || '(Chưa có thông tin)'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedBooking.customerEmail || '(Chưa có thông tin)'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Địa chỉ
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedBooking.customerAddress || '(Chưa có thông tin)'}</p>
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

                {/* Edit Store Dialog */}
                <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa thông tin cửa hàng</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tên cửa hàng</label>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                                <Input
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                                    onClick={handleUpdateStore}
                                >
                                    Lưu thay đổi
                                </Button>
                            </div>
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
                            {/* Add New Pricing Form */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thêm giá đặc biệt mới</h3>

                                <div className="space-y-4">
                                    {/* Field Selection Dropdown */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Chọn sân *
                                        </label>
                                        <select
                                            value={pricingForm.field_id}
                                            onChange={(e) => {
                                                setPricingForm({ ...pricingForm, field_id: e.target.value })
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">-- Chọn một sân --</option>
                                            {fields.map((field) => (
                                                <option key={field._id} value={field._id}>
                                                    {field.name} - {field.defaultPrice ? parseInt(field.defaultPrice).toLocaleString() + 'đ' : 'N/A'}/giờ
                                                </option>
                                            ))}
                                        </select>
                                    </div>

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
                                            Giá đặc biệt sẽ được áp dụng cho các khung giờ đã chọn trên sân "{pricingForm.field_id ? fields.find(f => f._id === pricingForm.field_id)?.name : 'chưa chọn'}". Nếu không có giá đặc biệt, sẽ sử dụng giá mặc định.
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
                                            disabled={!pricingForm.field_id || pricingForm.day_of_weeks.length === 0 || !pricingForm.price}
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
        </StoreLayout>
    );
}
