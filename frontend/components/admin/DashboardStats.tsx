"use client"

import React, { useState, useEffect } from 'react'
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
import { getUsers, getUserStores } from '@/services/api-new'
import { FieldService } from '@/services/field.service'

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
  const [totalUsers, setTotalUsers] = useState<number | string>('0')
  const [totalStores, setTotalStores] = useState<number | string>('0')
  const [totalFields, setTotalFields] = useState<number | string>('0')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch tổng người dùng
        try {
          const usersData = await getUsers(0, 1000)
          if (Array.isArray(usersData)) {
            setTotalUsers(usersData.length)
            console.log(' Users loaded:', usersData.length)
          } else {
            console.warn('Users data is not an array:', usersData)
            setTotalUsers('0')
          }
        } catch (err: any) {
          console.error(' Error fetching users:', err.message)
          // Don't set error here - let the component handle gracefully
          setTotalUsers('0')
        }

        // Fetch tổng Trung tâm thể thao
        try {
          const storesData = await getUserStores(1, 1000)
          if (Array.isArray(storesData)) {
            setTotalStores(storesData.length)
            console.log(' Stores loaded:', storesData.length)
          } else {
            console.warn('Stores data is not an array:', storesData)
            setTotalStores('0')
          }
        } catch (err: any) {
          console.error(' Error fetching stores:', err.message)
          // Don't set error here - let the component handle gracefully
          setTotalStores('0')
        }

        // Fetch tổng sân - sử dụng FieldService
        try {
          const fieldsResponse = await FieldService.getFields()
          if (fieldsResponse?.data && Array.isArray(fieldsResponse.data)) {
            setTotalFields(fieldsResponse.data.length)
            console.log(' Fields loaded:', fieldsResponse.data.length)
          } else {
            console.warn('Fields response invalid:', fieldsResponse)
            setTotalFields('0')
          }
        } catch (err: any) {
          console.error(' Error fetching fields:', err.message)
          // Don't set error here - let the component handle gracefully
          setTotalFields('0')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}