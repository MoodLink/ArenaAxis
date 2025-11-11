"use client"

import React, { useState } from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import {
    AlertTriangle
} from 'lucide-react'
import AdminHeader from '@/components/admin/shared/AdminHeader'
import GeneralSettings from '@/components/admin/settings/GeneralSettings'
import SecuritySettings from '@/components/admin/settings/SecuritySettings'
import NotificationSettings from '@/components/admin/settings/NotificationSettings'
import PaymentSettings from '@/components/admin/settings/PaymentSettings'
import BookingSettings from '@/components/admin/settings/BookingSettings'
import { 
    mockSystemSettings,
    mockSecuritySettings,
    mockNotificationSettings,
    mockPaymentSettings,
    mockBookingSettings,
    SystemSettings,
    SecuritySettings as SecuritySettingsType,
    NotificationSettings as NotificationSettingsType,
    PaymentSettings as PaymentSettingsType,
    BookingSettings as BookingSettingsType
} from '@/data/mockDataAdmin'

export default function SettingsManagement() {
    const [systemSettings, setSystemSettings] = useState<SystemSettings>(mockSystemSettings)
    const [securitySettings, setSecuritySettings] = useState<SecuritySettingsType>(mockSecuritySettings)
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>(mockNotificationSettings)
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsType>(mockPaymentSettings)
    const [bookingSettings, setBookingSettings] = useState<BookingSettingsType>(mockBookingSettings)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const handleSaveSettings = (category: string) => {
        // Simulate saving settings
        console.log(`Saving ${category} settings`)
        setHasUnsavedChanges(false)
        // Show success message
    }

    const handleResetSettings = (category: string) => {
        console.log(`Resetting ${category} settings`)
        // Reset to default values based on category
        switch (category) {
            case 'general':
                setSystemSettings(mockSystemSettings)
                break
            case 'security':
                setSecuritySettings(mockSecuritySettings)
                break
            case 'notifications':
                setNotificationSettings(mockNotificationSettings)
                break
            case 'payment':
                setPaymentSettings(mockPaymentSettings)
                break
            case 'booking':
                setBookingSettings(mockBookingSettings)
                break
        }
        setHasUnsavedChanges(false)
    }

    const handleSystemSettingsChange = (settings: SystemSettings) => {
        setSystemSettings(settings)
        setHasUnsavedChanges(true)
    }

    const handleSecuritySettingsChange = (settings: SecuritySettingsType) => {
        setSecuritySettings(settings)
        setHasUnsavedChanges(true)
    }

    const handleNotificationSettingsChange = (settings: NotificationSettingsType) => {
        setNotificationSettings(settings)
        setHasUnsavedChanges(true)
    }

    const handlePaymentSettingsChange = (settings: PaymentSettingsType) => {
        setPaymentSettings(settings)
        setHasUnsavedChanges(true)
    }

    const handleBookingSettingsChange = (settings: BookingSettingsType) => {
        setBookingSettings(settings)
        setHasUnsavedChanges(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <AdminHeader
                    title="Cài đặt hệ thống"
                    description="Quản lý cấu hình và thiết lập hệ thống"
                />
                {hasUnsavedChanges && (
                    <div className="flex items-center space-x-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Có thay đổi chưa lưu</span>
                    </div>
                )}
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general" className="flex items-center space-x-2">
                        <span>Chung</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center space-x-2">
                        <span>Bảo mật</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center space-x-2">
                        <span>Thông báo</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center space-x-2">
                        <span>Thanh toán</span>
                    </TabsTrigger>
                    <TabsTrigger value="booking" className="flex items-center space-x-2">
                        <span>Booking</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <GeneralSettings
                        settings={systemSettings}
                        onSettingsChange={handleSystemSettingsChange}
                        onSave={() => handleSaveSettings('general')}
                        onReset={() => handleResetSettings('general')}
                    />
                </TabsContent>

                <TabsContent value="security">
                    <SecuritySettings
                        settings={securitySettings}
                        onSettingsChange={handleSecuritySettingsChange}
                        onSave={() => handleSaveSettings('security')}
                        onReset={() => handleResetSettings('security')}
                    />
                </TabsContent>

                <TabsContent value="notifications">
                    <NotificationSettings
                        settings={notificationSettings}
                        onSettingsChange={handleNotificationSettingsChange}
                        onSave={() => handleSaveSettings('notifications')}
                        onReset={() => handleResetSettings('notifications')}
                    />
                </TabsContent>

                <TabsContent value="payment">
                    <PaymentSettings
                        settings={paymentSettings}
                        onSettingsChange={handlePaymentSettingsChange}
                        onSave={() => handleSaveSettings('payment')}
                        onReset={() => handleResetSettings('payment')}
                    />
                </TabsContent>

                <TabsContent value="booking">
                    <BookingSettings
                        settings={bookingSettings}
                        onSettingsChange={handleBookingSettingsChange}
                        onSave={() => handleSaveSettings('booking')}
                        onReset={() => handleResetSettings('booking')}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}