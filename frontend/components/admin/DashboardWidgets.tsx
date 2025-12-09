"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MoreHorizontal,
  Clock,
  MapPin,
  Star,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react'

// Component hiển thị booking gần đây
function RecentBookings() {
  const recentBookings = [
    {
      id: '1',
      user: {
        name: 'Nguyễn Văn An',
        avatar: '/placeholder-user.jpg',
        email: 'nguyenvanan@email.com'
      },
      field: 'Journey Multi Sports Turf',
      date: '2024-12-25',
      time: '14:00 - 16:00',
      status: 'confirmed' as const,
      amount: '300,000đ'
    },
    {
      id: '2',
      user: {
        name: 'Trần Thị Bình',
        avatar: '/placeholder-user.jpg',
        email: 'tranthibinh@email.com'
      },
      field: 'Sân Tennis Luxury',
      date: '2024-12-25',
      time: '18:00 - 19:00',
      status: 'pending' as const,
      amount: '200,000đ'
    },
    {
      id: '3',
      user: {
        name: 'Lê Văn Cường',
        avatar: '/placeholder-user.jpg',
        email: 'levancuong@email.com'
      },
      field: 'Sân Cầu lông ProCourt',
      date: '2024-12-26',
      time: '07:00 - 08:00',
      status: 'completed' as const,
      amount: '150,000đ'
    },
    {
      id: '4',
      user: {
        name: 'Phạm Thị Dung',
        avatar: '/placeholder-user.jpg',
        email: 'phamthidung@email.com'
      },
      field: 'Sân Bóng rổ Elite',
      date: '2024-12-26',
      time: '16:00 - 17:00',
      status: 'cancelled' as const,
      amount: '180,000đ'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ xác nhận'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Booking gần đây</CardTitle>
        <CardDescription>Các booking mới nhất trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={booking.user.avatar} />
                <AvatarFallback>
                  {booking.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{booking.user.name}</p>
                <p className="text-xs text-gray-500">{booking.field}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{booking.date}</span>
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{booking.time}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{booking.amount}</p>
              <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Xem tất cả booking
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Component hiển thị top sân được đặt nhiều nhất
function TopFields() {
  const topFields = [
    {
      id: '1',
      name: 'Journey Multi Sports Turf',
      location: 'Phường Tân Bình',
      bookings: 156,
      rating: 4.8,
      revenue: '15.2M'
    },
    {
      id: '2',
      name: 'Sân Tennis Luxury',
      location: 'Quận 1',
      bookings: 134,
      rating: 4.7,
      revenue: '12.8M'
    },
    {
      id: '3',
      name: 'Elite Basketball Court',
      location: 'Quận 3',
      bookings: 98,
      rating: 4.6,
      revenue: '8.9M'
    },
    {
      id: '4',
      name: 'ProCourt Badminton',
      location: 'Quận 7',
      bookings: 87,
      rating: 4.5,
      revenue: '7.2M'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top sân thể thao</CardTitle>
        <CardDescription>Sân được đặt nhiều nhất trong tháng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topFields.map((field, index) => (
          <div key={field.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">#{index + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{field.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{field.location}</span>
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-gray-500">{field.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{field.bookings} booking</p>
              <p className="text-xs text-gray-500">₫{field.revenue}</p>
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Xem báo cáo chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Component hiển thị hoạt động gần đây
function RecentActivities() {
  const activities = [
    {
      id: '1',
      type: 'user_register',
      user: 'Nguyễn Văn An',
      action: 'đã đăng ký tài khoản',
      time: '5 phút trước',
      icon: Users
    },
    {
      id: '2',
      type: 'booking_confirm',
      user: 'Trần Thị Bình',
      action: 'đã xác nhận booking sân tennis',
      time: '12 phút trước',
      icon: Calendar
    },
    {
      id: '3',
      type: 'field_review',
      user: 'Lê Văn Cường',
      action: 'đã đánh giá 5⭐ Journey Multi Sports',
      time: '1 giờ trước',
      icon: Star
    },
    {
      id: '4',
      type: 'revenue_milestone',
      user: 'Hệ thống',
      action: 'đạt mức doanh thu 100M trong tháng',
      time: '2 giờ trước',
      icon: TrendingUp
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hoạt động gần đây</CardTitle>
        <CardDescription>Các sự kiện mới nhất trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          )
        })}
        <div className="pt-4 border-t border-gray-200">
          <Button variant="outline" className="w-full">
            Xem tất cả hoạt động
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { RecentBookings, TopFields, RecentActivities }