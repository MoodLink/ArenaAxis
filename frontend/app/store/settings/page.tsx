"use client"

import React, { useState } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import AccountSettings from '@/components/store/settings/AccountSettings'
import NotificationSettings from '@/components/store/settings/NotificationSettings'
import SecuritySettings from '@/components/store/settings/SecuritySettings'
import PaymentSettings from '@/components/store/settings/PaymentSettings'
import TeamManagement from '@/components/store/settings/TeamManagement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Building2,
    Bell,
    Shield,
    CreditCard,
    Users
} from 'lucide-react'

// Mock data
const storeInfo = {
    name: 'Arena Sports Complex',
    description: 'Hệ thống sân thể thao hiện đại với đầy đủ tiện ích',
    address: '123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'contact@arenasports.com',
    website: 'https://arenasports.com',
    avatar: '/placeholder-logo.png',
    businessHours: {
        monday: { open: '06:00', close: '22:00', closed: false },
        tuesday: { open: '06:00', close: '22:00', closed: false },
        wednesday: { open: '06:00', close: '22:00', closed: false },
        thursday: { open: '06:00', close: '22:00', closed: false },
        friday: { open: '06:00', close: '22:00', closed: false },
        saturday: { open: '06:00', close: '23:00', closed: false },
        sunday: { open: '06:00', close: '23:00', closed: false }
    }
}

const notificationSettings = {
    email: {
        newBooking: true,
        cancelBooking: true,
        paymentReceived: true,
        customerReview: true,
        maintenanceReminder: true,
        promotionExpiry: false,
        systemUpdates: true
    },
    sms: {
        newBooking: true,
        cancelBooking: false,
        paymentReceived: false,
        customerReview: false,
        maintenanceReminder: true,
        promotionExpiry: false,
        systemUpdates: false
    },
    push: {
        newBooking: true,
        cancelBooking: true,
        paymentReceived: true,
        customerReview: true,
        maintenanceReminder: true,
        promotionExpiry: true,
        systemUpdates: true
    }
}

const teamMembers = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@arenasports.com',
        role: 'Manager',
        avatar: '/placeholder-user.jpg',
        status: 'active',
        permissions: ['manage_bookings', 'manage_fields', 'view_reports']
    },
    {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@arenasports.com',
        role: 'Staff',
        avatar: '/placeholder-user.jpg',
        status: 'active',
        permissions: ['manage_bookings', 'view_reports']
    },
    {
        id: 3,
        name: 'Lê Văn C',
        email: 'levanc@arenasports.com',
        role: 'Maintenance',
        avatar: '/placeholder-user.jpg',
        status: 'inactive',
        permissions: ['manage_maintenance']
    }
]

const paymentMethods = [
    {
        id: 1,
        type: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        details: {
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountName: 'ARENA SPORTS COMPLEX'
        },
        enabled: true
    },
    {
        id: 2,
        type: 'momo',
        name: 'Ví điện tử MoMo',
        details: {
            phone: '0901234567'
        },
        enabled: true
    },
    {
        id: 3,
        type: 'vnpay',
        name: 'VNPay',
        details: {
            merchantId: 'MERCHANT123'
        },
        enabled: false
    },
    {
        id: 4,
        type: 'cash',
        name: 'Tiền mặt',
        details: {},
        enabled: true
    }
]

export default function StoreSettings() {
    const [activeTab, setActiveTab] = useState('account')

    return (
        <StoreLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                    <p className="text-gray-600 mt-1">Quản lý cài đặt và cấu hình cơ sở thể thao</p>
                </div>

                {/* Settings Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="account" className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>Tài khoản</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Thông báo</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Bảo mật</span>
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Thanh toán</span>
                        </TabsTrigger>
                        <TabsTrigger value="team" className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Nhân viên</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="mt-6">
                        <AccountSettings storeInfo={storeInfo} />
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-6">
                        <NotificationSettings notificationSettings={notificationSettings} />
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                        <SecuritySettings />
                    </TabsContent>

                    <TabsContent value="payment" className="mt-6">
                        <PaymentSettings paymentMethods={paymentMethods} />
                    </TabsContent>

                    <TabsContent value="team" className="mt-6">
                        <TeamManagement teamMembers={teamMembers} />
                    </TabsContent>
                </Tabs>
            </div>
        </StoreLayout>
    )
}