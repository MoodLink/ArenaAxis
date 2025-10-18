import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
    LineChart,
    Legend,
    AreaChart,
    Area
} from 'recharts'

interface BookingPattern {
    hour: string
    bookings: number
    revenue: number
}

interface PeakTime {
    day: string
    morning: number
    afternoon: number
    evening: number
}

interface SeasonalTrend {
    month: string
    football: number
    tennis: number
    basketball: number
    badminton: number
}

interface BookingAnalyticsProps {
    bookingPatterns: BookingPattern[]
    peakTimes: PeakTime[]
    seasonalTrends: SeasonalTrend[]
}

export default function BookingAnalytics({
    bookingPatterns,
    peakTimes,
    seasonalTrends
}: BookingAnalyticsProps) {
    return (
        <div className="space-y-6">
            {/* Hourly Booking Patterns */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng đặt sân theo giờ</CardTitle>
                    <CardDescription>Số lượng đặt sân và doanh thu theo từng giờ trong ngày</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={bookingPatterns}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis yAxisId="bookings" orientation="left" />
                                <YAxis yAxisId="revenue" orientation="right" />
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        name === 'bookings' ? value : `${(value / 1000000).toFixed(1)}M VNĐ`,
                                        name === 'bookings' ? 'Số đặt sân' : 'Doanh thu'
                                    ]}
                                />
                                <Legend />
                                <Bar
                                    yAxisId="bookings"
                                    dataKey="bookings"
                                    fill="#3b82f6"
                                    name="Số đặt sân"
                                />
                                <Line
                                    yAxisId="revenue"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    name="Doanh thu"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Peak Times Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Phân tích giờ cao điểm</CardTitle>
                    <CardDescription>Số lượng đặt sân theo khung giờ trong tuần</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peakTimes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="morning" stackId="a" fill="#06b6d4" name="Sáng (6h-12h)" />
                                <Bar dataKey="afternoon" stackId="a" fill="#8b5cf6" name="Chiều (12h-18h)" />
                                <Bar dataKey="evening" stackId="a" fill="#f59e0b" name="Tối (18h-22h)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Seasonal Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Xu hướng theo mùa</CardTitle>
                    <CardDescription>Mức độ sử dụng các loại sân theo từng tháng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={seasonalTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="football"
                                    stackId="1"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    name="Bóng đá"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tennis"
                                    stackId="1"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    name="Tennis"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="basketball"
                                    stackId="1"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    name="Bóng rổ"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="badminton"
                                    stackId="1"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    name="Cầu lông"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">17:00 - 19:00</div>
                        <p className="text-sm text-gray-600 mb-1">Khung giờ bận nhất</p>
                        <p className="text-xs text-gray-500">Trung bình 50 đặt sân/ngày</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">Thứ 7 - CN</div>
                        <p className="text-sm text-gray-600 mb-1">Ngày bận nhất</p>
                        <p className="text-xs text-gray-500">Chiếm 35% tổng đặt sân</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">T4 - T8</div>
                        <p className="text-sm text-gray-600 mb-1">Mùa cao điểm</p>
                        <p className="text-xs text-gray-500">Tăng 25% so với các tháng khác</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}