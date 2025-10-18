"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Revenue trend data
const revenueData = [
  { month: 'T1', revenue: 45000000, bookings: 180 },
  { month: 'T2', revenue: 52000000, bookings: 210 },
  { month: 'T3', revenue: 48000000, bookings: 195 },
  { month: 'T4', revenue: 61000000, bookings: 245 },
  { month: 'T5', revenue: 55000000, bookings: 220 },
  { month: 'T6', revenue: 67000000, bookings: 270 },
  { month: 'T7', revenue: 72000000, bookings: 290 },
  { month: 'T8', revenue: 69000000, bookings: 275 },
  { month: 'T9', revenue: 58000000, bookings: 235 },
  { month: 'T10', revenue: 63000000, bookings: 255 },
  { month: 'T11', revenue: 71000000, bookings: 285 },
  { month: 'T12', revenue: 78000000, bookings: 315 }
]

// Sports distribution data
const sportsData = [
  { sport: 'Bóng đá', bookings: 450, percentage: 35, color: '#22C55E' },
  { sport: 'Tennis', bookings: 320, percentage: 25, color: '#3B82F6' },
  { sport: 'Cầu lông', bookings: 280, percentage: 22, color: '#F59E0B' },
  { sport: 'Bóng rổ', bookings: 150, percentage: 12, color: '#EF4444' },
  { sport: 'Bơi lội', bookings: 80, percentage: 6, color: '#8B5CF6' }
]

// Daily bookings data for the current week
const dailyBookingsData = [
  { day: 'T2', bookings: 45, revenue: 8500000 },
  { day: 'T3', bookings: 52, revenue: 9800000 },
  { day: 'T4', bookings: 48, revenue: 9200000 },
  { day: 'T5', bookings: 61, revenue: 11500000 },
  { day: 'T6', bookings: 73, revenue: 13800000 },
  { day: 'T7', bookings: 89, revenue: 16700000 },
  { day: 'CN', bookings: 92, revenue: 17400000 }
]

// Peak hours data
const peakHoursData = [
  { hour: '6-8h', bookings: 45 },
  { hour: '8-10h', bookings: 32 },
  { hour: '10-12h', bookings: 28 },
  { hour: '12-14h', bookings: 22 },
  { hour: '14-16h', bookings: 38 },
  { hour: '16-18h', bookings: 65 },
  { hour: '18-20h', bookings: 78 },
  { hour: '20-22h', bookings: 85 },
  { hour: '22-24h', bookings: 35 }
]

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))'
  },
  bookings: {
    label: 'Booking',
    color: 'hsl(var(--chart-2))'
  }
}

// Revenue Chart Component
export function RevenueChart() {
  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Doanh thu theo tháng</CardTitle>
        <CardDescription>Biểu đồ doanh thu và số lượng booking trong 12 tháng qua</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-sm font-medium">{`Tháng ${label}`}</p>
                        <p className="text-sm text-green-600">
                          Doanh thu: {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(payload[0].value as number)}
                        </p>
                        <p className="text-sm text-blue-600">
                          Booking: {payload[1]?.value} lượt
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22C55E"
                fill="#22C55E"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Sports Distribution Chart
export function SportsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Phân bố theo môn thể thao</CardTitle>
        <CardDescription>Tỷ lệ booking theo từng môn thể thao</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sportsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="bookings"
                >
                  {sportsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                          <p className="text-sm font-medium">{data.sport}</p>
                          <p className="text-sm text-gray-600">
                            {data.bookings} booking ({data.percentage}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 ml-6 space-y-3">
            {sportsData.map((sport, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sport.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{sport.sport}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{sport.bookings}</p>
                  <p className="text-xs text-gray-500">{sport.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Daily Bookings Chart
export function DailyBookingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Booking theo ngày trong tuần</CardTitle>
        <CardDescription>Số lượng booking và doanh thu hàng ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyBookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-blue-600">
                          Booking: {payload[0].value} lượt
                        </p>
                        <p className="text-sm text-green-600">
                          Doanh thu: {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(payload[0].payload.revenue)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="bookings"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Peak Hours Chart
export function PeakHoursChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Giờ cao điểm</CardTitle>
        <CardDescription>Phân bố booking theo khung giờ trong ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-blue-600">
                          {payload[0].value} booking
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Main Analytics Dashboard Component
export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Thống kê và phân tích dữ liệu chi tiết</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SportsChart />
        <DailyBookingsChart />
        <div className="lg:col-span-2">
          <PeakHoursChart />
        </div>
      </div>
    </div>
  )
}