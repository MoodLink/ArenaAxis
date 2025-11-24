"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  Store,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  DollarSign,
  Star,
  FileText
  , Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',

  },
  {
    title: 'Quản lý Users',
    icon: Users,
    href: '/admin/users',

  },
  // {
  //   title: 'Quản lý Sân',
  //   icon: MapPin,
  //   href: '/admin/fields',

  // },
  // {
  //   title: 'Quản lý Booking',
  //   icon: Calendar,
  //   href: '/admin/bookings',

  // },
  {
    title: 'Trung tâm thể thao',
    icon: Store,
    href: '/admin/stores',

  },
  // {
  //   title: 'Cộng đồng',
  //   icon: MessageSquare,
  //   href: '/admin/community',

  // },
  // {
  //   title: 'Gói khuyến mãi',
  //   icon: Tag,
  //   href: '/admin/promotions',

  // },
  // {
  //   title: 'Analytics',
  //   icon: BarChart3,
  //   href: '/admin/analytics',

  // },
  // {
  //   title: 'Doanh thu',
  //   icon: DollarSign,
  //   href: '/admin/revenue',

  // },
  // {
  //   title: 'Đánh giá',
  //   icon: Star,
  //   href: '/admin/reviews',

  // },
  // {
  //   title: 'Báo cáo',
  //   icon: FileText,
  //   href: '/admin/reports',

  // },
  // {
  //   title: 'Cài đặt',
  //   icon: Settings,
  //   href: '/admin/settings',

  // }
]

function Sidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AA</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ArenaAxis</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>

            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80">
        <Sidebar className="w-full" />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Notifications and Profile */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}