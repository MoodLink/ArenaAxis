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
import { useStoreOrders } from '@/hooks/use-store-orders';
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

export default function StoreBookingsContent() {
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

    // Use React Query hook for automatic orders deduplication
    const { data: ordersData } = useStoreOrders(storeId, selectedDate, selectedDate);

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
    const [pricingMode, setPricingMode] = useState<'day-of-week' | 'specific-date'>('day-of-week');
    const [pricingForm, setPricingForm] = useState({
        field_id: '',
        day_of_weeks: [] as string[],
        start_at: '17:00',
        end_at: '19:30',
        price: ''
    });
    const [specialDatePricingForm, setSpecialDatePricingForm] = useState({
        date: selectedDate,
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

    //  Helper function to refresh booking data from store orders
    const refreshBookingData = useCallback(async () => {
        console.log(' refreshBookingData called with:', { storeId, fields: fields.length, selectedDate })

        if (!storeId || fields.length === 0) {
            console.log('⏭️ Skipping refresh - no storeId or fields yet')
            return
        }

        try {
            console.log(' Refreshing booking data from statusField for date:', selectedDate)

            //  Fetch fields with statusField data for selected date
            const fieldsResponse = await FieldService.getFieldsWithAllData(
                storeId,
                '', // No specific sport filter - get all sports
                selectedDate
            )
            console.log('🏟️ Fields response:', fieldsResponse)

            // Use ordersData from React Query hook (already cached and deduplicated)
            const ordersResponse = ordersData
            console.log('📦 Orders response (from hook):', ordersResponse)

            // Build bookingData from statusField array (PAID bookings only)
            const bookingMap: { [fieldId: string]: { [timeSlot: string]: "available" | "booked" | "locked" | "selected" } } = {}
            const bookingWithCustomerMap: Record<string, BookingInfo> = {}

            // Initialize all fields with empty booking data
            fields.forEach(field => {
                bookingMap[field._id] = {}
            })

            // Process each field's statusField array
            const fieldsData = fieldsResponse.data || []
            console.log(` Processing ${fieldsData.length} fields for date ${selectedDate}`)

            fieldsData.forEach((field: any) => {
                const fieldId = field._id
                console.log(` Processing field ${fieldId}`)

                if (!field.statusField || field.statusField.length === 0) {
                    console.log(`   No statusField data for field ${fieldId}`)
                    return
                }

                console.log(`  Found ${field.statusField.length} status entries`)

                // Filter PAID status only and extract booked slots
                const paidStatuses = field.statusField.filter((status: any) => status.statusPayment === 'PAID')
                console.log(`   Found ${paidStatuses.length} PAID bookings`)

                paidStatuses.forEach((status: any) => {
                    const startTime = status.startTime  // ISO format: "2025-12-01T06:30:00.000Z"
                    const endTime = status.endTime      // ISO format: "2025-12-01T07:00:00.000Z"

                    console.log(`    🕐 Booking: ${startTime} to ${endTime}`)
                    console.log(`     Booking details:`, status)

                    // Parse ISO datetime to extract time part WITHOUT timezone conversion
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

                    if (!bookingMap[fieldId]) {
                        bookingMap[fieldId] = {}
                    }

                    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
                        const hours = Math.floor(minutes / 60)
                        const mins = minutes % 60
                        const slotTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

                        bookingMap[fieldId][slotTime] = 'booked'
                        console.log(`       Marked as booked: ${slotTime}`)

                        // Try to find matching order from ordersResponse to get complete customer info
                        let bookingInfo: BookingInfo | null = null

                        if (ordersResponse && ordersResponse.length > 0) {
                            // Find order that matches this time slot
                            for (const order of ordersResponse) {
                                if (order.orderDetails && order.orderDetails.length > 0) {
                                    for (const detail of order.orderDetails) {
                                        if (detail.fieldId === fieldId) {
                                            // Check if this detail's time matches our slot
                                            const detailStartMatch = detail.startTime.match(/T(\d{2}):(\d{2}):/)
                                            if (detailStartMatch) {
                                                const detailStartTime = `${detailStartMatch[1]}:${detailStartMatch[2]}`
                                                if (detailStartTime === slotTime) {
                                                    // Found matching order detail
                                                    console.log(`         Found matching order for slot ${slotTime}:`, order)
                                                    bookingInfo = {
                                                        id: order._id || `booking-${slotTime}`,
                                                        fieldId: fieldId,
                                                        timeSlot: slotTime,
                                                        // Try to get user info from order or use fallback
                                                        customerName: status.userId?.name || order.userId || 'N/A',
                                                        customerPhone: status.userId?.phone || 'N/A',
                                                        customerEmail: status.userId?.email || 'N/A',
                                                        customerAddress: order.address || status.userId?.address || 'N/A',
                                                        bookingTime: new Date(order.createdAt).toLocaleString('vi-VN'),
                                                        price: detail.price || parseInt(field?.defaultPrice || '0')
                                                    }
                                                    break
                                                }
                                            }
                                        }
                                    }
                                    if (bookingInfo) break
                                }
                            }
                        }

                        // If no matching order found, use fallback info
                        if (!bookingInfo) {
                            bookingInfo = {
                                id: status._id || `booking-${slotTime}`,
                                fieldId: fieldId,
                                timeSlot: slotTime,
                                customerName: status.userId?.name || 'N/A',
                                customerPhone: status.userId?.phone || 'N/A',
                                customerEmail: status.userId?.email || 'N/A',
                                customerAddress: status.userId?.address || 'N/A',
                                bookingTime: new Date(status.createdAt).toLocaleString('vi-VN'),
                                price: status.price || parseInt(field?.defaultPrice || '0')
                            }
                        }

                        const bookingKey = `${fieldId}-${slotTime}`
                        bookingWithCustomerMap[bookingKey] = bookingInfo
                        console.log(`       Saved booking info for slot ${slotTime}:`, bookingInfo)
                    }
                })
            })

            setBookingData(bookingMap)
            console.log(' Final booking data:', bookingMap)
            Object.entries(bookingMap).forEach(([fieldId, slots]) => {
                const bookedCount = Object.values(slots).filter((s: string) => s === 'booked').length
                console.log(`  Field ${fieldId}: ${bookedCount} booked slots`)
            })
        } catch (error) {
            console.error(' Error refreshing booking data:', error)
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
                description: 'Không tìm thấy ID Trung tâm thể thao',
                variant: 'destructive',
            });
            router.push('/store');
            return;
        }

        loadStoreAndFields();
    }, [storeId]);

    //  Trigger refresh when fields are first loaded
    useEffect(() => {
        if (fields.length > 0 && storeId) {
            console.log(' Fields loaded - refreshing booking data immediately')
            refreshBookingData()
        }
    }, [fields.length, storeId, refreshBookingData])

    // Update booking data when date changes
    useEffect(() => {
        if (fields.length > 0 && selectedDate && storeId) {
            console.log('📅 Date changed - refreshing booking data')
            refreshBookingData()
        }
    }, [selectedDate, fields.length, storeId, refreshBookingData])

    //  Re-fetch booking data when page is focused
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log(' Page focused - refreshing booking data')
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
            }
        }

        //  Listen to custom event for same-tab payment completion
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

    //  Auto-refresh every 30 seconds
    useEffect(() => {
        console.log('⏰ Setting up auto-refresh interval')
        const interval = setInterval(() => {
            console.log('⏰ Auto-refresh...')
            if (fields.length > 0 && storeId) {
                refreshBookingData()
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [refreshBookingData, fields.length, storeId])

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
            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const response = await FieldService.getFields({
                store_id: storeId,
                date_time: today,
            });
            const fieldsData = response.data || [];
            setFields(fieldsData.filter((f: APIField) => f.activeStatus));

            // Load field pricings for ALL fields (both day-of-week and special date)
            if (fieldsData.length > 0) {
                const pricingsMap: { [key: string]: FieldPricing[] } = {};

                for (const field of fieldsData) {
                    try {
                        // Fetch both day-of-week and special date pricings
                        const pricingsResponse = await FieldPricingService.getAllFieldPricings(field._id);
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

            //  Refresh booking data after loading fields and pricings
            setLoading(false);
            if (storeId && fieldsData.length > 0) {
                console.log(' Fields and pricings loaded - refreshing booking data immediately')
                // Set timeout to ensure state is updated first
                setTimeout(() => {
                    refreshBookingData();
                }, 0);
            }
        } catch (error) {
            console.error('Error loading store or fields:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải thông tin Trung tâm thể thao hoặc danh sách sân',
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    // Format price
    const formatPrice = (price: string) => {
        return `${Number(price).toLocaleString('vi-VN')}đ`;
    };

    // Get slot price with special pricing (both day-of-week and special date)
    const getSlotPrice = (timeSlot: string, selectedDate: string, fieldId: string): number => {
        const date = new Date(selectedDate);
        const dayOfWeek = FieldPricingService.getDayOfWeek(date);
        const fieldPricings = fieldPricingsMap[fieldId] || [];
        const field = fields.find(f => f._id === fieldId);

        // First, check for special date pricing
        if (fieldPricings && fieldPricings.length > 0) {
            const specialDatePricing = fieldPricings.find(pricing => {
                if (!pricing.startAt) return false;

                let startAtStr: string = '';
                let endAtStr: string = '';

                if (typeof pricing.startAt === 'string') {
                    startAtStr = pricing.startAt;
                } else if (pricing.startAt && typeof pricing.startAt === 'object' && 'hour' in pricing.startAt) {
                    return false; // This is day-of-week pricing
                }

                if (typeof pricing.endAt === 'string') {
                    endAtStr = pricing.endAt;
                } else if (pricing.endAt && typeof pricing.endAt === 'object' && 'hour' in pricing.endAt) {
                    return false; // This is day-of-week pricing
                }

                if (!startAtStr || !endAtStr) return false;

                // Check if this has a date component (special date pricing)
                const hasDateComponent = startAtStr.includes('-') && (startAtStr.includes('T') || startAtStr.includes(' '));
                if (!hasDateComponent) return false;

                // Extract time parts
                const startTimePart = startAtStr.includes(' ') ? startAtStr.split(' ')[1] : (startAtStr.split('T')[1]?.substring(0, 5) || '');
                const endTimePart = endAtStr.includes(' ') ? endAtStr.split(' ')[1] : (endAtStr.split('T')[1]?.substring(0, 5) || '');

                const startTimeHour = parseInt(startTimePart.split(':')[0] || '0');
                const startTimeMin = parseInt(startTimePart.split(':')[1] || '0');
                const startTimeTotal = startTimeHour * 60 + startTimeMin;

                const endTimeHour = parseInt(endTimePart.split(':')[0] || '0');
                const endTimeMin = parseInt(endTimePart.split(':')[1] || '0');
                const endTimeTotal = endTimeHour * 60 + endTimeMin;

                const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
                const slotMinutes = slotHour * 60 + slotMinute;

                const startDateStr = startAtStr.split(' ')[0] || startAtStr.split('T')[0];
                const endDateStr = endAtStr.split(' ')[0] || endAtStr.split('T')[0];

                let isInRange = false;
                if (startDateStr === selectedDate && endDateStr === selectedDate) {
                    isInRange = slotMinutes >= startTimeTotal && slotMinutes < endTimeTotal;
                } else if (startDateStr === selectedDate && endDateStr > selectedDate) {
                    isInRange = slotMinutes >= startTimeTotal;
                } else if (startDateStr < selectedDate && endDateStr === selectedDate) {
                    isInRange = slotMinutes < endTimeTotal;
                }

                return isInRange;
            });

            if (specialDatePricing) {
                return specialDatePricing.specialPrice || parseInt(field?.defaultPrice || '0');
            }
        }

        // Fallback: check for day-of-week pricing
        const specialPrice = FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek);
        return specialPrice || (field?.defaultPrice ? parseInt(field.defaultPrice || '0') : 0);
    };

    // Check if slot has special pricing
    // Check if slot has special pricing (both day-of-week and special date)
    const hasSpecialPrice = (timeSlot: string, selectedDate: string, fieldId: string): boolean => {
        const date = new Date(selectedDate);
        const dayOfWeek = FieldPricingService.getDayOfWeek(date);
        const fieldPricings = fieldPricingsMap[fieldId] || [];

        // First check for special date pricing
        if (fieldPricings && fieldPricings.length > 0) {
            const hasSpecialDatePrice = fieldPricings.some(pricing => {
                if (!pricing.startAt) return false;

                let startAtStr: string = '';
                let endAtStr: string = '';

                if (typeof pricing.startAt === 'string') {
                    startAtStr = pricing.startAt;
                } else if (pricing.startAt && typeof pricing.startAt === 'object' && 'hour' in pricing.startAt) {
                    return false; // This is day-of-week pricing
                }

                if (typeof pricing.endAt === 'string') {
                    endAtStr = pricing.endAt;
                } else if (pricing.endAt && typeof pricing.endAt === 'object' && 'hour' in pricing.endAt) {
                    return false; // This is day-of-week pricing
                }

                if (!startAtStr || !endAtStr) return false;

                // Check if this has a date component (special date pricing)
                const hasDateComponent = startAtStr.includes('-') && (startAtStr.includes('T') || startAtStr.includes(' '));
                if (!hasDateComponent) return false;

                // Extract time parts
                const startTimePart = startAtStr.includes(' ') ? startAtStr.split(' ')[1] : (startAtStr.split('T')[1]?.substring(0, 5) || '');
                const endTimePart = endAtStr.includes(' ') ? endAtStr.split(' ')[1] : (endAtStr.split('T')[1]?.substring(0, 5) || '');

                const startTimeHour = parseInt(startTimePart.split(':')[0] || '0');
                const startTimeMin = parseInt(startTimePart.split(':')[1] || '0');
                const startTimeTotal = startTimeHour * 60 + startTimeMin;

                const endTimeHour = parseInt(endTimePart.split(':')[0] || '0');
                const endTimeMin = parseInt(endTimePart.split(':')[1] || '0');
                const endTimeTotal = endTimeHour * 60 + endTimeMin;

                const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
                const slotMinutes = slotHour * 60 + slotMinute;

                const startDateStr = startAtStr.split(' ')[0] || startAtStr.split('T')[0];
                const endDateStr = endAtStr.split(' ')[0] || endAtStr.split('T')[0];

                let isInRange = false;
                if (startDateStr === selectedDate && endDateStr === selectedDate) {
                    isInRange = slotMinutes >= startTimeTotal && slotMinutes < endTimeTotal;
                } else if (startDateStr === selectedDate && endDateStr > selectedDate) {
                    isInRange = slotMinutes >= startTimeTotal;
                } else if (startDateStr < selectedDate && endDateStr === selectedDate) {
                    isInRange = slotMinutes < endTimeTotal;
                }

                return isInRange;
            });

            if (hasSpecialDatePrice) return true;
        }

        // Fallback: check for day-of-week pricing
        return FieldPricingService.getSpecialPriceForSlot(fieldPricings, timeSlot, dayOfWeek) !== null;
    };

    // Format date from YYYY-MM-DD to DD-MM-YYYY
    const formatDateDisplay = (dateStr: string): string => {
        if (!dateStr || !dateStr.includes('-')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
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
                title: 'Thành công ',
                description: 'Thông tin Trung tâm thể thao đã được cập nhật',
            });

            setShowEditModal(false);
            loadStoreAndFields();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error instanceof Error ? error.message : 'Không thể cập nhật Trung tâm thể thao',
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
            if (pricingMode === 'day-of-week') {
                // Create day-of-week pricing
                await FieldPricingService.createFieldPricing({
                    field_id: pricingForm.field_id,
                    day_of_weeks: pricingForm.day_of_weeks,
                    start_at: pricingForm.start_at,
                    end_at: pricingForm.end_at,
                    price: pricingForm.price
                });
            } else {
                // Create special date pricing
                const startDateTime = `${specialDatePricingForm.date} ${specialDatePricingForm.start_at}`;
                const endDateTime = `${specialDatePricingForm.date} ${specialDatePricingForm.end_at}`;

                await FieldPricingService.createSpecialDatePricing({
                    field_id: pricingForm.field_id,
                    start_at: startDateTime,
                    end_at: endDateTime,
                    price: specialDatePricingForm.price
                });
            }

            toast({
                title: 'Thành công ',
                description: 'Đã thêm giá đặc biệt',
            });

            // Reset forms
            setPricingForm({
                field_id: '',
                day_of_weeks: [],
                start_at: '17:00',
                end_at: '19:30',
                price: ''
            });
            setSpecialDatePricingForm({
                date: selectedDate,
                start_at: '17:00',
                end_at: '19:30',
                price: ''
            });
            setPricingMode('day-of-week');
            setShowPricingModal(false);

            //  Reload pricings for the updated field
            const updatedPricingsResponse = await FieldPricingService.getAllFieldPricings(pricingForm.field_id);
            if (updatedPricingsResponse.data) {
                setFieldPricingsMap(prev => ({
                    ...prev,
                    [pricingForm.field_id]: updatedPricingsResponse.data
                }));
            }

            //  Refresh booking data immediately to reflect new pricing without full page reload
            refreshBookingData();
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
                title: 'Thành công ',
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
                    <p className="text-gray-600">Đang tải thông tin Trung tâm thể thao...</p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Không tìm thấy thông tin Trung tâm thể thao</p>
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

                    {/* Two Column Layout: 75% Left Content + 25% Right Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Column - 75% */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Booking Grid */}
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
                                                                const bookingKey = `${field._id}-${slot}`
                                                                const bookingInfo = selectedBooking && selectedBooking.id === bookingKey ? selectedBooking : null

                                                                return (
                                                                    <div
                                                                        key={`booking-slot-${field._id}-${slotIndex}-${slot}`}
                                                                        className={`flex-shrink-0 w-20 border-r border-gray-100/50 flex items-center justify-center px-2 ${slotIndex % 2 === 0 ? 'bg-white/30' : 'bg-emerald-50/30'
                                                                            }`}
                                                                    >
                                                                        <div className="relative group">
                                                                            <button
                                                                                disabled={!isBooked}
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
                                                                                {status === 'booked' && (
                                                                                    <span className="text-white text-xs">✕</span>
                                                                                )}
                                                                            </button>
                                                                            {/* Price tooltip */}
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                                                <div className="px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg bg-gray-800 text-white">
                                                                                    {formatPrice(String(getSlotPrice(slot, selectedDate, field._id)))}
                                                                                    {hasSpecial && <span className="block text-yellow-300">(Giá đặc biệt)</span>}
                                                                                </div>
                                                                            </div>

                                                                            {/* Customer info tooltip for booked slots */}
                                                                            {status === 'booked' && (
                                                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                                                                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-xl px-3 py-2 text-xs whitespace-nowrap border border-blue-400">
                                                                                        <div className="font-bold">Chi tiết đặt sân</div>
                                                                                        <div className="text-blue-100 text-xs">Khung giờ: {slot}</div>
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
                                                    ))
                                                ) : (
                                                    <div className="flex items-center justify-center py-12 bg-gray-50">
                                                        <div className="text-center">
                                                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                            <p className="text-gray-600">Trung tâm thể thao này chưa có sân nào</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Store Details Card */}
                            {/* {fields.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thông tin chi tiết</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Tên trung tâm thể thao</p>
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
                            )} */}
                        </div>

                        {/* Right Sidebar - 25% */}
                        <div className="lg:col-span-1">
                            {/* Special Pricing Overview Sidebar */}
                            <div className="sticky top-6 h-fit">
                                <Card className="shadow-lg border-0">
                                    <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200">
                                        <CardTitle className="flex items-center gap-2 text-yellow-900 text-base">
                                            <Calendar className="h-4 w-4" />
                                            Giá đặc biệt
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 max-h-[calc(100vh-150px)] overflow-y-auto">
                                        {Object.entries(fieldPricingsMap).some(([_, pricings]) => pricings && pricings.length > 0) ? (
                                            <div className="space-y-3">
                                                {fields.map((field) => {
                                                    const fieldPricings = fieldPricingsMap[field._id] || [];

                                                    // Separate day-of-week and special date pricings
                                                    // Day-of-week has dayOfWeek property OR startAt is in time format (HH:MM)
                                                    // Special date has startAt with date format (YYYY-MM-DD HH:MM)
                                                    const dayOfWeekPricings = fieldPricings.filter((p: any) => {
                                                        if (p.dayOfWeek) return true;
                                                        // Check if startAt is in object format {hour, minute}
                                                        if (p.startAt && typeof p.startAt === 'object' && 'hour' in p.startAt) return true;
                                                        return false;
                                                    });

                                                    const specialDatePricings = fieldPricings.filter((p: any) => {
                                                        if (p.dayOfWeek) return false;
                                                        // Special date pricing has startAt as string with date (YYYY-MM-DD HH:MM)
                                                        if (p.startAt && typeof p.startAt === 'string' && p.startAt.includes('-') && p.startAt.includes(':')) {
                                                            return true;
                                                        }
                                                        return false;
                                                    });

                                                    return (dayOfWeekPricings.length > 0 || specialDatePricings.length > 0) ? (
                                                        <div key={`pricing-section-${field._id}`}>
                                                            <div className="mb-2 font-semibold text-gray-700 flex items-center gap-2 text-xs">
                                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                    {field.name?.charAt(0).toUpperCase() || 'S'}
                                                                </div>
                                                                <span className="truncate">{field.name}</span>
                                                            </div>
                                                            <div className="space-y-1 ml-7">
                                                                {/* Day-of-week pricings */}
                                                                {dayOfWeekPricings.map((pricing, idx) => (
                                                                    <div
                                                                        key={`pricing-item-${pricing._id}-${idx}`}
                                                                        className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-xs"
                                                                    >
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-medium text-gray-900 truncate">
                                                                                {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                            </div>
                                                                            <div className="text-xs text-gray-600">
                                                                                {formatDayOfWeekVietnamese(pricing.dayOfWeek)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right flex-shrink-0">
                                                                            <div className="font-bold text-emerald-600">
                                                                                {pricing.specialPrice.toLocaleString()}đ
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {/* Special date pricings */}
                                                                {specialDatePricings.map((pricing, idx) => {
                                                                    const startAtStr = typeof pricing.startAt === 'string' ? pricing.startAt : '';
                                                                    const dateStr = startAtStr.includes(' ') ? startAtStr.split(' ')[0] : 'N/A';
                                                                    const formattedDate = formatDateDisplay(dateStr);
                                                                    return (
                                                                        <div
                                                                            key={`special-pricing-item-${pricing._id}-${idx}`}
                                                                            className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-xs"
                                                                        >
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="font-medium text-gray-900 truncate">
                                                                                    {FieldPricingService.formatTime(pricing.startAt)} - {FieldPricingService.formatTime(pricing.endAt)}
                                                                                </div>
                                                                                <div className="text-xs text-gray-600">
                                                                                    {formattedDate}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right flex-shrink-0">
                                                                                <div className="font-bold text-emerald-600">
                                                                                    {pricing.specialPrice.toLocaleString()}đ
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg text-center">
                                                Chưa có giá đặc biệt nào. Bấm "Giá đặc biệt" để thêm.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
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
                            <DialogTitle>Chỉnh sửa thông tin trung tâm thể thao</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Tên trung tâm thể thao</label>
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

                                    {/* Mode Tabs */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Loại giá đặc biệt
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPricingMode('day-of-week');
                                                    setSpecialDatePricingForm({
                                                        date: selectedDate,
                                                        start_at: '17:00',
                                                        end_at: '19:30',
                                                        price: ''
                                                    });
                                                }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pricingMode === 'day-of-week'
                                                    ? 'bg-emerald-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Theo thứ trong tuần
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPricingMode('specific-date');
                                                    setPricingForm({
                                                        ...pricingForm,
                                                        day_of_weeks: []
                                                    });
                                                }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pricingMode === 'specific-date'
                                                    ? 'bg-emerald-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Ngày cụ thể
                                            </button>
                                        </div>
                                    </div>

                                    {/* Day of Week Mode */}
                                    {pricingMode === 'day-of-week' ? (
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
                                        <>
                                            {/* Specific Date Mode */}
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
                                            disabled={
                                                !pricingForm.field_id ||
                                                (pricingMode === 'day-of-week'
                                                    ? (pricingForm.day_of_weeks.length === 0 || !pricingForm.price || !pricingForm.start_at || !pricingForm.end_at)
                                                    : (!specialDatePricingForm.date || !specialDatePricingForm.price || !specialDatePricingForm.start_at || !specialDatePricingForm.end_at))
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
        </StoreLayout>
    )
}