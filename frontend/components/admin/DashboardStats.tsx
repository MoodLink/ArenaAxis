"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Activity
} from 'lucide-react'
import { useAllAdminUsers, useAllStores, useAdminFields } from '@/hooks/admin-queries'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ElementType
  description?: string
  loading?: boolean
}

function StatsCard({ title, value, change, icon: Icon, description, loading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {loading ? '...' : value}
        </div>
        {change && !loading && (
          <div className="flex items-center mt-1">
            {change.type === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs font-medium ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardStats() {
  // Using React Query hooks for optimized caching
  const { data: usersData, isLoading: usersLoading } = useAllAdminUsers()
  const { data: storesData, isLoading: storesLoading } = useAllStores()
  const { data: fieldsResponse, isLoading: fieldsLoading } = useAdminFields(
    new Date().toISOString().split('T')[0]
  )

  // Extract totals
  const totalUsers = Array.isArray(usersData) ? usersData.length : 0
  const totalStores = Array.isArray(storesData) ? storesData.length : 0
  const totalFields = fieldsResponse?.data && Array.isArray(fieldsResponse.data) ? fieldsResponse.data.length : 0
  const loading = usersLoading || storesLoading || fieldsLoading

  const stats = [
    {
      title: 'Tổng người dùng',
      value: totalUsers,
      icon: Users,
      description: 'Người dùng đã đăng ký',
      loading
    },
    {
      title: 'Tổng trung tâm thể thao',
      value: totalStores,
      icon: MapPin,
      description: 'Trung tâm thể thao đang hoạt động',
      loading
    },
    {
      title: 'Tổng sân thể thao',
      value: totalFields,
      icon: Calendar,
      description: 'Sân đang hoạt động',
      loading
    },
    {
      title: 'Booking trong tháng',
      value: '2,358',

      icon: Calendar,
      description: 'Lượt đặt sân',
      loading: false
    },
    {
      title: 'Doanh thu tháng',
      value: '₫125M',

      icon: DollarSign,
      description: 'Doanh thu thực tế',
      loading: false
    },
    {
      title: 'Đánh giá trung bình',
      value: '4.8',

      icon: Star,
      description: 'Từ 1,024 đánh giá',
      loading: false
    }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}