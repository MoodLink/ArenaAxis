"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    MapPin,
    Calendar,
    DollarSign,
    Star,
    Tag,
    Wrench,
    Bell,
    Search,
    Menu,
    X,
    User,
    Settings,
    LogOut,
    BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sidebarItems = [
    {
        title: 'Quản lý cửa hàng',
        icon: LayoutDashboard,
        href: '/store',
        badge: null,
        // children: [
        //     {
        //         title: 'Chi tiết',
        //         icon: BarChart3,
        //         href: '/store/detail',
        //         badge: null
        //     }
        // ]
    },
    {
        title: 'Sân của tôi',
        icon: MapPin,
        href: '/store/my-fields',
        badge: '5'
    },
    {
        title: 'Lịch đặt sân',
        icon: Calendar,
        href: '/store/bookings',
        badge: '12'
    },
    {
        title: 'Doanh thu',
        icon: DollarSign,
        href: '/store/revenue',
        badge: null
    },
    {
        title: 'Đánh giá',
        icon: Star,
        href: '/store/reviews',
        badge: '8'
    },
    {
        title: 'Khuyến mãi',
        icon: Tag,
        href: '/store/promotions',
        badge: '3'
    },
    {
        title: 'Bảo trì sân',
        icon: Wrench,
        href: '/store/maintenance',
        badge: '2'
    },
    {
        title: 'Thống kê',
        icon: BarChart3,
        href: '/store/analytics',
        badge: null
    },
    {
        title: 'Cài đặt',
        icon: Settings,
        href: '/store/settings',
        badge: null
    }
]

function Sidebar({ className = '' }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={`bg-white border-r border-gray-200 ${className}`}>
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/store" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AA</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900">ArenaAxis</h1>
                        <p className="text-sm text-gray-500">Store Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <div key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span>{item.title}</span>
                                </div>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        </div>
                    )
                })}
            </nav>

            {/* Store Info */}
            <div className="p-4 border-t border-gray-200 mt-auto">
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Sân Thể Thao Vinhomes</span>
                    </div>
                    <p className="text-xs text-blue-700">5 sân đang hoạt động</p>
                    <p className="text-xs text-blue-600">Quận 7, TP.HCM</p>
                </div>
            </div>
        </div>
    )
}

function Header({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={onMobileMenuToggle}
            >
                <Menu className="h-4 w-4" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 bg-gray-50 border-gray-200"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        3
                    </Badge>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" alt="Store Owner" />
                                <AvatarFallback>SO</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Nguyễn Văn Store</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    store@arenaaxis.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Tài khoản</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Cài đặt</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

interface StoreLayoutProps {
    children: React.ReactNode
}

export default function StoreLayout({ children }: StoreLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:h-full" />

                {/* Mobile Sidebar */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
                        <Sidebar className="relative w-64 h-full" />
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:ml-64 w-full max-w-full overflow-x-hidden">
                    <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <main className="flex-1 bg-gray-50 pb-20 overflow-x-hidden">
                        <div className="p-4 md:p-6 w-full max-w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}