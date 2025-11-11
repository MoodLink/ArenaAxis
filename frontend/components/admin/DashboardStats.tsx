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

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ElementType
  description?: string
}

function StatsCard({ title, value, change, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
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
  const stats = [
    {
      title: 'Tổng người dùng',
      value: '1,247',
      change: { value: 12.5, type: 'increase' as const },
      icon: Users,
      description: 'Người dùng đã đăng ký'
    },
    {
      title: 'Tổng sân thể thao',
      value: '89',
      change: { value: 5.2, type: 'increase' as const },
      icon: MapPin,
      description: 'Sân đang hoạt động'
    },
    {
      title: 'Booking trong tháng',
      value: '2,358',
      change: { value: 8.7, type: 'increase' as const },
      icon: Calendar,
      description: 'Lượt đặt sân'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫125M',
      change: { value: 15.3, type: 'increase' as const },
      icon: DollarSign,
      description: 'Doanh thu thực tế'
    },
    {
      title: 'Đánh giá trung bình',
      value: '4.8',
      change: { value: 0.2, type: 'increase' as const },
      icon: Star,
      description: 'Từ 1,024 đánh giá'
    },
    {
      title: 'Người dùng hoạt động',
      value: '892',
      change: { value: -2.1, type: 'decrease' as const },
      icon: Activity,
      description: 'Trong 30 ngày qua'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}